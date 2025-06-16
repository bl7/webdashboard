import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"
import { getUserSubscriptionStatus } from "@/lib/getUserSubscriptionStatus"

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

if (!WEBHOOK_SECRET) {
  console.error("Missing STRIPE_WEBHOOK_SECRET environment variable")
}

const VALID_STATUSES = [
  "active",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "past_due",
  "trialing",
  "unpaid",
] as const

type SubStatus = (typeof VALID_STATUSES)[number]

function isValidStatus(status: string): status is SubStatus {
  return VALID_STATUSES.includes(status as SubStatus)
}

interface WebhookSubscriptionData {
  user_id?: string
  stripe_customer_id: string
  stripe_subscription_id: string
  price_id: string | null
  status: SubStatus
  current_period_end: Date | null
  trial_end: Date | null
  trial_start: Date | null
  plan_type: string | null
  plan_name: string | null
  plan_amount: number
  billing_interval: string | null
  next_amount_due: number
  card_last4: string | null
  card_exp_month: number | null
  card_exp_year: number | null
  card_brand: string | null
  currency: string
  collection_method: string
  default_payment_method: string | null
  cancel_at_period_end: boolean
  canceled_at: Date | null
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    console.error("No Stripe signature found")
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log(`Processing webhook event: ${event.type}`)

  try {
    switch (event.type) {
      // Subscription created
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      // Subscription updated (plan changes, status changes, etc.)
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      // Subscription deleted/canceled
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      // Invoice payment succeeded
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      // Invoice payment failed
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      // Payment method attached/updated
      case "payment_method.attached":
        await handlePaymentMethodAttached(event.data.object as Stripe.PaymentMethod)
        break

      // Customer updated
      case "customer.updated":
        await handleCustomerUpdated(event.data.object as Stripe.Customer)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true, processed: event.type })
  } catch (error) {
    console.error(`Error processing webhook ${event.type}:`, error)
    return NextResponse.json(
      { error: "Webhook processing failed", type: event.type },
      { status: 500 }
    )
  }
}

// Helper function to determine plan type and name from price data
function getPlanInfo(price: Stripe.Price | null): {
  planType: string | null
  planName: string | null
  billingInterval: string | null
} {
  if (!price) {
    return { planType: null, planName: null, billingInterval: null }
  }

  // You can customize this logic based on your pricing structure
  const amount = (price.unit_amount || 0) / 100
  const interval = price.recurring?.interval || null

  // Example logic - customize based on your actual plans
  let planType = "paid"
  let planName = "Unknown Plan"

  if (price.nickname) {
    planName = price.nickname
  } else if (price.product && typeof price.product === "object" && !price.product.deleted) {
    planName = price.product.name || "Unknown Plan"
  } else {
    // Fallback based on amount and interval
    if (interval === "month") {
      planName = `Monthly Plan ($${amount})`
    } else if (interval === "year") {
      planName = `Annual Plan ($${amount})`
    } else {
      planName = `${amount > 0 ? "Paid" : "Free"} Plan`
    }
  }

  // Determine plan type based on amount
  if (amount === 0) {
    planType = "free"
  } else if (amount < 50) {
    // Example threshold
    planType = "basic"
  } else {
    planType = "premium"
  }

  return {
    planType,
    planName,
    billingInterval: interval,
  }
}

// Extract subscription data from Stripe subscription object
async function extractSubscriptionData(
  subscription: Stripe.Subscription
): Promise<WebhookSubscriptionData> {
  const price = subscription.items.data[0]?.price

  // Properly handle customer retrieval
  let customer: Stripe.Customer | null = null
  try {
    const customerData = await stripe.customers.retrieve(subscription.customer as string)
    // Check if customer was deleted
    if (!customerData.deleted) {
      customer = customerData as Stripe.Customer
    }
  } catch (err) {
    console.warn("Failed to retrieve customer:", err)
  }

  // Get plan information
  const { planType, planName, billingInterval } = getPlanInfo(price)

  // Get payment method details
  let paymentMethodData = {
    card_last4: null as string | null,
    card_exp_month: null as number | null,
    card_exp_year: null as number | null,
    card_brand: null as string | null,
  }

  if (subscription.default_payment_method) {
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        subscription.default_payment_method as string
      )
      if (paymentMethod.card) {
        paymentMethodData = {
          card_last4: paymentMethod.card.last4,
          card_exp_month: paymentMethod.card.exp_month,
          card_exp_year: paymentMethod.card.exp_year,
          card_brand: paymentMethod.card.brand,
        }
      }
    } catch (err) {
      console.warn("Failed to retrieve payment method:", err)
    }
  }

  // Calculate next amount due
  let nextAmountDue = 0
  if (subscription.latest_invoice) {
    try {
      const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string)
      nextAmountDue = (invoice.amount_due || 0) / 100
    } catch (err) {
      console.warn("Failed to retrieve latest invoice:", err)
    }
  }

  // Handle customer metadata safely
  const userId = customer?.metadata?.user_id

  return {
    user_id: userId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    price_id: price?.id || null,
    status: isValidStatus(subscription.status) ? subscription.status : "active",
    current_period_end: (subscription as any).current_period_end
      ? new Date((subscription as any).current_period_end * 1000)
      : null,
    trial_end: (subscription as any).trial_end
      ? new Date((subscription as any).trial_end * 1000)
      : null,
    trial_start: (subscription as any).trial_start
      ? new Date((subscription as any).trial_start * 1000)
      : null,
    plan_type: planType,
    plan_name: planName,
    plan_amount: price ? (price.unit_amount || 0) / 100 : 0,
    billing_interval: billingInterval,
    next_amount_due: nextAmountDue,
    currency: price?.currency || "usd",
    collection_method: subscription.collection_method || "charge_automatically",
    default_payment_method:
      typeof subscription.default_payment_method === "string"
        ? subscription.default_payment_method
        : subscription.default_payment_method?.id || null,
    cancel_at_period_end: (subscription as any).cancel_at_period_end || false,
    canceled_at: (subscription as any).canceled_at
      ? new Date((subscription as any).canceled_at * 1000)
      : null,
    ...paymentMethodData,
  }
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log(`Processing subscription created: ${subscription.id}`)

  const subscriptionData = await extractSubscriptionData(subscription)

  if (!subscriptionData.user_id) {
    console.error(`No user_id found in customer metadata for subscription ${subscription.id}`)
    return
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // HYBRID: Check if user has existing fake subscription record
    const existingResult = await client.query(
      `SELECT * FROM subscriptions 
       WHERE user_id = $1 AND stripe_subscription_id LIKE 'free-%'`,
      [subscriptionData.user_id]
    )

    if (existingResult.rows.length > 0) {
      console.log(
        `Found existing fake subscription for user ${subscriptionData.user_id}, replacing with real Stripe data`
      )

      // Replace fake record with real Stripe data
      await client.query(
        `UPDATE subscriptions SET
          stripe_customer_id = $2, stripe_subscription_id = $3, price_id = $4,
          status = $5, current_period_end = $6, trial_end = $7, trial_start = $8,
          plan_type = $9, plan_name = $10, plan_amount = $11, billing_interval = $12,
          next_amount_due = $13, card_last4 = $14, card_exp_month = $15,
          card_exp_year = $16, card_brand = $17, currency = $18,
          collection_method = $19, default_payment_method = $20,
          cancel_at_period_end = $21, canceled_at = $22,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1`,
        [
          subscriptionData.user_id,
          subscriptionData.stripe_customer_id,
          subscriptionData.stripe_subscription_id,
          subscriptionData.price_id,
          subscriptionData.status,
          subscriptionData.current_period_end,
          subscriptionData.trial_end,
          subscriptionData.trial_start,
          subscriptionData.plan_type,
          subscriptionData.plan_name,
          subscriptionData.plan_amount,
          subscriptionData.billing_interval,
          subscriptionData.next_amount_due,
          subscriptionData.card_last4,
          subscriptionData.card_exp_month,
          subscriptionData.card_exp_year,
          subscriptionData.card_brand,
          subscriptionData.currency,
          subscriptionData.collection_method,
          subscriptionData.default_payment_method,
          subscriptionData.cancel_at_period_end,
          subscriptionData.canceled_at,
        ]
      )
      console.log(
        `Successfully updated fake subscription to real for user ${subscriptionData.user_id}`
      )
    } else {
      // No existing fake record, create new one normally
      await client.query(
        `INSERT INTO subscriptions (
          user_id, stripe_customer_id, stripe_subscription_id, price_id,
          status, current_period_end, trial_end, trial_start, plan_type, plan_name, plan_amount,
          billing_interval, next_amount_due, card_last4, card_exp_month,
          card_exp_year, card_brand, currency, collection_method, 
          default_payment_method, cancel_at_period_end, canceled_at,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
          $12, $13, $14, $15, $16, $17, $18, $19,
          $20, $21, $22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id) DO UPDATE SET
          stripe_customer_id = $2, stripe_subscription_id = $3, price_id = $4,
          status = $5, current_period_end = $6, trial_end = $7, trial_start = $8,
          plan_type = $9, plan_name = $10, plan_amount = $11, billing_interval = $12,
          next_amount_due = $13, card_last4 = $14, card_exp_month = $15,
          card_exp_year = $16, card_brand = $17, currency = $18,
          collection_method = $19, default_payment_method = $20,
          cancel_at_period_end = $21, canceled_at = $22,
          updated_at = CURRENT_TIMESTAMP`,
        [
          subscriptionData.user_id,
          subscriptionData.stripe_customer_id,
          subscriptionData.stripe_subscription_id,
          subscriptionData.price_id,
          subscriptionData.status,
          subscriptionData.current_period_end,
          subscriptionData.trial_end,
          subscriptionData.trial_start,
          subscriptionData.plan_type,
          subscriptionData.plan_name,
          subscriptionData.plan_amount,
          subscriptionData.billing_interval,
          subscriptionData.next_amount_due,
          subscriptionData.card_last4,
          subscriptionData.card_exp_month,
          subscriptionData.card_exp_year,
          subscriptionData.card_brand,
          subscriptionData.currency,
          subscriptionData.collection_method,
          subscriptionData.default_payment_method,
          subscriptionData.cancel_at_period_end,
          subscriptionData.canceled_at,
        ]
      )
      console.log(`Successfully created new subscription for user ${subscriptionData.user_id}`)
    }

    await client.query("COMMIT")
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error creating/updating subscription:", error)
    throw error
  } finally {
    client.release()
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`Processing subscription updated: ${subscription.id}`)

  const subscriptionData = await extractSubscriptionData(subscription)

  if (!subscriptionData.user_id) {
    // HYBRID: Enhanced lookup - try multiple approaches
    let user_id = null

    // Try 1: Find by real stripe_subscription_id
    let result = await pool.query(
      "SELECT user_id FROM subscriptions WHERE stripe_subscription_id = $1",
      [subscription.id]
    )

    if (result.rows.length > 0) {
      user_id = result.rows[0].user_id
    } else {
      // Try 2: Find fake subscription by customer ID
      result = await pool.query(
        `SELECT user_id FROM subscriptions 
         WHERE stripe_customer_id = $1 AND stripe_subscription_id LIKE 'free-%'`,
        [subscription.customer]
      )

      if (result.rows.length > 0) {
        user_id = result.rows[0].user_id
        console.log(
          `Found fake subscription for customer ${subscription.customer}, will replace with real data`
        )
      }
    }

    if (!user_id) {
      console.error(`No user found for subscription ${subscription.id}`)
      return
    }

    subscriptionData.user_id = user_id
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // HYBRID: Always update by user_id to handle both real and fake IDs
    const updateResult = await client.query(
      `UPDATE subscriptions SET
        stripe_customer_id = $1,
        stripe_subscription_id = $2,
        price_id = $3,
        status = $4,
        current_period_end = $5,
        trial_end = $6,
        trial_start = $7,
        plan_type = $8,
        plan_name = $9,
        plan_amount = $10,
        billing_interval = $11,
        next_amount_due = $12,
        card_last4 = $13,
        card_exp_month = $14,
        card_exp_year = $15,
        card_brand = $16,
        currency = $17,
        collection_method = $18,
        default_payment_method = $19,
        cancel_at_period_end = $20,
        canceled_at = $21,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $22`,
      [
        subscriptionData.stripe_customer_id,
        subscription.id,
        subscriptionData.price_id,
        subscriptionData.status,
        subscriptionData.current_period_end,
        subscriptionData.trial_end,
        subscriptionData.trial_start,
        subscriptionData.plan_type,
        subscriptionData.plan_name,
        subscriptionData.plan_amount,
        subscriptionData.billing_interval,
        subscriptionData.next_amount_due,
        subscriptionData.card_last4,
        subscriptionData.card_exp_month,
        subscriptionData.card_exp_year,
        subscriptionData.card_brand,
        subscriptionData.currency,
        subscriptionData.collection_method,
        subscriptionData.default_payment_method,
        subscriptionData.cancel_at_period_end,
        subscriptionData.canceled_at,
        subscriptionData.user_id,
      ]
    )

    if (updateResult.rowCount === 0) {
      console.warn(`No subscription found to update for user ${subscriptionData.user_id}`)
    } else {
      console.log(`Successfully updated subscription for user ${subscriptionData.user_id}`)
    }

    await client.query("COMMIT")
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error updating subscription:", error)
    throw error
  } finally {
    client.release()
  }
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`Processing subscription deleted: ${subscription.id}`)

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const result = await client.query(
      `UPDATE subscriptions SET
        status = 'canceled',
        cancel_at_period_end = false,
        canceled_at = CURRENT_TIMESTAMP,
        next_amount_due = 0,
        updated_at = CURRENT_TIMESTAMP
      WHERE stripe_subscription_id = $1`,
      [subscription.id]
    )

    if (result.rowCount === 0) {
      console.warn(`No subscription found to cancel for stripe_subscription_id ${subscription.id}`)
    }

    await client.query("COMMIT")
    console.log(`Successfully canceled subscription ${subscription.id}`)
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error canceling subscription:", error)
    throw error
  } finally {
    client.release()
  }
}

// Handle successful invoice payment
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`Processing invoice payment succeeded: ${invoice.id}`)

  if (!(invoice as any).subscription) {
    console.log("Invoice not associated with subscription, skipping")
    return
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // Update next_amount_due and ensure status is active for successful payments
    await client.query(
      `UPDATE subscriptions SET
        status = CASE 
          WHEN status = 'past_due' THEN 'active'
          WHEN status = 'unpaid' THEN 'active'
          ELSE status
        END,
        next_amount_due = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE stripe_subscription_id = $2`,
      [(invoice.amount_due || 0) / 100, (invoice as any).subscription]
    )

    await client.query("COMMIT")
    console.log(`Successfully processed payment for subscription ${(invoice as any).subscription}`)
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error processing successful payment:", error)
    throw error
  } finally {
    client.release()
  }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`Processing invoice payment failed: ${invoice.id}`)

  if (!(invoice as any).subscription) {
    console.log("Invoice not associated with subscription, skipping")
    return
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // Update status to past_due for failed payments
    await client.query(
      `UPDATE subscriptions SET
        status = 'past_due',
        next_amount_due = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE stripe_subscription_id = $2`,
      [(invoice.amount_due || 0) / 100, (invoice as any).subscription]
    )

    await client.query("COMMIT")
    console.log(
      `Successfully processed failed payment for subscription ${(invoice as any).subscription}`
    )
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error processing failed payment:", error)
    throw error
  } finally {
    client.release()
  }
}

// Handle payment method attached
async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  console.log(`Processing payment method attached: ${paymentMethod.id}`)

  if (!paymentMethod.customer || !paymentMethod.card) {
    console.log("Payment method not associated with customer or not a card, skipping")
    return
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // Update card details for subscriptions with this customer
    await client.query(
      `UPDATE subscriptions SET
        card_last4 = $1,
        card_exp_month = $2,
        card_exp_year = $3,
        card_brand = $4,
        default_payment_method = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE stripe_customer_id = $6`,
      [
        paymentMethod.card.last4,
        paymentMethod.card.exp_month,
        paymentMethod.card.exp_year,
        paymentMethod.card.brand,
        paymentMethod.id,
        paymentMethod.customer,
      ]
    )

    await client.query("COMMIT")
    console.log(`Successfully updated payment method for customer ${paymentMethod.customer}`)
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error updating payment method:", error)
    throw error
  } finally {
    client.release()
  }
}

// Handle customer updates
async function handleCustomerUpdated(customer: Stripe.Customer) {
  console.log(`Processing customer updated: ${customer.id}`)

  // This is a placeholder for any customer-specific updates you might need
  // For example, updating email, name, or other customer details in your database

  console.log(`Customer ${customer.id} updated - implement specific logic as needed`)
}

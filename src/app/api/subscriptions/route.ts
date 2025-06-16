import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"
import { formatPlanName } from "@/lib/formatPlanName"

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

interface SubscriptionData {
  user_id: string
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  price_id?: string | null
  status?: SubStatus
  current_period_end?: string | null
  trial_end?: string | null
  trial_start?: string | null
  plan_name?: string | null
  plan_amount?: number | null
  billing_interval?: string | null
  next_amount_due?: number | null
  card_last4?: string | null
  card_exp_month?: number | null
  card_exp_year?: number | null
  card_brand?: string | null
  currency?: string | null
  collection_method?: string | null
  default_payment_method?: string | null
  cancel_at_period_end?: boolean | null
  canceled_at?: string | null
}

// ✅ MAIN MAPPING: Map your Stripe price IDs to plan names
const PRICE_ID_TO_PLAN_NAME = {
  price_1RZnHW6acbqNMwXigvqDdo8I: "Pro Kitchen - Monthly",
  price_1RZnI76acbqNMwXiW5y61Vfl: "Pro Kitchen - Annual",

  price_1RZnIb6acbqNMwXiSMZnDKvH: "Multi-Site Mastery - Monthly",
  price_1RZnIv6acbqNMwXi4cEZhKU8: "Multi-Site Mastery - Annual",
} as const

// ✅ Helper function to get plan name from price_id
function getPlanNameFromPriceId(price_id: string | null): string {
  // Handle free plan cases
  if (!price_id || price_id === "free" || price_id === "" || price_id === "null") {
    return "Free Plan"
  }

  // Check direct mapping first
  if (price_id in PRICE_ID_TO_PLAN_NAME) {
    return PRICE_ID_TO_PLAN_NAME[price_id as keyof typeof PRICE_ID_TO_PLAN_NAME]
  }

  // Try formatPlanName utility as fallback
  const formattedName = formatPlanName(price_id)
  if (formattedName && formattedName !== price_id) {
    return formattedName
  }

  // Final fallback
  return "Unknown Plan"
}

// ✅ Enhanced function to get plan name with Stripe API fallback
async function getPlanNameWithStripeCheck(price_id: string | null): Promise<string> {
  // Handle free plan cases first
  if (!price_id || price_id === "free" || price_id === "" || price_id === "null") {
    return "Free Plan"
  }

  const mappedName = getPlanNameFromPriceId(price_id)

  // If we got a mapped name, return it
  if (mappedName !== "Unknown Plan") {
    return mappedName
  }

  // For unknown price IDs, try to fetch from Stripe
  try {
    const price = await stripe.prices.retrieve(price_id, {
      expand: ["product"], // Ensure product is expanded to get the full object
    })

    if (price.nickname) {
      return price.nickname
    }

    // Check if product exists, is not deleted, and has a name
    if (price.product && typeof price.product === "object") {
      // Type guard to check if it's not a DeletedProduct
      const product = price.product as Stripe.Product
      if (product.name && !product.deleted) {
        // Add billing interval to product name for clarity
        const interval = price.recurring?.interval || "monthly"
        const intervalDisplay = interval === "year" ? "Annual" : "Monthly"
        return `${product.name} - ${intervalDisplay}`
      }
    }

    return `${price.recurring?.interval || "monthly"} plan`
  } catch (error) {
    console.error(`Error fetching price ${price_id} from Stripe:`, error)
    return "Unknown Plan"
  }
}

// GET - Enhanced with better error handling
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id parameter" }, { status: 400 })
  }

  try {
    const result = await pool.query(
      `SELECT * FROM subscriptions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    )

    const subscription = result.rows[0] || null
    const planName = subscription ? getPlanNameFromPriceId(subscription.price_id) : "Free Plan"

    // Handle period end expiration
    if (subscription?.current_period_end) {
      const now = new Date()
      const periodEnd = new Date(subscription.current_period_end)
      if (now > periodEnd && subscription.status === "active") {
        await pool.query(
          `UPDATE subscriptions 
           SET status = 'past_due', updated_at = CURRENT_TIMESTAMP 
           WHERE id = $1`,
          [subscription.id]
        )
        subscription.status = "past_due"
      }
    }

    console.log("GET subscription for user:", userId, "found:", !!subscription)
    if (subscription) {
      console.log("Subscription data:", {
        id: subscription.id,
        status: subscription.status,
        plan_name: planName,
        price_id: subscription.price_id,
        stripe_subscription_id: subscription.stripe_subscription_id,
      })
    }

    return NextResponse.json({
      subscription,
      plan_name: planName,
      message: subscription ? "Subscription found" : "No subscription found",
    })
  } catch (error) {
    console.error("Database error in GET /subscriptions:", error)
    return NextResponse.json({ error: "Failed to retrieve subscription" }, { status: 500 })
  }
}

// POST - Enhanced with plan name derivation
export async function POST(req: NextRequest) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const { user_id, price_id, prorate = true } = await req.json()

    if (!user_id || !price_id) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "user_id and price_id are required" }, { status: 400 })
    }

    const currentSubResult = await client.query(`SELECT * FROM subscriptions WHERE user_id = $1`, [
      user_id,
    ])
    const currentSub = currentSubResult.rows[0]

    if (!currentSub || !currentSub.stripe_subscription_id) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "No valid subscription to update" }, { status: 404 })
    }

    if (currentSub.stripe_subscription_id.startsWith("free-")) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "Cannot update free plan" }, { status: 400 })
    }

    const price = await stripe.prices.retrieve(price_id)
    if (!price.active) throw new Error("Inactive Stripe price")

    // ✅ Get plan name from mapping
    const planName = await getPlanNameWithStripeCheck(price_id)

    const stripeSubscription = await stripe.subscriptions.retrieve(
      currentSub.stripe_subscription_id
    )
    const updatedSubscription = await stripe.subscriptions.update(
      currentSub.stripe_subscription_id,
      {
        items: [{ id: stripeSubscription.items.data[0].id, price: price_id }],
        proration_behavior: prorate ? "create_prorations" : "none",
        expand: ["default_payment_method", "latest_invoice"],
      }
    )

    const paymentMethod = (updatedSubscription as any)
      .default_payment_method as Stripe.PaymentMethod
    const currentPeriodEnd = new Date((updatedSubscription as any).current_period_end * 1000)
    let nextAmountDue = 0

    try {
      const latestInvoice = updatedSubscription.latest_invoice
      if (latestInvoice) {
        const invoice =
          typeof latestInvoice === "string"
            ? await stripe.invoices.retrieve(latestInvoice)
            : latestInvoice

        if (invoice) {
          nextAmountDue = (invoice.amount_due || 0) / 100
        }
      }
    } catch (err) {
      console.warn("Invoice fetch failed:", err)
    }

    // ✅ Include plan_name in UPDATE
    await client.query(
      `UPDATE subscriptions 
       SET stripe_customer_id = $1,
           stripe_subscription_id = $2,
           price_id = $3, 
           status = $4, 
           current_period_end = $5,
           trial_end = $6,
           trial_start = $7,
           plan_name = $8, 
           plan_amount = $9, 
           billing_interval = $10,
           next_amount_due = $11, 
           card_last4 = $12, 
           card_exp_month = $13,
           card_exp_year = $14, 
           card_brand = $15,
           currency = $16,
           collection_method = $17,
           default_payment_method = $18,
           cancel_at_period_end = $19,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $20`,
      [
        updatedSubscription.customer as string,
        updatedSubscription.id,
        price_id,
        updatedSubscription.status,
        currentPeriodEnd,
        updatedSubscription.trial_end ? new Date(updatedSubscription.trial_end * 1000) : null,
        updatedSubscription.trial_start ? new Date(updatedSubscription.trial_start * 1000) : null,
        planName, // ✅ Using derived plan name
        (price.unit_amount || 0) / 100,
        price.recurring?.interval || "month",
        nextAmountDue,
        paymentMethod?.card?.last4 || null,
        paymentMethod?.card?.exp_month || null,
        paymentMethod?.card?.exp_year || null,
        paymentMethod?.card?.brand || null,
        price.currency || "usd",
        updatedSubscription.collection_method || "charge_automatically",
        typeof updatedSubscription.default_payment_method === "string"
          ? updatedSubscription.default_payment_method
          : updatedSubscription.default_payment_method?.id || null,
        updatedSubscription.cancel_at_period_end || false,
        user_id,
      ]
    )

    await client.query("COMMIT")

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
      plan_name: planName,
    })
  } catch (error: any) {
    await client.query("ROLLBACK")
    console.error("POST /subscriptions error:", error)
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 })
  } finally {
    client.release()
  }
}

// PUT - Enhanced with plan name derivation
export async function PUT(req: NextRequest) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const data: SubscriptionData = await req.json()
    const { user_id, status, price_id } = data

    if (!user_id) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "user_id is required" }, { status: 400 })
    }

    if (status && !isValidStatus(status)) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 })
    }

    // ✅ Derive plan name from price_id instead of using provided plan_name
    const derivedPlanName = data.price_id
      ? await getPlanNameWithStripeCheck(data.price_id)
      : "Free Plan"

    console.log("PUT /subscriptions received data:", {
      user_id: data.user_id,
      price_id: data.price_id,
      derived_plan_name: derivedPlanName,
      status: data.status,
    })

    const result = await client.query(`SELECT * FROM subscriptions WHERE user_id = $1`, [user_id])
    const existingSubscription = result.rows[0]

    // Use derived plan name instead of data.plan_name
    const dataWithDerivedPlanName = {
      ...data,
      plan_name: derivedPlanName,
    }

    if (data.price_id === null || data.price_id === "free") {
      await handleFreePlanDowngrade(client, user_id, existingSubscription, dataWithDerivedPlanName)
    } else {
      await handlePaidPlanSubscription(
        client,
        user_id,
        existingSubscription,
        dataWithDerivedPlanName
      )
    }

    await client.query("COMMIT")
    return NextResponse.json({
      success: true,
      message: "Subscription updated",
      plan_name: derivedPlanName,
    })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("PUT /subscriptions error:", error)
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
  } finally {
    client.release()
  }
}

// DELETE - Enhanced
export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")
  const immediate = req.nextUrl.searchParams.get("immediate") === "true"

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const result = await client.query(`SELECT * FROM subscriptions WHERE user_id = $1`, [userId])
    const subscription = result.rows[0]

    if (!subscription) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    if (
      subscription.stripe_subscription_id &&
      !subscription.stripe_subscription_id.startsWith("free-")
    ) {
      try {
        if (immediate) {
          await stripe.subscriptions.cancel(subscription.stripe_subscription_id)
        } else {
          await stripe.subscriptions.update(subscription.stripe_subscription_id, {
            cancel_at_period_end: true,
          })
        }
      } catch (err) {
        console.error("Stripe cancellation error:", err)
      }
    }

    const cancelDate = immediate ? new Date() : subscription.current_period_end
    await client.query(
      `UPDATE subscriptions 
       SET status = 'canceled',
           current_period_end = $2,
           next_amount_due = 0,
           cancel_at_period_end = $3,
           canceled_at = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1`,
      [userId, cancelDate, !immediate, immediate ? new Date() : null]
    )

    await client.query("COMMIT")
    return NextResponse.json({
      success: true,
      message: immediate ? "Cancelled immediately" : "Will cancel at period end",
      cancellation_date: cancelDate,
    })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("DELETE /subscriptions error:", error)
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
  } finally {
    client.release()
  }
}

async function handleFreePlanDowngrade(
  client: any,
  user_id: string,
  existingSubscription: any,
  data: SubscriptionData
) {
  console.log("Downgrading user", user_id, "to free plan")

  if (
    existingSubscription?.stripe_subscription_id &&
    !existingSubscription.stripe_subscription_id.startsWith("free-")
  ) {
    try {
      await stripe.subscriptions.update(existingSubscription.stripe_subscription_id, {
        cancel_at_period_end: true,
      })
    } catch (err) {
      console.error("Stripe downgrade error:", err)
    }
  }

  await client.query(
    `INSERT INTO subscriptions (
      user_id, stripe_customer_id, stripe_subscription_id, price_id,
      status, plan_name, plan_amount, billing_interval, next_amount_due,
      created_at, updated_at
    ) VALUES (
      $1, NULL, $2, NULL,
      'active', 'Free Plan', 0, NULL, 0,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    ON CONFLICT (user_id) DO UPDATE SET
      stripe_customer_id = NULL,
      stripe_subscription_id = $2,
      price_id = NULL,
      status = 'active',
      plan_name = 'Free Plan',
      plan_amount = 0,
      billing_interval = NULL,
      next_amount_due = 0,
      updated_at = CURRENT_TIMESTAMP`,
    [user_id, `free-${user_id}-${Date.now()}`]
  )

  console.log("Free plan update completed for user", user_id)
}

async function handlePaidPlanSubscription(
  client: any,
  user_id: string,
  existingSubscription: any,
  data: SubscriptionData
) {
  console.log("Updating paid subscription for user", user_id)
  if (!data.stripe_subscription_id || !data.stripe_customer_id) {
    throw new Error("Missing stripe_subscription_id or stripe_customer_id for paid plan")
  }

  await client.query(
    `INSERT INTO subscriptions (
      user_id, stripe_customer_id, stripe_subscription_id, price_id,
      status, current_period_end, trial_end, trial_start, plan_name, plan_amount,
      billing_interval, next_amount_due, card_last4, card_exp_month,
      card_exp_year, card_brand, currency, collection_method, 
      default_payment_method, cancel_at_period_end, canceled_at,
      created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14,
      $15, $16, $17, $18,
      $19, $20, $21,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    ON CONFLICT (user_id) DO UPDATE SET
      stripe_customer_id = $2, stripe_subscription_id = $3, price_id = $4,
      status = $5, current_period_end = $6, trial_end = $7, trial_start = $8,
      plan_name = $9, plan_amount = $10, billing_interval = $11,
      next_amount_due = $12, card_last4 = $13, card_exp_month = $14,
      card_exp_year = $15, card_brand = $16, currency = $17,
      collection_method = $18, default_payment_method = $19,
      cancel_at_period_end = $20, canceled_at = $21,
      updated_at = CURRENT_TIMESTAMP`,
    [
      user_id,
      data.stripe_customer_id,
      data.stripe_subscription_id,
      data.price_id,
      data.status || "active",
      data.current_period_end ? new Date(data.current_period_end) : null,
      data.trial_end ? new Date(data.trial_end) : null,
      data.trial_start ? new Date(data.trial_start) : null,
      data.plan_name || "Unknown Plan", // This will be the derived plan name
      data.plan_amount ?? 0,
      data.billing_interval || "month",
      data.next_amount_due ?? 0,
      data.card_last4 || null,
      data.card_exp_month || null,
      data.card_exp_year || null,
      data.card_brand || null,
      data.currency || "usd",
      data.collection_method || "charge_automatically",
      data.default_payment_method || null,
      data.cancel_at_period_end ?? false,
      data.canceled_at ? new Date(data.canceled_at) : null,
    ]
  )
  console.log("Paid subscription update completed for user", user_id)
}

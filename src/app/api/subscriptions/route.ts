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

const PRICE_ID_TO_PLAN_NAME = {
  price_1RZnHW6acbqNMwXigvqDdo8I: "Pro Kitchen - Monthly",
  price_1RZnI76acbqNMwXiW5y61Vfl: "Pro Kitchen - Annual",
  price_1RZnIb6acbqNMwXiSMZnDKvH: "Multi-Site Mastery - Monthly",
  price_1RZnIv6acbqNMwXi4cEZhKU8: "Multi-Site Mastery - Annual",
} as const

function getPlanNameFromPriceId(price_id: string | null): string {
  if (!price_id || price_id === "free" || price_id === "" || price_id === "null") {
    return "Free Plan"
  }
  if (price_id in PRICE_ID_TO_PLAN_NAME) {
    return PRICE_ID_TO_PLAN_NAME[price_id as keyof typeof PRICE_ID_TO_PLAN_NAME]
  }
  const formattedName = formatPlanName(price_id)
  if (formattedName && formattedName !== price_id) {
    return formattedName
  }
  return "Unknown Plan"
}

async function getPlanNameWithStripeCheck(price_id: string | null): Promise<string> {
  if (!price_id || price_id === "free" || price_id === "" || price_id === "null") {
    return "Free Plan"
  }
  const mappedName = getPlanNameFromPriceId(price_id)
  if (mappedName !== "Unknown Plan") {
    return mappedName
  }
  try {
    const price = await stripe.prices.retrieve(price_id, {
      expand: ["product"],
    })
    if (price.nickname) {
      return price.nickname
    }
    if (price.product && typeof price.product === "object") {
      const product = price.product as Stripe.Product
      if (product.name && !product.deleted) {
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

// --- FREE PLAN DOWNGRADE LOGIC MOVED HERE ---
async function handleFreePlanDowngrade(client: any, user_id: string, existingSubscription: any) {
  // Cancel Stripe subscription if it exists
  if (existingSubscription?.stripe_subscription_id) {
    try {
      await stripe.subscriptions.cancel(existingSubscription.stripe_subscription_id)
    } catch (err) {
      console.warn("Stripe subscription cancel failed (may already be canceled):", err)
    }
  }
  // Update DB to reflect Free Plan
  await client.query(
    `UPDATE subscriptions
     SET status = $1,
         price_id = NULL,
         plan_name = $2,
         plan_amount = 0,
         billing_interval = NULL,
         stripe_subscription_id = NULL,
         cancel_at_period_end = false,
         canceled_at = NOW(),
         updated_at = NOW()
     WHERE user_id = $3`,
    ["canceled", "Free Plan", user_id]
  )
}

// --- END FREE PLAN LOGIC ---

// GET - unchanged
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

// POST - handles all plan changes (including Free)
export async function POST(req: NextRequest) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const { user_id, price_id, prorate = true } = await req.json()
    if (!user_id) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "user_id is required" }, { status: 400 })
    }

    // Get current subscription
    const currentSubResult = await client.query(`SELECT * FROM subscriptions WHERE user_id = $1`, [
      user_id,
    ])
    const currentSub = currentSubResult.rows[0]

    // --- Handle downgrade to Free Plan ---
    if (!price_id || price_id === "free" || price_id === "" || price_id === "null") {
      await handleFreePlanDowngrade(client, user_id, currentSub)
      await client.query("COMMIT")
      return NextResponse.json({
        success: true,
        message: "Downgraded to Free Plan",
        plan_name: "Free Plan",
      })
    }
    // --- End Free Plan logic ---

    // --- Paid plan logic (existing logic) ---
    if (!currentSub || !currentSub.stripe_subscription_id) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "No valid subscription to update" }, { status: 404 })
    }
    if (currentSub.stripe_subscription_id.startsWith("free-")) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "Cannot update free plan subscription" }, { status: 400 })
    }
    let price
    try {
      price = await stripe.prices.retrieve(price_id)
    } catch (stripeError) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "Invalid Stripe price ID" }, { status: 400 })
    }
    if (!price.active) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "Inactive Stripe price" }, { status: 400 })
    }
    const planName = await getPlanNameWithStripeCheck(price_id)
    let stripeSubscription
    try {
      stripeSubscription = await stripe.subscriptions.retrieve(currentSub.stripe_subscription_id)
    } catch (stripeError) {
      await client.query("ROLLBACK")
      return NextResponse.json(
        { error: "Failed to retrieve current subscription from Stripe" },
        { status: 500 }
      )
    }
    let updatedSubscription
    try {
      updatedSubscription = await stripe.subscriptions.update(currentSub.stripe_subscription_id, {
        items: [{ id: stripeSubscription.items.data[0].id, price: price_id }],
        proration_behavior: prorate ? "create_prorations" : "none",
        expand: ["default_payment_method", "latest_invoice"],
      })
    } catch (stripeError) {
      await client.query("ROLLBACK")
      return NextResponse.json(
        {
          error: `Failed to update Stripe subscription: ${(stripeError as any).message}`,
        },
        { status: 500 }
      )
    }
    const paymentMethod = updatedSubscription.default_payment_method as Stripe.PaymentMethod
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
    } catch (err) {}
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
        planName,
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
    return NextResponse.json(
      {
        error: error.message || "Unknown error occurred during subscription update",
      },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// DELETE - unchanged
export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")
  const immediate = req.nextUrl.searchParams.get("immediate") === "true"
  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  }
  const client = await pool.connect()
  try {
    // ...rest of your DELETE logic...
  } finally {
    client.release()
  }
}

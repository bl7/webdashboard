import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"

// Valid subscription statuses (adjust based on your enum)
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

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")
  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  }

  try {
    const result = await pool.query(
      "SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
      [userId]
    )

    return NextResponse.json({ subscription: result.rows[0] || null })
  } catch (error) {
    console.error("Database error in GET /subscriptions:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const {
      user_id,
      stripe_customer_id,
      stripe_subscription_id,
      price_id,
      status,
      current_period_end,
      trial_end,
      plan_name,
      plan_amount,
      billing_interval,
      next_amount_due,
      card_last4,
      card_exp_month,
      card_exp_year,
    } = await req.json()

    // Validation
    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
    }

    if (status && !isValidStatus(status)) {
      return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 })
    }

    // Get existing subscription
    const existingSubResult = await client.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [user_id]
    )
    const existingSub = existingSubResult.rows[0]

    // Handle downgrade to free plan (price_id === null)
    if (price_id === null) {
      // If there's an active Stripe subscription, cancel it at period end
      if (
        existingSub?.stripe_subscription_id &&
        !existingSub.stripe_subscription_id.startsWith("free-plan-")
      ) {
        try {
          await stripe.subscriptions.update(existingSub.stripe_subscription_id, {
            cancel_at_period_end: true,
          })
          console.log(`Cancelled Stripe subscription: ${existingSub.stripe_subscription_id}`)
        } catch (stripeError) {
          console.error("Failed to cancel Stripe subscription:", stripeError)
          // Continue with database update even if Stripe fails
        }
      }

      // Generate unique free plan subscription ID
      const freePlanStripeSubscriptionId = `free-plan-${user_id}-${Date.now()}`

      // UPSERT free plan subscription
      await client.query(
        `
        INSERT INTO subscriptions (
          user_id, stripe_customer_id, stripe_subscription_id, price_id,
          status, current_period_end, trial_end, plan_name, plan_amount,
          billing_interval, next_amount_due, card_last4, card_exp_month, card_exp_year
        ) VALUES (
          $1, NULL, $2, NULL,
          $3, $4, $5, $6, $7,
          $8, $9, NULL, NULL, NULL
        )
        ON CONFLICT (user_id) 
        DO UPDATE SET
          stripe_customer_id = NULL,
          stripe_subscription_id = $2,
          price_id = NULL,
          status = $3,
          current_period_end = $4,
          trial_end = $5,
          plan_name = $6,
          plan_amount = $7,
          billing_interval = $8,
          next_amount_due = $9,
          card_last4 = NULL,
          card_exp_month = NULL,
          card_exp_year = NULL
        `,
        [
          user_id,
          freePlanStripeSubscriptionId,
          status || "active",
          current_period_end ? new Date(current_period_end) : null,
          trial_end ? new Date(trial_end) : null,
          plan_name || "Free Plan",
          plan_amount ?? 0,
          billing_interval || null,
          next_amount_due ?? 0,
        ]
      )

      await client.query("COMMIT")
      return NextResponse.json({ success: true, message: "Downgraded to free plan" })
    }

    // For paid plans, require stripe_subscription_id and stripe_customer_id
    if (!stripe_subscription_id || !stripe_customer_id) {
      await client.query("ROLLBACK")
      return NextResponse.json(
        { error: "Missing required Stripe IDs for paid plan" },
        { status: 400 }
      )
    }

    // Validate card expiration data
    if (card_exp_month && (card_exp_month < 1 || card_exp_month > 12)) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "Invalid card expiration month" }, { status: 400 })
    }

    if (card_exp_year && card_exp_year < new Date().getFullYear()) {
      await client.query("ROLLBACK")
      return NextResponse.json(
        { error: "Card expiration year cannot be in the past" },
        { status: 400 }
      )
    }

    // Convert timestamps to proper Date objects
    const periodEnd = current_period_end ? new Date(current_period_end) : null
    const trialEndDate = trial_end ? new Date(trial_end) : null

    // UPSERT paid subscription
    await client.query(
      `
      INSERT INTO subscriptions (
        user_id, stripe_customer_id, stripe_subscription_id, price_id,
        status, current_period_end, trial_end, plan_name, plan_amount,
        billing_interval, next_amount_due, card_last4, card_exp_month, card_exp_year
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14
      )
      ON CONFLICT (user_id)
      DO UPDATE SET
        stripe_customer_id = $2,
        stripe_subscription_id = $3,
        price_id = $4,
        status = $5,
        current_period_end = $6,
        trial_end = $7,
        plan_name = $8,
        plan_amount = $9,
        billing_interval = $10,
        next_amount_due = $11,
        card_last4 = $12,
        card_exp_month = $13,
        card_exp_year = $14
      `,
      [
        user_id,
        stripe_customer_id,
        stripe_subscription_id,
        price_id,
        status,
        periodEnd,
        trialEndDate,
        plan_name,
        plan_amount,
        billing_interval,
        next_amount_due,
        card_last4,
        card_exp_month,
        card_exp_year,
      ]
    )

    await client.query("COMMIT")
    return NextResponse.json({ success: true, message: "Subscription updated successfully" })
  } catch (error: unknown) {
    await client.query("ROLLBACK")
    console.error("Subscription update error:", error)

    let message = "Internal Server Error"
    let statusCode = 500

    if (error instanceof Error) {
      message = error.message

      // Handle specific database errors
      if (error.message.includes("duplicate key")) {
        message = "Subscription conflict - please try again"
        statusCode = 409
      } else if (error.message.includes("foreign key")) {
        message = "Invalid user reference"
        statusCode = 400
      } else if (error.message.includes("invalid input syntax")) {
        message = "Invalid data format"
        statusCode = 400
      }
    }

    return NextResponse.json({ error: message }, { status: statusCode })
  } finally {
    client.release()
  }
}

// Optional: Add a DELETE endpoint for subscription cleanup
export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  }

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Get the subscription to cancel
    const result = await client.query(
      "SELECT stripe_subscription_id FROM subscriptions WHERE user_id = $1",
      [userId]
    )

    const subscription = result.rows[0]

    if (
      subscription?.stripe_subscription_id &&
      !subscription.stripe_subscription_id.startsWith("free-plan-")
    ) {
      try {
        // Cancel the Stripe subscription immediately
        await stripe.subscriptions.cancel(subscription.stripe_subscription_id)
        console.log(`Cancelled Stripe subscription: ${subscription.stripe_subscription_id}`)
      } catch (stripeError) {
        console.error("Failed to cancel Stripe subscription:", stripeError)
      }
    }

    // Soft delete: update status to canceled instead of deleting
    await client.query(
      `UPDATE subscriptions 
       SET status = 'canceled', 
           current_period_end = NOW(),
           next_amount_due = 0
       WHERE user_id = $1`,
      [userId]
    )

    await client.query("COMMIT")
    return NextResponse.json({ success: true, message: "Subscription cancelled" })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Subscription deletion error:", error)
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
  } finally {
    client.release()
  }
}

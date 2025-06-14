import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")
  if (!userId) return NextResponse.json({ error: "Missing user_id" }, { status: 400 })

  const result = await pool.query(
    "SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
    [userId]
  )

  return NextResponse.json({ subscription: result.rows[0] || null })
}

export async function PUT(req: NextRequest) {
  try {
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

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
    }

    // Check if subscription exists
    const existingSubResult = await pool.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [user_id]
    )
    const existingSub = existingSubResult.rows[0]

    // Handle downgrade to free plan (price_id === null)
    if (price_id === null) {
      // If there is an active Stripe subscription, cancel it at period end
      if (existingSub?.stripe_subscription_id) {
        await stripe.subscriptions.update(existingSub.stripe_subscription_id, {
          cancel_at_period_end: true,
        })
      }

      // Insert or update free plan subscription record
      const freePlanStripeSubscriptionId = `free-plan-${user_id}-${Date.now()}`

      if (existingSub) {
        await pool.query(
          `
          UPDATE subscriptions
          SET stripe_customer_id = NULL,
              stripe_subscription_id = $1,
              price_id = NULL,
              status = $2,
              current_period_end = $3,
              trial_end = $4,
              plan_name = $5,
              plan_amount = $6,
              billing_interval = $7,
              next_amount_due = $8,
              card_last4 = $9,
              card_exp_month = $10,
              card_exp_year = $11
          WHERE user_id = $12
        `,
          [
            freePlanStripeSubscriptionId,
            status || "active",
            current_period_end,
            trial_end,
            plan_name,
            plan_amount ?? 0,
            billing_interval,
            next_amount_due ?? 0,
            card_last4,
            card_exp_month,
            card_exp_year,
            user_id,
          ]
        )
      } else {
        await pool.query(
          `
          INSERT INTO subscriptions (
            user_id, stripe_customer_id, stripe_subscription_id, price_id,
            status, current_period_end, trial_end, plan_name, plan_amount,
            billing_interval, next_amount_due, card_last4, card_exp_month, card_exp_year
          ) VALUES (
            $1, NULL, $2, NULL,
            $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12
          )
        `,
          [
            user_id,
            freePlanStripeSubscriptionId,
            status || "active",
            current_period_end,
            trial_end,
            plan_name,
            plan_amount ?? 0,
            billing_interval,
            next_amount_due ?? 0,
            card_last4,
            card_exp_month,
            card_exp_year,
          ]
        )
      }

      return NextResponse.json({ success: true })
    }

    // For paid plans, require stripe_subscription_id and stripe_customer_id
    if (!stripe_subscription_id || !stripe_customer_id) {
      return NextResponse.json({ error: "Missing required Stripe IDs" }, { status: 400 })
    }

    if (existingSub) {
      await pool.query(
        `
        UPDATE subscriptions
        SET user_id = $1,
            stripe_customer_id = $2,
            price_id = $3,
            status = $4,
            current_period_end = $5,
            trial_end = $6,
            plan_name = $7,
            plan_amount = $8,
            billing_interval = $9,
            next_amount_due = $10,
            card_last4 = $11,
            card_exp_month = $12,
            card_exp_year = $13
        WHERE stripe_subscription_id = $14
      `,
        [
          user_id,
          stripe_customer_id,
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
          stripe_subscription_id,
        ]
      )
    } else {
      await pool.query(
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
      `,
        [
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
        ]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    let message = "Internal Server Error"
    if (error instanceof Error) message = error.message
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

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

    if (!user_id || !stripe_subscription_id || !stripe_customer_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await pool.query(
      `SELECT id FROM subscriptions WHERE stripe_subscription_id = $1`,
      [stripe_subscription_id]
    )

    if (result.rowCount > 0) {
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

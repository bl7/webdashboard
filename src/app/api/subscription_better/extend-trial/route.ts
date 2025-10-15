import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { verifyAuthToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user_id, days, reason } = await req.json()
    if (!user_id || typeof days !== "number" || days <= 0) {
      return NextResponse.json({ error: "Missing or invalid user_id/days" }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      const { rows } = await client.query("SELECT * FROM subscription_better WHERE user_id = $1", [
        user_id,
      ])
      const sub = rows[0]
      if (!sub) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
      }

      const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)

      // Only allow trial extension if subscription is currently in trial and not expired
      const nowSeconds = Math.floor(Date.now() / 1000)
      const currentTrialEnd = (stripeSub as any).trial_end as number | null
      const isTrialing = (stripeSub as any).status === "trialing"
      if (!isTrialing || !currentTrialEnd || currentTrialEnd <= nowSeconds) {
        return NextResponse.json(
          { error: "Trial can only be extended while it is active (not after it ends)." },
          { status: 400 }
        )
      }

      // Determine target trial_end in seconds (add days from the current trial end)
      const base = currentTrialEnd
      const extendedTrialEnd = base + days * 24 * 60 * 60

      const updated = await stripe.subscriptions.update(sub.stripe_subscription_id, {
        trial_end: extendedTrialEnd,
        proration_behavior: "none",
      })

      // Update local DB
      await client.query(
        `UPDATE subscription_better
         SET trial_end = to_timestamp($1), updated_at = NOW()
         WHERE user_id = $2`,
        [extendedTrialEnd, user_id]
      )

      // Optionally record reason in an audit table if exists
      try {
        await client.query(
          `INSERT INTO subscription_trial_extensions (user_id, subscription_id, days_extended, reason)
           VALUES ($1, $2, $3, $4)`,
          [user_id, sub.stripe_subscription_id, days, reason || null]
        )
      } catch (e) {
        // Table may not exist; ignore silently
      }

      return NextResponse.json({
        success: true,
        message: `Trial extended by ${days} day(s)`,
        trial_end: new Date(extendedTrialEnd * 1000).toISOString(),
      })
    } finally {
      client.release()
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 })
  }
}

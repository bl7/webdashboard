import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { verifyAuthToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { role, userUuid } = await verifyAuthToken(req)
    const { user_id } = await req.json()

    if (role === "user" && user_id !== userUuid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      const { rows } = await client.query(
        "SELECT * FROM subscription_better WHERE user_id = $1",
        [user_id]
      )
      const sub = rows[0]
      if (!sub) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
      }

      if (sub.status === "canceled" && sub.current_period_end) {
        const periodEnd = new Date(sub.current_period_end).getTime()
        if (periodEnd < Date.now()) {
          return NextResponse.json(
            {
              error:
                "This subscription has expired and cannot be reactivated. Please create a new subscription.",
            },
            { status: 400 }
          )
        }
      }

      if (!sub.cancel_at_period_end && !sub.cancel_at && sub.status !== "canceled") {
        return NextResponse.json(
          { error: "Subscription is already active and does not need reactivation." },
          { status: 400 }
        )
      }

      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        cancel_at: null,
        cancel_at_period_end: false,
      })

      await client.query(
        `UPDATE subscription_better SET cancel_at_period_end = false, cancel_at = NULL, updated_at = NOW() WHERE user_id = $1`,
        [user_id]
      )

      return NextResponse.json({
        message: "Your subscription has been reactivated. You will continue to be billed as normal.",
      })
    } finally {
      client.release()
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Reactivation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

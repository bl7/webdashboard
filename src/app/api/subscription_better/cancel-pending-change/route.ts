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

    if (!user_id) return NextResponse.json({ error: "Missing user_id" }, { status: 400 })

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

      const hasPending =
        sub.pending_plan_interval ||
        sub.pending_price_id ||
        sub.pending_plan_change ||
        sub.pending_plan_change_effective

      if (!hasPending) {
        return NextResponse.json({ message: "No pending billing change to cancel." })
      }

      if (sub.pending_price_id && sub.stripe_subscription_id && sub.price_id) {
        const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)
        const itemId = stripeSub.items.data[0]?.id
        if (itemId) {
          await stripe.subscriptions.update(sub.stripe_subscription_id, {
            items: [{ id: itemId, price: sub.price_id }],
            proration_behavior: "none",
          })
        }
      }

      await client.query(
        `UPDATE subscription_better SET
          pending_plan_change = NULL,
          pending_price_id = NULL,
          pending_plan_interval = NULL,
          pending_plan_name = NULL,
          pending_plan_change_effective = NULL,
          updated_at = NOW()
         WHERE user_id = $1`,
        [user_id]
      )

      return NextResponse.json({ message: "Pending billing change cancelled." })
    } finally {
      client.release()
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to cancel pending change"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

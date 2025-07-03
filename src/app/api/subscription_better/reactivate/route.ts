import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const { user_id } = await req.json()
  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  }
  const client = await pool.connect()
  try {
    const { rows } = await client.query("SELECT * FROM subscription_better WHERE user_id = $1", [user_id])
    const sub = rows[0]
    if (!sub) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }
    if (sub.status === 'canceled') {
      return NextResponse.json({ error: "Subscription is already canceled and cannot be reactivated." }, { status: 400 })
    }
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at: null,
    })
    await client.query(
      `UPDATE subscription_better SET cancel_at_period_end = false, cancel_at = NULL WHERE user_id = $1`,
      [user_id]
    )
    return NextResponse.json({ message: "Your subscription has been reactivated. You will continue to be billed as normal." })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    client.release()
  }
} 
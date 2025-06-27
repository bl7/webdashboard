import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const { user_id, immediate } = await req.json()
  if (!user_id) return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  const client = await pool.connect()
  try {
    const { rows } = await client.query("SELECT * FROM subscription_better WHERE user_id = $1", [user_id])
    const sub = rows[0]
    if (!sub) return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    if (immediate) {
      await stripe.subscriptions.cancel(sub.stripe_subscription_id)
      await client.query("UPDATE subscription_better SET status = 'canceled', cancel_at_period_end = false, updated_at = NOW() WHERE user_id = $1", [user_id])
      return NextResponse.json({ message: "Your subscription has been cancelled immediately." })
    } else {
      await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at_period_end: true })
      await client.query("UPDATE subscription_better SET cancel_at_period_end = true, updated_at = NOW() WHERE user_id = $1", [user_id])
      return NextResponse.json({ message: "Your subscription will be cancelled at the end of the current period." })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    client.release()
  }
} 
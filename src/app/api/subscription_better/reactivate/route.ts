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
    
    // Check if subscription is already fully canceled (past period end)
    if (sub.status === 'canceled' && sub.current_period_end) {
      const periodEnd = new Date(sub.current_period_end).getTime()
      const now = Date.now()
      // If period has ended, subscription cannot be reactivated - need to create new subscription
      if (periodEnd < now) {
        return NextResponse.json({ 
          error: "This subscription has expired and cannot be reactivated. Please create a new subscription." 
        }, { status: 400 })
      }
    }
    
    // Check if there's nothing to reactivate
    if (!sub.cancel_at_period_end && !sub.cancel_at && sub.status !== 'canceled') {
      return NextResponse.json({ 
        error: "Subscription is already active and does not need reactivation." 
      }, { status: 400 })
    }
    
    // Reactivate by removing cancellation flags in Stripe
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at: null,
      cancel_at_period_end: false,
    })
    
    // Update database immediately for better UX
    await client.query(
      `UPDATE subscription_better SET cancel_at_period_end = false, cancel_at = NULL, updated_at = NOW() WHERE user_id = $1`,
      [user_id]
    )
    
    return NextResponse.json({ 
      message: "Your subscription has been reactivated. You will continue to be billed as normal." 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    client.release()
  }
} 
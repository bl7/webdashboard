import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const { user_id, new_plan_id } = await req.json()
  if (!user_id || !new_plan_id) {
    return NextResponse.json({ error: "Missing user_id or new_plan_id" }, { status: 400 })
  }
  const client = await pool.connect()
  try {
    const { rows } = await client.query("SELECT * FROM subscription_better WHERE user_id = $1", [user_id])
    const sub = rows[0]
    if (!sub) return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    // TODO: Map new_plan_id to Stripe price_id
    const new_price_id = new_plan_id // Replace with your mapping logic
    // Get current Stripe subscription
    const stripeSubResp = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)
    const stripeSub = stripeSubResp as any
    const currentPriceId = stripeSub.items.data[0]?.price?.id
    const currentInterval = stripeSub.items.data[0]?.price?.recurring?.interval
    // Get new price details
    const newPrice = await stripe.prices.retrieve(new_price_id)
    const newInterval = newPrice.recurring?.interval
    // Determine if upgrade or downgrade/interval change
    const isUpgrade = (newPrice.unit_amount || 0) > (stripeSub.items.data[0]?.price?.unit_amount || 0)
    const isTrialing = stripeSub.status === 'trialing' || (stripeSub.trial_end && Date.now() / 1000 < stripeSub.trial_end)

    if (isTrialing) {
      // User is on trial: change plan immediately, keep trial going
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        items: [{ id: stripeSub.items.data[0].id, price: new_price_id }],
        trial_end: stripeSub.trial_end, // preserve trial
        proration_behavior: "none",    // no proration during trial
      })
      await client.query(
        `UPDATE subscription_better SET plan_id = $1, plan_name = $2, amount = $3, billing_interval = $4, updated_at = NOW(), pending_plan_change = NULL, pending_plan_change_effective = NULL WHERE user_id = $5`,
        [new_plan_id, newPrice.nickname || new_price_id, (newPrice.unit_amount || 0) / 100, newInterval, user_id]
      )
      return NextResponse.json({ message: "Your plan has been changed. Your trial continues, and you will be billed for the new plan when your trial ends." })
    }
    if (!isUpgrade || currentInterval !== newInterval) {
      // Schedule change at period end
      await client.query(
        `UPDATE subscription_better SET pending_plan_change = $1, pending_plan_change_effective = to_timestamp($2), updated_at = NOW() WHERE user_id = $3`,
        [new_plan_id, stripeSub.current_period_end, user_id]
      )
      return NextResponse.json({ message: "Your plan change is scheduled for the end of your current billing period.", effective_date: new Date(stripeSub.current_period_end * 1000) })
    } else {
      // Immediate upgrade (non-trial)
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        items: [{ id: stripeSub.items.data[0].id, price: new_price_id }],
        proration_behavior: "create_prorations",
      })
      await client.query(
        `UPDATE subscription_better SET plan_id = $1, plan_name = $2, amount = $3, billing_interval = $4, updated_at = NOW(), pending_plan_change = NULL, pending_plan_change_effective = NULL WHERE user_id = $5`,
        [new_plan_id, newPrice.nickname || new_price_id, (newPrice.unit_amount || 0) / 100, newInterval, user_id]
      )
      return NextResponse.json({ message: "Your plan has been upgraded and is effective immediately." })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    client.release()
  }
} 
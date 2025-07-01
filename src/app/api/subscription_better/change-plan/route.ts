import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const { user_id, plan_id, price_id } = await req.json()
  if (!user_id || !plan_id || !price_id) {
    return NextResponse.json({ error: "Missing user_id, plan_id, or price_id" }, { status: 400 })
  }
  const client = await pool.connect()
  try {
    // Look up plan name, interval, and tier from DB
    const planRes = await client.query(
      `SELECT name, stripe_price_id_monthly, stripe_price_id_yearly, tier FROM plans WHERE id = $1`,
      [plan_id]
    )
    if (planRes.rows.length === 0) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }
    const plan = planRes.rows[0]
    let plan_name = plan.name
    let plan_interval = null
    if (price_id === plan.stripe_price_id_monthly) plan_interval = 'monthly'
    else if (price_id === plan.stripe_price_id_yearly) plan_interval = 'yearly'
    else plan_interval = 'unknown'
    const { rows } = await client.query("SELECT * FROM subscription_better WHERE user_id = $1", [user_id])
    const sub = rows[0]
    if (!sub) return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    // Get current Stripe subscription
    const stripeSubResp = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)
    const stripeSub = stripeSubResp as any
    const currentPriceId = stripeSub.items.data[0]?.price?.id
    const currentInterval = stripeSub.items.data[0]?.price?.recurring?.interval
    // Get new price details
    const newPrice = await stripe.prices.retrieve(price_id)
    const newInterval = newPrice.recurring?.interval
    // Fetch current plan tier from DB
    const currentPlanId = sub.plan_id
    const currentPlanRes = await client.query(
      `SELECT tier FROM plans WHERE id = $1`,
      [currentPlanId]
    )
    const currentPlanTier = currentPlanRes.rows[0]?.tier ?? 0
    const newPlanTier = plan.tier ?? 0
    // Determine if upgrade or downgrade/interval change
    let isUpgrade = false;
    if (newPlanTier > currentPlanTier) {
      isUpgrade = true;
    } else if (newPlanTier === currentPlanTier) {
      isUpgrade = (newPrice.unit_amount || 0) > (stripeSub.items.data[0]?.price?.unit_amount || 0)
    }
    const isTrialing = stripeSub.status === 'trialing' || (stripeSub.trial_end && Date.now() / 1000 < stripeSub.trial_end)

    console.log('[CHANGE-PLAN] user_id:', user_id, 'plan_id:', plan_id, 'price_id:', price_id)

    if (isTrialing) {
      // For any plan or billing change on trial: end trial, start new plan, charge now (immediate payment)
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        items: [{ id: stripeSub.items.data[0].id, price: price_id }],
        trial_end: 'now', // end trial immediately
        proration_behavior: 'always_invoice', // immediately invoice and attempt payment
        billing_cycle_anchor: 'now', // reset billing cycle to now
        metadata: { plan_id, price_id, plan_name, plan_interval },
      })
      await client.query(
        `UPDATE subscription_better SET plan_id = $1, price_id = $2, plan_name = $3, plan_interval = $4, amount = $5, billing_interval = $6, updated_at = NOW(), pending_plan_change = NULL, pending_plan_change_effective = NULL WHERE user_id = $7`,
        [plan_id, price_id, plan_name, plan_interval, (newPrice.unit_amount || 0) / 100, newInterval, user_id]
      )
      return NextResponse.json({ message: "Your trial has ended and your new plan is now active. You have been charged for the new plan." })
    }
    // Determine if this is a billing period change
    const isBillingChange = currentInterval !== newInterval;
    // Determine if this is an upgrade (higher tier or higher price)
    let isImmediateUpgrade = false;
    if (newPlanTier > currentPlanTier) {
      isImmediateUpgrade = true;
    } else if (newPlanTier === currentPlanTier) {
      isImmediateUpgrade = (newPrice.unit_amount || 0) > (stripeSub.items.data[0]?.price?.unit_amount || 0);
    }
    // If upgrade or billing period change to longer period (monthly → yearly)
    if (isImmediateUpgrade || (isBillingChange && String(newInterval) === 'yearly')) {
      // Immediate change
      const updateParams: any = {
        items: [{ id: stripeSub.items.data[0].id, price: price_id }],
        proration_behavior: 'always_invoice',
        metadata: { plan_id, price_id, plan_name, plan_interval },
      };
      if (isBillingChange) {
        updateParams.billing_cycle_anchor = 'now';
      }
      await stripe.subscriptions.update(sub.stripe_subscription_id, updateParams);
      await client.query(
        `UPDATE subscription_better SET plan_id = $1, price_id = $2, plan_name = $3, plan_interval = $4, amount = $5, billing_interval = $6, updated_at = NOW(), pending_plan_change = NULL, pending_plan_change_effective = NULL WHERE user_id = $7`,
        [plan_id, price_id, plan_name, plan_interval, (newPrice.unit_amount || 0) / 100, newInterval, user_id]
      );
      return NextResponse.json({ message: "Your plan has been upgraded and is effective immediately. Proration and payment have been applied." });
    }
    // Downgrade or billing period change to shorter period (yearly → monthly): schedule for period end
      await client.query(
      `UPDATE subscription_better SET 
        pending_plan_change = $1, 
        pending_price_id = $2,
        pending_plan_interval = $3,
        pending_plan_name = $4,
        pending_plan_change_effective = to_timestamp($5), 
        updated_at = NOW() 
       WHERE user_id = $6`,
      [plan_id, price_id, plan_interval, plan_name, stripeSub.current_period_end, user_id]
    );
    return NextResponse.json({ message: "Your plan change is scheduled for the end of your current billing period.", effective_date: new Date(stripeSub.current_period_end * 1000) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    client.release()
  }
} 
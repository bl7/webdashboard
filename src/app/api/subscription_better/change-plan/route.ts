import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { verifyAuthToken } from "@/lib/auth"

function normalizeInterval(interval?: string | null): string {
  if (!interval) return "monthly"
  const v = interval.toLowerCase()
  if (v === "year" || v === "yearly") return "yearly"
  return "monthly"
}

export async function POST(req: NextRequest) {
  try {
    const { role, userUuid } = await verifyAuthToken(req)
    const { user_id, plan_id, price_id } = await req.json()

    if (role === "user" && user_id !== userUuid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user_id || !plan_id || !price_id) {
      return NextResponse.json({ error: "Missing user_id, plan_id, or price_id" }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      const planRes = await client.query(
        `SELECT name, stripe_price_id_monthly, stripe_price_id_yearly, tier FROM plans WHERE id = $1`,
        [plan_id]
      )
      if (planRes.rows.length === 0) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 })
      }
      const plan = planRes.rows[0]
      const plan_name = plan.name
      let plan_interval: string | null = null
      if (price_id === plan.stripe_price_id_monthly) plan_interval = "monthly"
      else if (price_id === plan.stripe_price_id_yearly) plan_interval = "yearly"
      else plan_interval = "unknown"

      const { rows } = await client.query(
        "SELECT * FROM subscription_better WHERE user_id = $1",
        [user_id]
      )
      const sub = rows[0]
      if (!sub) return NextResponse.json({ error: "No subscription found" }, { status: 404 })

      const stripeSubResp = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)
      const stripeSub = stripeSubResp
      const currentInterval = stripeSub.items.data[0]?.price?.recurring?.interval
      const newPrice = await stripe.prices.retrieve(price_id)
      const newInterval = newPrice.recurring?.interval

      const currentPlanRes = await client.query(`SELECT tier FROM plans WHERE id = $1`, [
        sub.plan_id,
      ])
      const currentPlanTier = currentPlanRes.rows[0]?.tier ?? 0
      const newPlanTier = plan.tier ?? 0

      let isUpgrade = false
      if (newPlanTier > currentPlanTier) {
        isUpgrade = true
      } else if (newPlanTier === currentPlanTier) {
        isUpgrade =
          (newPrice.unit_amount || 0) > (stripeSub.items.data[0]?.price?.unit_amount || 0)
      }

      const isTrialing =
        stripeSub.status === "trialing" ||
        (stripeSub.trial_end && Date.now() / 1000 < stripeSub.trial_end)

      if (sub.cancel_at_period_end || sub.cancel_at) {
        if (!isUpgrade) {
          return NextResponse.json(
            {
              error:
                "You cannot downgrade while cancellation is scheduled. Only upgrades are allowed.",
            },
            { status: 400 }
          )
        }
        await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at: null })
        await client.query(
          `UPDATE subscription_better SET cancel_at_period_end = false, cancel_at = NULL WHERE user_id = $1`,
          [user_id]
        )
      }

      const billing_interval = normalizeInterval(plan_interval)
      const amountCents = newPrice.unit_amount || 0

      if (isTrialing) {
        await stripe.subscriptions.update(sub.stripe_subscription_id, {
          items: [{ id: stripeSub.items.data[0].id, price: price_id }],
          trial_end: "now",
          proration_behavior: "always_invoice",
          billing_cycle_anchor: "now",
          metadata: { plan_id, price_id, plan_name, plan_interval },
        })
        await client.query(
          `UPDATE subscription_better SET plan_id = $1, price_id = $2, plan_name = $3, plan_interval = $4, amount = $5, billing_interval = $6, updated_at = NOW(), pending_plan_change = NULL, pending_plan_change_effective = NULL, pending_price_id = NULL, pending_plan_interval = NULL, pending_plan_name = NULL WHERE user_id = $7`,
          [plan_id, price_id, plan_name, plan_interval, amountCents, billing_interval, user_id]
        )
        return NextResponse.json({
          message:
            "Your trial has ended and your new plan is now active. You have been charged for the new plan.",
        })
      }

      const isBillingChange = currentInterval !== newInterval
      let isImmediateUpgrade = isUpgrade
      if (newPlanTier === currentPlanTier) {
        isImmediateUpgrade =
          (newPrice.unit_amount || 0) > (stripeSub.items.data[0]?.price?.unit_amount || 0)
      }

      if (isImmediateUpgrade || (isBillingChange && newInterval === "year")) {
        const updateParams: {
          items: { id: string; price: string }[]
          proration_behavior: "always_invoice"
          metadata: Record<string, string>
          billing_cycle_anchor?: "now"
        } = {
          items: [{ id: stripeSub.items.data[0].id, price: price_id }],
          proration_behavior: "always_invoice",
          metadata: { plan_id, price_id, plan_name, plan_interval: plan_interval || "" },
        }
        if (isBillingChange) updateParams.billing_cycle_anchor = "now"

        await stripe.subscriptions.update(sub.stripe_subscription_id, updateParams)
        await client.query(
          `UPDATE subscription_better SET plan_id = $1, price_id = $2, plan_name = $3, plan_interval = $4, amount = $5, billing_interval = $6, updated_at = NOW(), pending_plan_change = NULL, pending_plan_change_effective = NULL, pending_price_id = NULL, pending_plan_interval = NULL, pending_plan_name = NULL WHERE user_id = $7`,
          [plan_id, price_id, plan_name, plan_interval, amountCents, billing_interval, user_id]
        )
        return NextResponse.json({
          message:
            "Your plan has been upgraded and is effective immediately. Proration and payment have been applied.",
        })
      }

      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        items: [{ id: stripeSub.items.data[0].id, price: price_id }],
        proration_behavior: "none",
      })

      const periodEnd =
        stripeSub.items.data[0]?.current_period_end ??
        (stripeSub as unknown as { current_period_end?: number }).current_period_end

      await client.query(
        `UPDATE subscription_better SET 
          pending_plan_change = $1, 
          pending_price_id = $2,
          pending_plan_interval = $3,
          pending_plan_name = $4,
          pending_plan_change_effective = to_timestamp($5), 
          updated_at = NOW() 
         WHERE user_id = $6`,
        [plan_id, price_id, plan_interval, plan_name, periodEnd, user_id]
      )
      return NextResponse.json({
        message: "Your plan change is scheduled for the end of your current billing period.",
        effective_date: periodEnd ? new Date(periodEnd * 1000) : undefined,
      })
    } finally {
      client.release()
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Plan change failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

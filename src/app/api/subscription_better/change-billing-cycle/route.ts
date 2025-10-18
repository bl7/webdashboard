import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { verifyAuthToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { role, userUuid } = await verifyAuthToken(req)
    const { user_id, billing_cycle } = await req.json()

    console.log("[BILLING-CYCLE] Request received:", { user_id, billing_cycle, role })

    // Authorization: users can only change their own subscription
    if (role === "user" && user_id !== userUuid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user_id || !billing_cycle) {
      return NextResponse.json({ error: "Missing user_id or billing_cycle" }, { status: 400 })
    }

    if (!["monthly", "yearly"].includes(billing_cycle)) {
      return NextResponse.json(
        { error: "Invalid billing_cycle. Must be 'monthly' or 'yearly'" },
        { status: 400 }
      )
    }

    const client = await pool.connect()

    try {
      // Get current subscription
      const subResult = await client.query("SELECT * FROM subscription_better WHERE user_id = $1", [
        user_id,
      ])

      if (subResult.rows.length === 0) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
      }

      const sub = subResult.rows[0]
      const currentCycle = sub.billing_interval
      const currentPriceId = sub.price_id

      // Normalize billing cycle values to handle both 'month'/'monthly' and 'year'/'yearly'
      const normalizedCurrentCycle =
        currentCycle === "month" ? "monthly" : currentCycle === "year" ? "yearly" : currentCycle

      console.log("[BILLING-CYCLE] Current subscription:", {
        currentCycle,
        normalizedCurrentCycle,
        currentPriceId,
        plan_id: sub.plan_id,
        stripe_subscription_id: sub.stripe_subscription_id,
      })

      // If already on the requested cycle, return success
      if (normalizedCurrentCycle === billing_cycle) {
        return NextResponse.json({ message: "Already on requested billing cycle" })
      }

      // Get the new price ID based on the plan and billing cycle
      const planResult = await client.query("SELECT * FROM plans WHERE id = $1", [sub.plan_id])

      if (planResult.rows.length === 0) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 })
      }

      const plan = planResult.rows[0]
      const newPriceId =
        billing_cycle === "monthly" ? plan.stripe_price_id_monthly : plan.stripe_price_id_yearly

      console.log("[BILLING-CYCLE] Plan details:", {
        plan_id: plan.id,
        stripe_price_id_monthly: plan.stripe_price_id_monthly,
        stripe_price_id_yearly: plan.stripe_price_id_yearly,
        newPriceId,
        price_monthly: plan.price_monthly,
        price_yearly: plan.price_yearly,
      })

      if (!newPriceId) {
        console.log("[BILLING-CYCLE] Error: No price ID found for billing cycle:", billing_cycle)
        return NextResponse.json(
          { error: "Price ID not found for requested billing cycle" },
          { status: 400 }
        )
      }

      // Get Stripe subscription
      const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)

      // Determine if this is an upgrade (monthly to yearly) or downgrade (yearly to monthly)
      const isUpgrade = billing_cycle === "yearly" && normalizedCurrentCycle === "monthly"
      const isDowngrade = billing_cycle === "monthly" && normalizedCurrentCycle === "yearly"

      console.log("[BILLING-CYCLE] Change type:", {
        isUpgrade,
        isDowngrade,
        currentCycle,
        normalizedCurrentCycle,
        newCycle: billing_cycle,
      })

      if (isUpgrade) {
        // Monthly to Yearly: Immediate upgrade with credit
        await stripe.subscriptions.update(sub.stripe_subscription_id, {
          items: [{ id: stripeSub.items.data[0].id, price: newPriceId }],
          proration_behavior: "always_invoice",
          billing_cycle_anchor: "now",
        })

        // Update database immediately
        const newAmount = billing_cycle === "yearly" ? plan.price_yearly : plan.price_monthly
        await client.query(
          `UPDATE subscription_better 
           SET price_id = $1, billing_interval = $2, amount = $3, updated_at = NOW()
           WHERE user_id = $4`,
          [newPriceId, billing_cycle, newAmount, user_id]
        )

        return NextResponse.json({
          message:
            "Successfully upgraded to annual billing. You've been credited for unused time and charged for the new annual plan.",
        })
      } else if (isDowngrade) {
        // Yearly to Monthly: Schedule for period end
        await stripe.subscriptions.update(sub.stripe_subscription_id, {
          items: [{ id: stripeSub.items.data[0].id, price: newPriceId }],
          proration_behavior: "none",
        })

        // Update database with pending change
        const newPeriodEnd = new Date((stripeSub as any).current_period_end * 1000)
        console.log("[BILLING-CYCLE] Updating database with pending change:", {
          newPriceId,
          billing_cycle,
          newPeriodEnd: newPeriodEnd.toISOString(),
          user_id,
        })

        await client.query(
          `UPDATE subscription_better 
           SET pending_price_id = $1, pending_plan_interval = $2, pending_plan_change_effective = $3, updated_at = NOW()
           WHERE user_id = $4`,
          [newPriceId, billing_cycle, newPeriodEnd, user_id]
        )

        console.log("[BILLING-CYCLE] Database updated successfully")

        return NextResponse.json({
          message: `Successfully scheduled downgrade to monthly billing. This will take effect on ${newPeriodEnd.toLocaleDateString()}.`,
        })
      }

      return NextResponse.json({ error: "Invalid billing cycle change" }, { status: 400 })
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error("Billing cycle change error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

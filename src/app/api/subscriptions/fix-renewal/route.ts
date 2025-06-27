import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const { user_id } = await req.json()
  
  if (!user_id) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 })
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // Get current subscription
    const result = await client.query(
      `SELECT * FROM subscriptions WHERE user_id = $1`,
      [user_id]
    )

    const subscription = result.rows[0]
    if (!subscription) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    console.log("🔍 Current subscription data:", {
      id: subscription.id,
      user_id: subscription.user_id,
      stripe_subscription_id: subscription.stripe_subscription_id,
      current_period_end: subscription.current_period_end,
      current_period_end_type: typeof subscription.current_period_end,
      billing_interval: subscription.billing_interval,
      plan_name: subscription.plan_name,
      status: subscription.status
    })

    let updated = false
    let currentPeriodEnd = subscription.current_period_end

    // If current_period_end is missing and we have a Stripe subscription, fetch it
    if (!subscription.current_period_end && subscription.stripe_subscription_id) {
      try {
        console.log(`🔧 Fetching current_period_end from Stripe for ${subscription.stripe_subscription_id}`)
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
        
        if (stripeSubscription.current_period_end) {
          currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000).toISOString()
          
          await client.query(
            `UPDATE subscriptions 
             SET current_period_end = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2`,
            [currentPeriodEnd, subscription.id]
          )
          
          updated = true
          console.log(`✅ Updated current_period_end to ${currentPeriodEnd}`)
        }
      } catch (stripeError) {
        console.error("Failed to fetch from Stripe:", stripeError)
        await client.query("ROLLBACK")
        return NextResponse.json({ 
          error: "Failed to fetch from Stripe", 
          details: stripeError instanceof Error ? stripeError.message : String(stripeError)
        }, { status: 500 })
      }
    }

    // If current_period_end exists but is not in ISO format, fix it
    if (subscription.current_period_end && typeof subscription.current_period_end === 'string') {
      try {
        const date = new Date(subscription.current_period_end)
        const isoString = date.toISOString()
        
        if (isoString !== subscription.current_period_end) {
          await client.query(
            `UPDATE subscriptions 
             SET current_period_end = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2`,
            [isoString, subscription.id]
          )
          
          currentPeriodEnd = isoString
          updated = true
          console.log(`✅ Fixed current_period_end format to ${isoString}`)
        }
      } catch (e) {
        console.error("Failed to parse current_period_end:", e)
      }
    }

    await client.query("COMMIT")

    return NextResponse.json({
      success: true,
      updated,
      subscription: {
        ...subscription,
        current_period_end: currentPeriodEnd
      },
      message: updated ? "Renewal date fixed successfully" : "No changes needed"
    })

  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error fixing renewal date:", error)
    return NextResponse.json({ 
      error: "Failed to fix renewal date",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  } finally {
    client.release()
  }
} 
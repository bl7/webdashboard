// /api/stripe/update-subscription/route.ts
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const { user_id, price_id, prorate = true } = await req.json()

    if (!user_id || !price_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get current subscription
    const result = await pool.query(
      "SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
      [user_id]
    )

    const currentSub = result.rows[0]
    if (!currentSub?.stripe_subscription_id) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
    }

    // Update the subscription in Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      currentSub.stripe_subscription_id
    )

    const updatedSubscription = await stripe.subscriptions.update(
      currentSub.stripe_subscription_id,
      {
        items: [
          {
            id: stripeSubscription.items.data[0].id,
            price: price_id,
          },
        ],
        proration_behavior: prorate ? "create_prorations" : "none",
      }
    )

    // Get the price details
    const price = await stripe.prices.retrieve(price_id)
    const product = await stripe.products.retrieve(price.product as string)

    // Update our database
    await pool.query(
      `
      UPDATE subscriptions
      SET price_id = $1,
          plan_name = $2,
          plan_amount = $3,
          billing_interval = $4
      WHERE user_id = $5
      `,
      [price_id, product.name, price.unit_amount, price.recurring?.interval, user_id]
    )

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
    })
  } catch (error: any) {
    console.error("Error updating subscription:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to update subscription",
      },
      { status: 500 }
    )
  }
}

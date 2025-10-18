import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { verifyAuthToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { role, userUuid } = await verifyAuthToken(req)
    const { user_id } = await req.json()

    // Authorization: users can only access their own payment methods
    if (role === "user" && user_id !== userUuid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
    }

    const client = await pool.connect()

    try {
      // Get subscription to find Stripe customer ID
      const subResult = await client.query(
        "SELECT stripe_customer_id FROM subscription_better WHERE user_id = $1",
        [user_id]
      )

      if (subResult.rows.length === 0) {
        return NextResponse.json({ error: "No subscription found" }, { status: 404 })
      }

      const stripeCustomerId = subResult.rows[0].stripe_customer_id

      if (!stripeCustomerId) {
        return NextResponse.json({ error: "No Stripe customer found" }, { status: 404 })
      }

      // Create a Stripe Checkout session for payment method setup
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "setup",
        payment_method_types: ["card"],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?payment_method_updated=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?payment_method_cancelled=true`,
        metadata: {
          user_id: user_id,
          action: "update_payment_method",
        },
        setup_intent_data: {
          metadata: {
            user_id: user_id,
            action: "update_payment_method",
          },
        },
      })

      return NextResponse.json({ url: session.url })
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error("Payment method session error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

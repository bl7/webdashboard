import { stripe } from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function POST(req: NextRequest) {
  let body
  try {
    body = await req.json()
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
  const { user_id, email, plan_id } = body
  if (!user_id || !email || !plan_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  // TODO: Map plan_id to Stripe price_id
  const price_id = plan_id // Replace with your mapping logic
  try {
    // Find or create Stripe customer
    let customer
    const customers = await stripe.customers.list({ email, limit: 1 })
    if (customers.data.length > 0) {
      customer = customers.data[0]
      if (customer.metadata?.user_id !== user_id) {
        await stripe.customers.update(customer.id, { metadata: { user_id } })
      }
    } else {
      customer = await stripe.customers.create({ email, metadata: { user_id } })
    }
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: price_id, quantity: 1 }],
      subscription_data: {
        metadata: { user_id },
        trial_period_days: 10, // Or your policy
      },
      metadata: { user_id, plan_id },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true&session_id={CHECKOUT_SESSION_ID}`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    })
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 
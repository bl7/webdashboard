import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, email, price_id } = body

    if (!user_id || !email || !price_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error("NEXT_PUBLIC_APP_URL not defined")
    }

    // Optional: basic price_id format check (Stripe price IDs usually start with "price_")
    if (!price_id.startsWith("price_")) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 })
    }

    const customer = await stripe.customers.create({
      email,
      metadata: { user_id },
    })

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: price_id, quantity: 1 }],
      subscription_data: {
        metadata: { user_id }, // Optional but useful
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error instanceof Error ? error.stack : error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

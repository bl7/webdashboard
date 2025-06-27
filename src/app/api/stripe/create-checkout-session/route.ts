import { stripe } from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  let body
  try {
    body = await req.json()
  } catch (err) {
    console.error("Invalid JSON body:", err)
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { user_id, email, price_id } = body

  // Validate required fields
  if (!user_id || !email || !price_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Validate price_id format
  if (!price_id.startsWith("price_")) {
    return NextResponse.json({ error: "Invalid price ID" }, { status: 400 })
  }

  // Validate email format (basic validation)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL

  if (!APP_URL) {
    console.error("Missing NEXT_PUBLIC_APP_URL in environment variables.")
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  try {
    console.log("🔍 Starting checkout session creation with:", {
      user_id,
      email,
      price_id,
      APP_URL,
      stripeApiKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8) + "...",
    })

    // Check if customer already exists to avoid duplicates
    let customer
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
      console.log("📝 Found existing customer:", customer.id)

      // Update metadata if customer exists but doesn't have user_id
      if (!customer.metadata?.user_id) {
        customer = await stripe.customers.update(customer.id, {
          metadata: { user_id },
        })
        console.log("✅ Updated customer metadata")
      }
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email,
        metadata: { user_id },
      })
      console.log("✅ Created new customer:", customer.id)
    }

    // IMPORTANT: Validate the price exists before creating session
    console.log("🔍 Validating price ID:", price_id)
    try {
      const price = await stripe.prices.retrieve(price_id)
      console.log("✅ Price validation successful:", {
        id: price.id,
        active: price.active,
        currency: price.currency,
        recurring: price.recurring,
        product: price.product,
      })

      if (!price.active) {
        throw new Error(`Price ${price_id} is not active`)
      }
    } catch (priceError) {
      console.error("❌ Price validation failed:", priceError)
      throw new Error(`Invalid price ID: ${price_id}. Please check your Stripe dashboard.`)
    }

    console.log("🚀 Creating checkout session...")

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: price_id, quantity: 1 }],
      subscription_data: {
        metadata: { user_id },
        trial_period_days: 10,
      },
      // Add metadata to the session itself for tracking
      metadata: {
        user_id,
        price_id,
      },
      // Improved success/cancel URLs with session ID for tracking
      success_url: `${APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/billing?canceled=true&session_id={CHECKOUT_SESSION_ID}`,
      // Optional: Add automatic tax calculation if you have it configured
      // automatic_tax: { enabled: true },
      // Optional: Allow promotion codes
      allow_promotion_codes: true,
      // Optional: Set billing address collection
      billing_address_collection: "auto",
      // Optional: Add consent collection for terms of service
      // consent_collection: {
      //   terms_of_service: "required",
      // },
    })

    console.log("✅ Checkout session created:", {
      sessionId: session.id,
      customerId: customer.id,
      userId: user_id,
      priceId: price_id,
      url: session.url,
    })

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error: any) {
    console.error("❌ Stripe checkout error:", {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
      stack: error.stack,
      userId: user_id,
      email: email,
      priceId: price_id,
      requestBody: { user_id, email, price_id }, // Log the full request
    })

    // Handle specific Stripe errors with more detailed messages
    if (error.type === "StripeCardError") {
      return NextResponse.json({ error: "Card was declined" }, { status: 400 })
    }

    if (error.type === "StripeRateLimitError") {
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        { status: 429 }
      )
    }

    if (error.type === "StripeInvalidRequestError") {
      console.error("🚨 STRIPE INVALID REQUEST DETAILS:", {
        message: error.message,
        param: error.param,
        code: error.code,
        doc_url: error.doc_url,
      })

      // More specific error messages based on the param
      if (error.param === "line_items[0][price]") {
        return NextResponse.json(
          {
            error: `Invalid price ID: ${price_id}. Please check your Stripe dashboard.`,
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          error: `Invalid request: ${error.message}`,
        },
        { status: 400 }
      )
    }

    if (error.type === "StripeAPIError") {
      return NextResponse.json({ error: "Stripe API error, please try again" }, { status: 502 })
    }

    if (error.type === "StripeConnectionError") {
      return NextResponse.json({ error: "Network error, please try again" }, { status: 503 })
    }

    if (error.type === "StripeAuthenticationError") {
      console.error("🚨 Stripe authentication error - check API keys")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Generic error for unknown issues
    return NextResponse.json(
      {
        error: `Failed to create checkout session: ${error.message}`,
      },
      { status: 500 }
    )
  }
}

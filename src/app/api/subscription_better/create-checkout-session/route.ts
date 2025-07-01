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
  const { user_id, email, plan_id, price_id } = body
  // Debug log
  console.log('DEBUG: Received checkout payload', { user_id, email, plan_id, price_id })
  if (!user_id || !email || !plan_id || !price_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  try {
    // Look up plan name and interval from DB
    const planRes = await pool.query(
      `SELECT name, stripe_price_id_monthly, stripe_price_id_yearly FROM plans WHERE id = $1`,
      [plan_id]
    )
    if (planRes.rows.length === 0) {
      console.error('[CHECKOUT] Plan not found:', plan_id);
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }
    const plan = planRes.rows[0]
    let plan_name = plan.name
    let plan_interval = null
    if (price_id === plan.stripe_price_id_monthly) plan_interval = 'monthly'
    else if (price_id === plan.stripe_price_id_yearly) plan_interval = 'yearly'
    else {
      console.error('[CHECKOUT] Invalid price_id for plan:', { plan_id, price_id, plan });
      return NextResponse.json({ error: "Invalid price ID for plan" }, { status: 400 })
    }
    // Find or create Stripe customer
    let customer
    const customers = await stripe.customers.list({ email, limit: 1 })
    if (customers.data.length > 0) {
      customer = customers.data[0]
      console.log('[CHECKOUT] Found existing customer:', { customer_id: customer.id, email });
      if (customer.metadata?.user_id !== user_id) {
        console.log('[CHECKOUT] Updating customer metadata:', { customer_id: customer.id, user_id });
        await stripe.customers.update(customer.id, { metadata: { user_id } })
      }
    } else {
      console.log('[CHECKOUT] Creating new customer:', { email, user_id });
      customer = await stripe.customers.create({ email, metadata: { user_id } })
    }
    // Check if user has ever had a trial before
    const trialCheck = await pool.query(
      `SELECT 1 FROM subscription_better WHERE user_id = $1 AND trial_end IS NOT NULL LIMIT 1`,
      [user_id]
    );
    const trialEligible = trialCheck.rows.length === 0;
    // Create checkout session with detailed metadata
    const sessionData = {
      customer: customer.id,
      mode: "subscription" as const,
      payment_method_types: ["card" as const],
      line_items: [{ price: price_id, quantity: 1 }],
      subscription_data: {
        metadata: { user_id, plan_id, price_id, plan_name, plan_interval },
        ...(trialEligible ? { trial_period_days: 10 } : {}),
      },
      metadata: { user_id, plan_id, price_id, plan_name, plan_interval },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true&session_id={CHECKOUT_SESSION_ID}`,
      allow_promotion_codes: true,
      billing_address_collection: "auto" as const,
    }
    console.log('[CHECKOUT] Creating session with data:', sessionData);
    const session = await stripe.checkout.sessions.create(sessionData)
    console.log('[CHECKOUT] Session created:', { session_id: session.id });
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('[CHECKOUT] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 
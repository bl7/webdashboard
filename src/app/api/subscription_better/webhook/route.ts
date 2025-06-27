import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"
import { getPlanNameFromPriceId } from '@/lib/formatPlanName'
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  console.log("[WEBHOOK] Handler invoked");
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")
  if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 })
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
  } catch (err: any) {
    console.error("[WEBHOOK] Invalid signature", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }
  try {
    console.log("[WEBHOOK] Received event:", event.type, JSON.stringify(event.data, null, 2))
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        // Log the full Stripe subscription object for debugging
        console.log("[WEBHOOK] Stripe Subscription Object:", JSON.stringify(sub, null, 2));
        // Extract user_id from metadata or fallback
        let user_id = sub.metadata?.user_id
        if (!user_id && sub.customer) {
          const customer = await stripe.customers.retrieve(sub.customer as string)
          if (!customer.deleted) user_id = (customer as any).metadata?.user_id
        }
        if (!user_id) user_id = 'unknown-' + sub.customer
        console.log("[WEBHOOK] Extracted user_id:", user_id)
        // Extract card info if available
        let card = null
        if (sub.default_payment_method) {
          const pm = await stripe.paymentMethods.retrieve(sub.default_payment_method as string)
          if (pm.card) card = pm.card
        }
        console.log("[WEBHOOK] Card info:", card)
        // Upsert subscription_better
        const client = await pool.connect()
        try {
          await client.query(
            `INSERT INTO subscription_better (
              user_id, stripe_customer_id, stripe_subscription_id, plan_id, plan_name, status,
              trial_start, trial_end, current_period_start, current_period_end, billing_interval, amount, currency,
              cancel_at_period_end, pending_plan_change, pending_plan_change_effective,
              card_brand, card_last4, card_exp_month, card_exp_year, card_country, card_fingerprint, created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6,
              to_timestamp($7), to_timestamp($8), to_timestamp($9), to_timestamp($10), $11, $12, $13,
              $14, $15, to_timestamp($16),
              $17, $18, $19, $20, $21, $22, NOW(), NOW()
            )
            ON CONFLICT (user_id) DO UPDATE SET
              stripe_customer_id = $2, stripe_subscription_id = $3, plan_id = $4, plan_name = $5, status = $6,
              trial_start = to_timestamp($7), trial_end = to_timestamp($8), current_period_start = to_timestamp($9), current_period_end = to_timestamp($10),
              billing_interval = $11, amount = $12, currency = $13, cancel_at_period_end = $14,
              pending_plan_change = $15, pending_plan_change_effective = to_timestamp($16),
              card_brand = $17, card_last4 = $18, card_exp_month = $19, card_exp_year = $20, card_country = $21, card_fingerprint = $22, updated_at = NOW()`,
            [
              user_id,
              sub.customer,
              sub.id,
              sub.items.data[0]?.price?.id || '',
              getPlanNameFromPriceId(sub.items.data[0]?.price?.id) || sub.items.data[0]?.price?.id || '',
              sub.status,
              sub.trial_start || null,
              sub.trial_end || null,
              sub.items.data[0]?.current_period_start || null,
              sub.items.data[0]?.current_period_end || null,
              sub.items.data[0]?.price?.recurring?.interval || null,
              sub.items.data[0]?.price?.unit_amount || null,
              sub.items.data[0]?.price?.currency || null,
              sub.cancel_at_period_end || false,
              sub.metadata?.pending_plan_change || null,
              sub.metadata?.pending_plan_change_effective || null,
              card?.brand || null,
              card?.last4 || null,
              card?.exp_month || null,
              card?.exp_year || null,
              card?.country || null,
              card?.fingerprint || null,
            ]
          )
          console.log("[WEBHOOK] Upserted subscription for user_id:", user_id)
        } catch (dbErr) {
          console.error("[WEBHOOK] DB error:", dbErr)
        } finally {
          client.release()
        }
        break
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        console.log("[WEBHOOK] checkout.session.completed received", JSON.stringify(session, null, 2))
        // Get subscription ID from session
        const subscriptionId = session.subscription as string
        if (!subscriptionId) {
          console.error("[WEBHOOK] No subscription ID in checkout.session.completed")
          break
        }
        // Fetch the subscription from Stripe
        const sub = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription
        // Log the full Stripe subscription object for debugging
        console.log("[WEBHOOK] Stripe Subscription Object:", JSON.stringify(sub, null, 2));
        // Extract user_id from metadata or fallback
        let user_id = sub.metadata?.user_id
        if (!user_id && sub.customer) {
          const customer = await stripe.customers.retrieve(sub.customer as string)
          if (!customer.deleted) user_id = (customer as any).metadata?.user_id
        }
        if (!user_id) user_id = 'unknown-' + sub.customer
        console.log("[WEBHOOK] Extracted user_id from checkout.session.completed:", user_id)
        // Extract card info if available
        let card = null
        if (sub.default_payment_method) {
          const pm = await stripe.paymentMethods.retrieve(sub.default_payment_method as string)
          if (pm.card) card = pm.card
        }
        console.log("[WEBHOOK] Card info:", card)
        // Upsert subscription_better
        const client = await pool.connect()
        try {
          await client.query(
            `INSERT INTO subscription_better (
              user_id, stripe_customer_id, stripe_subscription_id, plan_id, plan_name, status,
              trial_start, trial_end, current_period_start, current_period_end, billing_interval, amount, currency,
              cancel_at_period_end, pending_plan_change, pending_plan_change_effective,
              card_brand, card_last4, card_exp_month, card_exp_year, card_country, card_fingerprint, created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6,
              to_timestamp($7), to_timestamp($8), to_timestamp($9), to_timestamp($10), $11, $12, $13,
              $14, $15, to_timestamp($16),
              $17, $18, $19, $20, $21, $22, NOW(), NOW()
            )
            ON CONFLICT (user_id) DO UPDATE SET
              stripe_customer_id = $2, stripe_subscription_id = $3, plan_id = $4, plan_name = $5, status = $6,
              trial_start = to_timestamp($7), trial_end = to_timestamp($8), current_period_start = to_timestamp($9), current_period_end = to_timestamp($10),
              billing_interval = $11, amount = $12, currency = $13, cancel_at_period_end = $14,
              pending_plan_change = $15, pending_plan_change_effective = to_timestamp($16),
              card_brand = $17, card_last4 = $18, card_exp_month = $19, card_exp_year = $20, card_country = $21, card_fingerprint = $22, updated_at = NOW()`,
            [
              user_id,
              sub.customer,
              sub.id,
              sub.items.data[0]?.price?.id || '',
              getPlanNameFromPriceId(sub.items.data[0]?.price?.id) || sub.items.data[0]?.price?.id || '',
              sub.status,
              sub.trial_start || null,
              sub.trial_end || null,
              sub.items.data[0]?.current_period_start || null,
              sub.items.data[0]?.current_period_end || null,
              sub.items.data[0]?.price?.recurring?.interval || null,
              sub.items.data[0]?.price?.unit_amount || null,
              sub.items.data[0]?.price?.currency || null,
              sub.cancel_at_period_end || false,
              sub.metadata?.pending_plan_change || null,
              sub.metadata?.pending_plan_change_effective || null,
              card?.brand || null,
              card?.last4 || null,
              card?.exp_month || null,
              card?.exp_year || null,
              card?.country || null,
              card?.fingerprint || null,
            ]
          )
          console.log("[WEBHOOK] Upserted subscription for user_id (checkout.session.completed):", user_id)
        } catch (dbErr) {
          console.error("[WEBHOOK] DB error (checkout.session.completed):", dbErr)
        } finally {
          client.release()
        }
        break
      }
      default:
        // Ignore other events
        console.log("[WEBHOOK] Ignored event type:", event.type)
        break
    }
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("[WEBHOOK] Handler error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 
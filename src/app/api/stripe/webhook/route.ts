import { NextRequest } from "next/server"
import Stripe from "stripe"
import pool from "@/lib/pg"
export const config = {
  runtime: "nodejs",
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable")
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable")
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any,
})
console.log("env", process.env.STRIPE_SECRET_KEY)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(rawBody), signature, endpointSecret)
  } catch (err: any) {
    console.error("Webhook Error:", err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const data = event.data.object as Stripe.Subscription | Stripe.Checkout.Session | Stripe.Invoice

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = data as Stripe.Checkout.Session
        const subscriptionId = session.subscription as string | undefined
        const customerId = session.customer as string | undefined
        const userId = session.metadata?.user_id

        if (!userId || !subscriptionId || !customerId) {
          return new Response("Missing user, subscription, or customer ID", { status: 400 })
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ["default_payment_method", "latest_invoice", "items.data.price"],
        })

        if (subscription.items.data.length === 0) {
          return new Response("Subscription has no items", { status: 400 })
        }

        const item = subscription.items.data[0]
        const plan = item.price

        const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod | null

        // Use current_period_end from subscription item (not subscription)
        const currentPeriodEnd = item.current_period_end ?? 0
        // trial_end remains on subscription object
        const trialEnd = subscription.trial_end ?? 0

        await pool.query(
          `
          INSERT INTO subscriptions (
            user_id, stripe_customer_id, stripe_subscription_id, price_id,
            status, current_period_end, trial_end, plan_name, plan_amount,
            billing_interval, next_amount_due, card_last4, card_exp_month, card_exp_year
          ) VALUES (
            $1, $2, $3, $4,
            $5, to_timestamp($6), to_timestamp($7), $8, $9,
            $10, $11, $12, $13, $14
          )
          ON CONFLICT (stripe_subscription_id) DO UPDATE SET
            status = EXCLUDED.status,
            current_period_end = EXCLUDED.current_period_end,
            trial_end = EXCLUDED.trial_end,
            plan_name = EXCLUDED.plan_name,
            plan_amount = EXCLUDED.plan_amount,
            billing_interval = EXCLUDED.billing_interval,
            next_amount_due = EXCLUDED.next_amount_due,
            card_last4 = EXCLUDED.card_last4,
            card_exp_month = EXCLUDED.card_exp_month,
            card_exp_year = EXCLUDED.card_exp_year;
          `,
          [
            userId,
            customerId,
            subscription.id,
            plan.id,
            subscription.status,
            currentPeriodEnd,
            trialEnd,
            plan.nickname ?? null,
            (plan.unit_amount ?? 0) / 100,
            plan.recurring?.interval ?? null,
            subscription.latest_invoice && typeof subscription.latest_invoice !== "string"
              ? subscription.latest_invoice.amount_due / 100
              : null,
            paymentMethod?.card?.last4 ?? null,
            paymentMethod?.card?.exp_month ?? null,
            paymentMethod?.card?.exp_year ?? null,
          ]
        )
        break
      }

      case "invoice.paid": {
        const invoice = data as Stripe.Invoice
        console.log("✅ Invoice paid:", invoice.id)
        break
      }

      case "invoice.payment_failed": {
        const invoice = data as Stripe.Invoice
        console.warn("❌ Payment failed for invoice:", invoice.id)
        break
      }

      case "customer.subscription.updated": {
        const subscription = data as Stripe.Subscription

        if (subscription.items.data.length === 0) {
          return new Response("Subscription has no items", { status: 400 })
        }

        const item = subscription.items.data[0]
        const plan = item.price

        const currentPeriodEnd = item.current_period_end ?? 0
        const trialEnd = subscription.trial_end ?? 0

        await pool.query(
          `
          UPDATE subscriptions
          SET status = $1,
              current_period_end = to_timestamp($2),
              trial_end = to_timestamp($3),
              price_id = $4,
              plan_name = $5,
              plan_amount = $6,
              billing_interval = $7
          WHERE stripe_subscription_id = $8
          `,
          [
            subscription.status,
            currentPeriodEnd,
            trialEnd,
            plan.id,
            plan.nickname ?? null,
            (plan.unit_amount ?? 0) / 100,
            plan.recurring?.interval ?? null,
            subscription.id,
          ]
        )
        break
      }

      case "customer.subscription.deleted": {
        const subscription = data as Stripe.Subscription
        await pool.query(`UPDATE subscriptions SET status = $1 WHERE stripe_subscription_id = $2`, [
          subscription.status,
          subscription.id,
        ])
        break
      }

      case "invoice.created": {
        const invoice = data as Stripe.Invoice
        console.log("🧾 Invoice created:", invoice.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err: any) {
    console.error("Error processing webhook event:", err)
    return new Response("Internal Server Error", { status: 500 })
  }

  return new Response("Webhook handled", { status: 200 })
}

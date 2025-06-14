import { NextRequest } from "next/server"
import Stripe from "stripe"
import pool from "@/lib/pg"

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
}

if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY")
if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error("Missing STRIPE_WEBHOOK_SECRET")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any,
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  console.log("🔔 Webhook received")

  let body: string
  let signature: string | null

  try {
    // Get raw body as text - this is crucial for Vercel
    body = await req.text()
    signature = req.headers.get("stripe-signature")

    console.log("📝 Body length:", body.length)
    console.log("✍️ Signature present:", !!signature)

    if (!signature) {
      console.error("❌ Missing Stripe signature")
      return new Response("Missing Stripe signature", { status: 400 })
    }

    if (!body) {
      console.error("❌ Empty request body")
      return new Response("Empty request body", { status: 400 })
    }
  } catch (err) {
    console.error("❌ Failed to read request:", err)
    return new Response("Failed to read request", { status: 400 })
  }

  let event: Stripe.Event

  try {
    // Construct event with raw body string
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    console.log("✅ Webhook signature verified:", event.type)
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", {
      error: err.message,
      bodyLength: body.length,
      signaturePresent: !!signature,
      webhookSecret: endpointSecret ? "Present" : "Missing",
    })
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const data = event.data.object as Stripe.Subscription | Stripe.Checkout.Session | Stripe.Invoice

  try {
    console.log(`🎯 Processing event: ${event.type}`)

    switch (event.type) {
      case "checkout.session.completed": {
        console.log("🛒 Processing checkout session completed")
        const session = data as Stripe.Checkout.Session
        const subscriptionId = session.subscription as string
        const customerId = session.customer as string
        const userId = session.metadata?.user_id

        console.log("📊 Session data:", {
          subscriptionId: !!subscriptionId,
          customerId: !!customerId,
          userId: !!userId,
        })

        if (!userId || !subscriptionId || !customerId) {
          console.error("❌ Missing required metadata:", { userId, subscriptionId, customerId })
          return new Response("Missing required Stripe metadata", { status: 400 })
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ["default_payment_method", "latest_invoice", "items.data.price"],
        })

        const item = subscription.items.data[0]
        const plan = item.price
        const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod | null

        const currentPeriodEnd = item.current_period_end ?? 0
        const trialEnd = subscription.trial_end ?? 0

        // Safe access of latest_invoice.amount_due
        const latestInvoiceAmountDue =
          typeof subscription.latest_invoice === "object" &&
          subscription.latest_invoice !== null &&
          "amount_due" in subscription.latest_invoice
            ? (subscription.latest_invoice.amount_due as number) / 100
            : null

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
            latestInvoiceAmountDue,
            paymentMethod?.card?.last4 ?? null,
            paymentMethod?.card?.exp_month ?? null,
            paymentMethod?.card?.exp_year ?? null,
          ]
        )

        console.log("✅ Subscription saved to database")
        break
      }

      case "invoice.paid":
        console.log("✅ Invoice paid:", (data as Stripe.Invoice).id)
        break

      case "invoice.payment_failed":
        console.warn("❌ Payment failed:", (data as Stripe.Invoice).id)
        break

      case "invoice.created":
        console.log("🧾 Invoice created:", (data as Stripe.Invoice).id)
        break

      case "customer.subscription.updated": {
        console.log("🔄 Processing subscription update")
        const subscription = data as Stripe.Subscription
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

        console.log("✅ Subscription updated in database")
        break
      }

      case "customer.subscription.deleted": {
        console.log("🗑️ Processing subscription deletion")
        const subscription = data as Stripe.Subscription
        await pool.query(`UPDATE subscriptions SET status = $1 WHERE stripe_subscription_id = $2`, [
          subscription.status,
          subscription.id,
        ])

        console.log("✅ Subscription marked as deleted in database")
        break
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error("🔥 Error processing webhook event:", {
      error: err,
      eventType: event.type,
      eventId: event.id,
    })
    return new Response("Internal error", { status: 500 })
  }

  console.log("✅ Webhook processed successfully")
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

import Stripe from "stripe"
import pool from "@/lib/pg"

if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY")
if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error("Missing STRIPE_WEBHOOK_SECRET")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any,
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

// Helper function to safely extract subscription ID from invoice
function extractSubscriptionId(subscription: string | Stripe.Subscription | null): string | null {
  if (!subscription) return null
  if (typeof subscription === "string") return subscription
  if (typeof subscription === "object" && subscription.id) return subscription.id
  return null
}

// Type guard to ensure subscription has required properties
function hasSubscriptionTimestamps(sub: any): sub is Stripe.Subscription & {
  current_period_end: number
  trial_end: number | null
} {
  return typeof sub.current_period_end === "number"
}

export async function POST(request: Request) {
  console.log("🔔 Webhook received - using raw Request")

  let body: string
  let sig: string | null

  try {
    // Use the raw Request object instead of NextRequest
    body = await request.text()
    sig = request.headers.get("stripe-signature")

    console.log("📝 Body length:", body.length)
    console.log("✍️ Signature present:", !!sig)
    console.log("🔍 Body starts with:", body.substring(0, 50))

    if (!sig) {
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
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    console.log("✅ Webhook signature verified:", event.type)
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", {
      error: err.message,
      bodyLength: body.length,
      signaturePresent: !!sig,
      webhookSecret: endpointSecret ? "Present" : "Missing",
      bodyPreview: body.substring(0, 200),
    })

    // Log more details for debugging
    console.error("🔍 Signature details:", {
      signature: sig?.substring(0, 50) + "...",
      secretLength: endpointSecret?.length,
      secretPrefix: endpointSecret?.substring(0, 10),
    })

    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    console.log(`🎯 Processing event: ${event.type}`)

    switch (event.type) {
      case "checkout.session.completed": {
        console.log("🛒 Processing checkout session completed")
        const session = event.data.object as Stripe.Checkout.Session
        const subscriptionId = session.subscription as string
        const customerId = session.customer as string
        const userId = session.metadata?.user_id

        console.log("📊 Session data:", {
          subscriptionId: !!subscriptionId,
          customerId: !!customerId,
          userId: !!userId,
          metadata: session.metadata,
        })

        if (!userId) {
          console.error("❌ Missing user_id in metadata:", session.metadata)
          return new Response("Missing required user_id in metadata", { status: 400 })
        }

        if (!subscriptionId) {
          console.error("❌ Missing subscription ID in session")
          return new Response("Missing subscription ID", { status: 400 })
        }

        if (!customerId) {
          console.error("❌ Missing customer ID in session")
          return new Response("Missing customer ID", { status: 400 })
        }

        try {
          const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ["default_payment_method", "latest_invoice", "items.data.price"],
          })

          // Handle Response<Subscription> wrapper - remove this problematic line
          const subscription = subscriptionResponse // Direct assignment, no wrapper handling
          const item = subscription.items.data[0]

          if (!item || !item.price) {
            console.error("❌ Missing price data in subscription")
            return new Response("Missing price data", { status: 400 })
          }

          const plan = item.price
          const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod | null

          // Safely access subscription timestamps
          const currentPeriodEnd = hasSubscriptionTimestamps(subscription)
            ? subscription.current_period_end
            : Math.floor(Date.now() / 1000) // Use current timestamp as fallback

          const trialEnd =
            hasSubscriptionTimestamps(subscription) && subscription.trial_end
              ? subscription.trial_end
              : null

          const latestInvoice = subscription.latest_invoice
          const latestInvoiceAmountDue =
            latestInvoice &&
            typeof latestInvoice === "object" &&
            latestInvoice.amount_due !== undefined
              ? latestInvoice.amount_due / 100
              : null

          await pool.query(
            `
            INSERT INTO subscriptions (
              user_id, stripe_customer_id, stripe_subscription_id, price_id,
              status, current_period_end, trial_end, plan_name, plan_amount,
              billing_interval, next_amount_due, card_last4, card_exp_month, card_exp_year
            ) VALUES (
              $1, $2, $3, $4,
              $5, to_timestamp($6), $7, $8, $9,
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
              card_exp_year = EXCLUDED.card_exp_year,
              updated_at = CURRENT_TIMESTAMP
            `,
            [
              userId,
              customerId,
              subscription.id,
              plan.id,
              subscription.status,
              currentPeriodEnd,
              trialEnd ? new Date(trialEnd * 1000) : null, // Convert to Date object or null
              plan.nickname ?? `${plan.recurring?.interval || "unknown"} plan`,
              (plan.unit_amount ?? 0) / 100,
              plan.recurring?.interval ?? "month",
              latestInvoiceAmountDue,
              paymentMethod?.card?.last4 ?? null,
              paymentMethod?.card?.exp_month ?? null,
              paymentMethod?.card?.exp_year ?? null,
            ]
          )

          console.log("✅ Subscription saved to database for user:", userId)
        } catch (dbError) {
          console.error("❌ Database error:", dbError)
          return new Response("Database error", { status: 500 })
        }
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        console.log("✅ Invoice paid:", invoice.id)

        // Extract subscription ID safely
        const subscriptionId = extractSubscriptionId((invoice as any).subscription)

        if (subscriptionId) {
          try {
            const result = await pool.query(
              `UPDATE subscriptions 
               SET status = 'active', updated_at = CURRENT_TIMESTAMP 
               WHERE stripe_subscription_id = $1 AND status IN ('past_due', 'unpaid')
               RETURNING user_id, status`,
              [subscriptionId]
            )

            if (result.rows.length > 0) {
              console.log(
                `✅ Subscription ${subscriptionId} status updated to active for user ${result.rows[0].user_id}`
              )
            } else {
              console.log(`ℹ️ No subscription found to update or already active: ${subscriptionId}`)
            }
          } catch (dbError) {
            console.error("❌ Error updating subscription status on payment:", {
              error: dbError,
              subscriptionId,
              invoiceId: invoice.id,
            })
          }
        } else {
          console.warn("⚠️ No subscription ID found in invoice:", invoice.id)
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        console.warn("❌ Payment failed:", invoice.id)

        // Extract subscription ID safely
        const subscriptionId = extractSubscriptionId((invoice as any).subscription)

        if (subscriptionId) {
          try {
            const result = await pool.query(
              `UPDATE subscriptions 
               SET status = 'past_due', updated_at = CURRENT_TIMESTAMP 
               WHERE stripe_subscription_id = $1 AND status = 'active'
               RETURNING user_id, status`,
              [subscriptionId]
            )

            if (result.rows.length > 0) {
              console.log(
                `⚠️ Subscription ${subscriptionId} status updated to past_due for user ${result.rows[0].user_id}`
              )
            } else {
              console.log(`ℹ️ No active subscription found to mark as past_due: ${subscriptionId}`)
            }
          } catch (dbError) {
            console.error("❌ Error updating subscription status on payment failure:", {
              error: dbError,
              subscriptionId,
              invoiceId: invoice.id,
            })
          }
        } else {
          console.warn("⚠️ No subscription ID found in failed invoice:", invoice.id)
        }
        break
      }

      case "invoice.created": {
        const invoice = event.data.object as Stripe.Invoice
        console.log("🧾 Invoice created:", invoice.id)
        break
      }

      case "customer.subscription.created": {
        console.log("🆕 Processing subscription creation")
        const subscription = event.data.object as Stripe.Subscription

        // This event doesn't have metadata, so we'll handle it in checkout.session.completed
        // Just log for now
        console.log("ℹ️ Subscription created:", subscription.id)
        break
      }

      case "customer.subscription.updated": {
        console.log("🔄 Processing subscription update")
        const subscription = event.data.object as Stripe.Subscription

        try {
          const item = subscription.items.data[0]
          if (!item || !item.price) {
            console.error("❌ Missing price data in subscription update")
            break
          }

          const plan = item.price

          // Safely access subscription timestamps
          const currentPeriodEnd = hasSubscriptionTimestamps(subscription)
            ? subscription.current_period_end
            : Math.floor(Date.now() / 1000)

          const trialEnd =
            hasSubscriptionTimestamps(subscription) && subscription.trial_end
              ? subscription.trial_end
              : null

          const result = await pool.query(
            `
            UPDATE subscriptions
            SET status = $1,
                current_period_end = to_timestamp($2),
                trial_end = $3,
                price_id = $4,
                plan_name = $5,
                plan_amount = $6,
                billing_interval = $7,
                updated_at = CURRENT_TIMESTAMP
            WHERE stripe_subscription_id = $8
            RETURNING user_id
          `,
            [
              subscription.status,
              currentPeriodEnd,
              trialEnd ? new Date(trialEnd * 1000) : null,
              plan.id,
              plan.nickname ?? `${plan.recurring?.interval || "unknown"} plan`,
              (plan.unit_amount ?? 0) / 100,
              plan.recurring?.interval ?? "month",
              subscription.id,
            ]
          )

          if (result.rows.length === 0) {
            console.warn("⚠️ No subscription found to update:", subscription.id)
          } else {
            console.log("✅ Subscription updated in database for user:", result.rows[0].user_id)
          }
        } catch (dbError) {
          console.error("❌ Database error in subscription update:", dbError)
        }
        break
      }

      case "customer.subscription.deleted": {
        console.log("🗑️ Processing subscription deletion")
        const subscription = event.data.object as Stripe.Subscription

        try {
          const result = await pool.query(
            `UPDATE subscriptions 
             SET status = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE stripe_subscription_id = $2
             RETURNING user_id`,
            [subscription.status, subscription.id]
          )

          if (result.rows.length === 0) {
            console.warn("⚠️ No subscription found to delete:", subscription.id)
          } else {
            console.log("✅ Subscription marked as deleted for user:", result.rows[0].user_id)
          }
        } catch (dbError) {
          console.error("❌ Database error in subscription deletion:", dbError)
        }
        break
      }

      // Handle other common events gracefully
      case "charge.succeeded":
      case "payment_method.attached":
      case "payment_intent.succeeded":
      case "payment_intent.created":
      case "invoice.finalized":
      case "invoice.updated":
      case "invoice.payment_succeeded":
      case "invoice_payment.paid":
        console.log(`ℹ️ Acknowledged event: ${event.type}`)
        break

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error("🔥 Error processing webhook event:", {
      error: err,
      message: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined,
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

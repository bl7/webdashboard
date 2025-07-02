import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"
import { getPlanNameFromPriceId } from '@/lib/formatPlanName'
import { sendMail } from '@/lib/mail'
import {
  newSubscriptionEmail,
  planChangeEmail,
  cancellationEmail,
  expiringSoonEmail,
  renewalReminderEmail,
  renewalConfirmationEmail,
  paymentFailedEmail,
  trialEndingSoonEmail,
  labelOrderConfirmationEmail,
  labelOrderAdminNotificationEmail
} from '@/components/templates/subscriptionEmails'
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
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription
        let user_id = sub.metadata?.user_id
        let userEmail = null
        if (!user_id && sub.customer) {
          const customer = await stripe.customers.retrieve(sub.customer as string)
          if (!customer.deleted) {
            user_id = (customer as any).metadata?.user_id
            userEmail = (customer as any).email
          }
        } else if (sub.customer) {
          const customer = await stripe.customers.retrieve(sub.customer as string)
          if (!customer.deleted) userEmail = (customer as any).email
        }
        if (!user_id) user_id = 'unknown-' + sub.customer
        // Send new subscription email
        if (userEmail) {
          await sendMail({
            to: userEmail,
            subject: 'Welcome to InstaLabel! Your Subscription is Active',
            body: newSubscriptionEmail({
              name: userEmail,
              planName: sub.metadata?.plan_name || (sub as any)['plan_id'] || '',
              trialDays: sub.trial_end && sub.trial_start ? Math.round((sub.trial_end - sub.trial_start) / 86400) : 0,
              trialEndDate: sub.trial_end ? new Date(sub.trial_end * 1000).toLocaleDateString() : '',
              amount: sub.items.data[0]?.price?.unit_amount ? sub.items.data[0].price.unit_amount / 100 : 0,
              currency: sub.items.data[0]?.price?.currency || 'gbp',
              billingInterval: sub.items.data[0]?.price?.recurring?.interval === 'year' ? 'year' : 'month',
            })
          })
        }
        // Log the full Stripe subscription object for debugging
        console.log("[WEBHOOK] Stripe Subscription Object:", JSON.stringify(sub, null, 2));
        console.log("[WEBHOOK] Event Type:", event.type);
        console.log("[WEBHOOK] Subscription Status:", sub.status);
        console.log("[WEBHOOK] Subscription Metadata:", sub.metadata);
        console.log("[WEBHOOK] Subscription Items:", sub.items.data);
        // Extract card info if available
        let card = null
        if (sub.default_payment_method) {
          const pm = await stripe.paymentMethods.retrieve(sub.default_payment_method as string)
          if (pm.card) card = pm.card
        }
        console.log("[WEBHOOK] Card info:", card)
        // Prepare all upsert fields and log them
        const plan_id = sub.metadata?.plan_id || null;
        const price_id = sub.items.data[0]?.price?.id || null;
        const plan_name = sub.metadata?.plan_name || getPlanNameFromPriceId(price_id) || price_id || '';
        const plan_interval = sub.metadata?.plan_interval || sub.items.data[0]?.price?.recurring?.interval || null;
        const status = sub.status;
        const trial_start = sub.trial_start || null;
        const trial_end = sub.trial_end || null;
        const current_period_start = sub.items.data[0]?.current_period_start || null;
        const current_period_end = sub.items.data[0]?.current_period_end || null;
        const billing_interval = sub.items.data[0]?.price?.recurring?.interval || null;
        const amount = sub.items.data[0]?.price?.unit_amount || null;
        const currency = sub.items.data[0]?.price?.currency || null;
        const cancel_at_period_end = sub.cancel_at_period_end || false;
        const pending_plan_change = sub.metadata?.pending_plan_change || null;
        const pending_plan_change_effective = sub.metadata?.pending_plan_change_effective || null;
        const card_brand = card?.brand || null;
        const card_last4 = card?.last4 || null;
        const card_exp_month = card?.exp_month || null;
        const card_exp_year = card?.exp_year || null;
        const card_country = card?.country || null;
        const card_fingerprint = card?.fingerprint || null;
        const cancel_at = sub.cancel_at || null;
        // Log all upsert fields
        console.log('[WEBHOOK] Upsert fields:', {
          user_id, plan_id, price_id, plan_name, plan_interval, status, trial_start, trial_end, current_period_start, current_period_end, billing_interval, amount, currency, cancel_at_period_end, pending_plan_change, pending_plan_change_effective, card_brand, card_last4, card_exp_month, card_exp_year, card_country, card_fingerprint, cancel_at
        });
        const client = await pool.connect()
        try {
          await client.query(
            `INSERT INTO subscription_better (
              user_id, stripe_customer_id, stripe_subscription_id, plan_id, plan_name, status,
              trial_start, trial_end, current_period_start, current_period_end, billing_interval, amount, currency,
              cancel_at_period_end, pending_plan_change, pending_plan_change_effective,
              card_brand, card_last4, card_exp_month, card_exp_year, card_country, card_fingerprint,
              created_at, updated_at, price_id, plan_interval,
              refund_due_at, refund_amount, pending_price_id, pending_plan_interval, pending_plan_name, cancel_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6,
              to_timestamp($7), to_timestamp($8), to_timestamp($9), to_timestamp($10), $11, $12, $13,
              $14, $15, to_timestamp($16),
              $17, $18, $19, $20, $21, $22,
              NOW(), NOW(), $23, $24,
              to_timestamp($25), $26, $27, $28, $29, to_timestamp($30)
            )
            ON CONFLICT (user_id) DO UPDATE SET
              stripe_customer_id = $2, stripe_subscription_id = $3, plan_id = $4, plan_name = $5, status = $6,
              trial_start = to_timestamp($7), trial_end = to_timestamp($8), current_period_start = to_timestamp($9), current_period_end = to_timestamp($10),
              billing_interval = $11, amount = $12, currency = $13, cancel_at_period_end = $14,
              pending_plan_change = $15, pending_plan_change_effective = to_timestamp($16),
              card_brand = $17, card_last4 = $18, card_exp_month = $19, card_exp_year = $20, card_country = $21, card_fingerprint = $22,
              updated_at = NOW(), price_id = $23, plan_interval = $24,
              refund_due_at = to_timestamp($25), refund_amount = $26, pending_price_id = $27, pending_plan_interval = $28, pending_plan_name = $29, cancel_at = to_timestamp($30)`,
            [
              user_id,
              sub.customer,
              sub.id,
              plan_id,
              plan_name,
              status,
              trial_start,
              trial_end,
              current_period_start,
              current_period_end,
              billing_interval,
              amount,
              currency,
              cancel_at_period_end,
              pending_plan_change,
              pending_plan_change_effective,
              card_brand,
              card_last4,
              card_exp_month,
              card_exp_year,
              card_country,
              card_fingerprint,
              price_id,
              plan_interval,
              null,
              null,
              null,
              null,
              null,
              cancel_at
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
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription
        let user_id = sub.metadata?.user_id
        let userEmail = null
        if (!user_id && sub.customer) {
          const customer = await stripe.customers.retrieve(sub.customer as string)
          if (!customer.deleted) {
            user_id = (customer as any).metadata?.user_id
            userEmail = (customer as any).email
          }
        } else if (sub.customer) {
          const customer = await stripe.customers.retrieve(sub.customer as string)
          if (!customer.deleted) userEmail = (customer as any).email
        }
        if (!user_id) user_id = 'unknown-' + sub.customer
        // Plan change (upgrade/downgrade/billing change)
        if (userEmail && sub.metadata?.plan_change_type) {
          await sendMail({
            to: userEmail,
            subject: 'Your InstaLabel Subscription Plan Change',
            body: planChangeEmail({
              name: userEmail,
              oldPlan: sub.metadata?.old_plan_name || '',
              newPlan: sub.metadata?.plan_name || '',
              changeType: sub.metadata?.plan_change_type as 'upgrade' | 'downgrade' | 'billing_change',
              effectiveDate: sub.metadata?.plan_change_effective ? new Date(Number(sub.metadata.plan_change_effective) * 1000).toLocaleDateString() : '',
              amount: sub.items.data[0]?.price?.unit_amount ? sub.items.data[0].price.unit_amount / 100 : 0,
              currency: sub.items.data[0]?.price?.currency || 'gbp',
              billingInterval: sub.items.data[0]?.price?.recurring?.interval === 'year' ? 'year' : 'month',
            })
          })
        }
        // Expiring soon (about to finish in a week)
        if (userEmail && (sub as any)['current_period_end']) {
          const daysLeft = Math.ceil(((sub as any)['current_period_end'] * 1000 - Date.now()) / (1000 * 60 * 60 * 24))
          if (daysLeft === 7) {
            await sendMail({
              to: userEmail,
              subject: 'Your InstaLabel Subscription is Expiring Soon',
              body: expiringSoonEmail({
                name: userEmail,
                planName: sub.metadata?.plan_name || '',
                expiryDate: new Date((sub as any)['current_period_end'] * 1000).toLocaleDateString(),
                daysLeft
              })
            })
          }
          // Will be renewed tomorrow
          if (daysLeft === 1) {
            await sendMail({
              to: userEmail,
              subject: 'Your InstaLabel Subscription Will Renew Tomorrow',
              body: renewalReminderEmail({
                name: userEmail,
                planName: sub.metadata?.plan_name || '',
                renewalDate: new Date((sub as any)['current_period_end'] * 1000).toLocaleDateString(),
              })
            })
          }
        }
        // Trial ending soon (3 days or less)
        if (userEmail && sub.trial_end) {
          const trialDaysLeft = Math.ceil((sub.trial_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24))
          if (trialDaysLeft > 0 && trialDaysLeft <= 3) {
            await sendMail({
              to: userEmail,
              subject: 'Your InstaLabel Trial is Ending Soon',
              body: trialEndingSoonEmail({
                name: userEmail,
                planName: sub.metadata?.plan_name || '',
                trialEndDate: new Date(sub.trial_end * 1000).toLocaleDateString(),
                daysLeft: trialDaysLeft
              })
            })
          }
        }
        // Renewal confirmation (on renewal)
        if (userEmail && (sub as any)['current_period_start'] && (sub as any)['current_period_end']) {
          const now = Date.now()
          const start = (sub as any)['current_period_start'] * 1000
          if (now - start < 1000 * 60 * 60 * 24) { // within 24 hours of renewal
            await sendMail({
              to: userEmail,
              subject: 'Your InstaLabel Subscription Has Been Renewed',
              body: renewalConfirmationEmail({
                name: userEmail,
                planName: sub.metadata?.plan_name || '',
                renewalDate: new Date((sub as any)['current_period_start'] * 1000).toLocaleDateString(),
                amount: sub.items.data[0]?.price?.unit_amount ? sub.items.data[0].price.unit_amount / 100 : 0,
                currency: sub.items.data[0]?.price?.currency || 'gbp',
                billingInterval: sub.items.data[0]?.price?.recurring?.interval === 'year' ? 'year' : 'month',
              })
            })
          }
        }
        // Log the full Stripe subscription object for debugging
        console.log("[WEBHOOK] Stripe Subscription Object:", JSON.stringify(sub, null, 2));
        // Extract card info if available
        let card = null
        if (sub.default_payment_method) {
          const pm = await stripe.paymentMethods.retrieve(sub.default_payment_method as string)
          if (pm.card) card = pm.card
        }
        console.log("[WEBHOOK] Card info:", card)
        // Prepare all upsert fields and log them
        const plan_id = sub.metadata?.plan_id || null;
        const price_id = sub.items.data[0]?.price?.id || null;
        const plan_name = sub.metadata?.plan_name || getPlanNameFromPriceId(price_id) || price_id || '';
        const plan_interval = sub.metadata?.plan_interval || sub.items.data[0]?.price?.recurring?.interval || null;
        const status = sub.status;
        const trial_start = sub.trial_start || null;
        const trial_end = sub.trial_end || null;
        const current_period_start = sub.items.data[0]?.current_period_start || null;
        const current_period_end = sub.items.data[0]?.current_period_end || null;
        const billing_interval = sub.items.data[0]?.price?.recurring?.interval || null;
        const amount = sub.items.data[0]?.price?.unit_amount || null;
        const currency = sub.items.data[0]?.price?.currency || null;
        const cancel_at_period_end = sub.cancel_at_period_end || false;
        const pending_plan_change = sub.metadata?.pending_plan_change || null;
        const pending_plan_change_effective = sub.metadata?.pending_plan_change_effective || null;
        const card_brand = card?.brand || null;
        const card_last4 = card?.last4 || null;
        const card_exp_month = card?.exp_month || null;
        const card_exp_year = card?.exp_year || null;
        const card_country = card?.country || null;
        const card_fingerprint = card?.fingerprint || null;
        const cancel_at = sub.cancel_at || null;
        // Log all upsert fields
        console.log('[WEBHOOK] Upsert fields:', {
          user_id, plan_id, price_id, plan_name, plan_interval, status, trial_start, trial_end, current_period_start, current_period_end, billing_interval, amount, currency, cancel_at_period_end, pending_plan_change, pending_plan_change_effective, card_brand, card_last4, card_exp_month, card_exp_year, card_country, card_fingerprint, cancel_at
        });
        const client = await pool.connect()
        try {
          await client.query(
            `INSERT INTO subscription_better (
              user_id, stripe_customer_id, stripe_subscription_id, plan_id, plan_name, status,
              trial_start, trial_end, current_period_start, current_period_end, billing_interval, amount, currency,
              cancel_at_period_end, pending_plan_change, pending_plan_change_effective,
              card_brand, card_last4, card_exp_month, card_exp_year, card_country, card_fingerprint,
              created_at, updated_at, price_id, plan_interval,
              refund_due_at, refund_amount, pending_price_id, pending_plan_interval, pending_plan_name, cancel_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6,
              to_timestamp($7), to_timestamp($8), to_timestamp($9), to_timestamp($10), $11, $12, $13,
              $14, $15, to_timestamp($16),
              $17, $18, $19, $20, $21, $22,
              NOW(), NOW(), $23, $24,
              to_timestamp($25), $26, $27, $28, $29, to_timestamp($30)
            )
            ON CONFLICT (user_id) DO UPDATE SET
              stripe_customer_id = $2, stripe_subscription_id = $3, plan_id = $4, plan_name = $5, status = $6,
              trial_start = to_timestamp($7), trial_end = to_timestamp($8), current_period_start = to_timestamp($9), current_period_end = to_timestamp($10),
              billing_interval = $11, amount = $12, currency = $13, cancel_at_period_end = $14,
              pending_plan_change = $15, pending_plan_change_effective = to_timestamp($16),
              card_brand = $17, card_last4 = $18, card_exp_month = $19, card_exp_year = $20, card_country = $21, card_fingerprint = $22,
              updated_at = NOW(), price_id = $23, plan_interval = $24,
              refund_due_at = to_timestamp($25), refund_amount = $26, pending_price_id = $27, pending_plan_interval = $28, pending_plan_name = $29, cancel_at = to_timestamp($30)`,
            [
              user_id,
              sub.customer,
              sub.id,
              plan_id,
              plan_name,
              status,
              trial_start,
              trial_end,
              current_period_start,
              current_period_end,
              billing_interval,
              amount,
              currency,
              cancel_at_period_end,
              pending_plan_change,
              pending_plan_change_effective,
              card_brand,
              card_last4,
              card_exp_month,
              card_exp_year,
              card_country,
              card_fingerprint,
              price_id,
              plan_interval,
              null,
              null,
              null,
              null,
              null,
              cancel_at
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
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        let user_id = sub.metadata?.user_id
        let userEmail = null
        if (!user_id && sub.customer) {
          const customer = await stripe.customers.retrieve(sub.customer as string)
          if (!customer.deleted) {
            user_id = (customer as any).metadata?.user_id
            userEmail = (customer as any).email
          }
        } else if (sub.customer) {
          const customer = await stripe.customers.retrieve(sub.customer as string)
          if (!customer.deleted) userEmail = (customer as any).email
        }
        if (!user_id) user_id = 'unknown-' + sub.customer
        // Send cancellation email
        if (userEmail) {
          await sendMail({
            to: userEmail,
            subject: 'Your InstaLabel Subscription Has Been Cancelled',
            body: cancellationEmail({
              name: userEmail,
              planName: sub.metadata?.plan_name || (sub as any)['plan_id'] || '',
              cancellationType: 'immediate',
              endDate: new Date().toLocaleDateString(),
            })
          })
        }
        // Log the full Stripe subscription object for debugging
        console.log("[WEBHOOK] Stripe Subscription Object:", JSON.stringify(sub, null, 2));
        // Extract card info if available
        let card = null
        if (sub.default_payment_method) {
          const pm = await stripe.paymentMethods.retrieve(sub.default_payment_method as string)
          if (pm.card) card = pm.card
        }
        console.log("[WEBHOOK] Card info:", card)
        // Prepare all upsert fields and log them
        const plan_id = sub.metadata?.plan_id || null;
        const price_id = sub.items.data[0]?.price?.id || null;
        const plan_name = sub.metadata?.plan_name || getPlanNameFromPriceId(price_id) || price_id || '';
        const plan_interval = sub.metadata?.plan_interval || sub.items.data[0]?.price?.recurring?.interval || null;
        const status = sub.status;
        const trial_start = sub.trial_start || null;
        const trial_end = sub.trial_end || null;
        const current_period_start = sub.items.data[0]?.current_period_start || null;
        const current_period_end = sub.items.data[0]?.current_period_end || null;
        const billing_interval = sub.items.data[0]?.price?.recurring?.interval || null;
        const amount = sub.items.data[0]?.price?.unit_amount || null;
        const currency = sub.items.data[0]?.price?.currency || null;
        const cancel_at_period_end = sub.cancel_at_period_end || false;
        const pending_plan_change = sub.metadata?.pending_plan_change || null;
        const pending_plan_change_effective = sub.metadata?.pending_plan_change_effective || null;
        const card_brand = card?.brand || null;
        const card_last4 = card?.last4 || null;
        const card_exp_month = card?.exp_month || null;
        const card_exp_year = card?.exp_year || null;
        const card_country = card?.country || null;
        const card_fingerprint = card?.fingerprint || null;
        const cancel_at = sub.cancel_at || null;
        // Log all upsert fields
        console.log('[WEBHOOK] Upsert fields:', {
          user_id, plan_id, price_id, plan_name, plan_interval, status, trial_start, trial_end, current_period_start, current_period_end, billing_interval, amount, currency, cancel_at_period_end, pending_plan_change, pending_plan_change_effective, card_brand, card_last4, card_exp_month, card_exp_year, card_country, card_fingerprint, cancel_at
        });
        const client = await pool.connect()
        try {
          await client.query(
            `INSERT INTO subscription_better (
              user_id, stripe_customer_id, stripe_subscription_id, plan_id, plan_name, status,
              trial_start, trial_end, current_period_start, current_period_end, billing_interval, amount, currency,
              cancel_at_period_end, pending_plan_change, pending_plan_change_effective,
              card_brand, card_last4, card_exp_month, card_exp_year, card_country, card_fingerprint,
              created_at, updated_at, price_id, plan_interval,
              refund_due_at, refund_amount, pending_price_id, pending_plan_interval, pending_plan_name, cancel_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6,
              to_timestamp($7), to_timestamp($8), to_timestamp($9), to_timestamp($10), $11, $12, $13,
              $14, $15, to_timestamp($16),
              $17, $18, $19, $20, $21, $22,
              NOW(), NOW(), $23, $24,
              to_timestamp($25), $26, $27, $28, $29, to_timestamp($30)
            )
            ON CONFLICT (user_id) DO UPDATE SET
              stripe_customer_id = $2, stripe_subscription_id = $3, plan_id = $4, plan_name = $5, status = $6,
              trial_start = to_timestamp($7), trial_end = to_timestamp($8), current_period_start = to_timestamp($9), current_period_end = to_timestamp($10),
              billing_interval = $11, amount = $12, currency = $13, cancel_at_period_end = $14,
              pending_plan_change = $15, pending_plan_change_effective = to_timestamp($16),
              card_brand = $17, card_last4 = $18, card_exp_month = $19, card_exp_year = $20, card_country = $21, card_fingerprint = $22,
              updated_at = NOW(), price_id = $23, plan_interval = $24,
              refund_due_at = to_timestamp($25), refund_amount = $26, pending_price_id = $27, pending_plan_interval = $28, pending_plan_name = $29, cancel_at = to_timestamp($30)`,
            [
              user_id,
              sub.customer,
              sub.id,
              plan_id,
              plan_name,
              status,
              trial_start,
              trial_end,
              current_period_start,
              current_period_end,
              billing_interval,
              amount,
              currency,
              cancel_at_period_end,
              pending_plan_change,
              pending_plan_change_effective,
              card_brand,
              card_last4,
              card_exp_month,
              card_exp_year,
              card_country,
              card_fingerprint,
              price_id,
              plan_interval,
              null,
              null,
              null,
              null,
              null,
              cancel_at
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
        console.log("[WEBHOOK] Session Metadata:", session.metadata);
        console.log("[WEBHOOK] Session Customer:", session.customer);
        console.log("[WEBHOOK] Session Mode:", session.mode);
        // Handle label order payment
        if (session.mode === 'payment' && session.metadata?.order_id) {
          const orderId = session.metadata.order_id;
          const client = await pool.connect();
          try {
            // Update order as paid and set the real PaymentIntent ID
            await client.query(
              `UPDATE label_orders SET status = 'paid', paid_at = NOW(), stripe_payment_intent_id = $2 WHERE id = $1`,
              [orderId, session.payment_intent]
            );
            // Fetch order and user info
            const orderRes = await client.query(
              `SELECT o.*, u.full_name, u.email FROM label_orders o LEFT JOIN user_profiles u ON o.user_id = u.user_id WHERE o.id = $1`,
              [orderId]
            );
            const order = orderRes.rows[0];
            if (order && order.email) {
              console.log('[WEBHOOK] Sending label order confirmation to user:', { to: order.email, orderId: order.id });
              await sendMail({
                to: order.email,
                subject: 'Your Label Order is Confirmed!',
                body: labelOrderConfirmationEmail({
                  name: order.full_name || order.email,
                  email: order.email,
                  bundleCount: order.bundle_count,
                  labelCount: order.label_count,
                  amount: order.amount_cents,
                  shippingAddress: order.shipping_address,
                  orderId: order.id,
                }),
              });
              console.log('[WEBHOOK] Sent label order confirmation to user:', { to: order.email, orderId: order.id });
              console.log('[WEBHOOK] Sending label order confirmation to admin:', { to: 'admin@instalabel.co', orderId: order.id });
              await sendMail({
                to: 'admin@instalabel.co',
                subject: `New Label Order Paid: #${order.id}`,
                body: labelOrderAdminNotificationEmail({
                  name: order.full_name || order.email,
                  email: order.email,
                  bundleCount: order.bundle_count,
                  labelCount: order.label_count,
                  amount: order.amount_cents,
                  shippingAddress: order.shipping_address,
                  orderId: order.id,
                }),
              });
              console.log('[WEBHOOK] Sent label order confirmation to admin:', { to: 'admin@instalabel.co', orderId: order.id });
            }
            console.log(`[WEBHOOK] Label order ${orderId} marked as paid.`);
          } catch (err) {
            console.error(`[WEBHOOK] Error updating label order ${orderId} to paid:`, err);
          } finally {
            client.release();
          }
        }
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
        const plan_id = sub.metadata?.plan_id || null;
        const price_id = sub.items.data[0]?.price?.id || null;
        const plan_name = sub.metadata?.plan_name || getPlanNameFromPriceId(price_id) || price_id || '';
        const plan_interval = sub.metadata?.plan_interval || sub.items.data[0]?.price?.recurring?.interval || null;
        console.log('[WEBHOOK] Upserting with plan_id:', plan_id, 'price_id:', price_id, 'plan_name:', plan_name, 'plan_interval:', plan_interval);
        const client = await pool.connect()
        try {
          await client.query(
            `INSERT INTO subscription_better (
              user_id, stripe_customer_id, stripe_subscription_id, plan_id, price_id, plan_name, plan_interval, status,
              trial_start, trial_end, current_period_start, current_period_end, billing_interval, amount, currency,
              cancel_at_period_end, pending_plan_change, pending_plan_change_effective,
              card_brand, card_last4, card_exp_month, card_exp_year, card_country, card_fingerprint, created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7,
              $8, to_timestamp($9), to_timestamp($10), to_timestamp($11), $12, $13, $14,
              $15, $16, to_timestamp($17),
              $18, $19, $20, $21, $22, $23, NOW(), NOW()
            )
            ON CONFLICT (user_id) DO UPDATE SET
              stripe_customer_id = $2, stripe_subscription_id = $3, plan_id = $4, price_id = $5, plan_name = $6, plan_interval = $7, status = $8,
              trial_start = to_timestamp($9), trial_end = to_timestamp($10), current_period_start = to_timestamp($11), current_period_end = to_timestamp($12),
              billing_interval = $13, amount = $14, currency = $15, cancel_at_period_end = $16,
              pending_plan_change = $17, pending_plan_change_effective = to_timestamp($18),
              card_brand = $19, card_last4 = $20, card_exp_month = $21, card_exp_year = $22, card_country = $23, card_fingerprint = $24, updated_at = NOW()`,
            [
              user_id,
              sub.customer,
              sub.id,
              plan_id,
              price_id,
              plan_name,
              plan_interval,
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
          // --- DEVICE ASSIGNMENT LOGIC ---
          if (plan_id) {
            // Check if plan includes device
            const planRes = await client.query('SELECT include_device FROM plans WHERE id = $1', [plan_id]);
            if (planRes.rows[0]?.include_device) {
              // Check if user already has a device for this plan
              const existingDevice = await client.query('SELECT id FROM devices WHERE user_id = $1 AND plan_id = $2', [user_id, plan_id]);
              if (existingDevice.rows.length === 0) {
                await client.query(
                  `INSERT INTO devices (user_id, plan_id, assigned_at, status, created_at, updated_at)
                   VALUES ($1, $2, NOW(), 'pending', NOW(), NOW())`,
                  [user_id, plan_id]
                );
                console.log(`[WEBHOOK] Device assignment created for user_id ${user_id}, plan_id ${plan_id}`);
              } else {
                console.log(`[WEBHOOK] Device already assigned for user_id ${user_id}, plan_id ${plan_id}`);
              }
            }
          }
          // --- END DEVICE ASSIGNMENT ---
        } catch (dbErr) {
          console.error("[WEBHOOK] DB error (checkout.session.completed):", dbErr)
        } finally {
          client.release()
        }
        break
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        let userEmail = null
        if (invoice.customer) {
          const customer = await stripe.customers.retrieve(invoice.customer as string)
          if (!customer.deleted) userEmail = (customer as any).email
        }
        if (userEmail) {
          await sendMail({
            to: userEmail,
            subject: 'Payment Failed for Your InstaLabel Subscription',
            body: paymentFailedEmail({
              name: userEmail,
              planName: invoice.lines.data[0]?.description || '',
              dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toLocaleDateString() : '',
            })
          })
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
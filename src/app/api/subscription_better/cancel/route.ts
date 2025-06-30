import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { sendMail } from "@/lib/mail"
import { cancellationEmail } from "@/components/templates/subscriptionEmails"

export async function POST(req: NextRequest) {
  const { user_id, immediate } = await req.json()

  if (!user_id) {
    return NextResponse.json({ success: false, error: "Missing user_id" }, { status: 400 })
  }

  const client = await pool.connect()

  try {
    const { rows } = await client.query("SELECT * FROM subscription_better WHERE user_id = $1", [
      user_id,
    ])
    const sub = rows[0]

    if (!sub) {
      return NextResponse.json({ success: false, error: "No subscription found" }, { status: 404 })
    }

    const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)

    if (stripeSub.status === "canceled") {
      return NextResponse.json({
        success: true,
        message: "Your subscription is already canceled.",
      })
    }

    const item = stripeSub.items.data[0]
    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid subscription: no items found.",
        },
        { status: 500 }
      )
    }

    const interval = item.price?.recurring?.interval
    const amount = item.price?.unit_amount || 0
    const currency = item.price?.currency || "gbp"
    const customerId = stripeSub.customer as string

    if (amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid subscription amount. Cannot proceed.",
        },
        { status: 500 }
      )
    }

    // Fetch user email from Stripe
    let userEmail = null;
    if (sub.stripe_customer_id) {
      const customer = await stripe.customers.retrieve(sub.stripe_customer_id);
      if (!customer.deleted) {
        userEmail = (customer as any).email;
      }
    }
    if (!userEmail) {
      return NextResponse.json({ success: false, error: "Could not find user email for notification." }, { status: 500 });
    }

    // Only allow immediate cancel if trialing
    if (sub.status === 'trialing') {
      await stripe.subscriptions.cancel(sub.stripe_subscription_id);
      await client.query(
        `UPDATE subscription_better
         SET status = 'canceled',
             cancel_at_period_end = false,
             cancel_at = NULL,
             pending_plan_change = NULL,
             pending_plan_change_effective = NULL,
             refund_due_at = NULL,
             refund_amount = NULL,
             updated_at = NOW()
         WHERE user_id = $1`,
        [user_id]
      );
      await sendMail({
        to: userEmail,
        subject: "Subscription Cancellation",
        body: cancellationEmail({
          name: userEmail,
          planName: sub.plan_name || sub.plan_id || '',
          cancellationType: 'immediate',
          endDate: new Date().toLocaleDateString(),
        }),
      });
      return NextResponse.json({
        success: true,
        message: "Your subscription has been cancelled immediately.",
      });
    }

    // Non-trialing: cancel at period end
    const now = Date.now() / 1000
    if (interval === "month") {
      const currentPeriodEnd = (stripeSub as any).current_period_end
      const newCancelAt = currentPeriodEnd + 30 * 24 * 60 * 60

      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        cancel_at: newCancelAt,
      })

      await client.query(
        `UPDATE subscription_better
         SET cancel_at_period_end = true,
             cancel_at = to_timestamp($2),
             pending_plan_change = NULL,
             pending_price_id = NULL,
             pending_plan_interval = NULL,
             pending_plan_name = NULL,
             pending_plan_change_effective = NULL,
             refund_due_at = NULL,
             refund_amount = NULL,
             updated_at = NOW()
         WHERE user_id = $1`,
        [user_id, newCancelAt]
      )

      await sendMail({
        to: userEmail,
        subject: "Subscription Cancellation",
        body: cancellationEmail({
          name: userEmail,
          planName: sub.plan_name || sub.plan_id || '',
          cancellationType: 'monthly',
          endDate: new Date(newCancelAt * 1000).toLocaleDateString(),
        }),
      })

      return NextResponse.json({
        success: true,
        message:
          "Your subscription will be cancelled at the end of the next month. You have been charged for the final month as per our notice policy.",
      })
    } else if (interval === "year") {
      const currentPeriodEnd = (stripeSub as any).current_period_end
      const newCancelAt = currentPeriodEnd + 30 * 24 * 60 * 60

      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        cancel_at: newCancelAt,
      })

      const monthsLeft =
        Math.max(0, (stripeSub as any).current_period_end - now) / (30 * 24 * 60 * 60) - 1
      const refundAmount = Math.round((amount / 12) * monthsLeft * 0.5)
      const refundDueAt = newCancelAt

      await client.query(
        `UPDATE subscription_better
         SET cancel_at_period_end = true,
             cancel_at = to_timestamp($2),
             refund_due_at = to_timestamp($3),
             refund_amount = $4,
             pending_plan_change = NULL,
             pending_price_id = NULL,
             pending_plan_interval = NULL,
             pending_plan_name = NULL,
             pending_plan_change_effective = NULL,
             updated_at = NOW()
         WHERE user_id = $1`,
        [user_id, newCancelAt, refundDueAt, refundAmount]
      )

      await sendMail({
        to: userEmail,
        subject: "Subscription Cancellation",
        body: cancellationEmail({
          name: userEmail,
          planName: sub.plan_name || sub.plan_id || '',
          cancellationType: 'annual',
          endDate: new Date(newCancelAt * 1000).toLocaleDateString(),
          refundInfo: { amount: refundAmount, date: new Date(refundDueAt * 1000).toLocaleDateString() },
        }),
      })

      return NextResponse.json({
        success: true,
        message:
          "Your subscription will be cancelled at the end of the next month. You have been charged for the final month. After that, you will be refunded 50% of the remaining months.",
      })
    } else {
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        cancel_at_period_end: true,
      })

      await client.query(
        `UPDATE subscription_better
         SET cancel_at_period_end = true,
             cancel_at = NULL,
             pending_plan_change = NULL,
             pending_price_id = NULL,
             pending_plan_interval = NULL,
             pending_plan_name = NULL,
             pending_plan_change_effective = NULL,
             refund_due_at = NULL,
             refund_amount = NULL,
             updated_at = NOW()
         WHERE user_id = $1`,
        [user_id]
      )

      await sendMail({
        to: userEmail,
        subject: "Subscription Cancellation",
        body: cancellationEmail({
          name: userEmail,
          planName: sub.plan_name || sub.plan_id || '',
          cancellationType: 'monthly',
          endDate: new Date((stripeSub as any).current_period_end * 1000).toLocaleDateString(),
        }),
      })

      return NextResponse.json({
        success: true,
        message: "Your subscription will be cancelled at the end of the current period.",
      })
    }
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  } finally {
    client.release()
  }
}

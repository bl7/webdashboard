import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { sendMail } from "@/lib/mail"

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

    if (immediate) {
      await stripe.subscriptions.cancel(sub.stripe_subscription_id)
      await client.query(
        `UPDATE subscription_better
         SET status = 'canceled',
             cancel_at_period_end = false,
             updated_at = NOW()
         WHERE user_id = $1`,
        [user_id]
      )
      await sendMail({
        to: user_id,
        subject: "Subscription Cancellation",
        body: "Your subscription has been cancelled immediately.",
      })
      return NextResponse.json({
        success: true,
        message: "Your subscription has been cancelled immediately.",
      })
    }

    const now = Date.now() / 1000

    if (interval === "month") {
      const currentPeriodEnd = (stripeSub as any).current_period_end
      const newCancelAt = currentPeriodEnd + 30 * 24 * 60 * 60

      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        cancel_at: newCancelAt,
        cancel_at_period_end: true,
      })

      await stripe.invoiceItems.create({
        customer: customerId,
        amount: amount,
        currency,
        description: "Final month charge due to cancellation notice",
        subscription: sub.stripe_subscription_id,
      })

      await stripe.invoices.create({
        customer: customerId,
        subscription: sub.stripe_subscription_id,
        auto_advance: true,
      })

      await client.query(
        `UPDATE subscription_better
         SET cancel_at_period_end = true,
             updated_at = NOW()
         WHERE user_id = $1`,
        [user_id]
      )

      await sendMail({
        to: user_id,
        subject: "Subscription Cancellation",
        body: "Your subscription will be cancelled at the end of the next month. You have been charged for the final month as per our notice policy.",
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
        cancel_at_period_end: true,
      })

      const oneMonthAmount = Math.round(amount / 12)

      await stripe.invoiceItems.create({
        customer: customerId,
        amount: oneMonthAmount,
        currency,
        description: "Final month charge due to cancellation notice (annual)",
        subscription: sub.stripe_subscription_id,
      })

      await stripe.invoices.create({
        customer: customerId,
        subscription: sub.stripe_subscription_id,
        auto_advance: true,
      })

      const monthsLeft =
        Math.max(0, (stripeSub as any).current_period_end - now) / (30 * 24 * 60 * 60) - 1
      const refundAmount = Math.round((amount / 12) * monthsLeft * 0.5)
      const refundDueAt = newCancelAt

      await client.query(
        `UPDATE subscription_better
         SET cancel_at_period_end = true,
             refund_due_at = to_timestamp($2),
             refund_amount = $3,
             updated_at = NOW()
         WHERE user_id = $1`,
        [user_id, refundDueAt, refundAmount]
      )

      await sendMail({
        to: user_id,
        subject: "Subscription Cancellation",
        body: "Your subscription will be cancelled at the end of the next month. You have been charged for the final month. After that, you will be refunded 50% of the remaining months.",
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
             updated_at = NOW()
         WHERE user_id = $1`,
        [user_id]
      )

      await sendMail({
        to: user_id,
        subject: "Subscription Cancellation",
        body: "Your subscription will be cancelled at the end of the current period.",
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

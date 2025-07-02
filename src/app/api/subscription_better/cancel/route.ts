import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { sendMail } from "@/lib/mail"
import { cancellationEmail } from "@/components/templates/subscriptionEmails"

// Helper to get end of next full calendar month (in seconds)
function getEndOfNextMonth() {
  const now = new Date();
  const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const endOfNextMonth = new Date(firstOfNextMonth.getFullYear(), firstOfNextMonth.getMonth() + 1, 0, 23, 59, 59);
  return Math.floor(endOfNextMonth.getTime() / 1000);
}

export async function POST(req: NextRequest) {
  const { user_id, immediate, reason } = await req.json()

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
      // Store cancellation reason
      await client.query(
        `INSERT INTO subscription_cancellations (user_id, subscription_id, reason) VALUES ($1, $2, $3)`,
        [user_id, sub.stripe_subscription_id, reason || null]
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

    // Non-trialing: cancel at end of next full calendar month
    const now = Date.now() / 1000
    const cancelAt = getEndOfNextMonth();
    if (interval === "month") {
      // Monthly: cancel at end of next month, no refund
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        cancel_at: cancelAt,
      });
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
        [user_id, cancelAt]
      );
      // Store cancellation reason
      await client.query(
        `INSERT INTO subscription_cancellations (user_id, subscription_id, reason) VALUES ($1, $2, $3)`,
        [user_id, sub.stripe_subscription_id, reason || null]
      );
      await sendMail({
        to: userEmail,
        subject: "Subscription Cancellation",
        body: cancellationEmail({
          name: userEmail,
          planName: sub.plan_name || sub.plan_id || '',
          cancellationType: 'monthly',
          endDate: new Date(cancelAt * 1000).toLocaleDateString(),
        }),
      });
      return NextResponse.json({
        success: true,
        message: "Your subscription will be cancelled at the end of the next full calendar month. You have been charged for the final month as per our notice policy.",
      });
    }
    if (interval === "year") {
      // Annual: cancel at end of next month, refund 50% of unused time after that
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        cancel_at: cancelAt,
      });
      const annualPeriodEnd = (stripeSub as any).current_period_end;
      const amount = item.price?.unit_amount || 0;
      // Calculate months remaining after cancelAt
      const monthsRemaining = (annualPeriodEnd - cancelAt) / (30 * 24 * 60 * 60);
      const refundAmount = Math.round((amount / 12) * monthsRemaining * 0.5);
      await client.query(
        `UPDATE subscription_better
         SET cancel_at_period_end = true,
             cancel_at = to_timestamp($2),
             refund_due_at = to_timestamp($2),
             refund_amount = $3,
             pending_plan_change = NULL,
             pending_price_id = NULL,
             pending_plan_interval = NULL,
             pending_plan_name = NULL,
             pending_plan_change_effective = NULL,
             updated_at = NOW()
         WHERE user_id = $1`,
        [user_id, cancelAt, refundAmount]
      );
      // Store cancellation reason
      await client.query(
        `INSERT INTO subscription_cancellations (user_id, subscription_id, reason) VALUES ($1, $2, $3)`,
        [user_id, sub.stripe_subscription_id, reason || null]
      );
      await sendMail({
        to: userEmail,
        subject: "Subscription Cancellation",
        body: cancellationEmail({
          name: userEmail,
          planName: sub.plan_name || sub.plan_id || '',
          cancellationType: 'annual',
          endDate: new Date(cancelAt * 1000).toLocaleDateString(),
          refundInfo: { amount: refundAmount, date: new Date(cancelAt * 1000).toLocaleDateString() },
        }),
      });
      return NextResponse.json({
        success: true,
        message: "Your subscription will be cancelled at the end of the next full calendar month. After that, you will be refunded 50% of the remaining unused annual period.",
      });
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

export async function GET(req: NextRequest) {
  const client = await pool.connect()
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)
    const offset = (page - 1) * pageSize

    let whereClause = ''
    let values: any[] = []
    if (search) {
      whereClause = `WHERE user_id ILIKE $1 OR subscription_id ILIKE $1 OR reason ILIKE $1`
      values.push(`%${search}%`)
    }

    // Get total count
    const countResult = await client.query(
      `SELECT COUNT(*) FROM subscription_cancellations ${whereClause}`,
      values
    )
    const total = parseInt(countResult.rows[0].count, 10)

    // Get paginated results
    let query = `SELECT id, user_id, subscription_id, reason, cancelled_at FROM subscription_cancellations ${whereClause} ORDER BY cancelled_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
    values.push(pageSize, offset)
    const { rows } = await client.query(query, values)

    return NextResponse.json({
      cancellations: rows,
      total,
      page,
      pageSize
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch cancellations' }, { status: 500 })
  } finally {
    client.release()
  }
}

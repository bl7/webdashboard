import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { sendMail } from "@/lib/mail"
import { cancellationEmail } from "@/components/templates/subscriptionEmails"
import { verifyAuthToken } from "@/lib/auth"

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
    let userEmail = null
    if (sub.stripe_customer_id) {
      const customer = await stripe.customers.retrieve(sub.stripe_customer_id)
      if (!customer.deleted) {
        userEmail = (customer as any).email
      }
    }
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Could not find user email for notification." },
        { status: 500 }
      )
    }

    // Only allow immediate cancel if trialing
    if (sub.status === "trialing") {
      await stripe.subscriptions.cancel(sub.stripe_subscription_id)
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
      )
      // Store cancellation reason
      await client.query(
        `INSERT INTO subscription_cancellations (user_id, subscription_id, reason) VALUES ($1, $2, $3)`,
        [user_id, sub.stripe_subscription_id, reason || null]
      )
      // Email sending disabled for subscription cancellations
      // await sendMail({
      //   to: userEmail,
      //   subject: "Subscription Cancellation",
      //   body: cancellationEmail({
      //     name: userEmail,
      //     planName: sub.plan_name || sub.plan_id || "",
      //     cancellationType: "immediate",
      //     endDate: new Date().toLocaleDateString(),
      //   }),
      // })
      return NextResponse.json({
        success: true,
        message: "Your subscription has been cancelled immediately.",
      })
    }

    // Non-trialing: cancel at end of next full calendar month
    // Simplified cancellation: cancel at period end for all plans, no refunds
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

    // Store cancellation reason
    await client.query(
      `INSERT INTO subscription_cancellations (user_id, subscription_id, reason) VALUES ($1, $2, $3)`,
      [user_id, sub.stripe_subscription_id, reason || null]
    )

    // Email sending disabled for subscription cancellations
    // await sendMail({
    //   to: userEmail,
    //   subject: "Subscription Cancellation",
    //   body: cancellationEmail({
    //     name: userEmail,
    //     planName: sub.plan_name || sub.plan_id || "",
    //     cancellationType: "period_end",
    //     endDate: new Date((stripeSub as any).current_period_end * 1000).toLocaleDateString(),
    //   }),
    // })

    return NextResponse.json({
      success: true,
      message:
        "Your subscription will be cancelled at the end of the current billing period. No refunds will be provided.",
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  } finally {
    client.release()
  }
}

export async function GET(req: NextRequest) {
  const { role } = await verifyAuthToken(req)
  if (role !== "boss") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const client = await pool.connect()
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10)
    const offset = (page - 1) * pageSize

    let whereClause = ""
    let values: any[] = []
    if (search) {
      whereClause = `WHERE c.user_id ILIKE $1 OR c.subscription_id ILIKE $1 OR c.reason ILIKE $1 OR p.email ILIKE $1`
      values.push(`%${search}%`)
    }

    // Get total count
    const countResult = await client.query(
      `SELECT COUNT(*) FROM subscription_cancellations c LEFT JOIN user_profiles p ON c.user_id = p.user_id ${whereClause}`,
      values
    )
    const total = parseInt(countResult.rows[0].count, 10)

    // Get paginated results with user profile info
    let query = `SELECT c.id, c.user_id, c.subscription_id, c.reason, c.cancelled_at, p.email, p.company_name FROM subscription_cancellations c LEFT JOIN user_profiles p ON c.user_id = p.user_id ${whereClause} ORDER BY c.cancelled_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
    values.push(pageSize, offset)
    const { rows } = await client.query(query, values)

    return NextResponse.json({
      cancellations: rows,
      total,
      page,
      pageSize,
    })
  } catch (err: any) {
    console.error("Cancellations API error:", err)
    return NextResponse.json(
      { error: err.message || "Failed to fetch cancellations" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

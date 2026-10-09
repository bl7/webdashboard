import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { verifyAuthToken } from "@/lib/auth"
import {
  ensureCancellationStatusColumn,
  PENDING_CANCELLATION_SQL,
} from "@/lib/cancellationRequest"

async function recordProcessedCancellation(
  client: { query: (text: string, params?: unknown[]) => Promise<{ rowCount: number | null }> },
  userId: string,
  subscriptionId: string,
  reason?: string
) {
  await ensureCancellationStatusColumn(client)
  const updated = await client.query(
    `UPDATE subscription_cancellations
     SET status = 'processed',
         reason = COALESCE($3, reason)
     WHERE user_id = $1 AND subscription_id = $2 AND ${PENDING_CANCELLATION_SQL}`,
    [userId, subscriptionId, reason || null]
  )
  if ((updated.rowCount ?? 0) === 0) {
    await client.query(
      `INSERT INTO subscription_cancellations (user_id, subscription_id, reason, status)
       VALUES ($1, $2, $3, 'processed')`,
      [userId, subscriptionId, reason || null]
    )
  }
}

export async function POST(req: NextRequest) {
  const { role, userUuid } = await verifyAuthToken(req)
  const body = (await req.json()) as { user_id?: string; reason?: string; immediate?: boolean }
  let user_id: string | undefined = body?.user_id
  const reason: string | undefined = body?.reason
  const immediate = role === "boss" && body?.immediate === true

  // Authorization rules:
  // - boss: may cancel any user_id (must be provided)
  // - user: may cancel only their own; ignore/override provided user_id
  if (role === "user") {
    user_id = String(userUuid)
  } else if (role === "boss") {
    if (!user_id) {
      return NextResponse.json({ success: false, error: "Missing user_id" }, { status: 400 })
    }
  } else {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

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

    if (!stripeSub.items.data[0]) {
      return NextResponse.json(
        { success: false, error: "Invalid subscription: no items found." },
        { status: 500 }
      )
    }

    if (immediate) {
      const canceled = await stripe.subscriptions.cancel(sub.stripe_subscription_id)
      const canceledAt = canceled.canceled_at || Math.floor(Date.now() / 1000)
      await client.query(
        `UPDATE subscription_better
         SET status = 'canceled',
             cancel_at_period_end = false,
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
        [user_id, canceledAt]
      )
      await recordProcessedCancellation(client, user_id, sub.stripe_subscription_id, reason)
      return NextResponse.json({
        success: true,
        message: "Subscription cancelled immediately.",
      })
    }

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

    await recordProcessedCancellation(client, user_id, sub.stripe_subscription_id, reason)

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
    const dateFrom = searchParams.get("date_from")
    const dateTo = searchParams.get("date_to")
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10)
    const offset = (page - 1) * pageSize

    const conditions: string[] = []
    const values: (string | number)[] = []
    if (search) {
      conditions.push(
        `(c.user_id ILIKE $${values.length + 1} OR c.subscription_id ILIKE $${values.length + 1} OR c.reason ILIKE $${values.length + 1} OR p.email ILIKE $${values.length + 1})`
      )
      values.push(`%${search}%`)
    }
    if (dateFrom && dateTo) {
      conditions.push(
        `c.cancelled_at >= $${values.length + 1}::date AND c.cancelled_at < ($${values.length + 2}::date + interval '1 day')`
      )
      values.push(dateFrom, dateTo)
    }
    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get total count
    const countResult = await client.query(
      `SELECT COUNT(*) FROM subscription_cancellations c LEFT JOIN user_profiles p ON c.user_id = p.user_id ${whereClause}`,
      values
    )
    const total = parseInt(countResult.rows[0].count, 10)

    // Join subscription to distinguish pending requests vs processed cancellations
    await ensureCancellationStatusColumn(client)
    const query = `
      SELECT
        c.id,
        c.user_id,
        c.subscription_id,
        c.reason,
        c.cancelled_at AS requested_at,
        c.status AS request_status,
        p.email,
        p.company_name,
        s.status AS subscription_status,
        s.cancel_at_period_end,
        s.cancel_at,
        s.current_period_end
      FROM subscription_cancellations c
      LEFT JOIN user_profiles p ON c.user_id::text = p.user_id::text
      LEFT JOIN subscription_better s ON s.user_id::text = c.user_id::text
        AND (c.subscription_id IS NULL OR s.stripe_subscription_id = c.subscription_id)
      ${whereClause}
      ORDER BY c.cancelled_at DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `
    values.push(pageSize, offset)
    const { rows } = await client.query(query, values)

    const cancellations = rows.map((row: Record<string, unknown>) => {
      const subStatus = row.subscription_status as string | null
      const cancelAtPeriodEnd = Boolean(row.cancel_at_period_end)
      const cancelAt = row.cancel_at as string | null
      const periodEnd = row.current_period_end as string | null
      const requestedAt = row.requested_at as string
      const requestStatus = (row.request_status as string | null) || "pending"

      let cancellation_status: "pending" | "scheduled" | "canceled" | "withdrawn" = "pending"
      let status_label = "Action required"
      let effective_at: string | null = null

      if (requestStatus === "withdrawn") {
        cancellation_status = "withdrawn"
        status_label = "Withdrawn"
        effective_at = requestedAt
      } else if (subStatus === "canceled") {
        cancellation_status = "canceled"
        status_label = "Cancelled"
        effective_at = periodEnd || requestedAt
      } else if (cancelAtPeriodEnd || cancelAt) {
        cancellation_status = "scheduled"
        status_label = "Scheduled"
        effective_at = periodEnd || cancelAt
      } else if (requestStatus === "processed") {
        if (subStatus && subStatus !== "canceled" && !cancelAtPeriodEnd && !cancelAt) {
          cancellation_status = "withdrawn"
          status_label = "Reactivated"
          effective_at = requestedAt
        } else {
          cancellation_status = "canceled"
          status_label = "Processed"
          effective_at = periodEnd || requestedAt
        }
      }

      return {
        id: row.id,
        user_id: row.user_id,
        subscription_id: row.subscription_id,
        reason: row.reason,
        requested_at: requestedAt,
        cancelled_at: requestedAt,
        email: row.email,
        company_name: row.company_name,
        cancellation_status,
        status_label,
        effective_at,
      }
    })

    return NextResponse.json({
      cancellations,
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

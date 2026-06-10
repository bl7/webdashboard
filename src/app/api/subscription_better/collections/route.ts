import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { verifyAuthToken } from "@/lib/auth"

type Profile = {
  user_id?: string
  company_name?: string
  email?: string
  plan_name?: string
}

type CustomerAgg = {
  user_id: string | null
  company_name: string | null
  email: string | null
  plan_name: string | null
  stripe_customer_id: string | null
  subscription_cents: number
  label_orders_cents: number
  collected_cents: number
  refunded_cents: number
  net_cents: number
  invoice_count: number
  label_order_count: number
  refund_count: number
}

function aggKey(stripeCustomerId: string | null, userId: string | null, email: string | null) {
  return stripeCustomerId || userId || email || "unknown"
}

function getOrCreate(
  map: Map<string, CustomerAgg>,
  key: string,
  profile: Profile,
  stripeCustomerId: string | null
): CustomerAgg {
  let row = map.get(key)
  if (!row) {
    row = {
      user_id: profile.user_id ?? null,
      company_name: profile.company_name ?? null,
      email: profile.email ?? null,
      plan_name: profile.plan_name ?? null,
      stripe_customer_id: stripeCustomerId,
      subscription_cents: 0,
      label_orders_cents: 0,
      collected_cents: 0,
      refunded_cents: 0,
      net_cents: 0,
      invoice_count: 0,
      label_order_count: 0,
      refund_count: 0,
    }
    map.set(key, row)
  }
  return row
}

function finalizeRows(map: Map<string, CustomerAgg>, totalCollected: number) {
  const byCustomer = Array.from(map.values())
    .map((row) => ({
      ...row,
      net_cents: row.collected_cents - row.refunded_cents,
      percent_of_collected:
        totalCollected > 0 ? (row.collected_cents / totalCollected) * 100 : 0,
    }))
    .filter((row) => row.collected_cents > 0 || row.refunded_cents > 0)
    .sort((a, b) => b.net_cents - a.net_cents)
  return byCustomer
}

export async function GET(req: NextRequest) {
  const { role } = await verifyAuthToken(req)
  if (role !== "boss") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const dateFrom = searchParams.get("date_from")
  const dateTo = searchParams.get("date_to")

  if (!dateFrom || !dateTo) {
    return NextResponse.json({ error: "date_from and date_to are required" }, { status: 400 })
  }

  const fromTs = Math.floor(new Date(`${dateFrom}T00:00:00`).getTime() / 1000)
  const toTs = Math.floor(new Date(`${dateTo}T23:59:59`).getTime() / 1000)
  const client = await pool.connect()

  try {
    const profileResult = await client.query(`
      SELECT s.user_id::text AS user_id, s.stripe_customer_id, u.company_name, u.email, s.plan_name
      FROM subscription_better s
      LEFT JOIN user_profiles u ON u.user_id::text = s.user_id::text
      WHERE s.stripe_customer_id IS NOT NULL
    `)

    const byStripeCustomer: Record<string, Profile & { stripe_customer_id: string }> = {}
    const stripeCustomerIds: string[] = []

    profileResult.rows.forEach(
      (row: {
        user_id: string
        stripe_customer_id: string
        company_name?: string
        email?: string
        plan_name?: string
      }) => {
        stripeCustomerIds.push(row.stripe_customer_id)
        byStripeCustomer[row.stripe_customer_id] = row
      }
    )

    const agg = new Map<string, CustomerAgg>()
    let subscriptionCents = 0
    let invoiceCount = 0

    for (const customerId of stripeCustomerIds) {
      const profile = byStripeCustomer[customerId]
      try {
        let hasMore = true
        let startingAfter: string | undefined
        while (hasMore) {
          const page = await stripe.invoices.list({
            customer: customerId,
            limit: 100,
            ...(startingAfter ? { starting_after: startingAfter } : {}),
          })
          for (const inv of page.data) {
            if (inv.status !== "paid") continue
            const paidAt =
              inv.status_transitions?.paid_at ?? inv.created
            if (paidAt < fromTs || paidAt > toTs) continue

            const amount = inv.amount_paid ?? 0
            const key = aggKey(customerId, profile.user_id ?? null, profile.email ?? null)
            const row = getOrCreate(agg, key, profile, customerId)
            row.subscription_cents += amount
            row.collected_cents += amount
            row.invoice_count += 1
            subscriptionCents += amount
            invoiceCount += 1
          }
          hasMore = page.has_more
          if (page.data.length > 0) {
            startingAfter = page.data[page.data.length - 1].id
          } else {
            hasMore = false
          }
        }
      } catch (e: unknown) {
        const code = (e as { code?: string })?.code
        if (code !== "resource_missing") {
          console.error("Collections: failed invoices for", customerId, e)
        }
      }
    }

    const ordersResult = await client.query(
      `SELECT o.id, o.user_id::text AS user_id, o.amount_cents, o.paid_at,
              u.company_name, u.email, u.full_name, s.plan_name
       FROM label_orders o
       LEFT JOIN user_profiles u ON u.user_id::text = o.user_id::text
       LEFT JOIN subscription_better s ON s.user_id::text = o.user_id::text
       WHERE o.paid_at IS NOT NULL
         AND o.status IN ('paid', 'shipped')
         AND o.paid_at::date >= $1::date
         AND o.paid_at::date <= $2::date`,
      [dateFrom, dateTo]
    )

    let labelOrdersCents = 0
    let labelOrderCount = 0

    for (const order of ordersResult.rows) {
      const amount = Number(order.amount_cents || 0)
      const profile: Profile = {
        user_id: order.user_id,
        company_name: order.company_name || order.full_name,
        email: order.email,
        plan_name: order.plan_name,
      }
      const stripeId =
        Object.entries(byStripeCustomer).find(([, p]) => p.user_id === order.user_id)?.[0] ??
        null
      const key = aggKey(stripeId, order.user_id, order.email)
      const row = getOrCreate(agg, key, profile, stripeId)
      row.label_orders_cents += amount
      row.collected_cents += amount
      row.label_order_count += 1
      labelOrdersCents += amount
      labelOrderCount += 1
    }

    const collectedCents = subscriptionCents + labelOrdersCents
    const refunds: {
      id: string
      amount_cents: number
      created: number
      company_name: string | null
      email: string | null
      reason: string | null
      stripe_customer_id: string | null
    }[] = []

    let refundedCents = 0
    let refundCount = 0

    let refundHasMore = true
    let refundStartingAfter: string | undefined
    while (refundHasMore) {
      const page = await stripe.refunds.list({
        created: { gte: fromTs, lte: toTs },
        limit: 100,
        expand: ["data.charge"],
        ...(refundStartingAfter ? { starting_after: refundStartingAfter } : {}),
      })

      for (const refund of page.data) {
        const amount = refund.amount ?? 0
        refundedCents += amount
        refundCount += 1

        const charge = refund.charge
        const customerId =
          typeof charge === "object" && charge !== null && "customer" in charge
            ? typeof charge.customer === "string"
              ? charge.customer
              : null
            : null

        const profile = customerId ? byStripeCustomer[customerId] : undefined
        const key = aggKey(
          customerId,
          profile?.user_id ?? null,
          profile?.email ?? null
        )
        if (key !== "unknown") {
          const row = getOrCreate(agg, key, profile || {}, customerId)
          row.refunded_cents += amount
          row.refund_count += 1
        }

        refunds.push({
          id: refund.id,
          amount_cents: amount,
          created: refund.created,
          company_name: profile?.company_name ?? null,
          email: profile?.email ?? null,
          reason: refund.reason ?? null,
          stripe_customer_id: customerId,
        })
      }

      refundHasMore = page.has_more
      if (page.data.length > 0) {
        refundStartingAfter = page.data[page.data.length - 1].id
      } else {
        refundHasMore = false
      }
    }

    const byCustomer = finalizeRows(agg, collectedCents)
    const netCents = collectedCents - refundedCents

    refunds.sort((a, b) => b.created - a.created)

    return NextResponse.json({
      date_from: dateFrom,
      date_to: dateTo,
      collected_cents: collectedCents,
      subscription_cents: subscriptionCents,
      label_orders_cents: labelOrdersCents,
      refunded_cents: refundedCents,
      net_cents: netCents,
      invoice_count: invoiceCount,
      label_order_count: labelOrderCount,
      refund_count: refundCount,
      by_customer: byCustomer,
      refunds,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch collections"
    return NextResponse.json({ error: message }, { status: 500 })
  } finally {
    client.release()
  }
}

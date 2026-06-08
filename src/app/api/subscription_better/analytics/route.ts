import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import {
  buildPlanDistribution,
  buildRevenueByBillingCycle,
  buildRevenueByPlan,
  buildStatusDistribution,
  buildTrendSeries,
  calculateARR,
  calculateARPU,
  calculateCancelledThisMonth,
  calculateChurnRate,
  calculateCustomerGrowth,
  calculateMRR,
  calculateNewCustomersThisMonth,
  calculateRevenueGrowth,
  calculateTrialConversion,
} from "@/lib/bossAnalytics"
import type { CancellationRow, PrintsTrendPoint, SubscriptionRow } from "@/types/bossAnalytics"

async function getCustomerTotalPaidPounds(stripeCustomerId: string): Promise<number> {
  try {
    let totalCents = 0
    let startingAfter: string | undefined
    let hasMore = true

    while (hasMore) {
      const page = await stripe.invoices.list({
        customer: stripeCustomerId,
        limit: 100,
        status: "paid",
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      })
      totalCents += page.data.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0)
      hasMore = page.has_more
      if (page.data.length > 0) {
        startingAfter = page.data[page.data.length - 1].id
      } else {
        hasMore = false
      }
    }

    return totalCents / 100
  } catch (e) {
    console.error("Failed to fetch customer total paid:", e)
    return 0
  }
}

async function enrichWithTotalPaid(
  customers: SubscriptionRow[]
): Promise<SubscriptionRow[]> {
  const results: SubscriptionRow[] = []
  const batchSize = 10
  for (let i = 0; i < customers.length; i += batchSize) {
    const batch = customers.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(async (sub) => ({
        ...sub,
        totalPaid: sub.stripe_customer_id
          ? await getCustomerTotalPaidPounds(sub.stripe_customer_id)
          : 0,
      }))
    )
    results.push(...batchResults)
  }
  return results
}

async function fetchOperationalMetrics(client: Awaited<ReturnType<typeof pool.connect>>) {
  const today = new Date().toISOString().slice(0, 10)
  const monthStart = new Date()
  monthStart.setDate(1)
  const monthStartStr = monthStart.toISOString().slice(0, 10)
  const lastMonthStart = new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1)
  const lastMonthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth(), 0)
  const lastMonthStartStr = lastMonthStart.toISOString().slice(0, 10)
  const lastMonthEndStr = lastMonthEnd.toISOString().slice(0, 10)

  const todayRes = await client.query(
    `SELECT COALESCE(SUM((details->>'quantity')::int), 0) AS total
     FROM activity_logs
     WHERE action = 'print_label' AND timestamp::date = $1::date`,
    [today]
  )

  const monthRes = await client.query(
    `SELECT COALESCE(SUM((details->>'quantity')::int), 0) AS total
     FROM activity_logs
     WHERE action = 'print_label' AND timestamp::date >= $1::date`,
    [monthStartStr]
  )

  const lastMonthRes = await client.query(
    `SELECT COALESCE(SUM((details->>'quantity')::int), 0) AS total
     FROM activity_logs
     WHERE action = 'print_label' AND timestamp::date BETWEEN $1::date AND $2::date`,
    [lastMonthStartStr, lastMonthEndStr]
  )

  const trendRes = await client.query(
    `SELECT timestamp::date AS day,
            COALESCE(SUM((details->>'quantity')::int), 0) AS prints
     FROM activity_logs
     WHERE action = 'print_label' AND timestamp >= NOW() - INTERVAL '30 days'
     GROUP BY 1
     ORDER BY 1`
  )

  const topKitchenRes = await client.query(
    `SELECT up.company_name,
            COALESCE(SUM((al.details->>'quantity')::int), 0) AS total_prints
     FROM activity_logs al
     LEFT JOIN user_profiles up ON up.user_id::text = al.user_id::text
     WHERE al.action = 'print_label' AND al.timestamp::date >= $1::date
     GROUP BY up.company_name
     ORDER BY total_prints DESC NULLS LAST
     LIMIT 1`,
    [monthStartStr]
  )

  const activeCustomersRes = await client.query(
    `SELECT COUNT(DISTINCT user_id) AS count
     FROM activity_logs
     WHERE action = 'print_label' AND timestamp::date >= $1::date`,
    [monthStartStr]
  )

  const labelsPrintedThisMonth = Number(monthRes.rows[0]?.total || 0)
  const activePrintCustomers = Number(activeCustomersRes.rows[0]?.count || 0)

  const printsTrend: PrintsTrendPoint[] = trendRes.rows.map((row: { day: Date; prints: string }) => {
    const date = new Date(row.day)
    return {
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      prints: Number(row.prints || 0),
    }
  })

  return {
    labelsPrintedToday: Number(todayRes.rows[0]?.total || 0),
    labelsPrintedThisMonth,
    labelsPrintedLastMonth: Number(lastMonthRes.rows[0]?.total || 0),
    mostActiveKitchen: topKitchenRes.rows[0]?.company_name || null,
    mostActiveKitchenPrints: Number(topKitchenRes.rows[0]?.total_prints || 0),
    avgLabelsPerCustomer:
      activePrintCustomers > 0 ? labelsPrintedThisMonth / activePrintCustomers : 0,
    printsTrend,
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userUuid, role } = await verifyAuthToken(req)
    const { searchParams } = new URL(req.url)
    const dateFrom = searchParams.get("date_from")
    const dateTo = searchParams.get("date_to")
    let where = ""
    const values: string[] = []
    if (dateFrom && dateTo) {
      where = "WHERE s.created_at BETWEEN $1 AND $2"
      values.push(dateFrom, dateTo)
    }

    const client = await pool.connect()
    let rows: SubscriptionRow[] = []
    let cancellations: CancellationRow[] = []

    if (role === "boss") {
        const result = await client.query(
          `SELECT u.user_id, u.company_name, s.stripe_customer_id, s.plan_id, s.plan_name, s.status,
                  s.billing_interval, s.amount, s.current_period_end, s.trial_end,
                  s.pending_plan_change, s.pending_plan_change_effective,
                  s.created_at, s.updated_at, s.cancel_at
           FROM user_profiles u
           INNER JOIN subscription_better s ON u.user_id::text = s.user_id::text
           ${where}`,
          values
        )
        rows = result.rows

        const cancelRes = await client.query(
          `SELECT user_id, cancelled_at FROM subscription_cancellations ORDER BY cancelled_at ASC`
        )
        cancellations = cancelRes.rows
      } else if (role === "user") {
        const result = await client.query(
          `SELECT u.user_id, u.company_name, s.stripe_customer_id, s.plan_id, s.plan_name, s.status,
                  s.billing_interval, s.amount, s.current_period_end, s.trial_end,
                  s.pending_plan_change, s.pending_plan_change_effective,
                  s.created_at, s.updated_at, s.cancel_at
           FROM user_profiles u
           INNER JOIN subscription_better s ON u.user_id::text = s.user_id::text
           WHERE u.user_id = $1
           ${where ? "AND " + where.replace("WHERE ", "") : ""}`,
          [userUuid, ...values]
        )
        rows = result.rows
    } else {
      client.release()
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subs = rows
    const total = subs.length
    const active = subs.filter((s) => s.status === "active").length
    const trialing = subs.filter((s) => s.status === "trialing").length
    const monthlyActive = subs.filter(
      (s) => s.status === "active" && s.billing_interval === "month"
    ).length
    const annualActive = subs.filter(
      (s) => s.status === "active" && s.billing_interval === "year"
    ).length
    const canceled = subs.filter((s) => s.status === "canceled").length

    const mrr = calculateMRR(subs)
    const arr = calculateARR(subs)
    const arpu = calculateARPU(subs)
    const churnRate = calculateChurnRate(subs)
    const trialConversion = calculateTrialConversion(subs)
    const newCustomersThisMonth = calculateNewCustomersThisMonth(subs)
    const cancelledThisMonth = calculateCancelledThisMonth(subs, cancellations)

    const trendSeries = buildTrendSeries(subs, cancellations)
    const currentTrend = trendSeries[trendSeries.length - 1]
    const previousTrend = trendSeries[trendSeries.length - 2]
    const revenueGrowthPercent = calculateRevenueGrowth(
      currentTrend?.mrr ?? mrr,
      previousTrend?.mrr ?? 0
    )
    const customerGrowthPercent = calculateCustomerGrowth(
      currentTrend?.totalCustomers ?? total,
      previousTrend?.totalCustomers ?? 0
    )

    const planDistribution = buildPlanDistribution(subs)
    const statusDistribution = buildStatusDistribution(subs)
    const revenueByPlan = buildRevenueByPlan(subs)
    const revenueByBillingCycle = buildRevenueByBillingCycle(subs)

    const now = new Date()
    const recentSignups = subs
      .filter(
        (s) =>
          s.created_at &&
          now.getTime() - new Date(s.created_at).getTime() < 30 * 24 * 60 * 60 * 1000
      )
      .slice(0, 10)

    let topCustomers: SubscriptionRow[] = []
    if (role === "boss") {
      const withStripe = subs.filter((s) => s.stripe_customer_id)
      const enriched = await enrichWithTotalPaid(withStripe)
      topCustomers = enriched
        .sort((a, b) => (b.totalPaid ?? 0) - (a.totalPaid ?? 0))
        .slice(0, 10)
    } else {
      topCustomers = [...subs]
        .sort((a, b) => (b.amount || 0) - (a.amount || 0))
        .slice(0, 10)
    }

    const upcomingRenewals = subs
      .filter(
        (s) =>
          s.current_period_end &&
          new Date(s.current_period_end).getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000 &&
          new Date(s.current_period_end).getTime() - now.getTime() > 0
      )
      .slice(0, 10)

    const pendingChanges = subs.filter((s) => s.pending_plan_change)
    const failedPayments = subs.filter((s) => s.status === "past_due" || s.status === "unpaid")

    let operational = {
      labelsPrintedToday: 0,
      labelsPrintedThisMonth: 0,
      labelsPrintedLastMonth: 0,
      mostActiveKitchen: null as string | null,
      mostActiveKitchenPrints: 0,
      avgLabelsPerCustomer: 0,
      printsTrend: [] as PrintsTrendPoint[],
    }

    if (role === "boss") {
      try {
        operational = await fetchOperationalMetrics(client)
      } catch (e) {
        console.error("Operational metrics error:", e)
      }
    }

    client.release()

    return NextResponse.json({
      total,
      active,
      trialing,
      monthlyActive,
      annualActive,
      canceled,
      mrr,
      arr,
      arpu,
      churnRate,
      trialConversion,
      newCustomersThisMonth,
      cancelledThisMonth,
      revenueGrowthPercent,
      customerGrowthPercent,
      planDistribution,
      statusDistribution,
      revenueByPlan,
      revenueByBillingCycle,
      revenueTrend: trendSeries,
      customerGrowth: trendSeries,
      activeVsCancelled: trendSeries,
      subscriptionGrowth: trendSeries,
      recentSignups,
      topCustomers,
      upcomingRenewals,
      pendingChanges,
      failedPayments,
      operational,
    })
  } catch (e) {
    console.error("Error fetching analytics:", e)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

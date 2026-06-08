import type {
  CancellationRow,
  ChartPoint,
  RevenueByBillingCycle,
  RevenueByPlan,
  SubscriptionRow,
  TrendPoint,
} from "@/types/bossAnalytics"

const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due", "unpaid"])

export function safeDivide(numerator: number, denominator: number, fallback = 0): number {
  if (!denominator || !Number.isFinite(denominator)) return fallback
  const result = numerator / denominator
  return Number.isFinite(result) ? result : fallback
}

export function subscriptionToMrr(amount?: number, billingInterval?: string): number {
  const pounds = (amount || 0) / 100
  if (billingInterval === "year") return pounds / 12
  return pounds
}

export function subscriptionToArr(amount?: number, billingInterval?: string): number {
  const pounds = (amount || 0) / 100
  if (billingInterval === "year") return pounds
  return pounds * 12
}

export function calculateMRR(subs: SubscriptionRow[]): number {
  return subs
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + subscriptionToMrr(s.amount, s.billing_interval), 0)
}

export function calculateARR(subs: SubscriptionRow[]): number {
  return subs
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + subscriptionToArr(s.amount, s.billing_interval), 0)
}

export function calculateARPU(subs: SubscriptionRow[]): number {
  const active = subs.filter((s) => s.status === "active").length
  return safeDivide(calculateMRR(subs), active)
}

export function calculateChurnRate(subs: SubscriptionRow[]): number {
  const canceled = subs.filter((s) => s.status === "canceled").length
  return safeDivide(canceled, subs.length)
}

export function calculateTrialConversion(subs: SubscriptionRow[]): number {
  const trialing = subs.filter((s) => s.status === "trialing").length
  const converted = subs.filter((s) => s.status === "active" || s.status === "canceled").length
  const pool = trialing + converted
  return safeDivide(converted, pool)
}

export function isSameMonth(date: Date, reference = new Date()): boolean {
  return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth()
}

export function calculateNewCustomersThisMonth(
  subs: SubscriptionRow[],
  reference = new Date()
): number {
  return subs.filter((s) => s.created_at && isSameMonth(new Date(s.created_at), reference)).length
}

export function calculateCancelledThisMonth(
  subs: SubscriptionRow[],
  cancellations: CancellationRow[],
  reference = new Date()
): number {
  const fromCancellations = cancellations.filter(
    (c) => c.cancelled_at && isSameMonth(new Date(c.cancelled_at), reference)
  ).length

  const fromSubs = subs.filter((s) => {
    if (s.status !== "canceled") return false
    const date = s.cancel_at || s.updated_at
    return date ? isSameMonth(new Date(date), reference) : false
  }).length

  return Math.max(fromCancellations, fromSubs)
}

export function calculateRevenueGrowth(currentMrr: number, previousMrr: number): number {
  if (previousMrr === 0) return currentMrr > 0 ? 100 : 0
  return ((currentMrr - previousMrr) / previousMrr) * 100
}

export function calculateCustomerGrowth(
  currentTotal: number,
  previousTotal: number
): number {
  if (previousTotal === 0) return currentTotal > 0 ? 100 : 0
  return ((currentTotal - previousTotal) / previousTotal) * 100
}

export function formatCurrencyGBP(amount?: number | null): string {
  const value = amount ?? 0
  if (!Number.isFinite(value)) return "£0.00"
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value?: number | null, decimals = 1): string {
  const pct = (value ?? 0) * (Math.abs(value ?? 0) <= 1 ? 100 : 1)
  if (!Number.isFinite(pct)) return "0%"
  return `${pct.toFixed(decimals)}%`
}

export function formatGrowthPercent(value?: number | null, decimals = 1): string {
  const pct = value ?? 0
  if (!Number.isFinite(pct)) return "0%"
  const sign = pct > 0 ? "+" : ""
  return `${sign}${pct.toFixed(decimals)}%`
}

function getLast12MonthStarts(reference = new Date()): Date[] {
  const months: Date[] = []
  for (let i = 11; i >= 0; i--) {
    months.push(new Date(reference.getFullYear(), reference.getMonth() - i, 1))
  }
  return months
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" })
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

function parseDate(value?: string | null): Date | null {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function subscriptionContributesMrrAt(sub: SubscriptionRow, at: Date): number {
  const created = parseDate(sub.created_at)
  if (!created || created > at) return 0

  const cancelDate =
    parseDate(sub.cancel_at) ||
    (sub.status === "canceled" ? parseDate(sub.updated_at) : null)

  if (cancelDate && cancelDate <= at) return 0
  if (sub.status === "trialing" && (!sub.trial_end || new Date(sub.trial_end) > at)) return 0
  if (!ACTIVE_STATUSES.has(sub.status) && sub.status !== "canceled") return 0

  return subscriptionToMrr(sub.amount, sub.billing_interval)
}

export function buildTrendSeries(
  subs: SubscriptionRow[],
  cancellations: CancellationRow[],
  reference = new Date()
): TrendPoint[] {
  const months = getLast12MonthStarts(reference)

  return months.map((monthStart) => {
    const monthEnd = endOfMonth(monthStart)
    const key = monthKey(monthStart)

    const newCustomers = subs.filter((s) => {
      const created = parseDate(s.created_at)
      return created && isSameMonth(created, monthStart)
    }).length

    const cancelled = cancellations.filter((c) => {
      const d = parseDate(c.cancelled_at)
      return d && isSameMonth(d, monthStart)
    }).length

    const activeAtEnd = subs.filter((s) => subscriptionContributesMrrAt(s, monthEnd) > 0).length
    const mrr = subs.reduce((sum, s) => sum + subscriptionContributesMrrAt(s, monthEnd), 0)
    const totalCustomers = subs.filter((s) => {
      const created = parseDate(s.created_at)
      return created && created <= monthEnd
    }).length

    return {
      month: key,
      label: monthLabel(monthStart),
      mrr,
      revenue: mrr,
      newCustomers,
      cancelled,
      active: activeAtEnd,
      totalCustomers,
    }
  })
}

export function buildPlanDistribution(subs: SubscriptionRow[]): ChartPoint[] {
  const map: Record<string, number> = {}
  subs.forEach((s) => {
    const name = s.plan_name || "Unknown"
    map[name] = (map[name] || 0) + 1
  })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

export function buildStatusDistribution(subs: SubscriptionRow[]): ChartPoint[] {
  const map: Record<string, number> = {}
  subs.forEach((s) => {
    const name = s.status || "unknown"
    map[name] = (map[name] || 0) + 1
  })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

export function buildRevenueByPlan(subs: SubscriptionRow[]): RevenueByPlan[] {
  const map: Record<string, { revenue: number; count: number }> = {}
  subs
    .filter((s) => s.status === "active")
    .forEach((s) => {
      const name = s.plan_name || "Unknown"
      if (!map[name]) map[name] = { revenue: 0, count: 0 }
      map[name].revenue += subscriptionToMrr(s.amount, s.billing_interval)
      map[name].count += 1
    })
  return Object.entries(map)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
}

export function buildRevenueByBillingCycle(subs: SubscriptionRow[]): RevenueByBillingCycle[] {
  const cycles = [
    { key: "month", name: "Monthly" },
    { key: "year", name: "Annual" },
  ]
  return cycles.map(({ key, name }) => {
    const matching = subs.filter((s) => s.status === "active" && s.billing_interval === key)
    return {
      name,
      revenue: matching.reduce((sum, s) => sum + subscriptionToMrr(s.amount, s.billing_interval), 0),
      count: matching.length,
    }
  })
}

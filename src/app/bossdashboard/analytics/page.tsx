"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Printer,
  TrendingUp,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDarkMode } from "../context/DarkModeContext"
import { KpiCard } from "./components/KpiCard"
import { ChartCard } from "./components/ChartCard"
import { AnalyticsSkeleton } from "./components/AnalyticsSkeleton"
import {
  formatCurrencyGBP,
  formatGrowthPercent,
  formatPercent,
} from "@/lib/bossAnalytics"
import type { BossAnalyticsData, KpiTrend } from "@/types/bossAnalytics"

const COLORS = ["#a259ff", "#f7b801", "#00c49a", "#ff6b6b", "#8884d8", "#82ca9d"]
function SectionHeader({
  id,
  title,
  linkHref,
  linkLabel,
}: {
  id?: string
  title: string
  linkHref?: string
  linkLabel?: string
}) {
  return (
    <div id={id} className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">{title}</h2>
      {linkHref && linkLabel && (
        <Link href={linkHref} className="text-xs text-primary hover:underline">
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#1f2937",
  border: "1px solid #374151",
  borderRadius: "8px",
  color: "#f9fafb",
}

function growthTrend(value: number, suffix: string): KpiTrend {
  if (value > 0) return { direction: "up", label: `+${value.toFixed(1)}% ${suffix}` }
  if (value < 0) return { direction: "down", label: `${value.toFixed(1)}% ${suffix}` }
  return { direction: "neutral", label: `No change ${suffix}` }
}

function countTrend(count: number, label: string): KpiTrend | undefined {
  if (!count) return undefined
  return {
    direction: count > 0 ? "up" : "neutral",
    label: count > 0 ? `+${count} ${label}` : label,
  }
}

export default function AnalyticsDashboard() {
  const { isDarkMode } = useDarkMode()
  const [data, setData] = useState<BossAnalyticsData | null>(null)
  const [devices, setDevices] = useState<{ status: string; shipped_at?: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const bossToken =
      typeof window !== "undefined" ? localStorage.getItem("bossToken") : null
    const headers: HeadersInit = bossToken
      ? { Authorization: `Bearer ${bossToken}` }
      : {}

    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        const [analyticsRes, devicesRes] = await Promise.all([
          fetch("/api/subscription_better/analytics", { headers }),
          fetch("/api/devices", { headers }),
        ])

        if (!analyticsRes.ok) throw new Error("Failed to fetch analytics")
        const analytics = await analyticsRes.json()
        setData(analytics)

        if (devicesRes.ok) {
          const devicesJson = await devicesRes.json()
          setDevices(devicesJson.devices || [])
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const deviceStatusData = useMemo(() => {
    const map: Record<string, number> = {}
    devices.forEach((d) => {
      const status = d.status || "unknown"
      map[status] = (map[status] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [devices])

  const deviceShipments = useMemo(() => {
    const shipments: Record<string, number> = {}
    devices
      .filter((d) => d.shipped_at)
      .forEach((d) => {
        const date = new Date(d.shipped_at!).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        })
        shipments[date] = (shipments[date] || 0) + 1
      })
    return Object.entries(shipments).map(([name, value]) => ({ name, value }))
  }, [devices])

  if (loading) return <AnalyticsSkeleton isDarkMode={isDarkMode} />
  if (error)
    return (
      <div className="p-8 text-center text-red-400">
        <p>{error}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Check your connection and try refreshing the page.
        </p>
      </div>
    )
  if (!data)
    return (
      <div className="p-8 text-center text-muted-foreground">
        No analytics data available yet.
      </div>
    )

  const op = data.operational || {
    labelsPrintedToday: 0,
    labelsPrintedThisMonth: 0,
    labelsPrintedLastMonth: 0,
    mostActiveKitchen: null,
    mostActiveKitchenPrints: 0,
    avgLabelsPerCustomer: 0,
    activeKitchensLast30Days: 0,
    activeKitchensUsagePercent: 0,
    printsTrend: [],
  }

  const kitchensSubtitle =
    op.activeKitchensLast30Days > 0
      ? `${op.activeKitchensLast30Days} kitchen${op.activeKitchensLast30Days === 1 ? "" : "s"} printed in the last 30 days`
      : "No print activity in the last 30 days"

  const kitchensPercentSubtitle =
    data.active > 0 && op.activeKitchensLast30Days > 0
      ? `${op.activeKitchensUsagePercent.toFixed(0)}% of active customers used printing`
      : undefined

  const printsMonthChange =
    op.labelsPrintedLastMonth > 0
      ? ((op.labelsPrintedThisMonth - op.labelsPrintedLastMonth) /
          op.labelsPrintedLastMonth) *
        100
      : op.labelsPrintedThisMonth > 0
        ? 100
        : 0

  const axisColor = isDarkMode ? "#9ca3af" : "#6b7280"
  const gridColor = isDarkMode ? "#374151" : "#e5e7eb"

  return (
    <div className="space-y-8 p-6 md:p-10">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>

      {/* Executive KPIs */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
          Executive KPIs
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <KpiCard
            isDarkMode={isDarkMode}
            title="MRR"
            value={formatCurrencyGBP(data.mrr)}
            subtitle={`${formatCurrencyGBP(data.arr)} ARR`}
            tooltip="Monthly Recurring Revenue from all active subscriptions, normalised to a monthly value."
            trend={growthTrend(data.revenueGrowthPercent, "vs last month")}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <KpiCard
            isDarkMode={isDarkMode}
            title="ARR"
            value={formatCurrencyGBP(data.arr)}
            subtitle="Based on active subscriptions"
            tooltip="Annual Recurring Revenue — projected yearly revenue from current active subscriptions."
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <KpiCard
            isDarkMode={isDarkMode}
            title="Active Customers"
            value={String(data.active)}
            subtitle={`${data.total} total accounts`}
            trend={growthTrend(data.customerGrowthPercent, "vs last month")}
            icon={<Users className="h-5 w-5" />}
          />
          <KpiCard
            isDarkMode={isDarkMode}
            title="Trialing"
            value={String(data.trialing)}
            subtitle="Currently in free trial"
            icon={<Activity className="h-5 w-5" />}
          />
          <KpiCard
            isDarkMode={isDarkMode}
            title="Cancelled"
            value={String(data.canceled)}
            subtitle={`${data.cancelledThisMonth} this month`}
            trend={
              data.cancelledThisMonth > 0
                ? { direction: "down", label: `${data.cancelledThisMonth} cancelled this month` }
                : undefined
            }
            invertTrend
            icon={<UserMinus className="h-5 w-5" />}
          />
          <KpiCard
            isDarkMode={isDarkMode}
            title="Churn Rate"
            value={formatPercent(data.churnRate)}
            subtitle={`${data.canceled} cancelled total`}
            tooltip="Percentage of all accounts that have cancelled."
            invertTrend
            icon={<ArrowDownRight className="h-5 w-5" />}
          />
          <KpiCard
            isDarkMode={isDarkMode}
            title="ARPU"
            value={formatCurrencyGBP(data.arpu)}
            subtitle="Avg. revenue per active user"
            tooltip="Average Revenue Per User — MRR divided by active customers."
            icon={<DollarSign className="h-5 w-5" />}
          />
          <KpiCard
            isDarkMode={isDarkMode}
            title="New This Month"
            value={String(data.newCustomersThisMonth)}
            subtitle="Customer acquisitions"
            trend={countTrend(data.newCustomersThisMonth, "this month")}
            icon={<UserPlus className="h-5 w-5" />}
          />
          <KpiCard
            isDarkMode={isDarkMode}
            title="Cancelled This Month"
            value={String(data.cancelledThisMonth)}
            subtitle="Lost customers"
            invertTrend
            icon={<UserMinus className="h-5 w-5" />}
          />
          <KpiCard
            isDarkMode={isDarkMode}
            title="Trial Conversion"
            value={formatPercent(data.trialConversion)}
            subtitle={`${data.trialing} still trialing`}
            tooltip="Share of trial + paid accounts that converted to paid or have since cancelled."
            icon={<ArrowUpRight className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Operational metrics */}
      <section className="space-y-3">
        <SectionHeader
          id="platform-usage"
          title="Platform Usage"
          linkHref="/bossdashboard/reports?tab=label_orders"
          linkLabel="Export label orders"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <KpiCard
            isDarkMode={isDarkMode}
            title="Labels This Month"
            value={op.labelsPrintedThisMonth.toLocaleString()}
            subtitle="Across all kitchens"
            trend={growthTrend(printsMonthChange, "vs last month")}
            icon={<Printer className="h-5 w-5" />}
          />
          <KpiCard
            isDarkMode={isDarkMode}
            title="Labels Today"
            value={op.labelsPrintedToday.toLocaleString()}
            subtitle="Printed today"
            icon={<Printer className="h-5 w-5" />}
          />
          <KpiCard
            isDarkMode={isDarkMode}
            title="Most Active Kitchen"
            value={op.mostActiveKitchen || "—"}
            subtitle={
              op.mostActiveKitchen
                ? `${op.mostActiveKitchenPrints.toLocaleString()} labels this month`
                : "No print activity yet"
            }
            icon={<Users className="h-5 w-5" />}
          />
          <KpiCard
            isDarkMode={isDarkMode}
            title="Avg Labels / Kitchen"
            value={Math.round(op.avgLabelsPerCustomer).toLocaleString()}
            subtitle="Labels per active kitchen this month"
            icon={<Activity className="h-5 w-5" />}
          />
          <KpiCard
            isDarkMode={isDarkMode}
            title="Active Kitchens (30d)"
            value={String(op.activeKitchensLast30Days)}
            subtitle={kitchensPercentSubtitle || kitchensSubtitle}
            tooltip="Distinct customers with at least one print_label activity in the last 30 days."
            icon={<Users className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Revenue analytics */}
      <section className="space-y-3">
        <SectionHeader
          id="revenue-analytics"
          title="Revenue Analytics"
          linkHref="/bossdashboard/reports?tab=revenue"
          linkLabel="Export revenue report"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            isDarkMode={isDarkMode}
            title="Revenue Trend"
            description={`${formatGrowthPercent(data.revenueGrowthPercent)} growth vs last month`}
            isEmpty={!data.revenueTrend?.length}
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.revenueTrend}>
                <defs>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a259ff" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#a259ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="label" stroke={axisColor} fontSize={12} />
                <YAxis
                  stroke={axisColor}
                  fontSize={12}
                  tickFormatter={(v) => `£${v}`}
                />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(value) => [formatCurrencyGBP(Number(value ?? 0)), "MRR"]}
                />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  stroke="#a259ff"
                  fill="url(#mrrGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            isDarkMode={isDarkMode}
            title="MRR Trend"
            description="Monthly recurring revenue over the last 12 months"
            isEmpty={!data.revenueTrend?.length}
          >
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="label" stroke={axisColor} fontSize={12} />
                <YAxis
                  stroke={axisColor}
                  fontSize={12}
                  tickFormatter={(v) => `£${v}`}
                />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(value) => [formatCurrencyGBP(Number(value ?? 0)), "MRR"]}
                />
                <Line
                  type="monotone"
                  dataKey="mrr"
                  stroke="#a259ff"
                  strokeWidth={2}
                  dot={{ fill: "#a259ff", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            isDarkMode={isDarkMode}
            title="Revenue by Plan"
            description="MRR contribution by subscription plan"
            isEmpty={!data.revenueByPlan?.length}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.revenueByPlan} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  type="number"
                  stroke={axisColor}
                  fontSize={12}
                  tickFormatter={(v) => `£${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke={axisColor}
                  fontSize={12}
                  width={100}
                />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(value, _n, item) => [
                    formatCurrencyGBP(Number(value ?? 0)),
                    `${(item?.payload as { count?: number })?.count ?? 0} customers`,
                  ]}
                />
                <Bar dataKey="revenue" fill="#a259ff" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            isDarkMode={isDarkMode}
            title="Revenue by Billing Cycle"
            description="MRR split between monthly and annual billing"
            isEmpty={
              !data.revenueByBillingCycle?.some((c) => c.revenue > 0 || c.count > 0)
            }
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.revenueByBillingCycle}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} tickFormatter={(v) => `£${v}`} />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(value, _n, item) => [
                    formatCurrencyGBP(Number(value ?? 0)),
                    `${(item?.payload as { count?: number })?.count ?? 0} customers`,
                  ]}
                />
                <Legend />
                <Bar dataKey="revenue" name="MRR" fill="#a259ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      {/* Customer analytics */}
      <section className="space-y-3">
        <SectionHeader title="Customer Analytics" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            isDarkMode={isDarkMode}
            title="Customer Growth"
            description={`${formatGrowthPercent(data.customerGrowthPercent)} vs last month`}
            isEmpty={!data.customerGrowth?.length}
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="label" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Area
                  type="monotone"
                  dataKey="totalCustomers"
                  name="Total Customers"
                  stroke="#00c49a"
                  fill="#00c49a33"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            isDarkMode={isDarkMode}
            title="Customer Acquisition"
            description="New signups per month"
            isEmpty={!data.customerGrowth?.some((p) => p.newCustomers > 0)}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="label" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar
                  dataKey="newCustomers"
                  name="New Customers"
                  fill="#a259ff"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            isDarkMode={isDarkMode}
            title="Active vs Cancelled Trend"
            description="Monthly active paying customers vs cancellations"
            isEmpty={!data.activeVsCancelled?.length}
          >
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.activeVsCancelled}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="label" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="active"
                  name="Active"
                  stroke="#00c49a"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  name="Cancelled"
                  stroke="#ff6b6b"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            isDarkMode={isDarkMode}
            title="Subscription Growth"
            description="Net customer additions over time"
            isEmpty={!data.subscriptionGrowth?.length}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={data.subscriptionGrowth.map((p) => ({
                  ...p,
                  net: p.newCustomers - p.cancelled,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="label" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="net" name="Net Growth" radius={[6, 6, 0, 0]}>
                  {data.subscriptionGrowth.map((p, i) => (
                    <Cell
                      key={i}
                      fill={p.newCustomers - p.cancelled >= 0 ? "#00c49a" : "#ff6b6b"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      {/* Distribution & usage charts */}
      <section className="space-y-3">
        <SectionHeader
          title="Distribution & Usage"
          linkHref="/bossdashboard/devices"
          linkLabel="Device management"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            isDarkMode={isDarkMode}
            title="Plan Distribution"
            isEmpty={!data.planDistribution?.length}
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.planDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {data.planDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            isDarkMode={isDarkMode}
            title="Status Distribution"
            isEmpty={!data.statusDistribution?.length}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="value" fill="#a259ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            isDarkMode={isDarkMode}
            title="Labels Printed Over Time"
            description="Last 30 days of platform print activity"
            isEmpty={!op.printsTrend?.length}
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={op.printsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="label" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Area
                  type="monotone"
                  dataKey="prints"
                  name="Labels"
                  stroke="#f7b801"
                  fill="#f7b80133"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            isDarkMode={isDarkMode}
            title="Device Activity"
            isEmpty={!deviceStatusData.length}
            emptyMessage="No devices registered yet."
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={deviceStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {deviceStatusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Top Customers</CardTitle>
            <p className="text-xs text-muted-foreground">
              Ranked by total Stripe payments — click a customer to investigate
            </p>
          </div>
          <Link href="/bossdashboard/users" className="text-xs text-primary hover:underline">
            All users →
          </Link>
        </CardHeader>
        <CardContent>
          {data.topCustomers?.length ? (
            <ul className="space-y-2">
              {data.topCustomers.map((user, i) => {
                const q = encodeURIComponent(user.company_name || "")
                return (
                  <li key={user.user_id || i} className="border-b border-gray-700/50 pb-2 last:border-0">
                    <Link
                      href={q ? `/bossdashboard/users?q=${q}` : "/bossdashboard/users"}
                      className="flex items-center justify-between rounded-md p-1 transition-colors hover:bg-gray-700/30"
                    >
                      <span className="font-medium">{user.company_name || "Unknown"}</span>
                      <div className="text-right text-xs text-muted-foreground">
                        <div>
                          {formatCurrencyGBP((user.amount || 0) / 100)}
                          {user.billing_interval === "year" ? "/yr" : "/mo"}
                        </div>
                        <div>{formatCurrencyGBP(user.totalPaid ?? 0)} total paid</div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No customer data yet.</p>
          )}
        </CardContent>
      </Card>

      {deviceShipments.length > 0 && (
        <ChartCard
          isDarkMode={isDarkMode}
          title="Device Shipments Over Time"
          isEmpty={!deviceShipments.length}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deviceShipments}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Bar dataKey="value" name="Shipments" fill="#00c49a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  )
}

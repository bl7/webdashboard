"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  AlertTriangle,
  Calendar,
  DollarSign,
  Truck,
  FileText,
  CalendarClock,
  ArrowRight,
  Printer,
} from "lucide-react"
import { useDarkMode } from "./context/DarkModeContext"
import { formatCurrencyGBP } from "@/lib/bossAnalytics"

interface SubscriptionRow {
  company_name?: string
  email?: string
  plan_name?: string
  created_at?: string
  current_period_end?: string
  pending_plan_change?: string
  pending_plan_change_effective?: string
  amount?: number
  billing_interval?: string
  status?: string
}

interface ActionData {
  total: number
  active: number
  mrr: number
  recentSignups: SubscriptionRow[]
  upcomingRenewals: SubscriptionRow[]
  pendingChanges: SubscriptionRow[]
  failedPayments: SubscriptionRow[]
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

function ActionList({
  title,
  icon,
  href,
  hrefLabel,
  isDarkMode,
  empty,
  children,
}: {
  title: string
  icon: React.ReactNode
  href: string
  hrefLabel: string
  isDarkMode?: boolean
  empty: string
  children: React.ReactNode
}) {
  return (
    <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
        <Link href={href} className="flex items-center gap-1 text-xs text-primary hover:underline">
          {hrefLabel} <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {children || <p className="text-sm text-muted-foreground">{empty}</p>}
      </CardContent>
    </Card>
  )
}

export default function BossDashboard() {
  const { isDarkMode } = useDarkMode()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionData, setActionData] = useState<ActionData | null>(null)
  const [printsToday, setPrintsToday] = useState(0)
  const [printsWeek, setPrintsWeek] = useState(0)
  const [pendingDevices, setPendingDevices] = useState<{ id: string; customer_name?: string; status: string }[]>([])
  const [returnRequiredDevices, setReturnRequiredDevices] = useState<{ id: string; customer_name?: string; customer_email?: string }[]>([])
  const [recentLabelOrders, setRecentLabelOrders] = useState<
    { id: string; email?: string; full_name?: string; bundle_count?: number; status?: string; amount_cents?: number; label_product_name?: string }[]
  >([])
  const [pendingDemos, setPendingDemos] = useState<{ id: string; name?: string; company?: string; created_at?: string }[]>([])
  const [recentCancellations, setRecentCancellations] = useState<
    { id: string; company_name?: string; email?: string; user_id?: string; cancelled_at?: string }[]
  >([])

  useEffect(() => {
    const bossToken = typeof window !== "undefined" ? localStorage.getItem("bossToken") : null
    const headers: HeadersInit = bossToken ? { Authorization: `Bearer ${bossToken}` } : {}

    const today = new Date().toISOString().slice(0, 10)
    const now = new Date()
    const day = now.getDay() || 7
    const monday = new Date(now)
    monday.setDate(now.getDate() - (day - 1))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    const weekFrom = monday.toISOString().slice(0, 10)
    const weekTo = sunday.toISOString().slice(0, 10)

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [analyticsRes, devicesRes, ordersRes, demosRes, cancelRes, printsTodayRes, printsWeekRes] =
          await Promise.all([
            fetch("/api/subscription_better/analytics", { headers }),
            fetch("/api/devices", { headers }),
            fetch("/api/label-orders/all", { headers }),
            fetch("/api/bookdemo", { headers }),
            fetch("/api/subscription_better/cancel?page=1&pageSize=5", { headers }),
            fetch(`/api/logs/summary?date=${today}`, { headers }),
            fetch(`/api/logs/summary?date_from=${weekFrom}&date_to=${weekTo}`, { headers }),
          ])

        if (!analyticsRes.ok) throw new Error("Failed to fetch dashboard data")
        setActionData(await analyticsRes.json())

        if (devicesRes.ok) {
          const devices = (await devicesRes.json()).devices || []
          setPendingDevices(devices.filter((d: { status: string }) => d.status === "pending"))
          setReturnRequiredDevices(
            devices.filter((d: { status: string }) => d.status === "return_requested")
          )
        }

        if (ordersRes.ok) {
          const orders = (await ordersRes.json()).orders || []
          setRecentLabelOrders(
            orders
              .slice()
              .sort(
                (a: { created_at: string }, b: { created_at: string }) =>
                  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )
              .slice(0, 5)
          )
        }

        if (demosRes.ok) {
          const demos = await demosRes.json()
          setPendingDemos(
            (Array.isArray(demos) ? demos : []).filter((d: { attended?: boolean }) => !d.attended).slice(0, 5)
          )
        }

        if (cancelRes.ok) {
          setRecentCancellations((await cancelRes.json()).cancellations || [])
        }

        if (printsTodayRes.ok) {
          setPrintsToday(Number((await printsTodayRes.json()).totalPrints || 0))
        }
        if (printsWeekRes.ok) {
          setPrintsWeek(Number((await printsWeekRes.json()).totalPrints || 0))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatOrderAmount = (cents?: number) =>
    cents != null ? formatCurrencyGBP(cents / 100) : "—"

  const formatSubAmount = (row: SubscriptionRow) => {
    if (!row.amount) return ""
    const amt = formatCurrencyGBP(row.amount / 100)
    return row.billing_interval === "year" ? `${amt}/yr` : `${amt}/mo`
  }

  const cardClass = isDarkMode ? "border-gray-700 bg-gray-800" : ""
  const needsAttentionCount =
    (actionData?.failedPayments?.length ?? 0) +
    pendingDevices.length +
    recentCancellations.length +
    pendingDemos.length +
    returnRequiredDevices.length

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} variant="purple">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 md:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Action Centre</h1>
          <p className="text-sm text-muted-foreground">What needs your attention today</p>
        </div>
        <Link href="/bossdashboard/analytics">
          <Button variant="outline" size="sm">
            Full analytics <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Snapshot */}
      <section>
        <SectionHeading title="Today's snapshot" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className={cardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{actionData?.total ?? 0}</div>
              <p className="text-xs text-muted-foreground">{actionData?.active ?? 0} active</p>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">MRR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrencyGBP(actionData?.mrr ?? 0)}</div>
              <Link href="/bossdashboard/analytics" className="text-xs text-primary hover:underline">
                Revenue analytics →
              </Link>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Prints Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{printsToday.toLocaleString()}</div>
              <Link
                href="/bossdashboard/analytics#platform-usage"
                className="text-xs text-primary hover:underline"
              >
                Usage trends →
              </Link>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Prints This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{printsWeek.toLocaleString()}</div>
              <Link
                href="/bossdashboard/analytics#platform-usage"
                className="text-xs text-primary hover:underline"
              >
                Usage trends →
              </Link>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingDevices.length}</div>
              <Link href="/bossdashboard/devices" className="text-xs text-primary hover:underline">
                Device management →
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Needs Attention */}
      <section>
        <SectionHeading
          title="Needs attention"
          subtitle={
            needsAttentionCount > 0
              ? `${needsAttentionCount} item(s) may need action`
              : "Nothing urgent right now"
          }
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ActionList
            title="Failed Payments"
            icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
            href="/bossdashboard/users"
            hrefLabel="All users"
            isDarkMode={isDarkMode}
            empty="No failed payments."
          >
            {actionData?.failedPayments?.length ? (
              <ul className="space-y-2">
                {actionData.failedPayments.slice(0, 5).map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded border border-red-200 bg-red-50 p-2 text-sm dark:border-red-900 dark:bg-red-950/30"
                  >
                    <span className="font-medium">{p.company_name || "Unknown"}</span>
                    <Badge variant="outline" className="border-red-500 text-red-600">
                      {p.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </ActionList>

          <ActionList
            title="Pending Device Shipments"
            icon={<Truck className="h-4 w-4 text-primary" />}
            href="/bossdashboard/devices"
            hrefLabel="Devices"
            isDarkMode={isDarkMode}
            empty="No devices awaiting shipment."
          >
            {pendingDevices.length ? (
              <ul className="space-y-2 text-sm">
                {pendingDevices.slice(0, 5).map((d) => (
                  <li key={d.id} className="flex justify-between">
                    <span>{d.customer_name || "Unknown"}</span>
                    <Badge variant="outline">pending</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </ActionList>

          <ActionList
            title="Devices Return Required"
            icon={<Truck className="h-4 w-4 text-orange-500" />}
            href="/bossdashboard/devices"
            hrefLabel="Devices"
            isDarkMode={isDarkMode}
            empty="No returns required."
          >
            {returnRequiredDevices.length ? (
              <ul className="space-y-2 text-sm">
                {returnRequiredDevices.slice(0, 5).map((d) => (
                  <li key={d.id} className="flex justify-between">
                    <span>{d.customer_name || d.customer_email || "Unknown"}</span>
                    <Badge variant="outline">return required</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </ActionList>

          <ActionList
            title="Cancellation Requests"
            icon={<AlertTriangle className="h-4 w-4 text-orange-500" />}
            href="/bossdashboard/cancellations"
            hrefLabel="Cancellations"
            isDarkMode={isDarkMode}
            empty="No recent cancellations."
          >
            {recentCancellations.length ? (
              <ul className="space-y-2 text-sm">
                {recentCancellations.map((c) => (
                  <li key={c.id} className="flex justify-between">
                    <span className="font-medium">{c.company_name || c.email || c.user_id}</span>
                    <span className="text-muted-foreground">{formatDate(c.cancelled_at)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </ActionList>

          <ActionList
            title="Demo Requests Waiting"
            icon={<CalendarClock className="h-4 w-4 text-primary" />}
            href="/bossdashboard/bookdemo"
            hrefLabel="All demos"
            isDarkMode={isDarkMode}
            empty="No pending demo requests."
          >
            {pendingDemos.length ? (
              <ul className="space-y-2 text-sm">
                {pendingDemos.map((d) => (
                  <li key={d.id} className="flex justify-between">
                    <span className="font-medium">{d.company || d.name}</span>
                    <span className="text-muted-foreground">{formatDate(d.created_at)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </ActionList>
        </div>
      </section>

      {/* Renewals & signups */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <SectionHeading title="Upcoming renewals" subtitle="Next 30 days" />
          <ActionList
            title="Renewals"
            icon={<Calendar className="h-4 w-4 text-yellow-500" />}
            href="/bossdashboard/users"
            hrefLabel="All users"
            isDarkMode={isDarkMode}
            empty="No renewals in the next 30 days."
          >
            {actionData?.upcomingRenewals?.length ? (
              <ul className="space-y-2 text-sm">
                {actionData.upcomingRenewals.slice(0, 5).map((r, i) => (
                  <li key={i} className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{r.company_name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{r.plan_name || "—"}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div>{formatDate(r.current_period_end)}</div>
                      {formatSubAmount(r) && (
                        <div className="text-muted-foreground">{formatSubAmount(r)}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </ActionList>
        </div>

        <div>
          <SectionHeading title="Recent signups" subtitle="Last 30 days" />
          <ActionList
            title="New customers"
            icon={<Users className="h-4 w-4 text-primary" />}
            href="/bossdashboard/users"
            hrefLabel="All users"
            isDarkMode={isDarkMode}
            empty="No recent signups."
          >
            {actionData?.recentSignups?.length ? (
              <ul className="space-y-2 text-sm">
                {actionData.recentSignups.slice(0, 5).map((u, i) => (
                  <li key={i} className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{u.company_name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{u.plan_name || "—"}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(u.created_at)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </ActionList>
        </div>
      </section>

      {/* Orders & plan changes */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <SectionHeading title="Recent label orders" />
          <ActionList
            title="Label orders"
            icon={<FileText className="h-4 w-4 text-primary" />}
            href="/bossdashboard/orders"
            hrefLabel="All orders"
            isDarkMode={isDarkMode}
            empty="No recent label orders."
          >
            {recentLabelOrders.length ? (
              <ul className="space-y-2 text-sm">
                {recentLabelOrders.map((o) => (
                  <li key={o.id} className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">#{o.id}</div>
                      <div className="text-xs text-muted-foreground">
                        {o.full_name || o.email || "Unknown"} · {o.label_product_name || "Labels"}
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div>{formatOrderAmount(o.amount_cents)}</div>
                      <Badge variant="outline" className="mt-0.5">
                        {o.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </ActionList>
        </div>

        <div>
          <SectionHeading title="Pending plan changes" />
          <ActionList
            title="Plan changes"
            icon={<DollarSign className="h-4 w-4 text-yellow-500" />}
            href="/bossdashboard/users"
            hrefLabel="All users"
            isDarkMode={isDarkMode}
            empty="No pending plan changes."
          >
            {actionData?.pendingChanges?.length ? (
              <ul className="space-y-2 text-sm">
                {actionData.pendingChanges.slice(0, 5).map((c, i) => (
                  <li key={i} className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{c.company_name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">
                        → {c.pending_plan_change || "—"}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {c.pending_plan_change_effective
                        ? formatDate(c.pending_plan_change_effective)
                        : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </ActionList>
        </div>
      </section>
    </div>
  )
}

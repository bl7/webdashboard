"use client"

import React, { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer, Users, CalendarDays, AlertTriangle } from "lucide-react"
import AboutToExpireList from "./AboutToExpireList"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

type LabelStats = { [labelType: string]: number }

const GRADIENTS = [
  "from-blue-500 to-indigo-500",
  "from-green-400 to-emerald-500",
  "from-purple-500 to-pink-500",
  "from-orange-400 to-red-500",
]
const ICONS = [
  <Printer className="h-7 w-7 text-white drop-shadow" />,
  <Users className="h-7 w-7 text-white drop-shadow" />,
  <CalendarDays className="h-7 w-7 text-white drop-shadow" />,
  <AlertTriangle className="h-7 w-7 text-white drop-shadow" />,
]

const fetcher = async (url: string) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  if (!token) return { logs: [] }
  
  try {
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    return res.json()
  } catch (error) {
    console.error("Failed to fetch logs:", error)
    return { logs: [] }
  }
}

const RANGE_OPTIONS = [
  { label: "1 Week", value: "week" },
  { label: "1 Month", value: "month" },
]

function processLogs(logs: any[], range: "week" | "month") {
  const now = new Date()
  let startOfRange = new Date(now)
  if (range === "week") {
    startOfRange.setDate(now.getDate() - now.getDay())
  } else {
    startOfRange.setDate(1)
  }
  startOfRange.setHours(0, 0, 0, 0)
  const nowTime = now.getTime()
  const startOfRangeTime = startOfRange.getTime()

  const printLogs = (logs || []).filter((log: any) => log.action === "print_label")
  const rangeLogs = printLogs.filter((log: any) => {
    const printedAtTime = new Date(log.details.printedAt).getTime()
    return printedAtTime >= startOfRangeTime && printedAtTime <= nowTime
  })

  // Count by labelType (for this week)
  const stats: LabelStats = {}
  rangeLogs.forEach((log: any) => {
    const type = log.details.labelType || "other"
    stats[type] = (stats[type] || 0) + (log.details.quantity || 1)
  })

  // Count by initial (for this week)
  const initialsStats: { [initial: string]: number } = {}
  rangeLogs.forEach((log: any) => {
    const initial = log.details.initial || "Unknown"
    initialsStats[initial] = (initialsStats[initial] || 0) + (log.details.quantity || 1)
  })

  // Labels printed per day (for line chart)
  const labelsPerDay: { [date: string]: number } = {}
  rangeLogs.forEach((log: any) => {
    const date = new Date(log.details.printedAt)
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    labelsPerDay[key] = (labelsPerDay[key] || 0) + (log.details.quantity || 1)
  })

  // Prepare data for line chart
  const days = []
  const daysCount =
    range === "week" ? 7 : new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  for (let i = 0; i < daysCount; i++) {
    const d = new Date(startOfRange)
    d.setDate(startOfRange.getDate() + i)
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    days.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      count: labelsPerDay[key] || 0,
    })
  }

  // Prepare data for bar chart (labels by staff initial)
  const initialsBarData = Object.entries(initialsStats).map(([initial, count]) => ({
    initial,
    count,
  }))

  // Prepare data for pie chart (label type breakdown)
  const labelTypePieData = Object.entries(stats).map(([type, count]) => ({
    name: type,
    value: count,
  }))

  // Total for the week (not just today)
  const totalThisWeek = rangeLogs.reduce(
    (sum: number, log: any) => sum + (log.details.quantity || 1),
    0
  )

  // Active staff (unique initials)
  const activeStaff = Object.keys(initialsStats).length

  // Daily average
  const dailyAvg = days.reduce((sum, d) => sum + d.count, 0) / days.length

  // Expiring soon count (simulate: count logs with expiryDate within 24h and not printed today)
  const nowDate = new Date()
  const expiringSoon = Object.values(
    printLogs.reduce((acc: any, log: any) => {
      if (log.details.labelType === "ppds") return acc;
      const key = log.details.itemName
      if (
        !acc[key] ||
        new Date(log.details.printedAt).getTime() > new Date(acc[key].details.printedAt).getTime()
      ) {
        acc[key] = log
      }
      return acc
    }, {})
  ).filter((log: any) => {
    if (log.details.labelType === "ppds") return false;
    const expiryDate = new Date(log.details.expiryDate)
    const printedAt = new Date(log.details.printedAt)
    const hoursLeft = (expiryDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60)
    const isPrintedToday =
      printedAt.getFullYear() === nowDate.getFullYear() &&
      printedAt.getMonth() === nowDate.getMonth() &&
      printedAt.getDate() === nowDate.getDate()
    return hoursLeft > 0 && hoursLeft <= 24 && !isPrintedToday
  }).length

  const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
  const weekRange = `${formatDate(startOfRange)} - ${formatDate(now)}`

  return {
    stats,
    initialsStats,
    totalThisWeek,
    weekRange,
    days,
    initialsBarData,
    labelTypePieData,
    activeStaff,
    dailyAvg,
    expiringSoon,
  }
}

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e42", "#a78bfa", "#f43f5e", "#fbbf24"]

const MetricCard = ({
  icon,
  title,
  value,
  subtitle,
  gradient,
  trend,
}: {
  icon: React.ReactNode
  title: string
  value: React.ReactNode
  subtitle: string
  gradient: string
  trend?: string
}) => (
  <Card
    className={`border-0 bg-gradient-to-br shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl ${gradient}`}
  >
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="flex flex-col">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
          {icon}
          {title}
        </CardTitle>
        <span className="mt-2 text-4xl font-extrabold text-white">{value}</span>
        <span className="mt-1 text-xs text-white/80">{subtitle}</span>
      </div>
      {trend && (
        <span className="ml-2 rounded-full bg-white/20 px-2 py-1 text-xs font-bold text-white">
          {trend}
        </span>
      )}
    </CardHeader>
  </Card>
)

const AnalyticsDashboard: React.FC = () => {
  const [range, setRange] = useState<"week" | "month">("week")
  const { data, isLoading } = useSWR("/api/logs", fetcher, { suspense: false })

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
        <AnalyticsSkeleton />
      </div>
    )
  }

  const {
    stats,
    initialsStats,
    totalThisWeek,
    weekRange,
    days,
    initialsBarData,
    labelTypePieData,
    activeStaff,
    dailyAvg,
    expiringSoon,
  } = processLogs(data.logs, range)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-2 py-10 md:px-8">
      {/* Header */}
      <header className="mb-10 flex flex-col items-center text-center">
        <h1 className="mb-2 text-5xl font-extrabold text-primary drop-shadow-lg">
          Analytics Dashboard
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-medium text-gray-600">
          Visualize your label printing activity, staff performance, and expiring items in real
          time.
        </p>
      </header>
      {/* Range Selector */}
      <div className="mx-auto mb-6 flex max-w-6xl justify-end">
        <div className="inline-flex rounded-lg bg-white/70 shadow">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`rounded-lg px-4 py-2 font-medium transition ${
                range === opt.value
                  ? "bg-purple-500 text-white shadow"
                  : "text-purple-700 hover:bg-blue-100"
              }`}
              onClick={() => setRange(opt.value as "week" | "month")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {/* Metric Cards */}
      <section className="mx-auto mb-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={ICONS[0]}
          title="Labels Printed"
          value={totalThisWeek}
          subtitle={weekRange}
          gradient={GRADIENTS[0]}
        />
        <MetricCard
          icon={ICONS[1]}
          title="Active Staff"
          value={activeStaff}
          subtitle="This Week"
          gradient={GRADIENTS[1]}
        />
        <MetricCard
          icon={ICONS[2]}
          title="Daily Average"
          value={dailyAvg.toFixed(1)}
          subtitle="Labels/Day"
          gradient={GRADIENTS[2]}
        />
        <MetricCard
          icon={ICONS[3]}
          title="Expiring Soon"
          value={expiringSoon}
          subtitle="Next 24h"
          gradient={GRADIENTS[3]}
        />
      </section>
      {/* Expiring Items */}
      <section className="mx-auto mb-10 w-full max-w-6xl">
        <AboutToExpireList />
      </section>

      {/* Charts */}
      <section className="mx-auto mb-10 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="border-0 bg-white/70 shadow-xl backdrop-blur-md">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-blue-100 to-indigo-100">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-blue-700">
              <CalendarDays className="h-5 w-5 text-blue-500" />
              Labels Printed Each Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white/70 shadow-xl backdrop-blur-md">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-green-100 to-emerald-100">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-green-700">
              <Users className="h-5 w-5 text-green-500" />
              Staff Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={initialsBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="initial" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1 border-0 bg-white/70 shadow-xl backdrop-blur-md md:col-span-2">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-purple-100 to-pink-100">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-purple-700">
              <Printer className="h-5 w-5 text-purple-500" />
              Label Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={labelTypePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {labelTypePieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-2 py-10 md:px-8">
      {/* Header Skeleton */}
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-2 h-10 w-64 rounded bg-blue-100/60" />
        <div className="mx-auto mb-2 h-6 w-80 rounded bg-gray-200/60" />
      </div>
      {/* Metric Cards Skeleton */}
      <section className="mx-auto mb-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl border-0 bg-white/70 p-6 shadow-lg backdrop-blur-md"
          >
            <div className="mb-4 h-6 w-1/3 rounded bg-blue-100/60" />
            <div className="mb-2 h-10 w-1/2 rounded bg-blue-200/60" />
            <div className="h-4 w-1/3 rounded bg-blue-100/40" />
          </div>
        ))}
      </section>
      {/* AboutToExpireList Skeleton */}
      <section className="mx-auto mb-10 w-full max-w-6xl">
        <div className="rounded-2xl bg-orange-100/40 p-6 shadow-md backdrop-blur-md">
          <div className="mb-4 h-6 w-1/4 rounded bg-orange-200/60" />
          <div className="mb-2 h-4 w-1/2 rounded bg-orange-100/60" />
          <div className="h-4 w-1/3 rounded bg-orange-100/40" />
        </div>
      </section>
      {/* Charts Skeleton */}
      <section className="mx-auto mb-10 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`rounded-2xl bg-white/70 p-6 shadow-xl backdrop-blur-md ${
              i === 3 ? "md:col-span-2" : ""
            }`}
          >
            <div className="mb-4 h-6 w-1/4 rounded bg-gray-200/60" />
            <div className="h-48 w-full rounded bg-gray-100/60" />
          </div>
        ))}
      </section>
    </div>
  )
}

export default AnalyticsDashboard

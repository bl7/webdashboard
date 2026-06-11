"use client"

import React, { useState } from "react"
import useSWR from "swr"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

const LABEL_TYPE_LABELS: Record<string, string> = {
  prep: "Prep",
  cooked: "Cooked",
  ppds: "PPDS",
  ppd: "PPDS",
  default: "Use First",
  defrost: "Defrost",
  other: "Other",
}

const CATEGORY_COLORS: Record<string, string> = {
  prep: "#10b981",
  cooked: "#f59e0b",
  ppds: "#8b5cf6",
  ppd: "#8b5cf6",
  default: "#6366f1",
  defrost: "#06b6d4",
  other: "#94a3b8",
}

type PrintJob = {
  id: number
  itemName: string
  quantity: number
  printedAt: string
  initial: string
}

type CategoryRow = {
  type: string
  count: number
  jobs: PrintJob[]
}

type AnalyticsData = {
  date: string
  lastWeekDate: string
  todayTotal: number
  lastWeekTotal: number
  hourlyComparison: Array<{
    hour: number
    label: string
    today: number
    lastWeek: number
  }>
  byCategory: CategoryRow[]
}

const fetcher = async (url: string) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  if (!token) return null
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Failed to load analytics")
  return res.json()
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  } catch {
    return ""
  }
}

function formatDateLabel(iso: string) {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  } catch {
    return iso
  }
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-white px-3 py-2 text-sm shadow-lg">
      <p className="mb-1 font-medium text-slate-700">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function PrintAnalytics() {
  const { data, isLoading, error } = useSWR<AnalyticsData>("/api/logs/analytics", fetcher)
  const [expandedType, setExpandedType] = useState<string | null>(null)

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/70 shadow-xl backdrop-blur-md">
        <CardContent className="p-6">
          <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
        </CardContent>
      </Card>
    )
  }

  if (error || !data) return null

  const now = new Date()
  const isViewingToday = data.date === now.toISOString().slice(0, 10)
  const currentHour = now.getHours()
  const chartData = data.hourlyComparison.map((row) => ({
    ...row,
    today: isViewingToday && row.hour > currentHour ? null : row.today,
  }))

  return (
    <section className="space-y-6">
      <Card className="border-0 bg-white/70 shadow-xl backdrop-blur-md">
        <CardHeader className="rounded-t-lg bg-gradient-to-r from-indigo-50 to-purple-50 pb-2">
          <CardTitle className="text-base font-bold text-indigo-800">
            Prints by hour — today vs last week
          </CardTitle>
          <p className="text-sm text-slate-500">
            {formatDateLabel(data.date)} vs {formatDateLabel(data.lastWeekDate)}
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="todayGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lastWeekGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#64748b" }}
                interval={2}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="lastWeek"
                name="Last week"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="url(#lastWeekGradient)"
                connectNulls
              />
              <Area
                type="monotone"
                dataKey="today"
                name="Today"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#todayGradient)"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 rounded bg-indigo-500" /> Today
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 rounded border-t-2 border-dashed border-slate-400" />{" "}
              Last week
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/70 shadow-xl backdrop-blur-md">
        <CardHeader className="rounded-t-lg bg-gradient-to-r from-emerald-50 to-teal-50 pb-2">
          <CardTitle className="text-base font-bold text-emerald-800">
            Today by label type
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100 p-0">
          {data.byCategory.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-500">No prints today yet</p>
          ) : (
            data.byCategory.map((cat) => {
              const isExpanded = expandedType === cat.type
              const color = CATEGORY_COLORS[cat.type] || CATEGORY_COLORS.other
              const label = LABEL_TYPE_LABELS[cat.type] || cat.type
              return (
                <div key={cat.type}>
                  <button
                    type="button"
                    onClick={() => setExpandedType(isExpanded ? null : cat.type)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-medium text-slate-800">{label}</span>
                      <span className="text-sm text-slate-500">
                        {cat.jobs.length} job{cat.jobs.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-slate-800">{cat.count}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-3">
                      <ul className="max-h-48 space-y-2 overflow-y-auto">
                        {cat.jobs.map((job) => (
                          <li
                            key={job.id}
                            className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm shadow-sm"
                          >
                            <span className="truncate font-medium text-slate-700">
                              {job.itemName}
                            </span>
                            <span className="ml-3 shrink-0 text-slate-500">
                              ×{job.quantity}
                              {job.initial ? ` · ${job.initial}` : ""} · {formatTime(job.printedAt)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </section>
  )
}

"use client"

import React from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer } from "lucide-react"
import AboutToExpireList from "./AboutToExpireList"

type LabelStats = {
  [labelType: string]: number
}

function AnalyticsSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="flex animate-pulse flex-col justify-between">
          <CardHeader>
            <div className="mb-2 h-5 w-2/3 rounded bg-muted-foreground/20" />
          </CardHeader>
          <CardContent>
            <div className="mb-4 h-10 w-1/3 rounded bg-muted-foreground/20" />
            <div className="mb-2 h-4 w-1/2 rounded bg-muted-foreground/10" />
            <div className="mb-2 h-4 w-1/4 rounded bg-muted-foreground/10" />
            <div className="h-4 w-1/3 rounded bg-muted-foreground/10" />
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const userId = typeof window !== "undefined" ? localStorage.getItem("userid") : null
  if (!userId) return { logs: [] }
  const res = await fetch(`${url}?user_id=${userId}`)
  return res.json()
}

function processLogs(logs: any[]) {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const weekRange = `${startOfWeek.toLocaleDateString()} - ${now.toLocaleDateString()}`

  const printLogs = (logs || []).filter((log: any) => log.action === "print_label")
  const weekLogs = printLogs.filter((log: any) => {
    const printedAt = new Date(log.details.printedAt)
    return printedAt >= startOfWeek && printedAt <= now
  })

  // Count by labelType (for this week)
  const stats: LabelStats = {}
  weekLogs.forEach((log: any) => {
    const type = log.details.labelType || "other"
    stats[type] = (stats[type] || 0) + (log.details.quantity || 1)
  })

  // Count by initial (for this week)
  const initialsStats: { [initial: string]: number } = {}
  weekLogs.forEach((log: any) => {
    const initial = log.details.initial || "Unknown"
    initialsStats[initial] = (initialsStats[initial] || 0) + (log.details.quantity || 1)
  })

  const totalToday = weekLogs.reduce(
    (sum: number, log: any) => sum + (log.details.quantity || 1),
    0
  )

  return { stats, initialsStats, totalToday, weekRange }
}

const AnalyticsDashboard: React.FC = () => {
  const { data, isLoading } = useSWR("/api/logs", fetcher, { suspense: false })

  if (isLoading || !data) {
    return <AnalyticsSkeleton />
  }

  const { stats, initialsStats, totalToday, weekRange } = processLogs(data.logs)

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
            <Printer className="h-5 w-5 text-primary" />
            Labels Printed This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-foreground">{totalToday}</div>
          <div className="mt-4 space-y-1">
            {Object.entries(stats).map(([type, count]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="capitalize">{type.replace("_", " ")}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
          <p className="mb-2 text-sm text-muted-foreground">Week: {weekRange}</p>
        </CardContent>
      </Card>
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
            👤 Labels Printed by Staff (This Week)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-2 space-y-1">
            {Object.entries(initialsStats).length === 0 ? (
              <div className="text-gray-400">No labels printed this week.</div>
            ) : (
              Object.entries(initialsStats).map(([initial, count]) => (
                <div key={initial} className="flex justify-between text-sm">
                  <span className="font-mono">{initial}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <AboutToExpireList />
    </section>
  )
}

export default AnalyticsDashboard

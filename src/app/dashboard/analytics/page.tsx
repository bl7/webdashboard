"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer } from "lucide-react"
import AboutToExpireList from "./AboutToExpireList"

type LabelStats = {
  [labelType: string]: number
}

const AnalyticsDashboard: React.FC = () => {
  const [labelsToday, setLabelsToday] = useState<LabelStats>({})
  const [totalToday, setTotalToday] = useState(0)
  const [initialsToday, setInitialsToday] = useState<{ [initial: string]: number }>({})
  const [weekRange, setWeekRange] = useState("")

  useEffect(() => {
    const fetchPrintedLabels = async () => {
      const userId = typeof window !== "undefined" ? localStorage.getItem("userid") : null
      if (!userId) return
      const res = await fetch(`/api/logs?user_id=${userId}`)
      const data = await res.json()
      const printLogs = (data.logs || []).filter((log: any) => log.action === "print_label")
      const now = new Date()
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay()) // Sunday as start of week
      startOfWeek.setHours(0, 0, 0, 0)
      setWeekRange(`${startOfWeek.toLocaleDateString()} - ${now.toLocaleDateString()}`)

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
      setLabelsToday(stats)
      setTotalToday(
        weekLogs.reduce((sum: number, log: any) => sum + (log.details.quantity || 1), 0)
      )

      // Count by initial (for this week)
      const initialsStats: { [initial: string]: number } = {}
      weekLogs.forEach((log: any) => {
        const initial = log.details.initial || "Unknown"
        initialsStats[initial] = (initialsStats[initial] || 0) + (log.details.quantity || 1)
      })
      setInitialsToday(initialsStats)
    }
    fetchPrintedLabels()
  }, [])

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
            {Object.entries(labelsToday).map(([type, count]) => (
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
            {Object.entries(initialsToday).length === 0 ? (
              <div className="text-gray-400">No labels printed this week.</div>
            ) : (
              Object.entries(initialsToday).map(([initial, count]) => (
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

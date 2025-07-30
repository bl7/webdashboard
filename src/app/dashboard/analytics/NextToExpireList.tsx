"use client"
import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Clock, ChevronDown, ChevronUp } from "lucide-react"

type ExpiringItem = { name: string; type: string; expiresAt: string; hoursLeft: number }

type PrintLog = {
  details: {
    itemId: string
    itemName: string
    labelType: string
    printedAt: string
    expiryDate: string
    [key: string]: any
  }
  action: string
}

function NextToExpireSkeleton() {
  return (
    <Card className="w-full border-0 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
      <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-100 to-yellow-100">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-amber-800">
          <Clock className="h-5 w-5 text-amber-600" />
          Next to Expire (After 24h)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-2">
          {[1, 2, 3].map((i) => (
            <li key={i} className="h-6 w-2/3 animate-pulse rounded bg-amber-100/60" />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default function NextToExpireList() {
  const [nextToExpire, setNextToExpire] = useState<ExpiringItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) {
        setLoading(false)
        return
      }
      
      try {
        const res = await fetch(`/api/logs`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        const data = await res.json()
        const printLogs: PrintLog[] = (data.logs || []).filter(
          (log: PrintLog) => log.action === "print_label"
        )

        // Group logs by itemName (or itemId if you prefer)
        const latestLogsByItem: { [key: string]: PrintLog } = {}
        for (const log of printLogs) {
          const key = log.details.itemName // or use itemId if you want
          if (
            !latestLogsByItem[key] ||
            new Date(log.details.printedAt).getTime() >
              new Date(latestLogsByItem[key].details.printedAt).getTime()
          ) {
            latestLogsByItem[key] = log
          }
        }

        const now = new Date()
        const result: ExpiringItem[] = []

        Object.values(latestLogsByItem).forEach((log) => {
          // Defensive date parsing
          let expiryDate: Date
          let printedAt: Date
          
          try {
            expiryDate = new Date(log.details.expiryDate)
            if (isNaN(expiryDate.getTime())) {
              return
            }
          } catch (error) {
            return
          }
          
          try {
            printedAt = new Date(log.details.printedAt)
            if (isNaN(printedAt.getTime())) {
              return
            }
          } catch (error) {
            return
          }
          
          const hoursLeft = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)
          const isPrintedToday =
            printedAt.getFullYear() === now.getFullYear() &&
            printedAt.getMonth() === now.getMonth() &&
            printedAt.getDate() === now.getDate()

          // Filter out 'ppds' label type
          if (log.details.labelType === "ppds") return

          // Include items that expire after 24 hours but within the next 7 days
          if (hoursLeft > 24 && hoursLeft <= 168) { // 168 hours = 7 days
            // For defrost labels, always include them regardless of when they were printed
            // For other labels, exclude if printed today (unless they're defrost)
            if (log.details.labelType === "defrost" || !isPrintedToday) {
              result.push({
                name: log.details.itemName,
                type: log.details.labelType,
                expiresAt: expiryDate.toLocaleString(),
                hoursLeft: Math.round(hoursLeft)
              })
            }
          }
        })

        // Sort by hours left (soonest first)
        result.sort((a, b) => a.hoursLeft - b.hoursLeft)

        // Take only the top 10 items
        setNextToExpire(result.slice(0, 10))
      } catch (error) {
        console.error("Failed to fetch logs:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatTimeLeft = (hours: number) => {
    if (hours < 48) {
      return `${hours}h`
    } else {
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
    }
  }

  return (
    <Card className="w-full border-0 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
      <CardHeader
        className="cursor-pointer select-none border-b border-amber-100 bg-gradient-to-r from-amber-100 to-yellow-100"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-amber-800">
          <Clock className="h-5 w-5 text-amber-600" />
          Next to Expire (After 24h)
          <span className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium text-amber-600">
              {loading ? "..." : `${nextToExpire.length} items`}
            </span>
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-amber-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-amber-600" />
            )}
          </span>
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent className="w-full pt-6">
          {loading ? (
            <NextToExpireSkeleton />
          ) : nextToExpire.length === 0 ? (
            <div className="text-gray-500">No ingredients or menu items expiring in the next week.</div>
          ) : (
            <ul className="w-full space-y-2">
              {nextToExpire.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 border-b border-yellow-100 pb-2 text-amber-900"
                >
                  <span className="font-semibold">{item.name}</span>
                  <span className="rounded bg-yellow-100 px-2 py-0.5 font-mono text-xs text-yellow-700">
                    {item.type}
                  </span>
                  <span className="ml-auto font-medium text-amber-600">
                    {formatTimeLeft(item.hoursLeft)} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      )}
    </Card>
  )
} 
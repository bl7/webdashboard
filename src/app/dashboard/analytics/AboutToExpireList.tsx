"use client"
import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"

type ExpiringItem = { name: string; type: string; expiresAt: string }

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

function AboutToExpireSkeleton() {
  return (
    <Card className="w-full border-0 bg-gradient-to-br from-red-50 to-orange-50 shadow-lg">
      <CardHeader className="border-b border-red-100 bg-gradient-to-r from-red-100 to-orange-100">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-red-800">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          About to Expire (Next 24h)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-2">
          {[1, 2, 3].map((i) => (
            <li key={i} className="h-6 w-2/3 animate-pulse rounded bg-red-100/60" />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default function AboutToExpireList() {
  const [aboutToExpire, setAboutToExpire] = useState<ExpiringItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const userId = typeof window !== "undefined" ? localStorage.getItem("userid") : null
      if (!userId) {
        setLoading(false)
        return
      }
      const res = await fetch(`/api/logs?user_id=${userId}`)
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
        const expiryDate = new Date(log.details.expiryDate)
        const printedAt = new Date(log.details.printedAt)
        const hoursLeft = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)
        const isPrintedToday =
          printedAt.getFullYear() === now.getFullYear() &&
          printedAt.getMonth() === now.getMonth() &&
          printedAt.getDate() === now.getDate()

        // Filter out 'ppds' label type
        if (log.details.labelType === "ppds") return

        if (hoursLeft > 0 && hoursLeft <= 24 && !isPrintedToday) {
          result.push({
            name: log.details.itemName,
            type: log.details.labelType,
            expiresAt: expiryDate.toLocaleString(),
          })
        }
      })

      setAboutToExpire(result.filter(item => item.type !== "ppds"))
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <Card className="w-full border-0 bg-gradient-to-br from-red-50 to-orange-50 shadow-lg">
      <CardHeader
        className="cursor-pointer select-none border-b border-red-100 bg-gradient-to-r from-red-100 to-orange-100"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-red-800">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          About to Expire (Next 24h)
          <span className="ml-auto flex items-center">
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-red-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-red-600" />
            )}
          </span>
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent className="w-full pt-6">
          {loading ? (
            <AboutToExpireSkeleton />
          ) : aboutToExpire.length === 0 ? (
            <div className="text-gray-500">No ingredients or menu items are about to expire.</div>
          ) : (
            <ul className="w-full space-y-2">
              {aboutToExpire.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 border-b border-orange-100 pb-2 text-red-900"
                >
                  <span className="font-semibold">{item.name}</span>
                  <span className="rounded bg-orange-100 px-2 py-0.5 font-mono text-xs text-orange-700">
                    {item.type}
                  </span>
                  <span className="ml-auto font-medium text-red-600">
                    Expires at: {item.expiresAt}
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

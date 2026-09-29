"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cleaningGet, cleaningToken } from "@/lib/cleaningApi"

export default function CleaningOverdueAlert() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const token = cleaningToken()
    if (!token || localStorage.getItem("adminAccess") !== "true") return
    cleaningGet("/cleaning/overview", token)
      .then((data) => setCount(data.data?.openOverdue || data.data?.overdue || 0))
      .catch(() => setCount(0))
  }, [])

  if (count < 1) return null

  return (
    <Link
      href="/dashboard/cleaning/history?status=overdue"
      className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-800 shadow-sm"
    >
      <span className="font-semibold">
        ⚠ {count} cleaning {count === 1 ? "task is" : "tasks are"} overdue
      </span>
      <span className="text-sm font-semibold underline">View overdue tasks</span>
    </Link>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { complianceGet, complianceToken } from "@/lib/complianceApi"

export default function ComplianceDueAlert() {
  const [overdue, setOverdue] = useState(0)
  const [fails, setFails] = useState(0)

  useEffect(() => {
    const token = complianceToken()
    if (!token || localStorage.getItem("adminAccess") !== "true") return
    complianceGet("/compliance/today", token)
      .then((data) => {
        setOverdue(data.data?.overdue || 0)
        setFails(data.data?.openFails || 0)
      })
      .catch(() => {
        setOverdue(0)
        setFails(0)
      })
  }, [])

  if (overdue < 1 && fails < 1) return null

  return (
    <Link
      href="/dashboard/compliance"
      className="mb-6 block rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-800 shadow-sm"
    >
      <span className="font-semibold">
        {overdue > 0 ? `${overdue} temperature ${overdue === 1 ? "check is" : "checks are"} overdue. ` : ""}
        {fails > 0 ? `${fails} failed ${fails === 1 ? "reading is" : "readings are"} still open.` : ""}
      </span>
    </Link>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { complianceToken, downloadCompliancePdf } from "@/lib/complianceApi"

export default function DiaryPage() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [error, setError] = useState("")

  const pdf = async () => {
    const token = complianceToken()
    if (!token) return
    setError("")
    const query = new URLSearchParams()
    if (from) query.set("from", from)
    if (to) query.set("to", to)
    query.set("part", "all")
    try {
      await downloadCompliancePdf(token, query.toString(), "food-safety-diary.pdf")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not export the diary")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">From<input type="date" className="mt-1 block h-10 rounded-md border px-3" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="text-sm">To<input type="date" className="mt-1 block h-10 rounded-md border px-3" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <Button onClick={pdf}>Download diary</Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="rounded-2xl bg-white p-5 text-sm text-slate-700 shadow-sm">
        <p>This is the one file for a food officer. It includes the temperature diary, the checklist diary, and the cleaning record, plus corrective actions and the manager sign-off.</p>
        <p className="mt-2">Leave the dates blank for the last seven days. Photos are not included.</p>
      </div>
    </div>
  )
}

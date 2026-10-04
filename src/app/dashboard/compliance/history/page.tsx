"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { complianceGet, complianceToken, downloadCompliancePdf } from "@/lib/complianceApi"

type History = {
  from: string
  to: string
  readings: Array<{ uuid: string; businessDate: string; equipmentName: string; valueC: number; result: string; recordedBy: string; recordedAtLabel: string; correctionReason: string }>
  items?: Array<{ uuid: string; businessDate: string; equipmentName: string; itemName: string; valueC: number; result: string; recordedBy: string; recordedAtLabel: string; correctionReason: string }>
  food: Array<{ uuid: string; businessDate: string; dishName: string; process: string; result: string; timeRange?: string | null }>
  deliveries: Array<{ uuid: string; businessDate: string; supplier: string; product: string; decision: string }>
}

export default function HistoryPage() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [data, setData] = useState<History | null>(null)
  const [error, setError] = useState("")

  const load = (nextFrom = from, nextTo = to) => {
    const token = complianceToken()
    if (!token) return
    const query = new URLSearchParams()
    if (nextFrom) query.set("from", nextFrom)
    if (nextTo) query.set("to", nextTo)
    complianceGet(`/compliance/history?${query.toString()}`, token)
      .then((response) => {
        setData(response.data)
        setFrom(response.data.from)
        setTo(response.data.to)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    load()
  }, [])

  const pdf = async () => {
    const token = complianceToken()
    if (!token) return
    setError("")
    try {
      await downloadCompliancePdf(token, `from=${from}&to=${to}&part=temperatures`, "temperature-diary.pdf")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not export")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">From<input type="date" className="mt-1 block h-10 rounded-md border px-3" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="text-sm">To<input type="date" className="mt-1 block h-10 rounded-md border px-3" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <Button variant="outline" onClick={() => load()}>Show</Button>
        <Button onClick={pdf}>Download diary</Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        {(data?.readings || []).map((row) => (
          <p key={row.uuid} className="border-b py-2 text-sm">
            {row.businessDate} · {row.equipmentName} · {row.valueC} °C · {row.result} · {row.recordedBy} · {row.recordedAtLabel}
            {row.correctionReason ? ` · correction: ${row.correctionReason}` : ""}
          </p>
        ))}
        {(data?.items || []).map((row) => (
          <p key={row.uuid} className="border-b py-2 text-sm">
            {row.businessDate} · {row.equipmentName} · {row.itemName} · {row.valueC} °C · {row.result} · {row.recordedBy} · {row.recordedAtLabel}
            {row.correctionReason ? ` · correction: ${row.correctionReason}` : ""}
          </p>
        ))}
        {(data?.food || []).map((row) => (
          <p key={row.uuid} className="border-b py-2 text-sm">{row.businessDate} · {row.dishName} · {row.process.replace("_", " ")}{row.timeRange ? ` · ${row.timeRange}` : ""} · {row.result}</p>
        ))}
        {(data?.deliveries || []).map((row) => (
          <p key={row.uuid} className="border-b py-2 text-sm">{row.businessDate} · {row.supplier} · {row.product} · {row.decision}</p>
        ))}
        {data && data.readings.length === 0 && (data.items || []).length === 0 && data.food.length === 0 && data.deliveries.length === 0 ? (
          <p className="text-sm text-slate-500">No records in this range.</p>
        ) : null}
      </div>
    </div>
  )
}

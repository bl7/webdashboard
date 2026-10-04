"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { complianceGet, complianceToken, downloadCompliancePdf } from "@/lib/complianceApi"

type Tick = {
  businessDate: string
  itemId?: string
  kind: string
  label: string
  done: boolean
  note: string
  recordedBy: string
}

type Item = { uuid: string; kind: string; label: string; isActive: boolean }

type Note = { businessDate: string; problems: string; recordedBy: string }

function linesFor(kind: string, ticks: Tick[], items: Item[]) {
  const mine = ticks.filter((row) => row.kind === kind)
  const catalog = items.filter((item) => item.kind === kind && (item.isActive || mine.some((tick) => tick.itemId === item.uuid)))
  if (!catalog.length) {
    if (!mine.length) return [{ key: "empty", text: "Nothing ticked." }]
    return mine.map((row) => ({
      key: `${row.kind}-${row.label}`,
      text: `${row.done ? "Done" : "Not done"}: ${row.label}${row.note ? `. ${row.note}` : ""}${row.recordedBy ? ` · ${row.recordedBy}` : ""}`,
    }))
  }
  return catalog.map((item) => {
    const tick = mine.find((row) => row.itemId === item.uuid)
    if (!tick) return { key: item.uuid, text: `Not recorded: ${item.label}` }
    return {
      key: item.uuid,
      text: `${tick.done ? "Done" : "Not done"}: ${item.label}${tick.note ? `. ${tick.note}` : ""}${tick.recordedBy ? ` · ${tick.recordedBy}` : ""}`,
    }
  })
}

type History = {
  from: string
  to: string
  checks: Tick[]
  notes: Note[]
  checkItems?: Item[]
}

export default function ChecklistHistoryPage() {
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
      await downloadCompliancePdf(token, `from=${from}&to=${to}&part=checks`, "checklist-diary.pdf")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not export the diary")
    }
  }

  const dates = [...new Set([...(data?.checks || []).map((row) => row.businessDate), ...(data?.notes || []).map((row) => row.businessDate)])].sort().reverse()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">From<input type="date" className="mt-1 block h-10 rounded-md border px-3" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="text-sm">To<input type="date" className="mt-1 block h-10 rounded-md border px-3" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <Button variant="outline" onClick={() => load()}>Show</Button>
        <Button onClick={pdf}>Download diary</Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {data && dates.length === 0 ? <p className="text-sm text-slate-500">No checklist records in this range.</p> : null}
      {dates.map((date) => {
        const ticks = (data?.checks || []).filter((row) => row.businessDate === date)
        const note = (data?.notes || []).find((row) => row.businessDate === date)
        return (
          <div key={date} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="font-semibold text-slate-900">{date}</p>
            {(["opening", "closing"] as const).map((kind) => (
              <div key={kind} className="mt-3">
                <p className="text-sm font-semibold text-slate-800">{kind === "opening" ? "Opening" : "Closing"}</p>
                <ul className="mt-1 space-y-1 text-sm text-slate-700">
                  {linesFor(kind, ticks, data?.checkItems || []).map((row) => (
                    <li key={row.key}>{row.text}</li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="mt-3 text-sm text-slate-700">
              {note ? `Problems or changes: ${note.problems} · ${note.recordedBy}` : "Problems or changes: none recorded."}
            </p>
          </div>
        )
      })}
    </div>
  )
}

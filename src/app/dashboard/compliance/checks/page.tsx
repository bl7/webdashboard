"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { complianceGet, complianceSend, complianceToken } from "@/lib/complianceApi"

type Check = {
  uuid: string
  kind: "opening" | "closing"
  label: string
  isActive: boolean
}

export default function ChecksPage() {
  const [rows, setRows] = useState<Check[]>([])
  const [kind, setKind] = useState<"opening" | "closing">("opening")
  const [label, setLabel] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const load = () => {
    const token = complianceToken()
    if (!token) return
    complianceGet("/compliance/checks", token)
      .then((response) => setRows(response.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    const token = complianceToken()
    if (!token || !label.trim()) return
    setError("")
    try {
      await complianceSend("/compliance/checks", token, "POST", { kind, label: label.trim() })
      setLabel("")
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the check")
    }
  }

  const toggle = async (row: Check) => {
    const token = complianceToken()
    if (!token) return
    setError("")
    try {
      await complianceSend(`/compliance/checks/${row.uuid}`, token, "PATCH", { isActive: !row.isActive })
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the check")
    }
  }

  if (loading) return <div className="h-40 animate-pulse rounded-2xl bg-white/70" />

  const list = (id: "opening" | "closing", title: string) => (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2">
        {rows.filter((row) => row.kind === id).map((row) => (
          <li key={row.uuid} className="flex items-center justify-between gap-3 text-sm">
            <span className={row.isActive ? "text-slate-800" : "text-slate-400 line-through"}>{row.label}</span>
            <button type="button" className="font-semibold text-purple-700" onClick={() => toggle(row)}>
              {row.isActive ? "Retire" : "Restore"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Add a check</h2>
        <select className="h-10 w-full rounded-md border px-3 text-sm" value={kind} onChange={(e) => setKind(e.target.value as "opening" | "closing")}>
          <option value="opening">Opening</option>
          <option value="closing">Closing</option>
        </select>
        <input className="h-10 w-full rounded-md border px-3 text-sm" placeholder="Check" value={label} onChange={(e) => setLabel(e.target.value)} />
        <Button onClick={save} disabled={!label.trim()}>Add check</Button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <p className="text-sm text-slate-500">Staff tick these on the phone. A check that is not done needs a note of what they did.</p>
      </div>
      <div className="space-y-4">
        {list("opening", "Opening")}
        {list("closing", "Closing")}
      </div>
    </div>
  )
}

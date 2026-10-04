"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CleaningMessage, StatusPill } from "@/components/dashboard/cleaning/CleaningNav"
import { cleaningGet, cleaningToken, downloadCleaningPdf } from "@/lib/cleaningApi"
import CleaningPhoto from "@/components/dashboard/cleaning/CleaningPhoto"

type RecordRow = {
  uuid: string
  scheduledDate: string
  scheduledDateLabel: string
  scheduledDateLong?: string
  taskName: string
  taskId: string
  areaName: string
  areaId: string
  dueLabel: string
  status: string
  completedByName?: string | null
  completedByUserId?: string | null
  completedAtLabel?: string | null
  hasPhoto?: boolean
}

function businessToday(timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone || "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

function recordsSoFar(rows: RecordRow[], today: string) {
  return rows.filter((row) => /^\d{4}-\d{2}-\d{2}$/.test(row.scheduledDate || "") && row.scheduledDate <= today)
}

function longDate(dateStr: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return ""
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export default function CleaningHistoryPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-white/70" />}>
      <CleaningHistory />
    </Suspense>
  )
}

function CleaningHistory() {
  const searchParams = useSearchParams()
  const [records, setRecords] = useState<RecordRow[]>([])
  const [areas, setAreas] = useState<Array<{ uuid: string; name: string }>>([])
  const [tasks, setTasks] = useState<Array<{ uuid: string; name: string }>>([])
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [areaId, setAreaId] = useState("")
  const [taskId, setTaskId] = useState("")
  const [status, setStatus] = useState(searchParams.get("status") || "")
  const [staff, setStaff] = useState("")
  const [day, setDay] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (from) params.set("from", from)
    if (to) params.set("to", to)
    if (areaId) params.set("areaId", areaId)
    if (taskId) params.set("taskId", taskId)
    if (status) params.set("status", status)
    if (staff) params.set("staff", staff)
    return params.toString()
  }, [from, to, areaId, taskId, status, staff])

  const days = useMemo(() => [...new Set(records.map((row) => row.scheduledDate))].sort(), [records])

  useEffect(() => {
    if (days.length === 0) {
      setDay("")
      return
    }
    setDay((current) => (current && days.includes(current) ? current : days[days.length - 1]))
  }, [days])

  const load = () => {
    const token = cleaningToken()
    if (!token) return
    setLoading(true)
    setError("")
    cleaningGet(`/cleaning/history?${query}`, token)
      .then((response) => {
        setRecords(recordsSoFar(response.data.records || [], businessToday(response.data.timezone)))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const token = cleaningToken()
    if (!token) return
    cleaningGet("/cleaning/areas", token)
      .then((response) => setAreas(response.data || []))
      .catch(() => setAreas([]))
    cleaningGet("/cleaning/tasks", token)
      .then((response) => setTasks(response.data || []))
      .catch(() => setTasks([]))
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const exportPdf = async () => {
    const token = cleaningToken()
    if (!token) return
    setExporting(true)
    try {
      await downloadCleaningPdf(token, query)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed")
    } finally {
      setExporting(false)
    }
  }

  const dayRows = records.filter((row) => row.scheduledDate === day)
  const areaNames = [...new Set(dayRows.map((row) => row.areaName || "Other"))]
  const dayIndex = days.indexOf(day)
  const done = dayRows.filter((row) => row.status === "completed").length
  const missed = dayRows.filter((row) => row.status === "overdue").length
  const open = dayRows.filter((row) => row.status === "pending").length

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-6">
        <input className="h-10 rounded-md border px-3 text-sm" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className="h-10 rounded-md border px-3 text-sm" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <select className="h-10 rounded-md border px-3 text-sm" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
          <option value="">All areas</option>
          {areas.map((area) => (
            <option key={area.uuid} value={area.uuid}>
              {area.name}
            </option>
          ))}
        </select>
        <select className="h-10 rounded-md border px-3 text-sm" value={taskId} onChange={(e) => setTaskId(e.target.value)}>
          <option value="">All tasks</option>
          {tasks.map((task) => (
            <option key={task.uuid} value={task.uuid}>
              {task.name}
            </option>
          ))}
        </select>
        <select className="h-10 rounded-md border px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        <input
          className="h-10 rounded-md border px-3 text-sm"
          placeholder="Staff member"
          value={staff}
          onChange={(e) => setStaff(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">One day at a time, up to today. This diary is the cleaning record only.</p>
        <Button onClick={exportPdf} disabled={exporting}>
          {exporting ? "Exporting…" : "Download diary"}
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-white/70" />
      ) : days.length === 0 || !day ? (
        <CleaningMessage title={days.length === 0 ? "No cleaning records yet." : "Loading this day."} />
      ) : (
        <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="outline" disabled={dayIndex <= 0} onClick={() => setDay(days[dayIndex - 1])}>
              Previous day
            </Button>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900">{longDate(day)}</p>
              <p className="text-sm text-slate-500">
                {dayRows.length} tasks · {done} done · {missed} missed · {open} not done
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={dayIndex < 0 || dayIndex >= days.length - 1}
              onClick={() => setDay(days[dayIndex + 1])}
            >
              Next day
            </Button>
          </div>
          {areaNames.map((area) => (
            <section key={area}>
              <h3 className="mb-2 text-sm font-semibold text-slate-500">{area}</h3>
              <ul className="divide-y rounded-xl border">
                {dayRows
                  .filter((row) => (row.areaName || "Other") === area)
                  .map((row) => (
                    <li key={row.uuid} className="flex items-start gap-3 px-3 py-3">
                      <span
                        className={
                          row.status === "completed"
                            ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-emerald-700 bg-emerald-700 text-xs text-white"
                            : row.status === "overdue"
                              ? "mt-0.5 h-5 w-5 shrink-0 rounded border border-red-600"
                              : "mt-0.5 h-5 w-5 shrink-0 rounded border border-slate-300"
                        }
                      >
                        {row.status === "completed" ? "✓" : ""}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-slate-900">{row.taskName}</p>
                          <StatusPill status={row.status} />
                        </div>
                        <p className="text-sm text-slate-500">
                          Due {row.dueLabel}
                          {row.status === "completed" && row.completedByName
                            ? ` · ${row.completedByName}${row.completedAtLabel ? `, ${row.completedAtLabel}` : ""}`
                            : ""}
                        </p>
                        {row.hasPhoto ? <div className="mt-2"><CleaningPhoto occurrenceId={row.uuid} /></div> : null}
                      </div>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CleaningMessage, StatusPill } from "@/components/dashboard/cleaning/CleaningNav"
import { cleaningGet, cleaningToken, downloadCleaningPdf } from "@/lib/cleaningApi"

type RecordRow = {
  uuid: string
  scheduledDateLabel: string
  taskName: string
  taskId: string
  areaName: string
  areaId: string
  dueLabel: string
  status: string
  completedByName?: string | null
  completedByUserId?: string | null
  completedAtLabel?: string | null
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
  const [summary, setSummary] = useState({ total: 0, completed: 0, overdue: 0, pending: 0 })
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [areaId, setAreaId] = useState("")
  const [taskId, setTaskId] = useState("")
  const [status, setStatus] = useState(searchParams.get("status") || "")
  const [staff, setStaff] = useState("")
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

  const load = () => {
    const token = cleaningToken()
    if (!token) return
    setLoading(true)
    setError("")
    cleaningGet(`/cleaning/history?${query}`, token)
      .then((response) => {
        setRecords(response.data.records || [])
        setSummary(response.data.summary)
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {summary.total} records · {summary.completed} completed · {summary.overdue} overdue
        </p>
        <Button onClick={exportPdf} disabled={exporting}>
          {exporting ? "Exporting…" : "Export PDF"}
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-white/70" />
      ) : records.length === 0 ? (
        <CleaningMessage title="No cleaning records yet." />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completed by</TableHead>
                <TableHead>Completed at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((row) => (
                <TableRow key={row.uuid}>
                  <TableCell>{row.scheduledDateLabel}</TableCell>
                  <TableCell>{row.taskName}</TableCell>
                  <TableCell>{row.areaName}</TableCell>
                  <TableCell>{row.dueLabel}</TableCell>
                  <TableCell>
                    <StatusPill status={row.status} />
                  </TableCell>
                  <TableCell>{row.completedByName || "—"}</TableCell>
                  <TableCell>{row.completedAtLabel || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

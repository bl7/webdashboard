"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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
import { cleaningGet, cleaningToken } from "@/lib/cleaningApi"
import CleaningPhoto from "@/components/dashboard/cleaning/CleaningPhoto"

type Overview = {
  dateLabel: string
  total: number
  completed: number
  pending: number
  overdue: number
  openOverdue: number
  tasks: Array<{
    uuid: string
    taskName: string
    areaName: string
    dueLabel: string
    status: string
    completedByName?: string | null
    completedAtLabel?: string | null
    hasPhoto?: boolean
  }>
}

export default function CleaningOverviewPage() {
  const [data, setData] = useState<Overview | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const load = () => {
    const token = cleaningToken()
    if (!token) {
      setError("Please sign in again.")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    cleaningGet("/cleaning/overview", token)
      .then((response) => setData(response.data))
      .catch((err) => setError(err.message || "Could not load cleaning"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-white/70" />
  if (error) {
    return (
      <CleaningMessage
        title="Could not load today’s cleaning"
        body={error}
        action={<Button onClick={load}>Retry</Button>}
      />
    )
  }
  if (!data || data.total === 0) {
    return (
      <div className="space-y-4">
        {data && data.openOverdue > 0 ? (
          <Link
            href="/dashboard/cleaning/history?status=overdue"
            className="block rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-800"
          >
            ⚠ {data.openOverdue} cleaning {data.openOverdue === 1 ? "task is" : "tasks are"} overdue
          </Link>
        ) : null}
        <CleaningMessage
          title="Nothing scheduled for today."
          body="Create a cleaning task or start from a template."
          action={
            <Button asChild>
              <Link href="/dashboard/cleaning/tasks">Manage tasks</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {data.openOverdue > 0 ? (
        <Link
          href="/dashboard/cleaning/history?status=overdue"
          className="block rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-800"
        >
          ⚠ {data.openOverdue} cleaning {data.openOverdue === 1 ? "task is" : "tasks are"} overdue
        </Link>
      ) : data.pending === 0 ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 font-semibold text-emerald-800">
          All cleaning tasks are up to date.
        </div>
      ) : null}

      <div>
        <p className="text-sm text-slate-500">Today · {data.dateLabel}</p>
        <h2 className="text-3xl font-bold text-slate-900">{data.total} Tasks</h2>
        <p className="mt-2 text-sm text-slate-600">
          {data.completed} Completed · {data.pending} Pending · {data.overdue} Overdue
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-800">
          Completion rate: {data.completed} / {data.total}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completed by</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.tasks.map((task) => (
              <TableRow key={task.uuid}>
                <TableCell className="font-medium">{task.taskName}</TableCell>
                <TableCell>{task.areaName}</TableCell>
                <TableCell>{task.dueLabel}</TableCell>
                <TableCell>
                  <StatusPill status={task.status} />
                </TableCell>
                <TableCell>
                  {task.status === "completed"
                    ? `${task.completedByName || "Staff"}${task.completedAtLabel ? ` · ${task.completedAtLabel}` : ""}`
                    : "—"}
                  {task.hasPhoto ? <div className="mt-2"><CleaningPhoto occurrenceId={task.uuid} /></div> : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

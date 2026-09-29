"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CleaningMessage } from "@/components/dashboard/cleaning/CleaningNav"
import { cleaningGet, cleaningSend, cleaningToken } from "@/lib/cleaningApi"

const WEEKDAYS = [
  { iso: 1, label: "Monday" },
  { iso: 2, label: "Tuesday" },
  { iso: 3, label: "Wednesday" },
  { iso: 4, label: "Thursday" },
  { iso: 5, label: "Friday" },
  { iso: 6, label: "Saturday" },
  { iso: 7, label: "Sunday" },
]

type Area = { uuid: string; name: string }
type Task = {
  uuid: string
  name: string
  description?: string | null
  areaId: string
  areaName: string
  frequency: string
  daysOfWeek?: number[] | null
  dayOfMonth?: number | null
  dueTime: string
  dueLabel: string
  isActive: boolean
  scheduleLabel: string
  nextOccurrence?: { label: string } | null
}

const emptyForm = {
  name: "",
  description: "",
  areaId: "",
  frequency: "daily",
  daysOfWeek: [1] as number[],
  dayOfMonth: 1,
  dueTime: "22:00",
  isActive: true,
}

export default function CleaningTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [areaName, setAreaName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const token = cleaningToken()
    if (!token) {
      setError("Please sign in again.")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    try {
      const [taskRes, areaRes] = await Promise.all([
        cleaningGet("/cleaning/tasks", token),
        cleaningGet("/cleaning/areas", token),
      ])
      setTasks(taskRes.data || [])
      setAreas(areaRes.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    const token = cleaningToken()
    if (!token) return
    if (!form.name.trim()) {
      setError("Task name is required.")
      return
    }
    if (!form.areaId) {
      setError("Area is required.")
      return
    }
    if (form.frequency === "weekly" && form.daysOfWeek.length === 0) {
      setError("Choose at least one day.")
      return
    }
    setSaving(true)
    setError("")
    try {
      const body = {
        ...form,
        daysOfWeek: form.frequency === "weekly" ? form.daysOfWeek : null,
        dayOfMonth: form.frequency === "monthly" ? Number(form.dayOfMonth) : null,
      }
      if (editing) await cleaningSend(`/cleaning/tasks/${editing}`, token, "PATCH", body)
      else await cleaningSend("/cleaning/tasks", token, "POST", body)
      setOpen(false)
      setEditing(null)
      setForm(emptyForm)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the task")
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (task: Task) => {
    setEditing(task.uuid)
    setForm({
      name: task.name,
      description: task.description || "",
      areaId: task.areaId,
      frequency: task.frequency,
      daysOfWeek: task.daysOfWeek || [1],
      dayOfMonth: task.dayOfMonth || 1,
      dueTime: task.dueTime,
      isActive: task.isActive,
    })
    setOpen(true)
  }

  const deactivate = async (task: Task) => {
    const token = cleaningToken()
    if (!token) return
    await cleaningSend(`/cleaning/tasks/${task.uuid}`, token, "PATCH", { isActive: !task.isActive })
    await load()
  }

  const remove = async (task: Task) => {
    const token = cleaningToken()
    if (!token) return
    if (!window.confirm("Remove this cleaning task? Completed records are kept.")) return
    await cleaningSend(`/cleaning/tasks/${task.uuid}`, token, "DELETE")
    await load()
  }

  const addArea = async () => {
    const token = cleaningToken()
    if (!token || !areaName.trim()) return
    await cleaningSend("/cleaning/areas", token, "POST", { name: areaName.trim() })
    setAreaName("")
    await load()
  }

  const renameArea = async (area: Area) => {
    const name = window.prompt("Area name", area.name)
    if (!name || !name.trim()) return
    const token = cleaningToken()
    if (!token) return
    await cleaningSend(`/cleaning/areas/${area.uuid}`, token, "PATCH", { name: name.trim() })
    await load()
  }

  const removeArea = async (area: Area) => {
    const token = cleaningToken()
    if (!token) return
    await cleaningSend(`/cleaning/areas/${area.uuid}`, token, "DELETE")
    await load()
  }

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-white/70" />

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <Button
            onClick={() => {
              setEditing(null)
              setForm({ ...emptyForm, areaId: areas[0]?.uuid || "" })
              setOpen(true)
            }}
          >
            New task
          </Button>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {tasks.length === 0 ? (
          <CleaningMessage
            title="No cleaning tasks yet"
            body="Create your first cleaning task or start from a template."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Next</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.uuid}>
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>{task.areaName}</TableCell>
                    <TableCell>
                      <div className="capitalize">{task.frequency}</div>
                      <div className="text-xs text-slate-500">{task.scheduleLabel}</div>
                    </TableCell>
                    <TableCell>{task.dueLabel}</TableCell>
                    <TableCell>{task.nextOccurrence?.label || "—"}</TableCell>
                    <TableCell>{task.isActive ? "Active" : "Inactive"}</TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button size="sm" variant="outline" onClick={() => startEdit(task)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deactivate(task)}>
                        {task.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(task)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {open ? (
          <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-semibold">{editing ? "Edit task" : "New task"}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Task name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Area</Label>
                <select
                  className="h-10 w-full rounded-md border px-3 text-sm"
                  value={form.areaId}
                  onChange={(e) => setForm({ ...form, areaId: e.target.value })}
                >
                  <option value="">Choose an area</option>
                  {areas.map((area) => (
                    <option key={area.uuid} value={area.uuid}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description / instructions</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <select
                  className="h-10 w-full rounded-md border px-3 text-sm"
                  value={form.frequency}
                  onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Due time</Label>
                <Input
                  type="time"
                  value={form.dueTime}
                  onChange={(e) => setForm({ ...form, dueTime: e.target.value })}
                />
              </div>
            </div>
            {form.frequency === "weekly" ? (
              <div className="flex flex-wrap gap-3">
                {WEEKDAYS.map((day) => (
                  <label key={day.iso} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.daysOfWeek.includes(day.iso)}
                      onChange={(e) => {
                        const days = e.target.checked
                          ? [...form.daysOfWeek, day.iso]
                          : form.daysOfWeek.filter((value) => value !== day.iso)
                        setForm({ ...form, daysOfWeek: days })
                      }}
                    />
                    {day.label}
                  </label>
                ))}
              </div>
            ) : null}
            {form.frequency === "monthly" ? (
              <div className="max-w-xs space-y-2">
                <Label>Day of the month</Label>
                <Input
                  type="number"
                  min={1}
                  max={31}
                  value={form.dayOfMonth}
                  onChange={(e) => setForm({ ...form, dayOfMonth: Number(e.target.value) })}
                />
                <p className="text-xs text-slate-500">
                  If that day does not exist, the task runs on the last day of the month.
                </p>
              </div>
            ) : null}
            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={(checked) => setForm({ ...form, isActive: checked })} />
              <span className="text-sm">{form.isActive ? "Active" : "Inactive"}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save task"}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="font-semibold">Areas</h3>
        {areas.map((area) => (
          <div key={area.uuid} className="flex items-center justify-between gap-2 text-sm">
            <span>{area.name}</span>
            <span className="space-x-2">
              <button className="text-purple-700" onClick={() => renameArea(area)}>
                Rename
              </button>
              <button className="text-slate-500" onClick={() => removeArea(area)}>
                Remove
              </button>
            </span>
          </div>
        ))}
        <div className="flex gap-2">
          <Input value={areaName} placeholder="New area" onChange={(e) => setAreaName(e.target.value)} />
          <Button variant="outline" onClick={addArea}>
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CleaningMessage } from "@/components/dashboard/cleaning/CleaningNav"
import { cleaningGet, cleaningSend, cleaningToken } from "@/lib/cleaningApi"

type Area = { uuid: string; name: string }
type TemplateTask = {
  key: string
  name: string
  description: string
  frequency: string
  daysOfWeek?: number[]
  dayOfMonth?: number
  dueTime: string
  suggestedArea: string
  selected: boolean
  areaId: string
}
type Template = {
  id: string
  name: string
  description: string
  tasks: TemplateTask[]
}

export default function CleaningTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [active, setActive] = useState<Template | null>(null)
  const [rows, setRows] = useState<TemplateTask[]>([])
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const token = cleaningToken()
    if (!token) return
    Promise.all([cleaningGet("/cleaning/templates", token), cleaningGet("/cleaning/areas", token)])
      .then(([templateRes, areaRes]) => {
        setTemplates(templateRes.data || [])
        setAreas(areaRes.data || [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const openTemplate = (template: Template) => {
    setActive(template)
    setMessage("")
    setRows(
      template.tasks.map((task) => {
        const match = areas.find((area) => area.name === task.suggestedArea) || areas[0]
        return { ...task, selected: true, areaId: match?.uuid || "" }
      })
    )
  }

  const addSelected = async () => {
    const token = cleaningToken()
    if (!token || !active) return
    const selected = rows.filter((row) => row.selected)
    if (selected.length === 0) {
      setError("Select at least one task.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await cleaningSend(`/cleaning/templates/${active.id}/import`, token, "POST", {
        tasks: selected.map((row) => ({
          name: row.name,
          description: row.description,
          areaId: row.areaId,
          frequency: row.frequency,
          daysOfWeek: row.daysOfWeek || null,
          dayOfMonth: row.dayOfMonth || null,
          dueTime: row.dueTime,
          isActive: true,
        })),
      })
      setMessage("Selected tasks were added. You can edit them from Tasks.")
      setActive(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the tasks")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-white/70" />
  if (error && templates.length === 0) {
    return <CleaningMessage title="Could not load templates" body={error} />
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        These are starter templates, not legal requirements. Nothing is added until you confirm.
      </p>
      {message ? <p className="text-sm font-medium text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!active ? (
        <div className="grid gap-4 md:grid-cols-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => openTemplate(template)}
              className="rounded-2xl bg-white p-5 text-left shadow-sm"
            >
              <h2 className="font-semibold">{template.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{template.description}</p>
              <p className="mt-3 text-sm font-medium text-purple-700">{template.tasks.length} tasks</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">{active.name}</h2>
          {rows.map((row, index) => (
            <div key={row.key} className="grid items-center gap-3 border-t py-3 md:grid-cols-[auto_1fr_180px_140px]">
              <input
                type="checkbox"
                checked={row.selected}
                onChange={(e) => {
                  const next = [...rows]
                  next[index] = { ...row, selected: e.target.checked }
                  setRows(next)
                }}
              />
              <Input
                value={row.name}
                onChange={(e) => {
                  const next = [...rows]
                  next[index] = { ...row, name: e.target.value }
                  setRows(next)
                }}
              />
              <select
                className="h-10 rounded-md border px-3 text-sm"
                value={row.areaId}
                onChange={(e) => {
                  const next = [...rows]
                  next[index] = { ...row, areaId: e.target.value }
                  setRows(next)
                }}
              >
                {areas.map((area) => (
                  <option key={area.uuid} value={area.uuid}>
                    {area.name}
                  </option>
                ))}
              </select>
              <Input
                type="time"
                value={row.dueTime}
                onChange={(e) => {
                  const next = [...rows]
                  next[index] = { ...row, dueTime: e.target.value }
                  setRows(next)
                }}
              />
            </div>
          ))}
          <div className="flex gap-2">
            <Button onClick={addSelected} disabled={saving}>
              {saving ? "Adding…" : "Add selected tasks"}
            </Button>
            <Button variant="outline" onClick={() => setActive(null)}>
              Back
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

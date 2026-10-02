"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { complianceGet, complianceSend, complianceToken } from "@/lib/complianceApi"

type Item = {
  uuid: string
  name: string
  operatingTarget: number | null
  criticalLimit: number | null
  timesPerDay: number
  isActive: boolean
}

type Unit = {
  uuid: string
  name: string
  equipmentType: string
  location: string
  operatingTarget: number | null
  criticalLimit: number
  timesPerDay: number
  isActive: boolean
  notes: string
  items?: Item[]
}

const TYPES = [
  { id: "fridge", label: "Fridge" },
  { id: "walk_in", label: "Walk-in fridge" },
  { id: "display", label: "Display or sandwich unit" },
  { id: "freezer", label: "Freezer" },
  { id: "other", label: "Other" },
]

const TYPE_LABELS = Object.fromEntries(TYPES.map((type) => [type.id, type.label]))

const empty = { name: "", equipmentType: "fridge", location: "", timesPerDay: "", operatingTarget: "", criticalLimit: "", notes: "" }

export default function EquipmentPage() {
  const [rows, setRows] = useState<Unit[]>([])
  const [form, setForm] = useState(empty)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const load = () => {
    const token = complianceToken()
    if (!token) return
    complianceGet("/compliance/equipment", token)
      .then((response) => setRows(response.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    const token = complianceToken()
    if (!token) return
    setError("")
    try {
      await complianceSend("/compliance/equipment", token, "POST", {
        name: form.name,
        equipmentType: form.equipmentType,
        location: form.location,
        notes: form.notes,
        ...(form.timesPerDay ? { timesPerDay: Number(form.timesPerDay) } : {}),
        ...(form.operatingTarget !== "" ? { operatingTarget: form.operatingTarget } : {}),
        ...(form.criticalLimit !== "" ? { criticalLimit: form.criticalLimit } : {}),
      })
      setForm(empty)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add equipment")
    }
  }

  const toggle = async (unit: Unit) => {
    const token = complianceToken()
    if (!token) return
    await complianceSend(`/compliance/equipment/${unit.uuid}`, token, "PATCH", { isActive: !unit.isActive })
    load()
  }

  if (loading) return <div className="h-40 animate-pulse rounded-2xl bg-white/70" />

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Add equipment</h2>
        <input className="h-10 w-full rounded-md border px-3 text-sm" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="h-10 w-full rounded-md border px-3 text-sm" value={form.equipmentType} onChange={(e) => setForm({ ...form, equipmentType: e.target.value })}>
          {TYPES.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
        </select>
        <input className="h-10 w-full rounded-md border px-3 text-sm" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="h-10 w-full rounded-md border px-3 text-sm" placeholder="Checks per day" value={form.timesPerDay} onChange={(e) => setForm({ ...form, timesPerDay: e.target.value })} />
        <input className="h-10 w-full rounded-md border px-3 text-sm" placeholder="Operating target °C, optional" value={form.operatingTarget} onChange={(e) => setForm({ ...form, operatingTarget: e.target.value })} />
        <input className="h-10 w-full rounded-md border px-3 text-sm" placeholder="Critical limit °C, optional" value={form.criticalLimit} onChange={(e) => setForm({ ...form, criticalLimit: e.target.value })} />
        <input className="h-10 w-full rounded-md border px-3 text-sm" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button onClick={save}>Add</Button>
        <p className="text-xs text-slate-500">Leave the limits blank to use the safe-method defaults. A fridge starts at twice a day. A freezer starts at once a day. A display or sandwich unit is the cabinet. Add each cambro on that unit after you save it.</p>
      </div>
      <div className="space-y-3">
        {rows.map((unit) => (
          <div key={unit.uuid} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{unit.name}</p>
                <p className="text-sm text-slate-500">
                  {TYPE_LABELS[unit.equipmentType] || unit.equipmentType} · {unit.timesPerDay} a day · limit {unit.criticalLimit} °C
                  {unit.operatingTarget != null ? ` · target ${unit.operatingTarget} °C` : ""}
                  {unit.location ? ` · ${unit.location}` : ""}
                </p>
              </div>
              <Button variant="outline" onClick={() => toggle(unit)}>{unit.isActive ? "Retire" : "Restore"}</Button>
            </div>
            {unit.equipmentType === "display" ? <DisplayItems unit={unit} onChange={load} /> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function DisplayItems({ unit, onChange }: { unit: Unit; onChange: () => void }) {
  const [name, setName] = useState("")
  const [timesPerDay, setTimesPerDay] = useState("")
  const [operatingTarget, setOperatingTarget] = useState("")
  const [criticalLimit, setCriticalLimit] = useState("")
  const [error, setError] = useState("")
  const items = unit.items || []

  const add = async () => {
    const token = complianceToken()
    if (!token || !name.trim()) return
    setError("")
    try {
      await complianceSend(`/compliance/equipment/${unit.uuid}/items`, token, "POST", {
        name,
        ...(timesPerDay ? { timesPerDay: Number(timesPerDay) } : {}),
        ...(operatingTarget !== "" ? { operatingTarget } : {}),
        ...(criticalLimit !== "" ? { criticalLimit } : {}),
      })
      setName("")
      setTimesPerDay("")
      setOperatingTarget("")
      setCriticalLimit("")
      onChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add this item")
    }
  }

  const toggle = async (item: Item) => {
    const token = complianceToken()
    if (!token) return
    setError("")
    try {
      await complianceSend(`/compliance/equipment/${unit.uuid}/items/${item.uuid}`, token, "PATCH", { isActive: !item.isActive })
      onChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this item")
    }
  }

  return (
    <div className="mt-4 border-t pt-4">
      <p className="text-sm font-semibold text-slate-900">Food on this unit</p>
      <p className="mt-1 text-xs text-slate-500">Each cambro is probed on its own. Leave checks blank for four times a day. Leave the temperatures blank to use this unit’s limit. Staff record these on the phone.</p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.uuid} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-sm text-slate-700">
              {item.name} · {item.timesPerDay} a day
              {item.criticalLimit != null ? ` · limit ${item.criticalLimit} °C` : " · unit limit"}
              {item.operatingTarget != null ? ` · target ${item.operatingTarget} °C` : ""}
              {item.isActive ? "" : " · retired"}
            </p>
            <Button variant="outline" onClick={() => toggle(item)}>{item.isActive ? "Retire" : "Restore"}</Button>
          </div>
        ))}
        {items.length === 0 ? <p className="text-sm text-slate-500">No food added yet.</p> : null}
      </div>
      {unit.isActive ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <input className="h-10 rounded-md border px-3 text-sm" placeholder="Item, such as pepperoni" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="h-10 rounded-md border px-3 text-sm" placeholder="Checks per day" value={timesPerDay} onChange={(e) => setTimesPerDay(e.target.value)} />
          <input className="h-10 rounded-md border px-3 text-sm" placeholder="Operating target °C, optional" value={operatingTarget} onChange={(e) => setOperatingTarget(e.target.value)} />
          <input className="h-10 rounded-md border px-3 text-sm" placeholder="Critical limit °C, optional" value={criticalLimit} onChange={(e) => setCriticalLimit(e.target.value)} />
          {error ? <p className="text-sm text-red-600 sm:col-span-2">{error}</p> : null}
          <Button className="sm:col-span-2 w-fit" onClick={add}>Add item</Button>
        </div>
      ) : null}
    </div>
  )
}

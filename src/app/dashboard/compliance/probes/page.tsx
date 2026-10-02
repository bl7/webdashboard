"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { complianceGet, complianceSend, complianceToken } from "@/lib/complianceApi"

type Probe = {
  uuid: string
  name: string
  makeModel: string
  serial: string
  intervalDays: number
  isActive: boolean
  due: boolean
  last: { iceC: number; boilC: number; result: string; recordedAtLabel: string } | null
}

export default function ProbesPage() {
  const [rows, setRows] = useState<Probe[]>([])
  const [name, setName] = useState("")
  const [makeModel, setMakeModel] = useState("")
  const [serial, setSerial] = useState("")
  const [intervalDays, setIntervalDays] = useState("30")
  const [error, setError] = useState("")

  const load = () => {
    const token = complianceToken()
    if (!token) return
    complianceGet("/compliance/probes", token)
      .then((response) => setRows(response.data || []))
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    const token = complianceToken()
    if (!token) return
    setError("")
    try {
      await complianceSend("/compliance/probes", token, "POST", {
        name,
        makeModel,
        serial,
        intervalDays: Number(intervalDays),
      })
      setName("")
      setMakeModel("")
      setSerial("")
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add probe")
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-4">
        <input className="h-10 rounded-md border px-3 text-sm" placeholder="Probe name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="h-10 rounded-md border px-3 text-sm" placeholder="Make and model" value={makeModel} onChange={(e) => setMakeModel(e.target.value)} />
        <input className="h-10 rounded-md border px-3 text-sm" placeholder="Serial" value={serial} onChange={(e) => setSerial(e.target.value)} />
        <input className="h-10 rounded-md border px-3 text-sm" placeholder="Days between checks" value={intervalDays} onChange={(e) => setIntervalDays(e.target.value)} />
        <Button onClick={save}>Add probe</Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {rows.map((probe) => (
        <div key={probe.uuid} className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="font-semibold">{probe.name} {probe.due ? "· check due" : ""}</p>
          <p className="text-sm text-slate-500">{probe.makeModel} {probe.serial} · every {probe.intervalDays} days</p>
          <p className="text-sm text-slate-600">
            {probe.last ? `Last ice ${probe.last.iceC} °C, boil ${probe.last.boilC} °C, ${probe.last.result}, ${probe.last.recordedAtLabel}` : "No check yet. Staff record ice and boiling on the phone."}
          </p>
        </div>
      ))}
    </div>
  )
}

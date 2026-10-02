"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ComplianceMessage } from "@/components/dashboard/compliance/ComplianceNav"
import { complianceGet, complianceToken } from "@/lib/complianceApi"

type Slot = {
  slotIndex: number
  label: string
  status: string
  reading: { valueC: number; result: string; resultLabel: string; recordedBy: string; recordedAtLabel: string } | null
}

type HeldItem = {
  uuid: string
  name: string
  slots: Slot[]
}

type Today = {
  dateLabel: string
  overdue: number
  openFails: number
  equipment: Array<{ uuid: string; name: string; equipmentType: string; slots: Slot[]; items?: HeldItem[] }>
  food: Array<{ uuid: string; dishName: string; process: string; result: string; resultLabel: string; valueC: number | null; finalValue: number | null }>
  deliveries: Array<{ uuid: string; supplier: string; product: string; valueC: number; decision: string; result: string }>
  signoff: { signedBy: string; recordedBy: string; problems: string } | null
}

const statusText: Record<string, string> = {
  done: "Done",
  due: "Due",
  overdue: "Overdue",
  missed: "Missed",
}

export default function ComplianceTodayPage() {
  const [data, setData] = useState<Today | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const load = () => {
    const token = complianceToken()
    if (!token) {
      setError("Please sign in again.")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    complianceGet("/compliance/today", token)
      .then((response) => setData(response.data))
      .catch((err) => setError(err.message || "Could not load temperature records"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-white/70" />
  if (error) {
    return <ComplianceMessage title="Could not load today’s temperature records" body={error} action={<Button onClick={load}>Retry</Button>} />
  }
  if (!data || data.equipment.length === 0) {
    return (
      <ComplianceMessage
        title="This kitchen has no fridges or freezers yet."
        body="Add them here. After that, staff record the temperatures on the phone and they show up on this page."
        action={<Button asChild><Link href="/dashboard/compliance/equipment">Add equipment</Link></Button>}
      />
    )
  }

  const open = data.equipment.flatMap((unit) => [
    ...unit.slots
      .filter((slot) => slot.status !== "done")
      .map((slot) => ({ key: `${unit.uuid}-${slot.slotIndex}`, unit: unit.name, slot })),
    ...(unit.items || []).flatMap((item) =>
      item.slots
        .filter((slot) => slot.status !== "done")
        .map((slot) => ({ key: `${item.uuid}-${slot.slotIndex}`, unit: `${unit.name}, ${item.name}`, slot }))
    ),
  ])
  const attention = [...new Set(data.equipment.flatMap((unit) => [
    ...unit.slots.filter((slot) => slot.reading?.result === "attention").map(() => unit.name),
    ...(unit.items || []).flatMap((item) =>
      item.slots.filter((slot) => slot.reading?.result === "attention").map(() => `${unit.name} ${item.name}`)
    ),
  ]))]
  const headline =
    open.length > 0
      ? `${open.length} still to record on the phone.`
      : data.signoff
        ? "Today is recorded and signed off."
        : "Temperatures are in. The day is not signed off yet."

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">{data.dateLabel}</h2>
        <p className="mt-1 text-lg text-slate-700">{headline}</p>
      </div>
      {open.length > 0 ? (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="font-semibold text-slate-900">Still to record</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {open.map(({ key, unit, slot }) => (
              <li key={key}>
                {`${unit}, ${slot.label.toLowerCase()}${slot.status === "overdue" ? " · late" : ""}`}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {attention.length > 0 || data.openFails > 0 || !data.signoff ? (
        <p className="text-sm text-slate-600">
          {attention.length > 0 ? `${attention.join(", ")} ${attention.length === 1 ? "is" : "are"} above the usual target and still legal. ` : ""}
          {data.openFails > 0 ? `${data.openFails} failed ${data.openFails === 1 ? "reading is" : "readings are"} still open. ` : ""}
          {data.signoff ? `Signed by ${data.signoff.signedBy}.` : "Nobody has signed the day off."}
        </p>
      ) : null}
      <div className="space-y-3">
        <p className="font-semibold text-slate-900">Recorded</p>
        {data.equipment.map((unit) => (
          <div key={unit.uuid} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="font-semibold text-slate-900">{unit.name}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {unit.slots.map((slot) => (
                <div key={slot.slotIndex} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <p className="font-medium">{slot.label} · {statusText[slot.status] || slot.status}</p>
                  <p className="text-slate-600">
                    {slot.reading
                      ? `${slot.reading.valueC} °C · ${slot.reading.result === "attention" ? "Attention" : slot.reading.result === "fail" ? "Fail" : "Pass"} · ${slot.reading.recordedBy} · ${slot.reading.recordedAtLabel}`
                      : "Not recorded yet."}
                  </p>
                </div>
              ))}
            </div>
            {unit.equipmentType === "display" ? (
              <div className="mt-3 space-y-2">
                {(unit.items || []).length === 0 ? (
                  <p className="text-sm text-slate-500">No food is set up on this unit. Add each cambro under Equipment. Staff probe those on the phone.</p>
                ) : (unit.items || []).map((item) => (
                  <div key={item.uuid}>
                    <p className="text-sm font-medium text-slate-800">{item.name}</p>
                    <div className="mt-1 grid gap-2 sm:grid-cols-2">
                      {item.slots.map((slot) => (
                        <div key={slot.slotIndex} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                          <p className="font-medium">{slot.label} · {statusText[slot.status] || slot.status}</p>
                          <p className="text-slate-600">
                            {slot.reading
                              ? `${slot.reading.valueC} °C · ${slot.reading.result === "attention" ? "Attention" : slot.reading.result === "fail" ? "Fail" : "Pass"} · ${slot.reading.recordedBy} · ${slot.reading.recordedAtLabel}`
                              : "Not recorded yet."}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {data.food.length > 0 ? (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="font-semibold">Food checks</p>
          {data.food.map((row) => (
            <p key={row.uuid} className="mt-2 text-sm text-slate-700">
              {row.dishName} · {row.process.replace("_", " ")} · {row.resultLabel}
              {row.valueC != null ? ` · ${row.valueC} °C` : ""}
              {row.finalValue != null ? ` · final ${row.finalValue} °C` : ""}
            </p>
          ))}
        </div>
      ) : null}
      {data.deliveries.length > 0 ? (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="font-semibold">Deliveries</p>
          {data.deliveries.map((row) => (
            <p key={row.uuid} className="mt-2 text-sm text-slate-700">
              {row.supplier} · {row.product} · {row.valueC} °C · {row.decision} · {row.result}
            </p>
          ))}
        </div>
      ) : null}
      <div className="rounded-2xl bg-white p-4 text-sm text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">Sign-off</p>
        <p className="mt-1">
          {data.signoff
            ? `${data.signoff.signedBy} signed. ${data.signoff.recordedBy} recorded the day. ${data.signoff.problems}`
            : "Still open. Someone on the phone signs this when the day is finished."}
        </p>
      </div>
    </div>
  )
}

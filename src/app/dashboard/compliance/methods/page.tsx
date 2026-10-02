"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { complianceGet, complianceSend, complianceToken } from "@/lib/complianceApi"

type Option = { temp: number; seconds: number; label: string }
type Method = { id: string; label: string }

export default function MethodsPage() {
  const [timezone, setTimezone] = useState("Europe/London")
  const [chillTarget, setChillTarget] = useState("5")
  const [chillCritical, setChillCritical] = useState("8")
  const [frozenCritical, setFrozenCritical] = useState("-18")
  const [cook, setCook] = useState("75:30")
  const [reheat, setReheat] = useState("75:30")
  const [hotHoldMin, setHotHoldMin] = useState("63")
  const [interval, setInterval] = useState("120")
  const [coolingMethod, setCoolingMethod] = useState("shallow")
  const [coolingMaxMinutes, setCoolingMaxMinutes] = useState("120")
  const [coolingFinalMax, setCoolingFinalMax] = useState("8")
  const [pin, setPin] = useState("")
  const [pinSet, setPinSet] = useState(false)
  const [cookOptions, setCookOptions] = useState<Option[]>([])
  const [methods, setMethods] = useState<Method[]>([])
  const [error, setError] = useState("")
  const [saved, setSaved] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = complianceToken()
    if (!token) return
    complianceGet("/compliance/settings", token)
      .then((response) => {
        const data = response.data
        setTimezone(data.timezone)
        setChillTarget(String(data.chillTarget))
        setChillCritical(String(data.chillCritical))
        setFrozenCritical(String(data.frozenCritical))
        setCook(`${data.cookTemp}:${data.cookSeconds}`)
        setReheat(`${data.reheatTemp}:${data.reheatSeconds}`)
        setHotHoldMin(String(data.hotHoldMin))
        setInterval(String(data.hotHoldIntervalMinutes))
        setCoolingMethod(data.coolingMethod)
        setCoolingMaxMinutes(String(data.coolingMaxMinutes))
        setCoolingFinalMax(String(data.coolingFinalMax))
        setPinSet(data.pinSet)
        setCookOptions(data.cookOptions || [])
        setMethods(data.coolingMethods || [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    const token = complianceToken()
    if (!token) return
    setError("")
    setSaved("")
    const [cookTemp, cookSeconds] = cook.split(":").map(Number)
    const [reheatTemp, reheatSeconds] = reheat.split(":").map(Number)
    try {
      await complianceSend("/compliance/settings", token, "PATCH", {
        timezone,
        chillTarget: Number(chillTarget),
        chillCritical: Number(chillCritical),
        frozenCritical: Number(frozenCritical),
        cookTemp,
        cookSeconds,
        reheatTemp,
        reheatSeconds,
        hotHoldMin: Number(hotHoldMin),
        hotHoldIntervalMinutes: Number(interval),
        coolingMethod,
        coolingMaxMinutes: Number(coolingMaxMinutes),
        coolingFinalMax: Number(coolingFinalMax),
        ...(pin ? { pin } : {}),
      })
      setPin("")
      setSaved("Safe methods saved.")
      if (pin) setPinSet(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save")
    }
  }

  if (loading) return <div className="h-40 animate-pulse rounded-2xl bg-white/70" />

  return (
    <div className="max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        5 °C is the operating target for chilled food. 8 °C is the legal maximum. A reading between them is a pass with attention, not a fail.
      </p>
      <label className="block text-sm font-medium">Timezone
        <input className="mt-1 h-10 w-full rounded-md border px-3" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
      </label>
      <div className="grid grid-cols-3 gap-3">
        <label className="text-sm">Chill target<input className="mt-1 h-10 w-full rounded-md border px-3" value={chillTarget} onChange={(e) => setChillTarget(e.target.value)} /></label>
        <label className="text-sm">Chill limit<input className="mt-1 h-10 w-full rounded-md border px-3" value={chillCritical} onChange={(e) => setChillCritical(e.target.value)} /></label>
        <label className="text-sm">Frozen limit<input className="mt-1 h-10 w-full rounded-md border px-3" value={frozenCritical} onChange={(e) => setFrozenCritical(e.target.value)} /></label>
      </div>
      <label className="block text-sm font-medium">Cooking target
        <select className="mt-1 h-10 w-full rounded-md border px-3" value={cook} onChange={(e) => setCook(e.target.value)}>
          {cookOptions.map((option) => <option key={option.label} value={`${option.temp}:${option.seconds}`}>{option.label}</option>)}
        </select>
      </label>
      <label className="block text-sm font-medium">Reheating target
        <select className="mt-1 h-10 w-full rounded-md border px-3" value={reheat} onChange={(e) => setReheat(e.target.value)}>
          {cookOptions.map((option) => <option key={option.label} value={`${option.temp}:${option.seconds}`}>{option.label}</option>)}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">Hot hold minimum<input className="mt-1 h-10 w-full rounded-md border px-3" value={hotHoldMin} onChange={(e) => setHotHoldMin(e.target.value)} /></label>
        <label className="text-sm">Hot hold interval, minutes<input className="mt-1 h-10 w-full rounded-md border px-3" value={interval} onChange={(e) => setInterval(e.target.value)} /></label>
      </div>
      <label className="block text-sm font-medium">Cooling method
        <select className="mt-1 h-10 w-full rounded-md border px-3" value={coolingMethod} onChange={(e) => setCoolingMethod(e.target.value)}>
          {methods.map((method) => <option key={method.id} value={method.id}>{method.label}</option>)}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">Cooling max minutes<input className="mt-1 h-10 w-full rounded-md border px-3" value={coolingMaxMinutes} onChange={(e) => setCoolingMaxMinutes(e.target.value)} /></label>
        <label className="text-sm">Cooling final max °C<input className="mt-1 h-10 w-full rounded-md border px-3" value={coolingFinalMax} onChange={(e) => setCoolingFinalMax(e.target.value)} /></label>
      </div>
      <label className="block text-sm font-medium">Supervisor PIN {pinSet ? "(already set)" : ""}
        <input className="mt-1 h-10 w-full rounded-md border px-3" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="4 to 6 digits" />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-emerald-700">{saved}</p> : null}
      <Button onClick={save}>Save safe methods</Button>
    </div>
  )
}

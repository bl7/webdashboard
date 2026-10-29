"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { complianceGet, complianceSend, complianceToken } from "@/lib/complianceApi"
import { cleaningGet, cleaningSend, cleaningToken } from "@/lib/cleaningApi"

type Option = { temp: number; seconds: number; label: string }
type Method = { id: string; label: string }

const TIMEZONES = [
  "Europe/London",
  "Europe/Dublin",
  "Europe/Paris",
  "Europe/Lisbon",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney",
  "UTC",
]

export default function ComplianceSettingsPage() {
  return (
    <div className="max-w-xl space-y-6">
      <SignOffPin />
      <SafeMethods />
      <DiaryEmail />
    </div>
  )
}

function SignOffPin() {
  const [pin, setPin] = useState("")
  const [pinSet, setPinSet] = useState(false)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = complianceToken()
    if (!token) return
    complianceGet("/compliance/settings", token)
      .then((response) => setPinSet(Boolean(response.data.pinSet)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    const token = complianceToken()
    if (!token) return
    setError("")
    setSaved("")
    if (!/^\d{4,6}$/.test(pin)) {
      setError("Use 4 to 6 digits.")
      return
    }
    try {
      await complianceSend("/compliance/settings", token, "PATCH", { pin })
      setPin("")
      setPinSet(true)
      setSaved("Sign-off PIN saved.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the PIN")
    }
  }

  if (loading) return <div className="h-40 animate-pulse rounded-2xl bg-white/70" />

  return (
    <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">Sign-off PIN</h2>
        <p className="mt-1 text-sm text-slate-500">
          The person who signs the day off enters this on the phone. It is not the dashboard admin PIN.
          {pinSet ? " A PIN is already set. Enter a new one to replace it." : " No PIN is set yet, so the phone cannot sign the day off."}
        </p>
      </div>
      <label className="block text-sm font-medium">
        PIN
        <input
          className="mt-1 h-10 w-full rounded-md border px-3"
          value={pin}
          inputMode="numeric"
          autoComplete="off"
          placeholder="4 to 6 digits"
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-emerald-700">{saved}</p> : null}
      <Button onClick={save}>Save sign-off PIN</Button>
    </div>
  )
}

function SafeMethods() {
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
      })
      setSaved("Safe methods saved.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save")
    }
  }

  if (loading) return <div className="h-40 animate-pulse rounded-2xl bg-white/70" />

  return (
    <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">Safe methods</h2>
        <p className="mt-1 text-sm text-slate-500">
          5 °C is the operating target for chilled food. 8 °C is the legal maximum. A reading between them is a pass with attention, not a fail. Staff do not change these on the phone.
        </p>
      </div>
      <label className="block text-sm font-medium">Kitchen timezone
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
          {cookOptions.map((option) => <option key={`reheat-${option.label}`} value={`${option.temp}:${option.seconds}`}>{option.label}</option>)}
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
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-emerald-700">{saved}</p> : null}
      <Button onClick={save}>Save safe methods</Button>
    </div>
  )
}

function DiaryEmail() {
  const [enabled, setEnabled] = useState(true)
  const [timezone, setTimezone] = useState("Europe/London")
  const [sendTime, setSendTime] = useState("23:00")
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [saved, setSaved] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = cleaningToken()
    if (!token) return
    cleaningGet("/cleaning/settings", token)
      .then((response) => {
        setEnabled(response.data.overdueEmailEnabled !== false && response.data.overdueEmailEnabled !== 0 && response.data.overdueEmailEnabled !== "0")
        setTimezone(response.data.timezone)
        setSendTime(response.data.diaryEmailTime || "23:00")
        setNote(response.data.defaults?.note || "")
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    const token = cleaningToken()
    if (!token) return
    setError("")
    setSaved("")
    try {
      await cleaningSend("/cleaning/settings", token, "PATCH", {
        overdueEmailEnabled: enabled,
        timezone,
        diaryEmailTime: sendTime,
      })
      setSaved("Diary email saved.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings")
    }
  }

  if (loading) return <div className="h-40 animate-pulse rounded-2xl bg-white/70" />

  const zones = TIMEZONES.includes(timezone) ? TIMEZONES : [timezone, ...TIMEZONES]

  return (
    <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">End of day email</h2>
        <p className="mt-1 text-sm text-slate-500">
          One email at the time you choose. It lists temperatures, checklist lines, and cleaning tasks still not done, and attaches that day’s full diary.
        </p>
      </div>
      <label className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">Email the end-of-day diary</span>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium">Send time</span>
        <input
          type="time"
          className="h-10 w-full rounded-md border px-3 text-sm"
          value={sendTime}
          onChange={(e) => setSendTime(e.target.value)}
        />
      </label>
      <div className="space-y-2">
        <p className="text-sm font-medium">Email timezone</p>
        <select
          className="h-10 w-full rounded-md border px-3 text-sm"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500">
          Due times such as 10:00 PM use this timezone. The default is Europe/London.
        </p>
      </div>
      {note ? <p className="text-xs text-slate-500">{note}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-emerald-700">{saved}</p> : null}
      <Button onClick={save}>Save diary email</Button>
    </div>
  )
}

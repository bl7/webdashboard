"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cleaningGet, cleaningSend, cleaningToken } from "@/lib/cleaningApi"

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

export default function CleaningSettingsPage() {
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
        setEnabled(response.data.overdueEmailEnabled)
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
      setSaved("Cleaning settings saved.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings")
    }
  }

  if (loading) return <div className="h-40 animate-pulse rounded-2xl bg-white/70" />

  const zones = TIMEZONES.includes(timezone) ? TIMEZONES : [timezone, ...TIMEZONES]

  return (
    <div className="max-w-xl space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">End of day email</h2>
        <p className="mt-1 text-sm text-slate-500">
          One email at the time you choose, in the business timezone. It lists temperatures, checklist lines, and cleaning tasks still not done, and attaches that day’s full diary.
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
        <p className="text-xs text-slate-500">
          Kitchens close at different times. The diary email goes out once, at this time.
        </p>
      </label>
      <div className="space-y-2">
        <p className="text-sm font-medium">Business timezone</p>
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
      <Button onClick={save}>Save settings</Button>
    </div>
  )
}

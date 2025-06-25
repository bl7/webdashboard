"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Plus, X, CheckCircle2, AlertTriangle } from "lucide-react"

const labelTypes = [
  { label: "Cooked", key: "cooked" },
  { label: "Prep", key: "prep" },
  { label: "PPDS", key: "ppds" },
]

export default function Settings() {
  const [expiryDays, setExpiryDays] = useState<Record<string, string>>({})
  const [customInitials, setCustomInitials] = useState<string[]>([])
  const [useInitials, setUseInitials] = useState<boolean>(true)
  const [newInitial, setNewInitial] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  const [feedbackMsg, setFeedbackMsg] = useState<string>("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const feedbackTimeout = useRef<NodeJS.Timeout | null>(null)

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userid") || "test-user" : "test-user"

  const showFeedback = (msg: string, type: "success" | "error" = "success") => {
    setFeedbackMsg(msg)
    setFeedbackType(type)
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current)
    feedbackTimeout.current = setTimeout(() => {
      setFeedbackMsg("")
      setFeedbackType("")
    }, 3000)
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [settingsRes, initialsRes] = await Promise.all([
          fetch(`/api/label-settings?user_id=${userId}`),
          fetch(`/api/label-initials?user_id=${userId}`),
        ])

        const settingsData = await settingsRes.json()
        const initialsData = await initialsRes.json()

        const expiryMap = Object.fromEntries(
          (settingsData.settings || []).map((item: any) => [
            item.label_type,
            item.expiry_days.toString(),
          ])
        )
        setExpiryDays(expiryMap)
        setUseInitials(initialsData.use_initials)
        setCustomInitials(initialsData.initials || [])
      } catch (err) {
        console.error("Failed to load settings:", err)
        showFeedback("Failed to load settings", "error")
      }
    }

    fetchSettings()
  }, [userId])

  const handleChange = (type: string, value: string) => {
    setExpiryDays((prev) => ({ ...prev, [type]: value }))
  }

  // Helper to sync initials with backend immediately
  const saveInitials = async (initials: string[], useInitialsVal: boolean) => {
    try {
      const res = await fetch("/api/label-initials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          use_initials: useInitialsVal,
          initials,
        }),
      })
      if (res.ok) {
        showFeedback("Initials updated", "success")
      } else {
        showFeedback("Failed to update initials", "error")
      }
    } catch (error) {
      console.error("Failed to update initials:", error)
      showFeedback("Failed to update initials", "error")
    }
  }

  const handleAddInitial = () => {
    const trimmed = newInitial.trim().toUpperCase()
    if (!trimmed) {
      showFeedback("Initial cannot be empty", "error")
      return
    }
    if (customInitials.includes(trimmed)) {
      showFeedback(`Initial "${trimmed}" already added`, "error")
      return
    }
    const updatedInitials = [...customInitials, trimmed]
    setCustomInitials(updatedInitials)
    setNewInitial("")
    saveInitials(updatedInitials, useInitials)
  }

  const handleRemoveInitial = (initial: string) => {
    const updatedInitials = customInitials.filter((i) => i !== initial)
    setCustomInitials(updatedInitials)
    saveInitials(updatedInitials, useInitials)
  }

  // When toggling useInitials switch, update backend immediately too
  const handleToggleUseInitials = (checked: boolean) => {
    setUseInitials(checked)
    saveInitials(customInitials, checked)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const expiryPayload = labelTypes.map(({ key }) => ({
      label_type: key,
      expiry_days: Number(expiryDays[key] || "0"),
    }))

    try {
      const res = await fetch("/api/label-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, settings: expiryPayload }),
      })

      if (res.ok) {
        showFeedback("Expiry settings saved successfully", "success")
      } else {
        showFeedback(`Failed to save expiry settings (${res.status})`, "error")
      }
    } catch (error) {
      console.error("Failed to save expiry settings:", error)
      showFeedback("Failed to save expiry settings", "error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Label Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-10 p-6">
        {/* Expiry Days Settings */}
        <section className="rounded-lg bg-muted/40 p-6">
          <h2 className="mb-4 text-lg font-semibold">Label Type Expiry Settings (in days)</h2>
          <div className="space-y-4">
            {labelTypes.map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <Label>{label}</Label>
                <Input
                  type="number"
                  placeholder="Days"
                  value={expiryDays[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-32"
                  min={0}
                />
              </div>
            ))}
          </div>
          <Button onClick={handleSave} className="mt-6" disabled={isSaving}>
            {isSaving ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Save Expiry Settings
              </>
            )}
          </Button>
        </section>

        {/* Divider */}
        <div className="border-t border-muted" />

        {/* Label Initials Section */}
        <section className="rounded-lg bg-muted/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Label Initials</h2>
            <div className="flex items-center gap-2">
              <Label>Use Initials</Label>
              <Switch checked={useInitials} onCheckedChange={handleToggleUseInitials} />
            </div>
          </div>
          {useInitials && (
            <>
              <div className="mb-4 flex items-center gap-4">
                <Input
                  value={newInitial}
                  onChange={(e) => setNewInitial(e.target.value)}
                  placeholder="Enter Initial (e.g., CH)"
                  className="w-40"
                  maxLength={10}
                />
                <Button variant="outline" onClick={handleAddInitial}>
                  <Plus className="mr-1 h-4 w-4" /> Add Initial
                </Button>
              </div>
              {/* Display current initials */}
              <div className="flex flex-wrap gap-2">
                {customInitials.length === 0 && (
                  <span className="text-sm text-muted-foreground">No initials added yet.</span>
                )}
                {customInitials.map((initial) => (
                  <span
                    key={initial}
                    className="inline-flex items-center rounded-full border border-muted-foreground bg-white px-3 py-1 text-sm text-foreground shadow-sm transition hover:bg-red-50"
                  >
                    {initial}
                    <X
                      className="ml-2 h-4 w-4 cursor-pointer text-muted-foreground transition hover:text-red-500"
                      onClick={() => handleRemoveInitial(initial)}
                    />
                  </span>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Feedback message */}
        {feedbackMsg && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${
              feedbackType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {feedbackType === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {feedbackMsg}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

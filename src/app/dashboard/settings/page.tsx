"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Plus, X } from "lucide-react"

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
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Label Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Expiry Days Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Label Type Expiry Settings (in days)</h2>
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
        <Button onClick={handleSave}>Save Expiry Settings</Button>
        {/* Label Initials Section */}
        <div className="space-y-4">
          {/* Move Add Initials input + button above title */}
          {useInitials && (
            <div className="mb-2 flex items-center gap-4">
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
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Label Initials</h2>
            <div className="flex items-center gap-2">
              <Label>Use Initials</Label>
              <Switch checked={useInitials} onCheckedChange={handleToggleUseInitials} />
            </div>
          </div>

          {useInitials && (
            <>
              {/* Display current initials */}
              <div className="flex flex-wrap gap-2">
                {customInitials.map((initial) => (
                  <span
                    key={initial}
                    className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-foreground"
                  >
                    {initial}
                    <X
                      className="ml-2 h-4 w-4 cursor-pointer text-muted-foreground"
                      onClick={() => handleRemoveInitial(initial)}
                    />
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Save Button only saves expiry settings now */}

        {/* Feedback message */}
        {feedbackMsg && (
          <div
            className={`mt-4 rounded-md px-4 py-2 text-sm font-medium ${
              feedbackType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {feedbackMsg}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

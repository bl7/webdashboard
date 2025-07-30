"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, X, CheckCircle2, AlertTriangle } from "lucide-react"
import BridgeDownload from "@/components/BridgeDownload"
import SquareIntegration from "@/components/SquareIntegration"

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
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No token found")
          return
        }

        const [settingsRes, initialsRes] = await Promise.all([
          fetch(`/api/label-settings`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }),
          fetch(`/api/label-initials`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }),
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
  }, [])

  const handleChange = (type: string, value: string) => {
    setExpiryDays((prev) => ({ ...prev, [type]: value }))
  }

  // Helper to sync initials with backend immediately
  const saveInitials = async (initials: string[], useInitialsVal: boolean) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        showFeedback("No authentication token found", "error")
        return
      }

      const res = await fetch("/api/label-initials", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
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
      const token = localStorage.getItem("token")
      if (!token) {
        showFeedback("No authentication token found", "error")
        return
      }

      const res = await fetch("/api/label-settings", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
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
    <div className="space-y-10 py-8 px-2 md:px-8 bg-gray-50 min-h-screen">
      {/* Print Server Download Section */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">InstaLabel Print Server</h2>
        <p className="mb-6 text-gray-700">
          To print labels from your browser, you need to install our InstaLabel Print Server on your computer. Download and install the version for your operating system:
        </p>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <BridgeDownload platform="windows" />
          <BridgeDownload platform="mac" />
        </div>
        <a 
          href="/help/print-server-setup" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-purple-700 underline font-medium hover:text-purple-800"
        >
          Setup instructions
        </a>
      </div>

      {/* Label Settings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expiry Days Settings */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Label Type Expiry Settings (in days)</h2>
          <div className="space-y-4">
            {labelTypes.map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <Label className="text-gray-700 font-medium">{label}</Label>
                <Input
                  type="number"
                  placeholder="Days"
                  value={expiryDays[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-32 border-gray-300 focus:border-purple-500 focus:ring-purple-200"
                  min={0}
                />
              </div>
            ))}
          </div>
          <Button 
            onClick={handleSave} 
            className="mt-6 bg-purple-600 hover:bg-purple-700" 
            disabled={isSaving}
          >
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
        </div>

        {/* Label Initials Section */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Label Initials</h2>
            <div className="flex items-center gap-3">
              <Label className="text-gray-700 font-medium">Use Initials</Label>
              <Switch 
                checked={useInitials} 
                onCheckedChange={handleToggleUseInitials}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </div>
          {useInitials && (
            <>
              <div className="mb-6 flex items-center gap-4">
                <Input
                  value={newInitial}
                  onChange={(e) => setNewInitial(e.target.value)}
                  placeholder="Enter Initial (e.g., CH)"
                  className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-200"
                  maxLength={10}
                />
                <Button 
                  variant="outline" 
                  onClick={handleAddInitial}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Initial
                </Button>
              </div>
              {/* Display current initials */}
              <div className="flex flex-wrap gap-2">
                {customInitials.length === 0 && (
                  <span className="text-sm text-gray-500">No initials added yet.</span>
                )}
                {customInitials.map((initial) => (
                  <span
                    key={initial}
                    className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm text-purple-800 shadow-sm transition hover:bg-red-50 hover:border-red-200"
                  >
                    {initial}
                    <X
                      className="ml-2 h-4 w-4 cursor-pointer text-purple-600 transition hover:text-red-500"
                      onClick={() => handleRemoveInitial(initial)}
                    />
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Square POS Integration - Top Row */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <SquareIntegration userId={userId} onSyncComplete={(result) => {
          showFeedback(`Square sync completed! ${result.itemsCreated} items created`, "success")
        }} />
      </div>

      {/* Square Integration Setup - Bottom Row */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Square Integration Setup</h2>
        
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">📋 How to Store Ingredients in Square Dashboard</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <div>
                  <strong>Create Modifier Lists for Ingredients:</strong>
                  <ul className="mt-1 ml-4 space-y-1">
                    <li>• Go to Square Dashboard → Items → Modifier Lists</li>
                    <li>• Create a new modifier list named "Ingredients - [Ingredient Name]"</li>
                    <li>• Example: "Ingredients - Chicken", "Ingredients - Tomato"</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <div>
                  <strong>Add Ingredients as Modifiers:</strong>
                  <ul className="mt-1 ml-4 space-y-1">
                    <li>• Inside each modifier list, add the ingredient name as a modifier</li>
                    <li>• Example: In "Ingredients - Chicken" list, add "Chicken" as a modifier</li>
                    <li>• This allows InstaLabel to extract ingredients automatically</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <div>
                  <strong>Add Allergen Information to Descriptions:</strong>
                  <ul className="mt-1 ml-4 space-y-1">
                    <li>• In the modifier description, include allergen info</li>
                    <li>• Example: "Contains Chicken. Allergens: None"</li>
                    <li>• For menu items: "Menu item: Caesar Salad. Allergens: Gluten, Eggs"</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <div>
                  <strong>Link Modifier Lists to Menu Items:</strong>
                  <ul className="mt-1 ml-4 space-y-1">
                    <li>• When creating menu items, add the ingredient modifier lists</li>
                    <li>• This creates the ingredient structure InstaLabel needs</li>
                    <li>• Example: Caesar Salad → Add "Ingredients - Romaine", "Ingredients - Parmesan"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-3">✅ Best Practices</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• <strong>Use consistent naming:</strong> "Ingredients - [Ingredient Name]" format</li>
              <li>• <strong>Include allergens in descriptions:</strong> Square API doesn't support custom allergen fields</li>
              <li>• <strong>One ingredient per modifier list:</strong> Keeps data clean and structured</li>
              <li>• <strong>Update descriptions when ingredients change:</strong> Ensures accurate allergen detection</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Feedback message */}
      {feedbackMsg && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${
            feedbackType === "success" 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-red-100 text-red-800 border border-red-200"
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
    </div>
  )
}

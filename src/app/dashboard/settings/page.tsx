"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus } from "lucide-react"

const labelTypes = [
  { label: "Cooked", key: "cooked" },
  { label: "Prep", key: "prep" },
  { label: "PPDS", key: "ppds" },
]

const defaultInitials = ["CH", "PR", "PP"]

export default function Settings() {
  const [expiryDays, setExpiryDays] = useState<Record<string, string>>({})
  const [selectedInitial, setSelectedInitial] = useState<string>(defaultInitials[0])
  const [customInitials, setCustomInitials] = useState<string[]>([])
  const [useInitials, setUseInitials] = useState<boolean>(true)

  useEffect(() => {
    // Fetch existing values (mock for now)
    const fetchSettings = async () => {
      const data = [
        { labelType: "cooked", expiryDays: 3 },
        { labelType: "prep", expiryDays: 5 },
        { labelType: "ppds", expiryDays: 1 },
      ]
      const mapped = Object.fromEntries(
        data.map((item) => [item.labelType, item.expiryDays.toString()])
      )
      setExpiryDays(mapped)
      // Example toggle fetch:
      // setUseInitials(true);
    }

    fetchSettings()
  }, [])

  const handleChange = (type: string, value: string) => {
    setExpiryDays((prev) => ({ ...prev, [type]: value }))
  }

  const handleAddInitial = () => {
    if (selectedInitial && !customInitials.includes(selectedInitial)) {
      setCustomInitials((prev) => [...prev, selectedInitial])
    }
  }

  const handleSave = async () => {
    const payload = {
      expiryDays: labelTypes.map(({ key }) => ({
        labelType: key,
        expiryDays: Number(expiryDays[key] || "0"),
      })),
      useInitials,
      initials: customInitials,
    }

    // await fetch("/api/settings", {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
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

        {/* Label Initials Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Label Initials</h2>
            <div className="flex items-center gap-2">
              <Label>Use Initials</Label>
              <Switch checked={useInitials} onCheckedChange={setUseInitials} />
            </div>
          </div>

          {useInitials && (
            <>
              <div className="flex items-center gap-4">
                <Select value={selectedInitial} onValueChange={setSelectedInitial}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select Initial" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultInitials.map((initial) => (
                      <SelectItem key={initial} value={initial}>
                        {initial}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleAddInitial}>
                  <Plus className="mr-1 h-4 w-4" /> Add Initial
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {customInitials.map((initial) => (
                  <span
                    key={initial}
                    className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-foreground"
                  >
                    {initial}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Save Button */}
        <Button onClick={handleSave}>Save Changes</Button>
      </CardContent>
    </Card>
  )
}

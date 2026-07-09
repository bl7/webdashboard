"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Save, Smartphone } from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext"

interface AppVersionForm {
  minSupportedVersionCode: string
  minSupportedVersion: string
  latestVersionCode: string
  latestVersion: string
  updateUrl: string
  message: string
}

const emptyForm: AppVersionForm = {
  minSupportedVersionCode: "",
  minSupportedVersion: "",
  latestVersionCode: "",
  latestVersion: "",
  updateUrl: "",
  message: "",
}

export default function BossAppVersionPage() {
  const { isDarkMode } = useDarkMode()
  const [form, setForm] = useState<AppVersionForm>(emptyForm)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const bossHeaders = (): HeadersInit => {
    const bossToken = typeof window !== "undefined" ? localStorage.getItem("bossToken") : null
    return {
      "Content-Type": "application/json",
      ...(bossToken ? { Authorization: `Bearer ${bossToken}` } : {}),
    }
  }

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/app-version/admin", { headers: bossHeaders() })
        if (!res.ok) throw new Error("Failed to load app version config")
        const data = await res.json()
        const config = data.config
        setForm({
          minSupportedVersionCode: String(config.minSupportedVersionCode ?? ""),
          minSupportedVersion: config.minSupportedVersion ?? "",
          latestVersionCode:
            config.latestVersionCode != null ? String(config.latestVersionCode) : "",
          latestVersion: config.latestVersion ?? "",
          updateUrl: config.updateUrl ?? "",
          message: config.message ?? "",
        })
        setUpdatedAt(config.updatedAt ?? null)
      } catch (err: any) {
        setError(err.message || "Failed to load app version config")
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSuccess("")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch("/api/app-version/admin", {
        method: "PUT",
        headers: bossHeaders(),
        body: JSON.stringify({
          minSupportedVersionCode: Number(form.minSupportedVersionCode),
          minSupportedVersion: form.minSupportedVersion || null,
          latestVersionCode: form.latestVersionCode ? Number(form.latestVersionCode) : null,
          latestVersion: form.latestVersion || null,
          updateUrl: form.updateUrl || null,
          message: form.message || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save")
      setSuccess("App version settings saved.")
      setUpdatedAt(data.config?.updatedAt ?? null)
    } catch (err: any) {
      setError(err.message || "Failed to save app version config")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Smartphone className="h-7 w-7 text-purple-600" />
        <h1 className="text-2xl font-bold dark:text-gray-100">Mobile App Version</h1>
      </div>

      <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
        <CardHeader>
          <CardTitle className="text-lg dark:text-gray-100">Version gate (Android)</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Controls the forced-update check on every app launch. Bump{" "}
            <strong>Min supported version code</strong> only after the new Play Store build is live.
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="dark:text-gray-200">Loading...</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
                <div className="mb-1 flex items-center gap-2 font-medium">
                  <AlertTriangle className="h-4 w-4" />
                  Rollout order
                </div>
                <ol className="list-decimal space-y-1 pl-5">
                  <li>Ship new APK to Play Store (higher versionCode)</li>
                  <li>Wait until rollout is live</li>
                  <li>Then raise min supported version code here</li>
                </ol>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium dark:text-gray-200">
                    Min supported version code *
                  </label>
                  <Input
                    name="minSupportedVersionCode"
                    type="number"
                    min={1}
                    required
                    value={form.minSupportedVersionCode}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-xs text-gray-500">Blocks app if installed versionCode is lower</p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium dark:text-gray-200">
                    Min supported version
                  </label>
                  <Input
                    name="minSupportedVersion"
                    placeholder="6.1.0"
                    value={form.minSupportedVersion}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium dark:text-gray-200">
                    Latest version code
                  </label>
                  <Input
                    name="latestVersionCode"
                    type="number"
                    min={1}
                    value={form.latestVersionCode}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium dark:text-gray-200">
                    Latest version
                  </label>
                  <Input
                    name="latestVersion"
                    placeholder="6.1.0"
                    value={form.latestVersion}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium dark:text-gray-200">
                  Play Store update URL
                </label>
                <Input
                  name="updateUrl"
                  type="url"
                  value={form.updateUrl}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium dark:text-gray-200">
                  Blocking screen message
                </label>
                <Textarea
                  name="message"
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              {updatedAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {new Date(updatedAt).toLocaleString()}
                </p>
              )}

              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}

              <Button type="submit" disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save settings"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

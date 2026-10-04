"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tag } from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext"

export default function BossOfferCodePage() {
  const { isDarkMode } = useDarkMode()
  const [code, setCode] = useState("")
  const [detail, setDetail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const bossHeaders = (): HeadersInit => {
    const bossToken = typeof window !== "undefined" ? localStorage.getItem("bossToken") : null
    return {
      "Content-Type": "application/json",
      ...(bossToken ? { Authorization: `Bearer ${bossToken}` } : {}),
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/campaign-offer", { headers: bossHeaders() })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to load offer code")
        setCode(data.code || "")
        setDetail(data.stripe?.detail || "")
      } catch (err: any) {
        setError(err.message || "Failed to load offer code")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/campaign-offer", {
        method: "PUT",
        headers: bossHeaders(),
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save")
      setCode(data.code || "")
      setDetail(data.stripe?.detail || "Saved.")
    } catch (err: any) {
      setError(err.message || "Failed to save offer code")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Tag className="h-7 w-7 text-purple-600" />
        <h1 className="text-2xl font-bold dark:text-gray-100">Offer code</h1>
      </div>

      <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
        <CardHeader>
          <CardTitle className="text-lg dark:text-gray-100">Christmas offer</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="mb-6 list-decimal space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
            <li>In Stripe, create a coupon: 30% off, duration Once.</li>
            <li>Create a promotion code on that coupon. Use the same letters you will type below. Set it to expire on 10 January 2027, and limit it to first-time customers.</li>
            <li>Type that code here and save.</li>
          </ol>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            New customers who use the code get 60 days free. The 30% applies only when they choose the annual plan, and only on the first payment. Monthly stays at the normal price after the 60 days.
          </p>
          <form onSubmit={handleSave} className="space-y-4">
            <label className="block text-sm font-medium dark:text-gray-100">
              Code
              <Input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                disabled={loading || saving}
                autoComplete="off"
                spellCheck={false}
                className="mt-1"
              />
            </label>
            {detail && <p className="text-sm text-gray-700 dark:text-gray-200">{detail}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={loading || saving}>
              <Tag className="mr-2 h-4 w-4" />
              {saving ? "Saving…" : "Save code"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

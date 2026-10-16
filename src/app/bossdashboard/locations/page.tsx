"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext"

type LocationRow = {
  id: string
  name: string
  url: string
  qrDataUrl: string
  visits: number
  people: number
}

export default function BossLocationsPage() {
  const { isDarkMode } = useDarkMode()
  const [name, setName] = useState("")
  const [locations, setLocations] = useState<LocationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState("")
  const [error, setError] = useState("")

  const bossHeaders = (): HeadersInit => {
    const bossToken = typeof window !== "undefined" ? localStorage.getItem("bossToken") : null
    return {
      "Content-Type": "application/json",
      ...(bossToken ? { Authorization: `Bearer ${bossToken}` } : {}),
    }
  }

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/flyer-locations", { headers: bossHeaders() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load locations")
      setLocations(data.locations || [])
    } catch (err: any) {
      setError(err.message || "Failed to load locations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/flyer-locations", {
        method: "POST",
        headers: bossHeaders(),
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add location")
      setName("")
      await load()
    } catch (err: any) {
      setError(err.message || "Failed to add location")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (location: LocationRow) => {
    if (!window.confirm(`Delete the QR for ${location.name}? Its visit counts will be removed.`)) return
    setDeletingId(location.id)
    setError("")
    try {
      const res = await fetch("/api/flyer-locations", {
        method: "DELETE",
        headers: bossHeaders(),
        body: JSON.stringify({ id: location.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to delete location")
      setLocations((current) => current.filter((item) => item.id !== location.id))
    } catch (err: any) {
      setError(err.message || "Failed to delete location")
    } finally {
      setDeletingId("")
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <MapPin className="h-7 w-7 text-purple-600" />
        <h1 className="text-2xl font-bold dark:text-gray-100">Locations</h1>
      </div>

      <Card className={`mb-8 ${isDarkMode ? "border-gray-700 bg-gray-800" : ""}`}>
        <CardHeader>
          <CardTitle className="text-lg dark:text-gray-100">Add a location</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Each location gets its own QR. Scans are counted separately, so you can see which flyer people came from.
          </p>
          <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="block flex-1 text-sm font-medium dark:text-gray-100">
              Location name
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={saving}
                placeholder="Bournemouth"
                className="mt-1"
              />
            </label>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? "Adding…" : "Add location"}
            </Button>
          </form>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">Loading locations…</p>
      ) : locations.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">No locations yet.</p>
      ) : (
        <div className="space-y-4">
          {locations.map((location) => (
            <Card key={location.id} className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                <img
                  src={location.qrDataUrl}
                  alt={`QR code for ${location.name}`}
                  width={160}
                  height={160}
                  className="h-40 w-40 bg-white"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold dark:text-gray-100">{location.name}</h2>
                  <p className="mt-1 break-all text-sm text-gray-600 dark:text-gray-300">{location.url}</p>
                  <p className="mt-3 text-sm text-gray-800 dark:text-gray-100">
                    {location.visits} {location.visits === 1 ? "visit" : "visits"} · {location.people}{" "}
                    {location.people === 1 ? "person" : "people"}
                  </p>
                  <div className="mt-3 flex gap-4">
                    <a
                      href={location.qrDataUrl}
                      download={`${location.id}-qr.png`}
                      className="text-sm font-medium text-purple-700 hover:underline dark:text-purple-300"
                    >
                      Download QR
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(location)}
                      disabled={deletingId === location.id}
                      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deletingId === location.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

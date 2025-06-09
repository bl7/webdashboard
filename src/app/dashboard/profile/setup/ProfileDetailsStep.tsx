"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ProfileData {
  company_name: string
  address: string
  city: string
  state: string
  country: string
  zip: string
  avatar: number
}

interface ProfileDetailsStepProps {
  userId: string
  profileData: ProfileData
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>
  onNext: () => void
}

const avatarOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function ProfileDetailsStep({
  userId,
  profileData,
  setProfileData,
  onNext,
}: ProfileDetailsStepProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Fetch profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile?user_id=${encodeURIComponent(userId)}`)
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        if (data.profile) {
          setProfileData({
            company_name: data.profile.company_name || "",
            address: data.profile.address || "",
            city: data.profile.city || "",
            state: data.profile.state || "",
            country: data.profile.country || "",
            zip: data.profile.zip || "",
            avatar: Number(data.profile.avatar) || 1,
          })
          localStorage.setItem("avatar", String(data.profile.avatar || 1))
        } else {
          setProfileData((prev) => ({ ...prev, avatar: 1 }))
          localStorage.setItem("avatar", "1")
        }
      } catch {
        setProfileData((prev) => ({ ...prev, avatar: 1 }))
        localStorage.setItem("avatar", "1")
      }
    }
    fetchProfile()
  }, [userId, setProfileData])

  const handleAvatarSelect = (index: number) => {
    setProfileData((prev) => ({ ...prev, avatar: index }))
    localStorage.setItem("avatar", index.toString())
    setShowModal(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      const body = {
        user_id: userId,
        company_name: profileData.company_name,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        country: profileData.country,
        zip: profileData.zip,
        avatar: profileData.avatar,
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Failed to save profile")
      onNext()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  // Validation: all required fields must be non-empty
  const isValid =
    profileData.company_name.trim() !== "" &&
    profileData.address.trim() !== "" &&
    profileData.city.trim() !== "" &&
    profileData.state.trim() !== "" &&
    profileData.country.trim() !== "" &&
    profileData.zip.trim() !== ""

  return (
    <div>
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">Step 1: Profile Details</h2>

      {/* Avatar display and change button */}
      <div className="mb-8 flex flex-col items-center rounded-xl border bg-white p-6 shadow-sm">
        <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full">
          <img
            src={`/avatar${profileData.avatar || 1}.png`}
            alt="User Avatar"
            className="h-32 w-32 rounded-full object-cover"
          />
          <button
            onClick={() => setShowModal(true)}
            className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 text-xs text-white"
            type="button"
          >
            Change Avatar
          </button>
        </div>
      </div>

      {/* Avatar selection modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white p-6">
            <h2 className="mb-4 text-center text-lg font-semibold">Choose your avatar</h2>
            <div className="flex space-x-4">
              {avatarOptions.map((num) => (
                <img
                  key={num}
                  src={`/avatar${num}.png`}
                  alt={`Avatar ${num}`}
                  onClick={() => handleAvatarSelect(num)}
                  className={cn(
                    "h-16 w-16 cursor-pointer rounded-full border-2 transition hover:scale-105",
                    profileData.avatar === num ? "border-blue-600" : "border-gray-300"
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Profile form fields */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label>Company Name</Label>
          <Input
            name="company_name"
            value={profileData.company_name}
            onChange={handleChange}
            placeholder="Enter your company name"
          />
        </div>
        <div>
          <Label>Address</Label>
          <Input
            name="address"
            value={profileData.address}
            onChange={handleChange}
            placeholder="Enter your address"
          />
        </div>
        <div>
          <Label>City</Label>
          <Input
            name="city"
            value={profileData.city}
            onChange={handleChange}
            placeholder="Enter your city"
          />
        </div>
        <div>
          <Label>State</Label>
          <Input
            name="state"
            value={profileData.state}
            onChange={handleChange}
            placeholder="Enter your state"
          />
        </div>
        <div>
          <Label>Country</Label>
          <Input
            name="country"
            value={profileData.country}
            onChange={handleChange}
            placeholder="Enter your country"
          />
        </div>
        <div>
          <Label>Zip Code</Label>
          <Input
            name="zip"
            value={profileData.zip}
            onChange={handleChange}
            placeholder="Enter your zip code"
          />
        </div>
      </div>

      {/* Submit button and error */}
      {error && <p className="mt-4 text-center text-red-600">{error}</p>}

      <Button
        className="mt-6 w-full md:w-auto"
        onClick={handleSubmit}
        disabled={saving || !isValid}
      >
        {saving ? "Saving..." : "Next"}
      </Button>
    </div>
  )
}

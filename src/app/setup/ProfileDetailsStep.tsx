"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { saveData } from "@/lib/saveData"

interface ProfileData {
  full_name: string
  email: string
  company_name: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  country: string
  postal_code: string
  phone: string
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
    // Prefill from localStorage
    const full_name = localStorage.getItem("full_name") || ""
    const email = localStorage.getItem("email") || ""
    setProfileData((prev) => ({
      ...prev,
      full_name,
      email,
      avatar: prev.avatar || 1,
    }))
    // Fetch from API as before (can overwrite if present)
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile?user_id=${encodeURIComponent(userId)}`)
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        if (data.profile) {
          setProfileData({
            full_name: data.profile.full_name || full_name,
            email: data.profile.email || email,
            company_name: data.profile.company_name || "",
            address_line1: data.profile.address_line1 || "",
            address_line2: data.profile.address_line2 || "",
            city: data.profile.city || "",
            state: data.profile.state || "",
            country: data.profile.country || "",
            postal_code: data.profile.postal_code || "",
            phone: data.profile.phone || "",
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
    const body = {
      user_id: userId,
      full_name: profileData.full_name,
      email: profileData.email,
      company_name: profileData.company_name,
      address_line1: profileData.address_line1,
      address_line2: profileData.address_line2,
      city: profileData.city,
      state: profileData.state,
      country: profileData.country,
      postal_code: profileData.postal_code,
      phone: profileData.phone,
      avatar: profileData.avatar,
    }
    const success = await saveData("/api/profile", body, {
      method: "PUT",
      successMessage: "Profile saved!",
      errorMessage: "Could not save profile",
    })
    if (success) onNext()
    setSaving(false)
  }

  // Validation: all required fields must be non-empty (except address_line2, phone)
  const isValid =
    profileData.full_name.trim() !== "" &&
    profileData.email.trim() !== "" &&
    profileData.company_name.trim() !== "" &&
    profileData.address_line1.trim() !== "" &&
    profileData.city.trim() !== "" &&
    profileData.state.trim() !== "" &&
    profileData.country.trim() !== "" &&
    profileData.postal_code.trim() !== ""

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
      <div className="mb-6">
        <div className="text-lg font-semibold text-gray-800">{profileData.full_name}</div>
        <div className="text-sm text-gray-600">{profileData.email}</div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label>Company Name</Label>
          <Input name="company_name" value={profileData.company_name} onChange={handleChange} placeholder="Enter your company name" />
        </div>
        <div>
          <Label>Address Line 1</Label>
          <Input name="address_line1" value={profileData.address_line1} onChange={handleChange} placeholder="Address line 1" />
        </div>
        <div>
          <Label>Address Line 2 (optional)</Label>
          <Input name="address_line2" value={profileData.address_line2} onChange={handleChange} placeholder="Address line 2" />
        </div>
        <div>
          <Label>City</Label>
          <Input name="city" value={profileData.city} onChange={handleChange} placeholder="City" />
        </div>
        <div>
          <Label>State</Label>
          <Input name="state" value={profileData.state} onChange={handleChange} placeholder="State" />
        </div>
        <div>
          <Label>Country</Label>
          <Input name="country" value={profileData.country} onChange={handleChange} placeholder="Country" />
        </div>
        <div>
          <Label>Postal Code</Label>
          <Input name="postal_code" value={profileData.postal_code} onChange={handleChange} placeholder="Postal code" />
        </div>
        <div>
          <Label>Phone (optional)</Label>
          <Input name="phone" value={profileData.phone} onChange={handleChange} placeholder="Phone" />
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

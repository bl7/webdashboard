"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { saveData } from "@/lib/saveData"
import { searchPostcodes, lookupPostcode } from "@/lib/postcodesService"

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

// Country list - UK first, then European countries
const COUNTRIES = [
  "United Kingdom",
  "France",
  "Germany",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Austria",
  "Switzerland",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Portugal",
  "Ireland",
  "Greece",
  "Czech Republic",
  "Hungary",
  "Romania",
  "Other",
]

export default function ProfileDetailsStep({
  userId,
  profileData,
  setProfileData,
  onNext,
}: ProfileDetailsStepProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  
  // Postcode autocomplete state
  const [postcodeSuggestions, setPostcodeSuggestions] = useState<Array<{ postcode: string; originalPostcode: string }>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [postcodeValid, setPostcodeValid] = useState(false)
  const [postcodeError, setPostcodeError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [lastValidatedPostcode, setLastValidatedPostcode] = useState<string>("")
  
  const postcodeInputRef = useRef<HTMLInputElement>(null)
  const addressLine1Ref = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Check if UK is selected
  const isUK = profileData.country === "United Kingdom" || profileData.country === ""

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
      // Default to UK if no country set
      country: prev.country || "United Kingdom",
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
            country: data.profile.country || "United Kingdom",
            postal_code: data.profile.postal_code || "",
            phone: data.profile.phone || "",
            avatar: Number(data.profile.avatar) || 1,
          })
          localStorage.setItem("avatar", String(data.profile.avatar || 1))
        } else {
          setProfileData((prev) => ({ ...prev, avatar: 1, country: prev.country || "United Kingdom" }))
          localStorage.setItem("avatar", "1")
        }
      } catch {
        setProfileData((prev) => ({ ...prev, avatar: 1, country: prev.country || "United Kingdom" }))
        localStorage.setItem("avatar", "1")
      }
    }
    fetchProfile()
  }, [userId, setProfileData])
  
  // Validate postcode when it's initially loaded from API (UK only)
  const [hasValidatedInitialPostcode, setHasValidatedInitialPostcode] = useState(false)
  useEffect(() => {
    const isUKSelected = profileData.country === "United Kingdom" || profileData.country === ""
    
    // Only validate for UK
    if (!isUKSelected) {
      setHasValidatedInitialPostcode(true)
      return
    }
    
    const postcode = profileData.postal_code.trim()
    if (postcode && postcode.length >= 2 && !hasValidatedInitialPostcode) {
      lookupPostcode(postcode).then((result) => {
        if (result) {
          setPostcodeValid(true)
          setPostcodeError(null)
        } else {
          setPostcodeValid(false)
        }
        setHasValidatedInitialPostcode(true)
      })
    } else if (!postcode) {
      setHasValidatedInitialPostcode(true)
    }
  }, [profileData.postal_code, profileData.country, hasValidatedInitialPostcode])

  const handleAvatarSelect = (index: number) => {
    setProfileData((prev) => ({ ...prev, avatar: index }))
    localStorage.setItem("avatar", index.toString())
    setShowModal(false)
  }

  // Handle country change
  const handleCountryChange = (value: string) => {
    const isUKSelected = value === "United Kingdom"
    const wasUK = profileData.country === "United Kingdom" || profileData.country === ""
    
    setProfileData((prev) => ({ ...prev, country: value }))
    
    // If switching from UK to non-UK, clear postcode validation
    if (!isUKSelected && wasUK) {
      setPostcodeValid(false)
      setPostcodeError(null)
      setLastValidatedPostcode("")
      setPostcodeSuggestions([])
      setShowSuggestions(false)
      // Clear auto-filled fields if they were from UK postcode lookup
      setProfileData((prev) => ({
        ...prev,
        city: "",
        state: "",
      }))
    }
    
    // If switching to UK, clear validation state to allow re-validation
    if (isUKSelected && !wasUK) {
      setPostcodeValid(false)
      setPostcodeError(null)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
    
    // Handle postcode input with autocomplete (only for UK)
    if (name === "postal_code") {
      const isUKSelected = profileData.country === "United Kingdom" || profileData.country === ""
      
      // Normalize the new postcode value for comparison
      const normalizedNew = value.replace(/\s+/g, "").toUpperCase()
      const normalizedLast = lastValidatedPostcode.replace(/\s+/g, "").toUpperCase()
      
      // If postcode changed and was previously validated, clear auto-filled fields (UK only)
      if (isUKSelected && lastValidatedPostcode && normalizedNew !== normalizedLast) {
        setProfileData((prev) => ({
          ...prev,
          city: "",
          state: "",
        }))
      }
      
      // Only validate postcode for UK
      if (!isUKSelected) {
        // For non-UK, just clear validation state
        setPostcodeValid(false)
        setPostcodeError(null)
        setPostcodeSuggestions([])
        setShowSuggestions(false)
        return
      }
      
      setPostcodeValid(false)
      setPostcodeError(null)
      setLastValidatedPostcode("")
      
      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      
      // If less than 2 characters, clear suggestions
      if (value.length < 2) {
        setPostcodeSuggestions([])
        setShowSuggestions(false)
        return
      }
      
      // Debounce search by 250-300ms (UK only)
      setIsSearching(true)
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const suggestions = await searchPostcodes(value)
          setPostcodeSuggestions(suggestions.slice(0, 10))
          setShowSuggestions(suggestions.length > 0)
        } catch (err) {
          console.error("Error fetching postcode suggestions:", err)
          setPostcodeSuggestions([])
          setShowSuggestions(false)
        } finally {
          setIsSearching(false)
        }
      }, 275) // 275ms debounce
    }
  }
  
  // Handle postcode selection from dropdown
  const handlePostcodeSelect = useCallback(async (selectedPostcode: string, originalPostcode?: string) => {
    // Use original postcode for lookup if available, otherwise use the selected one
    const postcodeForLookup = originalPostcode || selectedPostcode
    
    setProfileData((prev) => ({ ...prev, postal_code: selectedPostcode }))
    setShowSuggestions(false)
    setPostcodeSuggestions([])
    
    // Lookup postcode details using the original postcode from API
    setIsSearching(true)
    try {
      // Try lookup with original postcode first, then fallback to formatted
      let lookupResult = await lookupPostcode(postcodeForLookup)
      
      // If lookup fails with original, try with the formatted version
      if (!lookupResult && postcodeForLookup !== selectedPostcode) {
        lookupResult = await lookupPostcode(selectedPostcode)
      }
      
      if (lookupResult) {
        setPostcodeValid(true)
        setPostcodeError(null)
        setLastValidatedPostcode(lookupResult.postcode)
        
        // Auto-fill city, state, country (always update, not just if empty)
        setProfileData((prev) => ({
          ...prev,
          postal_code: lookupResult.postcode,
          city: lookupResult.admin_district || lookupResult.parish || "",
          state: lookupResult.admin_county || lookupResult.region || "",
          country: lookupResult.country || "",
        }))
        
        // Auto-focus Address Line 1 after a short delay
        setTimeout(() => {
          addressLine1Ref.current?.focus()
        }, 100)
      } else {
        setPostcodeValid(false)
        setPostcodeError("Postcode not found, please enter address manually.")
        setLastValidatedPostcode("")
      }
    } catch (err) {
      console.error("Error looking up postcode:", err)
      setPostcodeValid(false)
      setPostcodeError("Postcode not found, please enter address manually.")
      setLastValidatedPostcode("")
    } finally {
      setIsSearching(false)
    }
  }, [setProfileData])
  
  // Validate postcode on blur if it's been entered (UK only)
  const handlePostcodeBlur = useCallback(async () => {
    // Small delay to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false)
      
      const isUKSelected = profileData.country === "United Kingdom" || profileData.country === ""
      
      // Only validate for UK
      if (!isUKSelected) {
        return
      }
      
      const postcode = profileData.postal_code.trim()
      if (postcode && !postcodeValid) {
        // Try to validate the postcode
        lookupPostcode(postcode).then((result) => {
          if (result) {
            setPostcodeValid(true)
            setPostcodeError(null)
            
            // Check if this is a different postcode than last validated
            const normalizedCurrent = postcode.replace(/\s+/g, "").toUpperCase()
            const normalizedLast = lastValidatedPostcode.replace(/\s+/g, "").toUpperCase()
            const isDifferentPostcode = normalizedCurrent !== normalizedLast
            
            if (isDifferentPostcode) {
              // Update the last validated postcode
              setLastValidatedPostcode(result.postcode)
              
              // Always auto-fill when postcode changes
              setProfileData((prev) => ({
                ...prev,
                postal_code: result.postcode,
                city: result.admin_district || result.parish || "",
                state: result.admin_county || result.region || "",
                country: result.country || "United Kingdom",
              }))
            } else {
              // Same postcode, just mark as valid
              setLastValidatedPostcode(result.postcode)
            }
          } else if (postcode.length >= 2) {
            setPostcodeValid(false)
            setPostcodeError("Postcode not found, please enter address manually.")
            setLastValidatedPostcode("")
          }
        })
      }
    }, 200)
  }, [profileData.postal_code, profileData.country, postcodeValid, lastValidatedPostcode, setProfileData])
  
  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        postcodeInputRef.current &&
        !postcodeInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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

  // Validation: Company Name, Address Line 1, and Postal Code are required
  // For UK: postal code must be valid (postcodeValid)
  // For non-UK: postal code just needs to be filled
  const isUKSelected = profileData.country === "United Kingdom" || profileData.country === ""
  const isValid =
    profileData.full_name.trim() !== "" &&
    profileData.email.trim() !== "" &&
    profileData.company_name.trim() !== "" &&
    profileData.address_line1.trim() !== "" &&
    profileData.postal_code.trim() !== "" &&
    profileData.country.trim() !== "" &&
    (isUKSelected ? postcodeValid : true) // Only require validation for UK

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
                    profileData.avatar === num ? "border-purple-600" : "border-gray-300"
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
          <Label>Country</Label>
          <Select value={profileData.country || "United Kingdom"} onValueChange={handleCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Postal Code - Industry standard: after country, before address */}
        <div className="relative">
          <Label>Postal Code {isUKSelected && <span className="text-gray-500">(UK)</span>}</Label>
          <Input
            ref={postcodeInputRef}
            name="postal_code"
            value={profileData.postal_code}
            onChange={handleChange}
            onBlur={handlePostcodeBlur}
            placeholder={isUKSelected ? "Postal code" : "Postal/ZIP code"}
            className={cn(
              postcodeError && isUKSelected && "border-red-500",
              postcodeValid && isUKSelected && "border-green-500"
            )}
            disabled={!isUKSelected && false} // Allow input for all countries
          />
          {isUKSelected && isSearching && (
            <div className="absolute right-3 top-9 text-xs text-gray-400">Searching...</div>
          )}
          {isUKSelected && postcodeError && (
            <p className="mt-1 text-xs text-red-600">{postcodeError}</p>
          )}
          {!isUKSelected && (
            <p className="mt-1 text-xs text-gray-500">Enter your postal/ZIP code manually</p>
          )}
          {/* Postcode suggestions dropdown (UK only) */}
          {isUKSelected && showSuggestions && postcodeSuggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
            >
              {postcodeSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePostcodeSelect(suggestion.postcode, suggestion.originalPostcode)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  {suggestion.postcode}
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <Label>Address Line 1</Label>
          <Input
            ref={addressLine1Ref}
            name="address_line1"
            value={profileData.address_line1}
            onChange={handleChange}
            placeholder="Address line 1"
          />
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

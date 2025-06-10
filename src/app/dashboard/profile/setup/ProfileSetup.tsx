"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import ProfileDetailsStep from "./ProfileDetailsStep"
import PlanSelectionStep from "./PlanSelectionStep"

interface ProfileData {
  company_name: string
  address: string
  city: string
  state: string
  country: string
  zip: string
  avatar: number
}

interface MultiStepProfileSetupProps {
  userId: string
}

export default function MultiStepProfileSetup({ userId }: MultiStepProfileSetupProps) {
  const router = useRouter()

  const [profileData, setProfileData] = useState<ProfileData>({
    company_name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    avatar: 1, // default avatar index
  })

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [step, setStep] = useState(1)

  // Admin PIN state
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Validation error for PIN
  const [pinError, setPinError] = useState<string | null>(null)

  const nextStep = () => setStep((s) => Math.min(s + 1, 3))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  // Handle PIN input change with auto-focus
  const handlePinChange = (index: number, value: string) => {
    if (/^\d$/.test(value)) {
      const newPin = [...pinDigits]
      newPin[index] = value
      setPinDigits(newPin)
      setPinError(null)

      if (index < 3) {
        inputRefs.current[index + 1]?.focus()
      }
    } else if (value === "") {
      const newPin = [...pinDigits]
      newPin[index] = ""
      setPinDigits(newPin)
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  // Validate and submit all data on final step
  async function handlePinSubmit() {
    const pin = pinDigits.join("")
    if (pin.length !== 4) {
      setPinError("Please enter a 4-digit PIN.")
      return
    }

    try {
      const res = await fetch("/api/set-admin-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin }),
      })

      if (res.ok) {
        // PIN saved successfully, proceed to next step
        nextStep()
      } else {
        const data = await res.json()
        setPinError(data.message || "Failed to save PIN.")
      }
    } catch (error) {
      setPinError("Network error. Please try again.")
    }
  }

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-lg">
      <ProgressBar step={step} />

      {step === 1 && (
        <ProfileDetailsStep
          userId={userId}
          profileData={profileData}
          setProfileData={setProfileData}
          onNext={nextStep}
        />
      )}

      {step === 2 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Set Admin PIN</h2>
          <p className="mb-4 text-gray-700">
            Please set a 4-digit PIN to enable admin access. You can use this PIN later to unlock
            full dashboard features.
          </p>

          <div className="mb-4 flex justify-center gap-3">
            {[0, 1, 2, 3].map((idx) => (
              <input
                key={idx}
                type="password"
                maxLength={1}
                value={pinDigits[idx]}
                onChange={(e) => handlePinChange(idx, e.target.value)}
                ref={(el) => {
                  inputRefs.current[idx] = el
                }}
                className="h-12 w-12 rounded border border-gray-300 text-center text-2xl focus:border-blue-600 focus:outline-none"
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {pinError && <p className="mb-4 text-center text-red-600">{pinError}</p>}

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="rounded bg-gray-200 px-4 py-2 font-semibold hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <PlanSelectionStep
          userId={userId}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          billingPeriod={billingPeriod}
          setBillingPeriod={setBillingPeriod}
          onPrev={prevStep}
          onNext={handlePinSubmit}
        />
      )}
    </div>
  )
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8 flex">
      {["Profile", "Admin PIN", "Plan"].map((label, idx) => {
        const s = idx + 1
        return (
          <div key={label} className="flex-1">
            <div
              className={`h-2 rounded-full transition-colors duration-300 ${
                s <= step ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
            <p
              className={`mt-2 text-center text-sm font-medium ${
                s === step ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {label}
            </p>
          </div>
        )
      })}
    </div>
  )
}

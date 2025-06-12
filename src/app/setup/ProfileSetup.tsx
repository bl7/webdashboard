"use client"

import React, { useState, useRef, useEffect } from "react"
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

  const [profileData, setProfileData] = useState<ProfileData>(() => {
    const saved = localStorage.getItem("profileData")
    return saved
      ? JSON.parse(saved)
      : {
          company_name: "",
          address: "",
          city: "",
          state: "",
          country: "",
          zip: "",
          avatar: 1,
        }
  })

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [step, setStep] = useState(1)

  const [pinDigits, setPinDigits] = useState<string[]>(() => {
    const saved = localStorage.getItem("adminPinDraft")
    return saved ? JSON.parse(saved) : ["", "", "", ""]
  })
  const [showPin, setShowPin] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [pinError, setPinError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = ["Profile", "Admin PIN", "Plan"]
  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  useEffect(() => {
    if (step === 2) inputRefs.current[0]?.focus()
  }, [step])

  useEffect(() => {
    localStorage.setItem("profileData", JSON.stringify(profileData))
  }, [profileData])

  useEffect(() => {
    localStorage.setItem("adminPinDraft", JSON.stringify(pinDigits))
  }, [pinDigits])

  const handlePinChange = (index: number, value: string) => {
    if (/^\d$/.test(value)) {
      const newPin = [...pinDigits]
      newPin[index] = value
      setPinDigits(newPin)
      setPinError(null)
      if (index < 3) inputRefs.current[index + 1]?.focus()
    } else if (value === "") {
      const newPin = [...pinDigits]
      newPin[index] = ""
      setPinDigits(newPin)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && pinDigits[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  async function handlePinSubmit() {
    const pin = pinDigits.join("")
    if (pin.length !== 4) {
      setPinError("Please enter a 4-digit PIN.")
      return
    }

    setIsSubmitting(true)
    setPinError(null)

    try {
      const res = await fetch("/api/set-admin-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to save PIN")
      }

      localStorage.removeItem("adminPinDraft")
      nextStep()
    } catch (error) {
      setPinError(error instanceof Error ? error.message : "Failed to save PIN")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-lg transition-all duration-300">
      <ProgressBar step={step} steps={steps} />

      <div className="transition-all duration-300">
        {step === 1 && (
          <ProfileDetailsStep
            userId={userId}
            profileData={profileData}
            setProfileData={setProfileData}
            onNext={nextStep}
          />
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="mb-4 text-xl font-semibold">Set Admin PIN</h2>
            <p className="mb-4 text-gray-700">
              Please set a 4-digit PIN for admin access. This will be required for sensitive
              operations.
            </p>

            <div className="mb-4 flex justify-center gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  type={showPin ? "text" : "password"}
                  maxLength={1}
                  value={pinDigits[idx]}
                  onChange={(e) => handlePinChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  ref={(el) => {
                    inputRefs.current[idx] = el
                  }}
                  className="h-12 w-12 rounded border border-gray-300 text-center text-2xl focus:border-blue-600 focus:outline-none"
                  inputMode="numeric"
                />
              ))}
            </div>

            <div className="mb-4 text-center">
              <button
                onClick={() => setShowPin((prev) => !prev)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showPin ? "Hide PIN" : "Show PIN"}
              </button>
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
                onClick={handlePinSubmit}
                disabled={isSubmitting}
                className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Next"}
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
            onNext={nextStep} // ✅ ADD THIS
          />
        )}
      </div>
    </div>
  )
}

function ProgressBar({ step, steps }: { step: number; steps: string[] }) {
  return (
    <div className="mb-8 flex">
      {steps.map((label, idx) => {
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

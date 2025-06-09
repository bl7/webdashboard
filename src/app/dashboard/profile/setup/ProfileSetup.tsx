"use client"

import React, { useState } from "react"
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
  avatar: number // selected avatar index
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

  const nextStep = () => setStep((s) => Math.min(s + 1, 2))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

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
        <PlanSelectionStep
          userId={userId}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          billingPeriod={billingPeriod}
          setBillingPeriod={setBillingPeriod}
          onPrev={prevStep}
        />
      )}
    </div>
  )
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8 flex">
      {["Profile", "Plan"].map((label, idx) => {
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

"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Plan {
  name: string
  monthly: string
  monthlyAmount: number
  yearly: string
  yearlyAmount: number
  description: string
  highlight: boolean
  cta: string
}

interface PlanSelectionStepProps {
  userId: string
  selectedPlan: string | null
  setSelectedPlan: React.Dispatch<React.SetStateAction<string | null>>
  billingPeriod: "monthly" | "yearly"
  setBillingPeriod: React.Dispatch<React.SetStateAction<"monthly" | "yearly">>
  onPrev: () => void
  onNext: () => void | Promise<void>
}

const plans: Plan[] = [
  {
    name: "Starter Kitchen",
    monthly: "Free",
    monthlyAmount: 0,
    yearly: "Free",
    yearlyAmount: 0,
    description:
      "Ideal for testing or low-volume use. Bring your own Epson TM-M30 and get 20 free prints every week.",
    highlight: false,
    cta: "Get Started Free",
  },
  {
    name: "🧑‍🍳 Pro Kitchen",
    monthly: "£20/mo",
    monthlyAmount: 20,
    yearly: "£216/yr (10% off)",
    yearlyAmount: 216,
    description:
      "For growing kitchens. Get an Epson device included and enjoy unlimited print volume.",
    highlight: true,
    cta: "Start Basic Plan",
  },
  {
    name: "Multi-Site Mastery",
    monthly: "£25/mo",
    monthlyAmount: 25,
    yearly: "£270/yr",
    yearlyAmount: 270,
    description:
      "Everything in Basic plus Web Dashboard access and support for Sunmi touchscreen printers.",
    highlight: false,
    cta: "Go Premium",
  },
]

export default function PlanSelectionStep({
  userId,
  selectedPlan,
  setSelectedPlan,
  billingPeriod,
  setBillingPeriod,
  onPrev,
}: PlanSelectionStepProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch(`/api/subscriptions?user_id=${encodeURIComponent(userId)}`)
        if (!res.ok) throw new Error("Failed to fetch subscription")
        const data = await res.json()
        if (data.subscription) {
          setSelectedPlan(data.subscription.plan_name)
          setBillingPeriod(data.subscription.billing_interval || "monthly")
        }
      } catch {
        // ignore errors
      }
    }
    fetchSubscription()
  }, [userId, setSelectedPlan, setBillingPeriod])

  async function savePlan(planName: string) {
    setSaving(true)
    setError(null)
    try {
      const planAmount =
        billingPeriod === "monthly"
          ? (plans.find((p) => p.name === planName)?.monthlyAmount ?? 0)
          : (plans.find((p) => p.name === planName)?.yearlyAmount ?? 0)

      const res = await fetch("/api/subscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          stripe_customer_id: "demo-customer", // placeholder
          stripe_subscription_id: `demo-subscription-${planName}-${Date.now()}`, // unique id
          price_id: billingPeriod === "monthly" ? "price_monthly" : "price_yearly",
          status: "active",
          current_period_end: null,
          trial_end: null,
          plan_name: planName,
          plan_amount: planAmount,
          billing_interval: billingPeriod,
          next_amount_due: null,
          card_last4: null,
          card_exp_month: null,
          card_exp_year: null,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to save subscription")
      }

      setSelectedPlan(planName)
      alert("Yay profile completed!")
      router.push("/dashboard/profile")
    } catch (err: any) {
      setError(err.message || "Failed to save plan selection")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Step 2: Choose Your Plan
      </h2>

      {/* Billing period toggle */}
      <div className="mb-6 flex justify-center gap-4">
        <button
          type="button"
          onClick={() => setBillingPeriod("monthly")}
          className={`rounded-full px-5 py-2 font-semibold transition ${
            billingPeriod === "monthly"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setBillingPeriod("yearly")}
          className={`rounded-full px-5 py-2 font-semibold transition ${
            billingPeriod === "yearly"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Yearly
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.name
          return (
            <div
              key={plan.name}
              className={`flex cursor-pointer flex-col rounded-lg border p-6 transition-shadow ${
                plan.highlight ? "border-blue-600 shadow-lg" : "border-gray-300 hover:shadow-md"
              } ${isSelected ? "bg-blue-50" : "bg-white"}`}
              onClick={() => !saving && savePlan(plan.name)}
            >
              <h3 className="mb-2 text-xl font-semibold">{plan.name}</h3>
              <p className="mb-2 text-lg font-bold">
                {billingPeriod === "monthly" ? plan.monthly : plan.yearly}
              </p>
              <p className="mb-4 flex-grow text-gray-600">{plan.description}</p>
              <button
                type="button"
                disabled={isSelected || saving}
                className={`mt-auto rounded bg-blue-600 px-4 py-2 font-semibold text-white transition ${
                  isSelected ? "cursor-default opacity-70" : "hover:bg-blue-700"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          )
        })}
      </div>

      {error && <p className="mt-4 text-center text-red-600">{error}</p>}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="rounded border border-gray-400 px-6 py-2 text-gray-700 transition hover:bg-gray-100"
          disabled={saving}
        >
          Previous
        </button>
      </div>
    </div>
  )
}

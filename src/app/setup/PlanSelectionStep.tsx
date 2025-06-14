"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Plan {
  name: string
  monthly: string
  yearly: string
  price_id_monthly: string
  price_id_yearly: string
  features: Record<string, any>
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
    yearly: "Free",
    price_id_monthly: "null",
    price_id_yearly: "null",
    features: {
      "Device Provided": false,
      "Unlimited Label Printing": false,
      "Access to Web Dashboard": true,
      "Sunmi Printer Support": false,
      "Weekly Free Prints": true,
    },
    description:
      "Ideal for testing or low-volume use. Bring your own Epson TM-M30 and get 20 free prints every week.",
    highlight: false,
    cta: "Get Started Free",
  },
  {
    name: "🧑🍳 Pro Kitchen",
    monthly: "£20/mo",
    yearly: "£216/yr (10% off)",
    price_id_monthly: "price_1RZnHW6acbqNMwXigvqDdo8I",
    price_id_yearly: "price_1RZnI76acbqNMwXiW5y61Vfl",
    features: {
      "Device Provided": "Epson TM-M30 Included",
      "Unlimited Label Printing": true,
      "Access to Web Dashboard": false,
      "Sunmi Printer Support": false,
      "Weekly Free Prints": false,
    },
    description:
      "For growing kitchens. Get an Epson device included and enjoy unlimited print volume.",
    highlight: true,
    cta: "Start Basic Plan",
  },
  {
    name: "Multi-Site Mastery",
    monthly: "£25/mo",
    yearly: "£270/yr",
    price_id_monthly: "price_1RZnIb6acbqNMwXiSMZnDKvH",
    price_id_yearly: "price_1RZnIv6acbqNMwXi4cEZhKU8",
    features: {
      "Device Provided": "Sunmi or Epson Included",
      "Unlimited Label Printing": true,
      "Access to Web Dashboard": true,
      "Sunmi Printer Support": true,
      "Weekly Free Prints": false,
    },
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
        const res = await fetch(`/api/subscriptions/?user_id=${encodeURIComponent(userId)}`)
        if (!res.ok) throw new Error("Failed to fetch subscription")
        const data = await res.json()
        if (data.subscription) {
          setSelectedPlan(data.subscription.plan_name)
          setBillingPeriod(data.subscription.billing_interval || "monthly")
        }
      } catch {
        // ignore fetch errors silently
      }
    }
    fetchSubscription()
  }, [userId, setSelectedPlan, setBillingPeriod])

  async function handlePlanSelect(planName: string) {
    setSaving(true)
    setError(null)
    const plan = plans.find((p) => p.name === planName)
    if (!plan) {
      setError("Selected plan not found.")
      setSaving(false)
      return
    }
    const priceId = billingPeriod === "monthly" ? plan.price_id_monthly : plan.price_id_yearly
    const userEmail = localStorage.getItem("email")

    if (priceId === "null") {
      // Free plan: Save subscription with price_id: null
      try {
        const res = await fetch("/api/subscriptions/", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            stripe_customer_id: null,
            stripe_subscription_id: null,
            price_id: null,
            status: "active",
            current_period_end: null,
            trial_end: null,
            plan_name: plan.name,
            plan_amount: 0,
            billing_interval: billingPeriod,
            next_amount_due: 0,
            card_last4: null,
            card_exp_month: null,
            card_exp_year: null,
          }),
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Failed to save free plan")
        }
        setSelectedPlan(planName)
        alert("Free plan selected!")
        router.push("/dashboard/profile")
      } catch (e: any) {
        setError(e.message || "Something went wrong")
      } finally {
        setSaving(false)
      }
      return
    }

    // Paid plan: Create Stripe Checkout session
    try {
      const res = await fetch("/api/stripe/create-checkout-session/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          price_id: priceId,
          email: userEmail, // Add email if needed
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Failed to create checkout session")
      }
      window.location.href = data.url
    } catch (e: any) {
      setError(e.message || "Something went wrong")
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h2 className="mb-6 text-center text-3xl font-bold">Step 2: Choose Your Plan</h2>

      {/* Billing period toggle */}
      <div className="mb-8 flex justify-center space-x-4">
        {["monthly", "yearly"].map((period) => (
          <button
            key={period}
            onClick={() => setBillingPeriod(period as "monthly" | "yearly")}
            className={`rounded-full px-6 py-2 font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              billingPeriod === period
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={saving}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Plans grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.name
          return (
            <div
              key={plan.name}
              className={`flex flex-col rounded-lg border p-6 shadow-sm transition-transform duration-300 ${
                plan.highlight
                  ? "scale-105 border-blue-600 bg-blue-50 shadow-lg"
                  : "border-gray-300 bg-white hover:scale-[1.03] hover:shadow-md"
              } ${isSelected ? "ring-4 ring-blue-500" : ""}`}
            >
              <h3 className="mb-2 flex items-center justify-between text-xl font-semibold">
                {plan.name}
                {plan.highlight && (
                  <span className="ml-2 rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                    Popular
                  </span>
                )}
              </h3>

              <p className="mb-4 text-2xl font-bold">
                {billingPeriod === "monthly" ? plan.monthly : plan.yearly}
              </p>

              <p className="mb-4 flex-grow text-gray-700">{plan.description}</p>

              <ul className="mb-6 space-y-1 text-sm text-gray-600">
                {Object.entries(plan.features).map(([feature, value]) => (
                  <li key={feature} className="flex items-center">
                    {typeof value === "boolean" ? (
                      value ? (
                        <svg
                          className="mr-2 h-5 w-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="mr-2 h-5 w-5 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      )
                    ) : (
                      <span className="mr-2 font-semibold">{value}</span>
                    )}
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !saving && handlePlanSelect(plan.name)}
                disabled={saving}
                className={`mt-auto rounded-md px-4 py-2 font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSelected
                    ? "cursor-not-allowed bg-blue-600 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {saving && isSelected ? (
                  <svg
                    className="mx-auto h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          )
        })}
      </div>

      {error && (
        <div className="mt-6 rounded border border-red-400 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onPrev}
          disabled={saving}
          className="rounded bg-gray-300 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
      </div>
    </div>
  )
}

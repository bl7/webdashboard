"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

interface Plan {
  id: string
  name: string
  monthly: string
  yearly: string
  price_id_monthly: string
  price_id_yearly: string
  features: string[]
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
  onNext: () => void
}

const plans: Plan[] = [
  {
    id: "pro_kitchen",
    name: "Pro Kitchen",
    monthly: "£20/mo",
    yearly: "£216/yr",
    price_id_monthly: "price_1RZnHW6acbqNMwXigvqDdo8I",
    price_id_yearly: "price_1RZnI76acbqNMwXiW5y61Vfl",
    features: [
      "Epson TM-M30 Device Included",
      "Unlimited Label Printing",
      "Basic Support",
      "10-day Free Trial"
    ],
    description: "Perfect for growing kitchens. Get started with a professional label printer included.",
    highlight: true,
    cta: "Start Pro Plan",
  },
  {
    id: "multi_site",
    name: "Multi-Site",
    monthly: "£25/mo",
    yearly: "£270/yr",
    price_id_monthly: "price_1RZnIb6acbqNMwXiSMZnDKvH",
    price_id_yearly: "price_1RZnIv6acbqNMwXi4cEZhKU8",
    features: [
      "Sunmi or Epson Device Included",
      "Unlimited Label Printing",
      "Web Dashboard Access",
      "Priority Support",
      "10-day Free Trial"
    ],
    description: "For multi-location businesses. Full web dashboard and advanced printer support.",
    highlight: false,
    cta: "Start Multi-Site Plan",
  },
]

export default function PlanSelectionStep({
  userId,
  selectedPlan,
  setSelectedPlan,
  billingPeriod,
  setBillingPeriod,
  onPrev,
  onNext,
}: PlanSelectionStepProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePlanSelect = async (plan: Plan) => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const priceId = billingPeriod === "monthly" ? plan.price_id_monthly : plan.price_id_yearly
      const userEmail = localStorage.getItem("email")

      if (!userEmail) {
        throw new Error("Email not found. Please refresh and try again.")
      }

      const response = await fetch("/api/stripe/create-checkout-session/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          price_id: priceId,
          email: userEmail,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-lg text-gray-600">Start with a 10-day free trial. Cancel anytime.</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === "yearly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Yearly
            <span className="ml-1 text-xs text-green-600">Save 10%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {plans.map((plan) => {
          const price = billingPeriod === "monthly" ? plan.monthly : plan.yearly
          const isSelected = selectedPlan === plan.name
          
          return (
            <div
              key={plan.id}
              className={`relative rounded-xl border-2 p-8 transition-all ${
                plan.highlight
                  ? "border-blue-500 bg-blue-50 scale-105"
                  : "border-gray-200 bg-white hover:border-gray-300"
              } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">{price}</div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelect(plan)}
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? "Processing..." : plan.cta}
              </button>
            </div>
          )
        })}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Back
        </button>
        
        <div className="text-sm text-gray-500">
          Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact us</a>
        </div>
      </div>
    </div>
  )
}

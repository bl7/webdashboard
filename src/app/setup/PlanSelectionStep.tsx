"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Plan {
  id: string
  name: string
  monthly: string
  yearly: string
  price_monthly: number
  price_yearly: number
  price_id_monthly: string
  price_id_yearly: string
  features: string[] | Record<string, boolean | string>
  description: string
  highlight?: boolean
  cta?: string
  badge?: string
  maxUsers?: number
  storageLimit?: string
  apiCalls?: string
  support?: string
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
  const [plans, setPlans] = useState<Plan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [plansError, setPlansError] = useState<string | null>(null)
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      setPlansLoading(true)
      setPlansError(null)

      try {
        const response = await fetch("/api/plans/secure", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format")
        }

        const formattedPlans = data.map((plan: any) => ({
          ...plan,
          price_id_monthly: plan.stripe_price_id_monthly || plan.price_id_monthly,
          price_id_yearly: plan.stripe_price_id_yearly || plan.price_id_yearly,
          price_monthly: Number(plan.price_monthly) || 0,
          price_yearly: Number(plan.price_yearly) || 0,
        }))

        setPlans(formattedPlans)
      } catch (err) {
        console.error("Error fetching plans:", err)
        setPlansError(
          err instanceof Error ? err.message : "Failed to load plans. Please try again."
        )
      } finally {
        setPlansLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handlePlanSelect = async (plan: Plan) => {
    if (isLoading || processingPlanId) return

    setIsLoading(true)
    setProcessingPlanId(plan.id)
    setError(null)

    try {
      const priceId = billingPeriod === "monthly" ? plan.price_id_monthly : plan.price_id_yearly
      const userEmail = localStorage.getItem("email")

      // Comprehensive validation
      if (!userEmail) {
        throw new Error("Authentication required. Please log in again.")
      }

      if (!priceId) {
        throw new Error(
          `Price information not available for ${plan.name} (${billingPeriod} billing). Please contact support.`
        )
      }

      if (!userId) {
        throw new Error("User ID is required. Please refresh and try again.")
      }

      console.log("Creating checkout session:", {
        planId: plan.id,
        planName: plan.name,
        priceId,
        billingPeriod,
        userId: userId.substring(0, 8) + "...", // Log partial ID for debugging
      })

      const response = await fetch("/api/subscription_better/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          plan_id: plan.id,
          price_id: priceId,
          email: userEmail,
          billing_period: billingPeriod,
          plan_name: plan.name,
        }),
      })

      console.log("Checkout session response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error occurred" }))
        throw new Error(errorData.error || `Server error (${response.status}). Please try again.`)
      }

      const data = await response.json()

      if (!data.url) {
        throw new Error(
          "Checkout session created but no redirect URL received. Please contact support."
        )
      }

      console.log("Redirecting to Stripe checkout...")

      // Use window.location.assign for better error handling
      window.location.assign(data.url)
    } catch (err) {
      console.error("Checkout error:", err)
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      )
    } finally {
      setIsLoading(false)
      setProcessingPlanId(null)
    }
  }

  const formatPrice = (priceInCents: number): string => {
    return (priceInCents / 100).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }

  const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number): string => {
    const savings = (monthlyPrice * 12 - yearlyPrice) / 100
    return savings.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }

  const renderFeatureList = (features: string[] | Record<string, boolean | string>) => {
    if (Array.isArray(features)) {
      return features.map((feature: string, index: number) => (
        <li key={index} className="flex items-start gap-3">
          <svg
            className="mt-1 h-4 w-4 flex-shrink-0 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm leading-relaxed text-gray-700">{feature}</span>
        </li>
      ))
    }

    return Object.entries(features).map(
      ([key, value]: [string, boolean | string], index: number) => (
        <li key={index} className="flex items-start gap-3">
          <svg
            className="mt-1 h-4 w-4 flex-shrink-0 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm leading-relaxed text-gray-700">
            {typeof value === "string" ? `${key}: ${value}` : key}
          </span>
        </li>
      )
    )
  }

  if (plansLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-purple-600"></div>
            <span className="text-lg text-gray-600">Loading plans...</span>
          </div>
          <p className="text-gray-500">We're fetching the latest pricing information for you.</p>
        </div>
      </div>
    )
  }

  if (plansError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-white p-8 shadow-sm">
            <svg
              className="mx-auto mb-4 h-12 w-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Unable to Load Plans</h3>
            <p className="mb-6 text-gray-600">{plansError}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition-colors hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="relative flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`relative rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 ${
                billingPeriod === "monthly"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`relative rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 ${
                billingPeriod === "yearly"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
              <span className="absolute -right-2 -top-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                Save
              </span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-auto mb-8 max-w-4xl">
            <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Payment Error</h3>
                  <p className="mb-4 text-gray-600">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div
              className={`grid gap-8 ${
                plans.length === 1
                  ? "max-w-md grid-cols-1"
                  : plans.length === 2
                    ? "max-w-4xl grid-cols-1 md:grid-cols-2"
                    : "max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.name
                const isPlanProcessing = processingPlanId === plan.id

                return (
                  <div
                    key={plan.id}
                    className={`relative flex cursor-pointer flex-col rounded-2xl border bg-white transition-all duration-200 hover:shadow-lg ${
                      plan.highlight
                        ? "border-purple-200 shadow-lg ring-1 ring-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    } ${isSelected ? "border-purple-500 ring-2 ring-blue-500" : ""}`}
                    style={{ minHeight: "600px", maxWidth: "400px" }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    onClick={() => !isLoading && !isPlanProcessing && setSelectedPlan(plan.name)}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && !isLoading && !isPlanProcessing) {
                        e.preventDefault()
                        setSelectedPlan(plan.name)
                      }
                    }}
                    aria-label={`Select ${plan.name} plan`}
                  >
                    {plan.highlight && (
                      <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 transform">
                        <span className="whitespace-nowrap rounded-full bg-purple-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm">
                          {plan.badge || "Most Popular"}
                        </span>
                      </div>
                    )}

                    {/* Header Section */}
                    <div className="p-8 pb-6 text-center">
                      <h3 className="mb-3 text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-5xl font-bold text-gray-900">
                          $
                          {formatPrice(
                            billingPeriod === "monthly" ? plan.price_monthly : plan.price_yearly
                          )}
                        </span>
                        <span className="ml-1 text-lg text-gray-600">
                          /{billingPeriod === "monthly" ? "month" : "year"}
                        </span>
                      </div>

                      {billingPeriod === "yearly" && plan.price_monthly > 0 && (
                        <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                          <span className="text-xs text-green-600">17% off</span>
                        </div>
                      )}

                      <p className="leading-relaxed text-gray-600">{plan.description}</p>
                    </div>

                    {/* Features Section */}
                    <div className="flex-1 px-8 pb-6">
                      <ul className="space-y-3">{renderFeatureList(plan.features)}</ul>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-auto p-8 pt-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlanSelect(plan)
                        }}
                        disabled={isLoading || isPlanProcessing}
                        className={`w-full rounded-xl px-6 py-3 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          plan.highlight
                            ? "bg-purple-600 text-white hover:bg-purple-700 focus:ring-blue-500"
                            : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500"
                        } ${isLoading || isPlanProcessing ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        {isPlanProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="h-4 w-4 animate-spin text-white"
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
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          plan.cta || "Choose Plan"
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-6 pt-8 sm:flex-row">
          <button
            onClick={onPrev}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-gray-600 transition-colors hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <div className="flex flex-col items-center gap-4 text-center text-sm text-gray-500 sm:flex-row">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.25-4.5H19a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0119 21.75h-4.5A2.25 2.25 0 0112.25 19v-1.5"
                />
              </svg>
              Secure payment powered by Stripe
            </span>
            <span className="hidden text-gray-300 sm:inline">•</span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              No setup fees
            </span>
            <span className="hidden text-gray-300 sm:inline">•</span>
            <a
              href="/contact"
              className="font-medium text-purple-600 transition-colors hover:text-purple-700"
            >
              Need help choosing?
            </a>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="mb-6 text-sm text-gray-500">Trusted by thousands of businesses worldwide</p>
          <div className="flex items-center justify-center gap-8 text-gray-400">
            <span className="flex items-center gap-1 text-xs">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              SSL Secured
            </span>
            <span className="flex items-center gap-1 text-xs">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              GDPR Compliant
            </span>
            <span className="flex items-center gap-1 text-xs">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              SOC 2 Certified
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

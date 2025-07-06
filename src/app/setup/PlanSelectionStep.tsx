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
        const response = await fetch('/api/plans/secure', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format')
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
        console.error('Error fetching plans:', err)
        setPlansError(err instanceof Error ? err.message : 'Failed to load plans. Please try again.')
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
        throw new Error(`Price information not available for ${plan.name} (${billingPeriod} billing). Please contact support.`)
      }

      if (!userId) {
        throw new Error("User ID is required. Please refresh and try again.")
      }

      console.log('Creating checkout session:', { 
        planId: plan.id, 
        planName: plan.name,
        priceId, 
        billingPeriod,
        userId: userId.substring(0, 8) + '...' // Log partial ID for debugging
      })

      const response = await fetch("/api/subscription_better/create-checkout-session", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
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

      console.log('Checkout session response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }))
        throw new Error(errorData.error || `Server error (${response.status}). Please try again.`)
      }

      const data = await response.json()
      
      if (!data.url) {
        throw new Error("Checkout session created but no redirect URL received. Please contact support.")
      }

      console.log('Redirecting to Stripe checkout...')
      
      // Use window.location.assign for better error handling
      window.location.assign(data.url)
      
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
      setProcessingPlanId(null)
    }
  }

  const formatPrice = (priceInCents: number): string => {
    return (priceInCents / 100).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
  }

  const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number): string => {
    const savings = (monthlyPrice * 12 - yearlyPrice) / 100
    return savings.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
  }

  const renderFeatureList = (features: string[] | Record<string, boolean | string>) => {
    if (Array.isArray(features)) {
      return features.map((feature: string, index: number) => (
        <li key={index} className="flex items-start gap-3">
          <svg
            className="h-4 w-4 text-green-600 mt-1 flex-shrink-0"
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
          <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
        </li>
      ))
    }

    return Object.entries(features).map(([key, value]: [string, boolean | string], index: number) => (
      <li key={index} className="flex items-start gap-3">
        <svg
          className="h-4 w-4 text-green-600 mt-1 flex-shrink-0"
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
        <span className="text-gray-700 text-sm leading-relaxed">
          {typeof value === 'string' ? `${key}: ${value}` : key}
        </span>
      </li>
    ))
  }

  if (plansLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-lg text-gray-600">Loading plans...</span>
          </div>
          <p className="text-gray-500">We're fetching the latest pricing information for you.</p>
        </div>
      </div>
    )
  }

  if (plansError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md mx-auto shadow-sm">
            <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Plans</h3>
            <p className="text-gray-600 mb-6">{plansError}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a 10-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="relative flex items-center bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`relative px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                billingPeriod === "monthly"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`relative px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                billingPeriod === "yearly"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Save
              </span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Error</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
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
            <div className={`grid gap-8 ${
              plans.length === 1 ? 'grid-cols-1 max-w-md' :
              plans.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl'
            }`}>
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.name
                const isPlanProcessing = processingPlanId === plan.id
                
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-lg flex flex-col ${
                      plan.highlight
                        ? "border-purple-200 shadow-lg ring-1 ring-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    } ${isSelected ? "ring-2 ring-blue-500 border-purple-500" : ""}`}
                    style={{ minHeight: '600px', maxWidth: '400px' }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    onClick={() => !isLoading && !isPlanProcessing && setSelectedPlan(plan.name)}
                    onKeyDown={e => {
                      if ((e.key === "Enter" || e.key === " ") && !isLoading && !isPlanProcessing) {
                        e.preventDefault()
                        setSelectedPlan(plan.name)
                      }
                    }}
                    aria-label={`Select ${plan.name} plan`}
                  >
                    {plan.highlight && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm whitespace-nowrap">
                          {plan.badge || "Most Popular"}
                        </span>
                      </div>
                    )}

                    {/* Header Section */}
                    <div className="text-center p-8 pb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-5xl font-bold text-gray-900">
                          ${formatPrice(billingPeriod === "monthly" ? plan.price_monthly : plan.price_yearly)}
                        </span>
                        <span className="text-lg text-gray-600 ml-1">
                          /{billingPeriod === "monthly" ? "month" : "year"}
                        </span>
                      </div>
                      
                      {billingPeriod === "yearly" && plan.price_monthly > 0 && (
                        <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                          <span className="text-green-600 text-xs">17% off</span>
                        </div>
                      )}
                      
                      <p className="text-gray-600 leading-relaxed">{plan.description}</p>
                    </div>

                    {/* Features Section */}
                    <div className="flex-1 px-8 pb-6">
                      <ul className="space-y-3">
                        {renderFeatureList(plan.features)}
                      </ul>
                    </div>

                    {/* CTA Section */}
                    <div className="p-8 pt-6 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlanSelect(plan)
                        }}
                        disabled={isLoading || isPlanProcessing}
                        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          plan.highlight
                            ? "bg-purple-600 text-white hover:bg-purple-700 focus:ring-blue-500"
                            : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500"
                        } ${(isLoading || isPlanProcessing) ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isPlanProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8">
          <button
            onClick={onPrev}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500 text-center">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.25-4.5H19a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0119 21.75h-4.5A2.25 2.25 0 0112.25 19v-1.5" />
              </svg>
              Secure payment powered by Stripe
            </span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              No setup fees
            </span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <a href="/contact" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
              Need help choosing?
            </a>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm mb-6">
            Trusted by thousands of businesses worldwide
          </p>
          <div className="flex justify-center items-center gap-8 text-gray-400">
            <span className="text-xs flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              SSL Secured
            </span>
            <span className="text-xs flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              GDPR Compliant
            </span>
            <span className="text-xs flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              SOC 2 Certified
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
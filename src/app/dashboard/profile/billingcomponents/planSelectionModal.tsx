"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, X, AlertTriangle, Info } from "lucide-react"
import clsx from "clsx"

// Plan configuration with better type safety
interface PlanConfig {
  id: string // Unique identifier for internal use
  name: string // Display name
  monthly: string
  yearly: string
  price_id_monthly: string | null
  price_id_yearly: string | null
  features: Record<string, boolean | string>
  description: string
  highlight: boolean
  cta: string
  tier: number // For upgrade/downgrade logic
  backendPlanName: string
}

const PLANS: PlanConfig[] = [
  {
    id: "free",
    name: "Starter Kitchen",
    monthly: "Free",
    yearly: "Free",
    price_id_monthly: null,
    price_id_yearly: null,
    tier: 0,
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
    backendPlanName: "Free Plan", // Add this field
  },
  {
    id: "pro_kitchen",
    name: "🧑‍🍳 Pro Kitchen",
    monthly: "£20/mo",
    yearly: "£216/yr (10% off)",
    price_id_monthly: "price_1RZnHW6acbqNMwXigvqDdo8I",
    price_id_yearly: "price_1RZnI76acbqNMwXiW5y61Vfl",
    tier: 1,
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
    cta: "Start Pro Plan",
    backendPlanName: "Pro Kitchen", // Add this field
  },
  {
    id: "multi_site",
    name: "Multi-Site Mastery",
    monthly: "£25/mo",
    yearly: "£270/yr (10% off)",
    price_id_monthly: "price_1RZnIb6acbqNMwXiSMZnDKvH",
    price_id_yearly: "price_1RZnIv6acbqNMwXi4cEZhKU8",
    tier: 2,
    features: {
      "Device Provided": "Sunmi or Epson Included",
      "Unlimited Label Printing": true,
      "Access to Web Dashboard": true,
      "Sunmi Printer Support": true,
      "Weekly Free Prints": false,
    },
    description:
      "Everything in Pro plus Web Dashboard access and support for Sunmi touchscreen printers.",
    highlight: false,
    cta: "Go Premium",
    backendPlanName: "Multi-Site Mastery", // Add this field
  },
]

// Legacy plan name mapping for backward compatibility
const LEGACY_PLAN_MAPPING: Record<string, string> = {
  // Backend plan names to frontend IDs
  "Free Plan": "free",
  "Pro Kitchen": "pro_kitchen",
  "Multi-Site Mastery": "multi_site",
  // Frontend display names to IDs
  "Starter Kitchen": "free",
  "🧑‍🍳 Pro Kitchen": "pro_kitchen",
}

type ChangeType = "upgrade" | "downgrade" | "same" | "billing_change"
type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
type BillingPeriod = "monthly" | "yearly"

interface Props {
  userid: string
  currentPlan: string
  currentBillingPeriod?: BillingPeriod
  subscriptionStatus?: SubscriptionStatus
  nextBillingDate?: string
  onClose: () => void
  onUpdate: (planId: string, billingPeriod: BillingPeriod) => void
}

export default function PlanSelectionModal({
  userid,
  currentPlan,
  currentBillingPeriod = "monthly",
  subscriptionStatus = "active",
  nextBillingDate,
  onClose,
  onUpdate,
}: Props) {
  // State management
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(currentBillingPeriod)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Utility functions
  const normalizePlanId = useCallback((planName: string): string => {
    // Check legacy mapping first
    if (LEGACY_PLAN_MAPPING[planName]) {
      return LEGACY_PLAN_MAPPING[planName]
    }

    // Check if it's already a valid plan ID
    if (PLANS.find((p) => p.id === planName)) {
      return planName
    }

    // Try to find by name
    const plan = PLANS.find((p) => p.name === planName)
    return plan?.id || "free" // Default to free if not found
  }, [])

  const findPlan = useCallback((planId: string): PlanConfig | undefined => {
    return PLANS.find((p) => p.id === planId)
  }, [])

  // Initialize selected plan
  useEffect(() => {
    const normalizedId = normalizePlanId(currentPlan)
    setSelectedPlanId(normalizedId)
  }, [currentPlan, normalizePlanId])

  // Get user email from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const email = localStorage.getItem("email")
        setUserEmail(email)
      } catch (err) {
        console.warn("Failed to access localStorage:", err)
      }
    }
  }, [])

  // Calculate change type
  const changeType = useMemo((): ChangeType => {
    const currentPlanId = normalizePlanId(currentPlan)
    const currentPlanConfig = findPlan(currentPlanId)
    const selectedPlanConfig = findPlan(selectedPlanId)

    if (!currentPlanConfig || !selectedPlanConfig) return "same"

    if (selectedPlanId !== currentPlanId) {
      return selectedPlanConfig.tier > currentPlanConfig.tier ? "upgrade" : "downgrade"
    }

    if (billingPeriod !== currentBillingPeriod) {
      return "billing_change"
    }

    return "same"
  }, [selectedPlanId, billingPeriod, currentPlan, currentBillingPeriod, normalizePlanId, findPlan])

  // Get appropriate price ID
  const getSelectedPriceId = useCallback((): string | null => {
    const plan = findPlan(selectedPlanId)
    if (!plan) return null
    return billingPeriod === "monthly" ? plan.price_id_monthly : plan.price_id_yearly
  }, [selectedPlanId, billingPeriod, findPlan])

  // Change message logic
  const changeMessage = useMemo(() => {
    const selectedPlan = findPlan(selectedPlanId)
    if (!selectedPlan) return null

    if (subscriptionStatus === "past_due") {
      return {
        type: "warning" as const,
        message:
          "Your current subscription is past due. Please update your payment method before changing plans.",
      }
    }

    if (subscriptionStatus === "canceled") {
      return {
        type: "warning" as const,
        message:
          "Your subscription is canceled. Selecting a new plan will create a new subscription.",
      }
    }

    const formatDate = (dateString?: string) => {
      if (!dateString) return ""
      try {
        return new Date(dateString).toLocaleDateString()
      } catch {
        return ""
      }
    }

    switch (changeType) {
      case "upgrade":
        return {
          type: "info" as const,
          message:
            "You'll be upgraded immediately with prorated billing. Any unused time from your current plan will be credited.",
        }

      case "downgrade":
        const isDowngradeToFree = !getSelectedPriceId()
        const dateStr = formatDate(nextBillingDate)
        return {
          type: "warning" as const,
          message: isDowngradeToFree
            ? `Your subscription will be canceled and you'll switch to the free plan at the end of your billing period${dateStr ? ` (${dateStr})` : ""}.`
            : `You'll be downgraded at the end of your billing period${dateStr ? ` (${dateStr})` : ""}.`,
        }

      case "billing_change":
        const newPrice = billingPeriod === "yearly" ? selectedPlan.yearly : selectedPlan.monthly
        const billingDateStr = formatDate(nextBillingDate)
        return {
          type: "info" as const,
          message: `Your billing will change to ${billingPeriod} (${newPrice}) on your next cycle${billingDateStr ? ` (${billingDateStr})` : ""}.`,
        }

      default:
        return null
    }
  }, [
    selectedPlanId,
    subscriptionStatus,
    changeType,
    billingPeriod,
    nextBillingDate,
    findPlan,
    getSelectedPriceId,
  ])
  console.log("=== PLAN NAME DEBUG ===")
  console.log("Frontend selectedPlanId:", selectedPlanId)
  console.log("Selected plan object:", findPlan(selectedPlanId))
  console.log("=======================")
  // Input validation
  const validateInputs = useCallback((): boolean => {
    setError(null)

    if (!userid?.trim()) {
      setError("Invalid user ID")
      return false
    }

    const plan = findPlan(selectedPlanId)
    if (!plan) {
      setError("Invalid plan selection")
      return false
    }

    const priceId = getSelectedPriceId()
    if (priceId && !userEmail?.trim()) {
      setError("Email is required for paid plans. Please refresh and try again.")
      return false
    }

    return true
  }, [userid, selectedPlanId, userEmail, findPlan, getSelectedPriceId])

  // Handle successful payment callback
  const handleSuccessfulPayment = useCallback(
    async (sessionId: string) => {
      try {
        const response = await fetch("/api/subscriptions/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            user_id: userid,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.subscription) {
            const planId = normalizePlanId(data.subscription.plan_name)
            const billing = data.subscription.billing_interval as BillingPeriod
            onUpdate(planId, billing)
          }
        }
      } catch (error) {
        console.error("Error verifying payment:", error)
        setError("Failed to verify payment. Please contact support if the issue persists.")
      }
    },
    [userid, onUpdate, normalizePlanId]
  )

  // Handle URL parameters for successful payments
  useEffect(() => {
    if (typeof window === "undefined") return

    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get("success")
    const sessionId = urlParams.get("session_id")

    if (success === "true" && sessionId) {
      handleSuccessfulPayment(sessionId)

      // Clean up URL parameters
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, "", cleanUrl)
    }
  }, [handleSuccessfulPayment])

  // Main update function
  const updatePlan = useCallback(async () => {
    if (!validateInputs()) return

    setLoading(true)
    setError(null)

    const selectedPlan = findPlan(selectedPlanId)
    if (!selectedPlan) {
      setError("Invalid plan selection.")
      setLoading(false)
      return
    }

    const priceId = getSelectedPriceId()
    const isFreePlan = !priceId
    const currentPlanId = normalizePlanId(currentPlan)
    const isCurrentlyFree = currentPlanId === "free"
    console.log("=== DEBUG INFO ===")
    console.log("selectedPlanId:", selectedPlanId)
    console.log("billingPeriod:", billingPeriod)
    console.log("selectedPlan:", selectedPlan)
    console.log("selectedPlan.price_id_monthly:", selectedPlan?.price_id_monthly)
    console.log("selectedPlan.price_id_yearly:", selectedPlan?.price_id_yearly)

    // Debug getSelectedPriceId function directly
    const debugPlan = findPlan(selectedPlanId)
    const debugPriceId =
      billingPeriod === "monthly" ? debugPlan?.price_id_monthly : debugPlan?.price_id_yearly
    console.log("debugPlan from findPlan:", debugPlan)
    console.log("debugPriceId (manual calculation):", debugPriceId)

    console.log("priceId from getSelectedPriceId():", priceId)
    console.log("isFreePlan:", isFreePlan)
    console.log("=================")

    try {
      if (isFreePlan) {
        console.log("GOING TO FREE PLAN PATH")
        // Handle free plan
        const response = await fetch("/api/subscriptions", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userid,
            price_id: null,
            status: "active",
            plan_name: selectedPlan.name,
            plan_amount: 0,
            billing_interval: null,
            next_amount_due: 0,
          }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || "Failed to switch to free plan")
        }

        onUpdate(selectedPlanId, billingPeriod)
        onClose()
      } else {
        // Handle paid plans
        console.log("GOING TO PAID PLAN PATH")
        if (isCurrentlyFree || subscriptionStatus === "canceled") {
          // Create new Stripe checkout session
          if (!userEmail) {
            throw new Error("Email is required for checkout")
          }

          const response = await fetch("/api/stripe/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userid,
              email: userEmail,
              price_id: priceId,
            }),
          })

          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.error || "Failed to create checkout session")
          }

          if (data.url) {
            window.location.href = data.url
          } else {
            throw new Error("No checkout URL received")
          }
        } else {
          // Update existing subscription
          const response = await fetch("/api/subscriptions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userid,
              price_id: priceId,
              prorate: changeType === "upgrade",
            }),
          })

          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.error || "Failed to update subscription")
          }

          if (data.success) {
            onUpdate(selectedPlanId, billingPeriod)
            onClose()
          } else {
            throw new Error("Subscription update failed")
          }
        }
      }
    } catch (err: any) {
      console.error("Plan update error:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }, [
    validateInputs,
    selectedPlanId,
    billingPeriod,
    findPlan,
    getSelectedPriceId,
    normalizePlanId,
    currentPlan,
    subscriptionStatus,
    userid,
    userEmail,
    changeType,
    onUpdate,
    onClose,
  ])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, planId: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (!loading) setSelectedPlanId(planId)
      }
    },
    [loading]
  )

  // Determine button state
  const isButtonDisabled = loading || changeType === "same"
  const buttonText = loading ? "Saving..." : "Save Changes"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-2 transition-colors hover:bg-gray-200"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Billing Period Toggle */}
        <div className="mb-6 flex justify-center space-x-4">
          {(["monthly", "yearly"] as const).map((period) => (
            <Button
              key={period}
              variant={billingPeriod === period ? "default" : "outline"}
              onClick={() => setBillingPeriod(period)}
              disabled={loading}
              className="transition-all"
            >
              {period === "monthly" ? "Monthly" : "Yearly (save 10%)"}
            </Button>
          ))}
        </div>

        {/* Plans Grid */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id
            const currentPrice = billingPeriod === "monthly" ? plan.monthly : plan.yearly

            return (
              <div
                key={plan.id}
                onClick={() => !loading && setSelectedPlanId(plan.id)}
                className={clsx(
                  "cursor-pointer rounded-lg border p-5 shadow-sm transition-all duration-200 hover:shadow-md",
                  isSelected
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                    : "border-gray-300 bg-white",
                  plan.highlight && !isSelected && "border-yellow-400 bg-yellow-50",
                  loading && "cursor-not-allowed opacity-50"
                )}
                role="radio"
                aria-checked={isSelected}
                tabIndex={loading ? -1 : 0}
                onKeyDown={(e) => handleKeyDown(e, plan.id)}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {plan.highlight && (
                    <span
                      className="text-yellow-500"
                      title="Recommended"
                      aria-label="Recommended Plan"
                    >
                      ⭐
                    </span>
                  )}
                </div>

                <p className="mb-3 text-sm leading-relaxed text-gray-600">{plan.description}</p>

                <p className="mb-4 text-xl font-bold text-gray-900">{currentPrice}</p>

                <ul className="mb-4 space-y-2 text-sm">
                  {Object.entries(plan.features).map(([feature, included]) => (
                    <li key={feature} className="flex items-start space-x-2">
                      <div className="mt-0.5 flex-shrink-0">
                        {typeof included === "boolean" ? (
                          included ? (
                            <CheckCircle2 className="text-green-600" size={16} />
                          ) : (
                            <X className="text-red-500" size={16} />
                          )
                        ) : (
                          <Info className="text-blue-500" size={16} />
                        )}
                      </div>
                      <span className="text-gray-700">
                        {feature}
                        {typeof included === "string" && `: ${included}`}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isSelected ? "default" : "outline"}
                  disabled={loading}
                  className="w-full transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!loading) setSelectedPlanId(plan.id)
                  }}
                >
                  {plan.cta}
                </Button>
              </div>
            )
          })}
        </div>

        {/* Info/Warning Messages */}
        {changeMessage && (
          <div
            className={clsx(
              "mb-4 flex items-start space-x-3 rounded-lg border p-4 text-sm",
              changeMessage.type === "warning"
                ? "border-yellow-400 bg-yellow-50 text-yellow-800"
                : "border-blue-400 bg-blue-50 text-blue-800"
            )}
          >
            <div className="mt-0.5 flex-shrink-0">
              {changeMessage.type === "warning" ? <AlertTriangle size={18} /> : <Info size={18} />}
            </div>
            <p className="leading-relaxed">{changeMessage.message}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 flex items-start space-x-3 rounded-lg border border-red-500 bg-red-50 p-4 text-sm text-red-700">
            <div className="mt-0.5 flex-shrink-0">
              <AlertTriangle size={18} />
            </div>
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 border-t pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading} className="transition-all">
            Cancel
          </Button>
          <Button
            onClick={updatePlan}
            disabled={isButtonDisabled}
            className="min-w-[120px] transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, X, AlertTriangle, Info, Crown } from "lucide-react"
import clsx from "clsx"

interface PlanConfig {
  id: string
  name: string
  monthly: string
  yearly: string
  price_id_monthly: string | null
  price_id_yearly: string | null
  features: Record<string, boolean | string>
  description: string
  highlight: boolean
  cta: string
  tier: number
  monthlyValue: number
  yearlyValue: number
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
    monthlyValue: 0,
    yearlyValue: 0,
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
    id: "pro_kitchen",
    name: "🧑‍🍳 Pro Kitchen",
    monthly: "£20/mo",
    yearly: "£216/yr (10% off)",
    price_id_monthly: "price_1RZnHW6acbqNMwXigvqDdo8I",
    price_id_yearly: "price_1RZnI76acbqNMwXiW5y61Vfl",
    tier: 1,
    monthlyValue: 20,
    yearlyValue: 216,
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
  },
  {
    id: "multi_site",
    name: "Multi-Site Mastery",
    monthly: "£25/mo",
    yearly: "£270/yr (10% off)",
    price_id_monthly: "price_1RZnIb6acbqNMwXiSMZnDKvH",
    price_id_yearly: "price_1RZnIv6acbqNMwXi4cEZhKU8",
    tier: 2,
    monthlyValue: 25,
    yearlyValue: 270,
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
  },
]

// Enhanced plan name normalization with price-based detection (from first file)
const normalizePlanName = (planName: string): string => {
  console.log("🔍 Normalizing plan name:", planName)

  if (!planName || typeof planName !== "string") {
    console.log("❌ Invalid plan name, defaulting to free")
    return "free"
  }

  const cleaned = planName.trim().toLowerCase()
  console.log("🧹 Cleaned plan name:", cleaned)

  // First, try price-based detection for patterns like "Annual Plan ($270)"
  const priceMatch = cleaned.match(/\$?(\d+)/)
  if (priceMatch) {
    const price = parseInt(priceMatch[1])
    console.log("💰 Found price in plan name:", price)

    const priceMapping: Record<number, string> = {
      270: "multi_site", // £270/yr = Multi-Site Mastery yearly
      25: "multi_site", // £25/mo = Multi-Site Mastery monthly
      216: "pro_kitchen", // £216/yr = Pro Kitchen yearly
      20: "pro_kitchen", // £20/mo = Pro Kitchen monthly
      0: "free", // Free plan
    }

    if (priceMapping[price]) {
      console.log("✅ Price-based mapping found:", priceMapping[price])
      return priceMapping[price]
    }
  }

  // Enhanced text-based mapping
  const mapping: Record<string, string> = {
    // Free plan variations
    free: "free",
    "free plan": "free",
    starter: "free",
    "starter kitchen": "free",
    basic: "free",

    // Pro Kitchen variations
    pro: "pro_kitchen",
    "pro kitchen": "pro_kitchen",
    "🧑‍🍳 pro kitchen": "pro_kitchen",
    professional: "pro_kitchen",
    "professional kitchen": "pro_kitchen",
    "pro plan": "pro_kitchen",

    // Multi-Site variations
    multi: "multi_site",
    "multi-site": "multi_site",
    "multi site": "multi_site",
    "multi-site mastery": "multi_site",
    multisite: "multi_site",
    enterprise: "multi_site",
    premium: "multi_site",

    // Add price-based patterns
    "annual plan": "multi_site",
    "monthly plan": "multi_site",
  }

  if (mapping[cleaned]) {
    console.log("✅ Direct mapping found:", mapping[cleaned])
    return mapping[cleaned]
  }

  // Fuzzy matching
  for (const [key, value] of Object.entries(mapping)) {
    if (cleaned.includes(key) || key.includes(cleaned)) {
      console.log("🎯 Fuzzy match found:", value)
      return value
    }
  }

  // Special handling for "annual" keyword
  if (cleaned.includes("annual") || cleaned.includes("yearly")) {
    console.log("📅 Annual plan detected, checking price context...")
    if (cleaned.includes("270")) {
      console.log("✅ Annual $270 plan = multi_site")
      return "multi_site"
    }
    if (cleaned.includes("216")) {
      console.log("✅ Annual $216 plan = pro_kitchen")
      return "pro_kitchen"
    }
  }

  console.warn(`❓ Unknown plan name: "${planName}", falling back to free`)
  return "free"
}

// Enhanced function to get current plan info with validation (from first file)
const getCurrentPlanInfo = (planName: string, subscriptionData?: any) => {
  console.log("📊 Getting current plan info for:", planName)
  console.log("📊 Subscription data:", subscriptionData)

  const normalizedId = normalizePlanName(planName)
  const planConfig = PLANS.find((p) => p.id === normalizedId)

  const result = {
    id: normalizedId,
    config: planConfig,
    isValid: !!planConfig,
    originalPlanName: planName,
  }

  console.log("📊 Plan info result:", result)
  return result
}

const getEffectiveMonthlyValue = (plan: PlanConfig, billingPeriod: BillingPeriod): number => {
  if (plan.id === "free") return 0
  return billingPeriod === "monthly" ? plan.monthlyValue : plan.yearlyValue / 12
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
  subscriptionData?: any // For debugging
  onClose: () => void
  onUpdate: (priceId: string | null) => void
}

export default function PlanSelectionModal({
  userid,
  currentPlan,
  currentBillingPeriod = "monthly",
  subscriptionStatus = "active",
  nextBillingDate,
  subscriptionData,
  onClose,
  onUpdate,
}: Props) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(currentBillingPeriod)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Enhanced plan finding with better logging (from first file)
  const findPlan = useCallback((planId: string): PlanConfig | undefined => {
    console.log("🔍 Finding plan for ID:", planId)
    let plan = PLANS.find((p) => p.id === planId)

    if (!plan) {
      console.log("❌ Direct match not found, trying normalization...")
      const normalizedId = normalizePlanName(planId)
      plan = PLANS.find((p) => p.id === normalizedId)
    }

    console.log("🔍 Plan found:", plan?.name || "None")
    return plan
  }, [])

  // Enhanced initialization with better logging (from first file)
  useEffect(() => {
    console.log("🚀 Initializing plan selection modal...")
    console.log("📥 Props received:", {
      userid,
      currentPlan,
      currentBillingPeriod,
      subscriptionStatus,
      nextBillingDate,
      subscriptionData,
    })

    const { id: normalizedId, isValid } = getCurrentPlanInfo(currentPlan, subscriptionData)

    if (!isValid) {
      console.warn(
        `⚠️ Current plan "${currentPlan}" not found in PLANS config, using "${normalizedId}"`
      )
    } else {
      console.log(`✅ Successfully mapped "${currentPlan}" to "${normalizedId}"`)
    }

    setSelectedPlanId(normalizedId)
  }, [currentPlan, subscriptionData])

  // Get user email
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const email = localStorage.getItem("email")
        setUserEmail(email)
        console.log("📧 User email loaded:", email ? "Found" : "Not found")
      } catch (err) {
        console.warn("Failed to access localStorage:", err)
      }
    }
  }, [])

  // Current plan info with enhanced debugging (from first file)
  const currentPlanInfo = useMemo(() => {
    const info = getCurrentPlanInfo(currentPlan, subscriptionData)
    console.log("🏷️ Current plan info computed:", info)
    return info
  }, [currentPlan, subscriptionData])

  // Enhanced change type calculation
  const changeType = useMemo((): ChangeType => {
    const currentPlanId = normalizePlanName(currentPlan)
    const currentPlanConfig = findPlan(currentPlanId)
    const selectedPlanConfig = findPlan(selectedPlanId)

    if (!currentPlanConfig || !selectedPlanConfig) return "same"

    if (selectedPlanId === currentPlanId && billingPeriod !== currentBillingPeriod) {
      return "billing_change"
    }

    if (selectedPlanId === currentPlanId && billingPeriod === currentBillingPeriod) {
      return "same"
    }

    const currentEffectiveMonthlyValue = getEffectiveMonthlyValue(
      currentPlanConfig,
      currentBillingPeriod
    )
    const selectedEffectiveMonthlyValue = getEffectiveMonthlyValue(
      selectedPlanConfig,
      billingPeriod
    )

    if (selectedEffectiveMonthlyValue > currentEffectiveMonthlyValue) {
      return "upgrade"
    } else if (selectedEffectiveMonthlyValue < currentEffectiveMonthlyValue) {
      return "downgrade"
    } else {
      return selectedPlanConfig.tier > currentPlanConfig.tier ? "upgrade" : "downgrade"
    }
  }, [selectedPlanId, billingPeriod, currentPlan, currentBillingPeriod, findPlan])

  const getSelectedPriceId = useCallback((): string | null => {
    const plan = findPlan(selectedPlanId)
    if (!plan) return null
    return billingPeriod === "monthly" ? plan.price_id_monthly : plan.price_id_yearly
  }, [selectedPlanId, billingPeriod, findPlan])

  const changeMessage = useMemo(() => {
    const selectedPlan = findPlan(selectedPlanId)
    const currentPlanConfig = findPlan(normalizePlanName(currentPlan))
    if (!selectedPlan || !currentPlanConfig) return null

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

    const currentEffectiveMonthly = getEffectiveMonthlyValue(
      currentPlanConfig,
      currentBillingPeriod
    )
    const selectedEffectiveMonthly = getEffectiveMonthlyValue(selectedPlan, billingPeriod)
    const costDifference = Math.abs(selectedEffectiveMonthly - currentEffectiveMonthly)

    switch (changeType) {
      case "upgrade":
        return {
          type: "info" as const,
          message: `You'll be upgraded immediately with prorated billing. This will increase your effective monthly cost by £${costDifference.toFixed(2)}.`,
        }

      case "downgrade":
        const isDowngradeToFree = !getSelectedPriceId()
        const dateStr = formatDate(nextBillingDate)
        const savingsMessage =
          costDifference > 0 ? ` You'll save £${costDifference.toFixed(2)} per month.` : ""

        return {
          type: "warning" as const,
          message: isDowngradeToFree
            ? `Your subscription will be canceled and you'll switch to the free plan at the end of your billing period${dateStr ? ` (${dateStr})` : ""}.${savingsMessage}`
            : `You'll be downgraded at the end of your billing period${dateStr ? ` (${dateStr})` : ""}.${savingsMessage}`,
        }

      case "billing_change":
        const newPrice = billingPeriod === "yearly" ? selectedPlan.yearly : selectedPlan.monthly
        const billingDateStr = formatDate(nextBillingDate)
        const yearlyIsCheaper = billingPeriod === "yearly"
        const savingsText = yearlyIsCheaper ? " (You'll save with annual billing!)" : ""

        return {
          type: "info" as const,
          message: `Your billing will change to ${billingPeriod} (${newPrice}) on your next cycle${billingDateStr ? ` (${billingDateStr})` : ""}.${savingsText}`,
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
    currentPlan,
    currentBillingPeriod,
    findPlan,
    getSelectedPriceId,
  ])

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

  const updatePlan = useCallback(async () => {
    if (!validateInputs()) return

    setLoading(true)
    setError(null)

    try {
      const priceId = getSelectedPriceId()
      const isFreePlan = !priceId
      const currentPlanId = normalizePlanName(currentPlan)
      const isCurrentlyFree = currentPlanId === "free"

      console.log("=== PLAN UPDATE DEBUG ===")
      console.log("selectedPlanId:", selectedPlanId)
      console.log("billingPeriod:", billingPeriod)
      console.log("priceId:", priceId)
      console.log("changeType:", changeType)
      console.log("isCurrentlyFree:", isCurrentlyFree)
      console.log("subscriptionStatus:", subscriptionStatus)
      console.log("========================")

      // Case 1: Downgrading to free plan
      if (isFreePlan) {
        console.log("🔄 Downgrading to free plan")
        await onUpdate(priceId) // This should handle the downgrade to free
      }
      // Case 2: Already have active subscription - update it
      else if (!isCurrentlyFree && subscriptionStatus === "active") {
        console.log("🔄 Updating existing paid subscription")
        await onUpdate(priceId) // This should call POST /api/subscriptions
      }
      // Case 3: Moving from free to paid, or reactivating canceled subscription
      else if (
        isCurrentlyFree ||
        subscriptionStatus === "canceled" ||
        subscriptionStatus === "incomplete"
      ) {
        console.log("🔄 Creating new subscription (free to paid or reactivating)")

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
      }
      // Case 4: Other subscription statuses that need special handling
      else {
        console.log("🔄 Handling special subscription status:", subscriptionStatus)

        // For past_due, unpaid, etc. - try to update but might need checkout
        if (subscriptionStatus === "past_due" || subscriptionStatus === "unpaid") {
          // First try to update the subscription
          try {
            await onUpdate(priceId)
          } catch (error) {
            console.log("Update failed, falling back to checkout:", error)
            // If update fails, fall back to checkout for payment method update
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
          }
        } else {
          throw new Error(`Cannot update subscription with status: ${subscriptionStatus}`)
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
    getSelectedPriceId,
    currentPlan,
    subscriptionStatus,
    userid,
    userEmail,
    onUpdate,
    changeType,
  ])
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, planId: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (!loading) setSelectedPlanId(planId)
      }
    },
    [loading]
  )

  const isButtonDisabled = loading || changeType === "same"

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

        {/* Enhanced Current Plan Display */}
        {currentPlanInfo.config && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Current Plan {!currentPlanInfo.isValid && "(⚠️ Normalized)"}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {currentPlanInfo.config.name} -{" "}
                    {currentBillingPeriod === "monthly"
                      ? currentPlanInfo.config.monthly
                      : currentPlanInfo.config.yearly}{" "}
                    ({currentBillingPeriod})
                  </p>
                  {subscriptionStatus !== "active" && (
                    <span
                      className={clsx(
                        "mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium",
                        subscriptionStatus === "past_due"
                          ? "bg-red-100 text-red-800"
                          : subscriptionStatus === "canceled"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {subscriptionStatus.replace("_", " ").toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              {nextBillingDate && subscriptionStatus === "active" && (
                <div className="text-right">
                  <p className="text-xs text-blue-600">Next billing</p>
                  <p className="text-sm font-medium text-blue-900">
                    {new Date(nextBillingDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

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
            const isCurrent = plan.id === normalizePlanName(currentPlan)
            const currentPrice = billingPeriod === "monthly" ? plan.monthly : plan.yearly

            return (
              <div
                key={plan.id}
                onClick={() => !loading && setSelectedPlanId(plan.id)}
                className={clsx(
                  "cursor-pointer rounded-lg border p-5 shadow-sm transition-all duration-200 hover:shadow-md",
                  isSelected
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                    : isCurrent && !isSelected
                      ? "border-green-500 bg-green-50 ring-1 ring-green-200"
                      : "border-gray-300 bg-white",
                  plan.highlight && !isSelected && !isCurrent && "border-yellow-400 bg-yellow-50",
                  loading && "cursor-not-allowed opacity-50"
                )}
                role="radio"
                aria-checked={isSelected}
                tabIndex={loading ? -1 : 0}
                onKeyDown={(e) => handleKeyDown(e, plan.id)}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="flex items-center space-x-2">
                    {isCurrent && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        CURRENT
                      </span>
                    )}
                    {plan.highlight && (
                      <span className="text-yellow-500" title="Recommended">
                        ⭐
                      </span>
                    )}
                  </div>
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
                  variant={isSelected ? "default" : isCurrent ? "outline" : "outline"}
                  disabled={loading}
                  className={clsx(
                    "w-full transition-all",
                    isCurrent && !isSelected && "border-green-500 text-green-700 hover:bg-green-50"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!loading) setSelectedPlanId(plan.id)
                  }}
                >
                  {isCurrent ? "Current Plan" : plan.cta}
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
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={updatePlan} disabled={isButtonDisabled} className="min-w-[120px]">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

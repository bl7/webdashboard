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

export const PLANS: PlanConfig[] = [
  {
    id: "basic",
    name: "Basic Plan",
    monthly: "£20/mo",
    yearly: "£216/yr (10% off)",
    price_id_monthly: "price_1RZnHW6acbqNMwXigvqDdo8I",
    price_id_yearly: "price_1RZnI76acbqNMwXiW5y61Vfl",
    tier: 0,
    monthlyValue: 20,
    yearlyValue: 216,
    features: {
      "Device Provided": "Epson TM-M30 Included",
      "Unlimited Label Printing": true,
      "Access to Web Dashboard": true,
      "Sunmi Printer Support": false,
      "Weekly Free Prints": false,
    },
    description:
      "For small kitchens. Get an Epson device included and enjoy unlimited print volume with web dashboard access.",
    highlight: false,
    cta: "Start Basic Plan",
  },
  {
    id: "pro_kitchen",
    name: "🧑‍🍳 Pro Kitchen",
    monthly: "£25/mo",
    yearly: "£270/yr (10% off)",
    price_id_monthly: "price_1RZnIb6acbqNMwXiSMZnDKvH",
    price_id_yearly: "price_1RZnIv6acbqNMwXi4cEZhKU8",
    tier: 1,
    monthlyValue: 25,
    yearlyValue: 270,
    features: {
      "Device Provided": "Sunmi Device Included",
      "Unlimited Label Printing": true,
      "Access to Web Dashboard": true,
      "Sunmi Printer Support": true,
      "Weekly Free Prints": false,
    },
    description:
      "For growing kitchens. Get a Sunmi device included and enjoy unlimited print volume with advanced features.",
    highlight: true,
    cta: "Start Pro Plan",
  },
  {
    id: "multi_site",
    name: "Multi-Kitchen",
    monthly: "£50/mo",
    yearly: "£540/yr (10% off)",
    price_id_monthly: "price_1RZnIb6acbqNMwXiSMZnDKvH", // TODO: Update with correct price ID
    price_id_yearly: "price_1RZnIv6acbqNMwXi4cEZhKU8", // TODO: Update with correct price ID
    tier: 2,
    monthlyValue: 50,
    yearlyValue: 540,
    features: {
      "Device Provided": "Multiple Devices Included",
      "Unlimited Label Printing": true,
      "Access to Web Dashboard": true,
      "Sunmi Printer Support": true,
      "Weekly Free Prints": false,
      "Multiple Kitchen Support": true,
      "Centralized Management": true,
    },
    description:
      "For restaurant chains and multi-location businesses. Manage 5+ kitchens with centralized control and multiple devices.",
    highlight: false,
    cta: "Go Multi-Kitchen",
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
      540: "multi_site", // £540/yr = Multi-Kitchen yearly
      50: "multi_site", // £50/mo = Multi-Kitchen monthly
      270: "pro_kitchen", // £270/yr = Pro Kitchen yearly
      25: "pro_kitchen", // £25/mo = Pro Kitchen monthly
      216: "basic", // £216/yr = Basic Plan yearly
      20: "basic", // £20/mo = Basic Plan monthly
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

    // Basic plan variations
    basic: "basic",
    "basic plan": "basic",
    "basic kitchen": "basic",

    // Pro Kitchen variations
    pro: "pro_kitchen",
    "pro kitchen": "pro_kitchen",
    "🧑‍🍳 pro kitchen": "pro_kitchen",
    professional: "pro_kitchen",
    "professional kitchen": "pro_kitchen",
    "pro plan": "pro_kitchen",

    // Multi-Kitchen variations
    multi: "multi_site",
    "multi-site": "multi_site",
    "multi site": "multi_site",
    "multi-kitchen": "multi_site",
    "multi kitchen": "multi_site",
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
  onUpdate: (priceId: string | null) => Promise<any>
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
  const [backendMessage, setBackendMessage] = useState<string | null>(null)

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
        const dateStr = formatDate(nextBillingDate)
        const savingsMessage =
          costDifference > 0 ? ` You'll save £${costDifference.toFixed(2)} per month.` : ""

        return {
          type: "warning" as const,
          message: `You'll be downgraded at the end of your billing period${dateStr ? ` (${dateStr})` : ""}.${savingsMessage}`,
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
    setBackendMessage(null)
    try {
      const priceId = getSelectedPriceId()
      // All plans are now paid, so no free plan logic
      console.log("=== PLAN UPDATE DEBUG ===")
      console.log("selectedPlanId:", selectedPlanId)
      console.log("billingPeriod:", billingPeriod)
      console.log("priceId:", priceId)
      console.log("changeType:", changeType)
      console.log("subscriptionStatus:", subscriptionStatus)
      console.log("========================")

      // Only handle paid plan updates
      if (subscriptionStatus === "active" || (subscriptionStatus === "trialing" && changeType === "upgrade")) {
        console.log("🔄 Updating paid or trialing subscription (upgrade allowed)")
        const result = await onUpdate(priceId)
        if (result && typeof result === 'object' && 'message' in result && typeof result.message === 'string') {
          setBackendMessage(result.message)
        } else if (typeof result === 'string') {
          setBackendMessage(result)
        } else {
          setBackendMessage("Plan updated successfully.")
        }
      } else if (subscriptionStatus === "canceled" || subscriptionStatus === "incomplete") {
        console.log("🔄 Creating new subscription (reactivating)")
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
      } else if (subscriptionStatus === "past_due" || subscriptionStatus === "unpaid") {
        try {
          const result = await onUpdate(priceId)
          if (result && typeof result === 'object' && 'message' in result && typeof result.message === 'string') {
            setBackendMessage(result.message)
          } else if (typeof result === 'string') {
            setBackendMessage(result)
          } else {
            setBackendMessage("Plan updated successfully.")
          }
        } catch (error) {
          console.log("Update failed, falling back to checkout:", error)
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

  // Detect pending plan change
  const hasPendingChange = !!subscriptionData?.pending_plan_change && !!subscriptionData?.pending_plan_change_effective;
  const pendingPlanName = hasPendingChange ? (PLANS.find(p => p.id === normalizePlanName(subscriptionData.pending_plan_change))?.name || subscriptionData.pending_plan_change) : null;
  const pendingPlanEffective = hasPendingChange ? new Date(subscriptionData.pending_plan_change_effective).toLocaleDateString() : null;

  // Get the current plan's price_id for the current interval
  const currentPlanPriceId = useMemo(() => {
    if (!subscriptionData) return null;
    if (subscriptionData.billing_interval === 'year' || subscriptionData.billing_interval === 'yearly') {
      return subscriptionData.plan_id;
    } else {
      return subscriptionData.plan_id;
    }
  }, [subscriptionData]);

  // Helper to normalize interval values
  const normalizeInterval = (interval: string | undefined | null) => {
    if (!interval) return '';
    if (interval === 'month' || interval === 'monthly') return 'monthly';
    if (interval === 'year' || interval === 'yearly' || interval === 'annual') return 'yearly';
    return interval;
  };

  const currentPlanInterval = normalizeInterval(subscriptionData?.billing_interval);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        {/* Make modal wider for 4 cards */}
        <style>{`.max-w-4xl { max-width: 72rem !important; }`}</style>
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

        {/* Policy Explanation Banner */}
        <div className="mb-6 rounded-xl bg-blue-50 border-l-8 border-blue-400 p-4 text-blue-900 shadow">
          <div className="font-bold mb-1">Plan Change Policy</div>
          <ul className="list-disc pl-5 text-sm">
            <li>Upgrades take effect <span className="font-semibold">immediately</span> and are prorated. You will be charged the difference for the rest of your billing period.</li>
            <li>Downgrades take effect <span className="font-semibold">at the end of your current billing period</span>. You will continue to enjoy your current plan until then.</li>
            <li>No automatic refunds are issued for downgrades or cancellations. If you need a refund, please contact support.</li>
            <li>You can switch between monthly and yearly billing. Changes take effect at the next renewal.</li>
          </ul>
        </div>

        {/* Prominent Change Message */}
        {changeMessage && (
          <div className={clsx(
            "mb-6 p-4 rounded-xl shadow text-base font-medium",
            changeMessage.type === "warning" ? "bg-yellow-50 border-l-8 border-yellow-400 text-yellow-900" : "bg-blue-50 border-l-8 border-blue-400 text-blue-900"
          )}>
            {changeMessage.message}
          </div>
        )}

        {/* Pending Plan Change Banner */}
        {hasPendingChange && (
          <div className="mb-6 rounded-xl bg-yellow-50 border-l-8 border-yellow-400 p-4 text-yellow-900 shadow font-medium">
            <div className="font-bold mb-1">Pending Plan Change</div>
            <div>
              You have requested to change your plan to <span className="font-bold">{pendingPlanName}</span>.<br />
              This will take effect on <span className="font-bold">{pendingPlanEffective}</span>.<br />
              You cannot change your plan again until then.
            </div>
          </div>
        )}

        {/* Plan Cards (hide only the exact current plan+interval) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(() => {
            const allPlanVariants = PLANS.flatMap(plan => [
              { ...plan, interval: 'monthly', price: plan.monthly, price_id: plan.price_id_monthly },
              { ...plan, interval: 'yearly', price: plan.yearly, price_id: plan.price_id_yearly },
            ]);
            
            console.log("🔍 All plan variants:", allPlanVariants.map(p => `${p.name} (${p.interval}) - ${p.price_id}`));
            console.log("🔍 Current plan price ID:", currentPlanPriceId);
            console.log("🔍 Current plan interval:", currentPlanInterval);
            
            const filteredVariants = allPlanVariants.filter(planVariant => {
              const shouldHide = (
                planVariant.price_id === currentPlanPriceId &&
                normalizeInterval(planVariant.interval) === currentPlanInterval
              );
              
              console.log(`🔍 ${planVariant.name} (${planVariant.interval}): price_id=${planVariant.price_id}, shouldHide=${shouldHide}`);
              
              return !shouldHide;
            });
            
            console.log("🔍 Filtered variants count:", filteredVariants.length);
            
            return filteredVariants.map(planVariant => (
              <div key={planVariant.id + '-' + planVariant.interval} className={clsx(
                "rounded-xl border bg-white p-6 shadow flex flex-col justify-between",
                selectedPlanId === planVariant.id && billingPeriod === planVariant.interval ? "ring-2 ring-blue-500" : "",
                hasPendingChange ? "opacity-50 pointer-events-none" : ""
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-bold">{planVariant.name}</span>
                  {planVariant.highlight && <Crown className="h-5 w-5 text-yellow-500" />}
                  <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">{planVariant.interval === 'monthly' ? 'Monthly' : 'Yearly'}</span>
                </div>
                <div className="mb-2 text-lg font-semibold">{planVariant.price}</div>
                <div className="mb-4 text-sm text-gray-600">{planVariant.description}</div>
                <Button
                  variant={selectedPlanId === planVariant.id && billingPeriod === planVariant.interval ? "default" : "outline"}
                  className="mt-auto"
                  onClick={() => { setSelectedPlanId(planVariant.id); setBillingPeriod(planVariant.interval as BillingPeriod); }}
                  disabled={loading || hasPendingChange}
                >
                  {selectedPlanId === planVariant.id && billingPeriod === planVariant.interval ? "Selected" : planVariant.cta}
                </Button>
              </div>
            ))
          })()}
        </div>

        {/* Billing period toggle and action buttons remain unchanged */}
        <div className="flex justify-end space-x-4 border-t pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={updatePlan} disabled={isButtonDisabled || hasPendingChange} className="min-w-[120px]">
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

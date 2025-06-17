also i can see some irregularities in data input, why is current_period_end null for some62 72433ef5-2fbc-4f82-9d30-63dab50e3192 cus_SVL6BxMnfMVwee sub_1RaLAm6acbqNMwXiBz1CYPyo price_1RZnIv6acbqNMwXi4cEZhKU8 active 2026-06-15 18:20:52.000 2025-06-15 18:21:14.583 2025-06-15 18:21:14.583 year plan 270.00 year 270.00 4242 2 2032 false usd charge_automatically

63 c4a75477-9107-45b6-a1d1-8017583f8be3 cus_SVJTUlKs2qXuyb sub_1RaKF26acbqNMwXibyxg5uZ3 price_1RZnHW6acbqNMwXigvqDdo8I active 2025-07-15 17:21:12.000 2025-06-15 18:22:03.669 2025-06-15 18:22:03.669 month plan 20.00 month 20.00 4242 1 2043 false usd charge_automatically

82 bfb2d9a0-b666-42cf-9e7e-e483318c8979 cus_SVYnmdkdSbSf2g sub_1RafLB6acbqNMwXiBYuy86wX price_1RZnHW6acbqNMwXigvqDdo8I active 2025-06-16 07:41:00.002 2025-06-16 15:53:02.854 Monthly Plan ($20) 20.00 month 20.00 4242 4 2056 visa false gbp charge_automatically pm_1RafLA6acbqNMwXilTHfNftN basic

79 01e64cfe-6d56-4f5b-898a-3840ff1f6253 cus_SUsyxejEgv4fGp sub_1Rafno6acbqNMwXiiZNYfN9R price_1RZnIv6acbqNMwXi4cEZhKU8 active 2025-06-16 07:22:46.659 2025-06-16 16:22:38.315 Annual Plan ($270) 270.00 year 270.00 4242 1 2034 visa false gbp charge_automatically pm_1Rafnn6acbqNMwXiEhjjS7XR premium

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { CheckCircle2, Loader2, X, AlertTriangle, Info, Crown, Bug } from "lucide-react"

// Plan configuration (same as your original)
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
description: "Ideal for testing or low-volume use. Bring your own Epson TM-M30 and get 20 free prints every week.",
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
description: "For growing kitchens. Get an Epson device included and enjoy unlimited print volume.",
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
description: "Everything in Pro plus Web Dashboard access and support for Sunmi touchscreen printers.",
highlight: false,
cta: "Go Premium",
},
]

// Enhanced plan name normalization with price-based detection
const normalizePlanName = (planName: string): string => {
console.log('🔍 Normalizing plan name:', planName)

if (!planName || typeof planName !== "string") {
console.log('❌ Invalid plan name, defaulting to free')
return "free"
}

const cleaned = planName.trim().toLowerCase()
console.log('🧹 Cleaned plan name:', cleaned)

// First, try price-based detection for patterns like "Annual Plan ($270)"
const priceMatch = cleaned.match(/\$?(\d+)/)
if (priceMatch) {
const price = parseInt(priceMatch[1])
console.log('💰 Found price in plan name:', price)

    // Map prices to plan IDs based on your PLANS config
    const priceMapping: Record<number, string> = {
      270: "multi_site",    // £270/yr = Multi-Site Mastery yearly
      25: "multi_site",     // £25/mo = Multi-Site Mastery monthly
      216: "pro_kitchen",   // £216/yr = Pro Kitchen yearly
      20: "pro_kitchen",    // £20/mo = Pro Kitchen monthly
      0: "free"             // Free plan
    }

    if (priceMapping[price]) {
      console.log('✅ Price-based mapping found:', priceMapping[price])
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
    "annual plan": "multi_site",  // Assuming "Annual Plan ($270)" should be multi_site
    "monthly plan": "multi_site", // Could be any plan, but let's see what else we get

}

if (mapping[cleaned]) {
console.log('✅ Direct mapping found:', mapping[cleaned])
return mapping[cleaned]
}

// Fuzzy matching
for (const [key, value] of Object.entries(mapping)) {
if (cleaned.includes(key) || key.includes(cleaned)) {
console.log('🎯 Fuzzy match found:', value)
return value
}
}

// Special handling for "annual" keyword
if (cleaned.includes('annual') || cleaned.includes('yearly')) {
console.log('📅 Annual plan detected, checking price context...')
// If it's an annual plan with $270, it's definitely multi_site
if (cleaned.includes('270')) {
console.log('✅ Annual $270 plan = multi_site')
return "multi_site"
}
// If it's an annual plan with $216, it's pro_kitchen
if (cleaned.includes('216')) {
console.log('✅ Annual $216 plan = pro_kitchen')
return "pro_kitchen"
}
}

console.warn(`❓ Unknown plan name: "${planName}", falling back to free`)
return "free"
}

// Enhanced function to get current plan info with debug data
const getCurrentPlanInfo = (planName: string, subscriptionData?: any) => {
console.log('📊 Getting current plan info for:', planName)
console.log('📊 Subscription data:', subscriptionData)

const normalizedId = normalizePlanName(planName)
const planConfig = PLANS.find((p) => p.id === normalizedId)

const result = {
id: normalizedId,
config: planConfig,
isValid: !!planConfig,
originalPlanName: planName,
debugInfo: {
normalizedId,
foundConfig: !!planConfig,
subscriptionData
}
}

console.log('📊 Plan info result:', result)
return result
}

type ChangeType = "upgrade" | "downgrade" | "same" | "billing_change"
type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing" | "incomplete" | "incomplete_expired" | "unpaid"
type BillingPeriod = "monthly" | "yearly"

interface Props {
userid: string
currentPlan: string
currentBillingPeriod?: BillingPeriod
subscriptionStatus?: SubscriptionStatus
nextBillingDate?: string
subscriptionData?: any // Add this for debugging
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
const [showDebug, setShowDebug] = useState(false)

// Enhanced plan finding with better logging
const findPlan = useCallback((planId: string): PlanConfig | undefined => {
console.log('🔍 Finding plan for ID:', planId)
let plan = PLANS.find((p) => p.id === planId)

    if (!plan) {
      console.log('❌ Direct match not found, trying normalization...')
      const normalizedId = normalizePlanName(planId)
      plan = PLANS.find((p) => p.id === normalizedId)
    }

    console.log('🔍 Plan found:', plan?.name || 'None')
    return plan

}, [])

// Enhanced initialization with better logging
useEffect(() => {
console.log('🚀 Initializing plan selection modal...')
console.log('📥 Props received:', {
userid,
currentPlan,
currentBillingPeriod,
subscriptionStatus,
nextBillingDate,
subscriptionData
})

    const { id: normalizedId, isValid, debugInfo } = getCurrentPlanInfo(currentPlan, subscriptionData)

    if (!isValid) {
      console.warn(`⚠️ Current plan "${currentPlan}" not found in PLANS config, using "${normalizedId}"`)
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
console.log('📧 User email loaded:', email ? 'Found' : 'Not found')
} catch (err) {
console.warn("Failed to access localStorage:", err)
}
}
}, [])

// Current plan info with enhanced debugging
const currentPlanInfo = useMemo(() => {
const info = getCurrentPlanInfo(currentPlan, subscriptionData)
console.log('🏷️ Current plan info computed:', info)
return info
}, [currentPlan, subscriptionData])

// Debug component
const DebugPanel = () => (

<div className="mb-4 rounded-lg border border-gray-300 bg-gray-50 p-4">
<div className="mb-2 flex items-center justify-between">
<h3 className="font-medium text-gray-800">Debug Information</h3>
<button
onClick={() => setShowDebug(!showDebug)}
className="text-sm text-blue-600 hover:text-blue-800" >
{showDebug ? 'Hide' : 'Show'} Details
</button>
</div>

      {showDebug && (
        <div className="space-y-2 text-sm">
          <div><strong>Original Plan Name:</strong> "{currentPlan}"</div>
          <div><strong>Normalized Plan ID:</strong> "{currentPlanInfo.id}"</div>
          <div><strong>Plan Config Found:</strong> {currentPlanInfo.isValid ? '✅ Yes' : '❌ No'}</div>
          <div><strong>Current Billing Period:</strong> {currentBillingPeriod}</div>
          <div><strong>Subscription Status:</strong> {subscriptionStatus}</div>
          <div><strong>User ID:</strong> {userid}</div>
          <div><strong>User Email:</strong> {userEmail || 'Not found'}</div>
          <div><strong>Next Billing Date:</strong> {nextBillingDate || 'Not set'}</div>

          {subscriptionData && (
            <div>
              <strong>Raw Subscription Data:</strong>
              <pre className="mt-1 max-h-32 overflow-auto rounded bg-white p-2 text-xs">
                {JSON.stringify(subscriptionData, null, 2)}
              </pre>
            </div>
          )}

          <div>
            <strong>Available Plans:</strong>
            <ul className="mt-1 space-y-1">
              {PLANS.map(plan => (
                <li key={plan.id} className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${plan.id === currentPlanInfo.id ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span>{plan.id} - {plan.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>

)

// Rest of your component logic remains the same...
const getEffectiveMonthlyValue = (plan: PlanConfig, billingPeriod: BillingPeriod): number => {
if (plan.id === "free") return 0
return billingPeriod === "monthly" ? plan.monthlyValue : plan.yearlyValue / 12
}

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

    const currentEffectiveMonthlyValue = getEffectiveMonthlyValue(currentPlanConfig, currentBillingPeriod)
    const selectedEffectiveMonthlyValue = getEffectiveMonthlyValue(selectedPlanConfig, billingPeriod)

    if (selectedEffectiveMonthlyValue > currentEffectiveMonthlyValue) {
      return "upgrade"
    } else if (selectedEffectiveMonthlyValue < currentEffectiveMonthlyValue) {
      return "downgrade"
    } else {
      return selectedPlanConfig.tier > currentPlanConfig.tier ? "upgrade" : "downgrade"
    }

}, [selectedPlanId, billingPeriod, currentPlan, currentBillingPeriod, findPlan])

const isButtonDisabled = loading || changeType === "same"

return (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
<div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
{/_ Header _/}
<div className="mb-4 flex items-center justify-between">
<h2 className="text-2xl font-bold">Choose Your Plan</h2>
<div className="flex items-center space-x-2">
<button
onClick={() => setShowDebug(!showDebug)}
className="rounded p-2 transition-colors hover:bg-gray-200"
title="Toggle Debug Info" >
<Bug size={16} />
</button>
<button
              onClick={onClose}
              aria-label="Close"
              className="rounded p-2 transition-colors hover:bg-gray-200"
              disabled={loading}
            >
<X size={20} />
</button>
</div>
</div>

        {/* Debug Panel */}
        <DebugPanel />

        {/* Enhanced Current Plan Display */}
        {currentPlanInfo.config && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Current Plan {!currentPlanInfo.isValid && '(⚠️ Normalized)'}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {currentPlanInfo.config.name} -{" "}
                    {currentBillingPeriod === "monthly"
                      ? currentPlanInfo.config.monthly
                      : currentPlanInfo.config.yearly}{" "}
                    ({currentBillingPeriod})
                  </p>
                  {subscriptionStatus !== "active" && (
                    <span className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      subscriptionStatus === "past_due"
                        ? "bg-red-100 text-red-800"
                        : subscriptionStatus === "canceled"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
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
            <button
              key={period}
              onClick={() => setBillingPeriod(period)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg transition-all ${
                billingPeriod === period
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {period === "monthly" ? "Monthly" : "Yearly (save 10%)"}
            </button>
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
                className={`cursor-pointer rounded-lg border p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                    : isCurrent && !isSelected
                    ? "border-green-500 bg-green-50 ring-1 ring-green-200"
                    : "border-gray-300 bg-white"
                } ${plan.highlight && !isSelected && !isCurrent && "border-yellow-400 bg-yellow-50"} ${
                  loading && "cursor-not-allowed opacity-50"
                }`}
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

                <button
                  className={`w-full py-2 px-4 rounded-lg transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : isCurrent
                      ? "border border-green-500 text-green-700 hover:bg-green-50"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!loading) setSelectedPlanId(plan.id)
                  }}
                >
                  {isCurrent ? "Current Plan" : plan.cta}
                </button>
              </div>
            )
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 flex items-start space-x-3 rounded-lg border border-red-500 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 border-t pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Simplified update logic for demo
              console.log('🚀 Update button clicked')
              console.log('Selected plan:', selectedPlanId)
              console.log('Billing period:', billingPeriod)
              console.log('Change type:', changeType)
            }}
            disabled={isButtonDisabled}
            className={`min-w-[120px] px-4 py-2 rounded-lg transition-all ${
              isButtonDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>

)
}

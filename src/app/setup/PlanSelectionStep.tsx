"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Plan {
  id: string // Added id field for consistency
  name: string
  monthly: string
  yearly: string
  price_id_monthly: string
  price_id_yearly: string
  features: Record<string, any>
  description: string
  highlight: boolean
  cta: string
  tier: number // Added tier for upgrade/downgrade logic
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

// Constants for clarity and maintainability
const FREE_PLAN_ID = "free"
const STRIPE_PRICE_PREFIX = "price_"

const plans: Plan[] = [
  {
    id: "free",
    name: "Starter Kitchen",
    monthly: "Free",
    yearly: "Free",
    price_id_monthly: "free",
    price_id_yearly: "free",
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
  },
  {
    id: "pro_kitchen",
    name: "🧑🍳 Pro Kitchen",
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
    cta: "Start Basic Plan",
  },
  {
    id: "multi_site",
    name: "Multi-Site Mastery",
    monthly: "£25/mo",
    yearly: "£270/yr",
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
      "Everything in Basic plus Web Dashboard access and support for Sunmi touchscreen printers.",
    highlight: false,
    cta: "Go Premium",
  },
]

// ✅ IMPROVED: More comprehensive plan name normalization
const normalizePlanName = (planName: string): string => {
  if (!planName || typeof planName !== "string") {
    return "free"
  }

  // Clean the input - trim whitespace and normalize case
  const cleaned = planName.trim().toLowerCase()

  // Comprehensive mapping for all possible backend plan name variations
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
    "🧑🍳 pro kitchen": "pro_kitchen",
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
  }

  // Direct mapping first
  if (mapping[cleaned]) {
    return mapping[cleaned]
  }

  // Fuzzy matching for partial matches
  for (const [key, value] of Object.entries(mapping)) {
    if (cleaned.includes(key) || key.includes(cleaned)) {
      return value
    }
  }

  // Enhanced fallback: convert to snake_case and match against known IDs
  const fallback = cleaned
    .replace(/[^\w\s]/g, "") // Remove special characters except spaces
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .toLowerCase()

  // Check if fallback matches any of our plan IDs
  const knownPlanIds = ["free", "pro_kitchen", "multi_site"]
  if (knownPlanIds.includes(fallback)) {
    return fallback
  }

  // Final fallback to free
  console.warn(`Unknown plan name: "${planName}", falling back to free`)
  return "free"
}

// ✅ IMPROVED: Helper function to get current plan info
const getCurrentPlanInfo = (planName: string) => {
  const normalizedId = normalizePlanName(planName)
  const planConfig = plans.find((p) => p.id === normalizedId)

  return {
    id: normalizedId,
    config: planConfig,
    isValid: !!planConfig,
  }
}

// ✅ IMPROVED: Enhanced plan finding with validation
const findPlanById = (planId: string): Plan | undefined => {
  // First try direct match
  let plan = plans.find((p) => p.id === planId)

  // If not found, try normalizing the input
  if (!plan) {
    const normalizedId = normalizePlanName(planId)
    plan = plans.find((p) => p.id === normalizedId)
  }

  return plan
}

// ✅ IMPROVED: Find plan by name with normalization
const findPlanByName = (planName: string): Plan | undefined => {
  // First try direct name match
  let plan = plans.find((p) => p.name === planName)

  // If not found, try normalizing and finding by ID
  if (!plan) {
    const normalizedId = normalizePlanName(planName)
    plan = plans.find((p) => p.id === normalizedId)
  }

  return plan
}
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
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    // Enhanced user ID detection with multiple fallbacks
    const userId =
      localStorage.getItem("userid") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("user_id")

    // Enhanced email detection with multiple fallbacks
    const email =
      localStorage.getItem("email") ||
      localStorage.getItem("userEmail") ||
      localStorage.getItem("user_email")

    console.log("User data detection:", {
      localStorage_userid: localStorage.getItem("userid"),
      localStorage_email: localStorage.getItem("email"),
      finalUserId: userId,
      finalEmail: email,
    })

    setUserEmail(email)

    async function fetchSubscription() {
      if (!userId) {
        console.warn("No user ID found in localStorage")
        return
      }

      try {
        console.log("Fetching subscription for userId:", userId)
        const res = await fetch(`/api/subscriptions/?user_id=${encodeURIComponent(userId)}`)

        console.log("Subscription fetch response:", {
          status: res.status,
          statusText: res.statusText,
          headers: Object.fromEntries(res.headers.entries()),
        })

        if (!res.ok) {
          if (res.status === 404) {
            console.log("No existing subscription found (404) - this is normal for new users")
            return
          }
          const errorText = await res.text()
          console.error("Subscription fetch failed:", errorText)
          throw new Error(`Failed to fetch subscription: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()
        console.log("Subscription data received:", data)

        if (data.subscription) {
          setSelectedPlan(data.subscription.plan_name)
          setBillingPeriod(data.subscription.billing_interval || "monthly")
        }
      } catch (err) {
        console.warn("Failed to fetch existing subscription:", err)
        // Don't show error to user for this
      }
    }

    if (userId) {
      fetchSubscription()
    }
  }, [setSelectedPlan, setBillingPeriod])

  async function handlePlanSelect(planName: string) {
    if (saving) return

    setSaving(true)
    setError(null)

    console.log("=== PLAN SELECTION DEBUG START ===")
    console.log("Selected plan name:", planName)
    console.log("Current billing period:", billingPeriod)
    console.log("User ID:", userId)
    console.log("User email:", userEmail)

    const plan = plans.find((p) => p.name === planName)
    if (!plan) {
      const errorMsg = `Selected plan not found: ${planName}`
      console.error(errorMsg)
      console.log(
        "Available plans:",
        plans.map((p) => p.name)
      )
      setError(errorMsg)
      setSaving(false)
      return
    }

    console.log("Found plan:", plan)

    const priceId = billingPeriod === "monthly" ? plan.price_id_monthly : plan.price_id_yearly
    console.log("Price ID:", priceId)

    // Validation checks
    if (!userId || userId.trim() === "") {
      const errorMsg = "User ID is missing or empty"
      console.error(errorMsg)
      setError(errorMsg)
      setSaving(false)
      return
    }

    // Handle free plan - separate flow that bypasses Stripe
    if (priceId === FREE_PLAN_ID) {
      console.log("Processing free plan selection...")

      try {
        const requestBody = {
          user_id: userId,
          stripe_customer_id: null,
          stripe_subscription_id: null,
          price_id: null, // Store as null in database for free plans
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
        }

        console.log("Free plan request body:", requestBody)

        const res = await fetch("/api/subscriptions/", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })

        console.log("Free plan response:", {
          status: res.status,
          statusText: res.statusText,
          headers: Object.fromEntries(res.headers.entries()),
        })

        if (!res.ok) {
          const errorData = await res.text()
          console.error("Free plan selection failed:", errorData)

          let parsedError
          try {
            parsedError = JSON.parse(errorData)
          } catch {
            parsedError = { error: errorData }
          }

          throw new Error(parsedError.error || `Failed to save free plan (${res.status})`)
        }

        const responseData = await res.json()
        console.log("Free plan selection successful:", responseData)

        setSelectedPlan(planName)
        alert("Free plan selected successfully!")
        router.push("/dashboard/profile")
      } catch (e: any) {
        console.error("Free plan selection error:", e)
        setError(e.message || "Failed to select free plan")
      } finally {
        setSaving(false)
      }
      return // Early return - don't process as paid plan
    }

    // Handle paid plans - Stripe checkout flow
    console.log("Processing paid plan selection...")

    // Validate that this is a proper Stripe price ID
    if (!priceId.startsWith(STRIPE_PRICE_PREFIX)) {
      const errorMsg = "Invalid price ID format"
      console.error(errorMsg, "Price ID:", priceId)
      setError(errorMsg)
      setSaving(false)
      return
    }

    // Enhanced email validation for paid plans
    const finalEmail =
      userEmail || localStorage.getItem("email") || localStorage.getItem("userEmail")

    if (!finalEmail || finalEmail.trim() === "") {
      const errorMsg = "Email is required for paid plans. Please refresh and try again."
      console.error(errorMsg, "Current email value:", finalEmail)
      setError(errorMsg)
      setSaving(false)
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(finalEmail)) {
      const errorMsg = "Invalid email format"
      console.error(errorMsg, "Email:", finalEmail)
      setError(errorMsg)
      setSaving(false)
      return
    }

    // Store plan selection data for consistency
    const planSelectionData = {
      user_id: userId,
      plan_name: planName,
      billing_interval: billingPeriod,
      price_id: priceId,
      email: finalEmail,
      timestamp: new Date().toISOString(),
    }

    // Store in localStorage for recovery if needed
    localStorage.setItem("pendingPlanSelection", JSON.stringify(planSelectionData))

    const checkoutRequestBody = {
      user_id: userId,
      price_id: priceId,
      email: finalEmail,
    }

    console.log("Checkout session request body:", checkoutRequestBody)

    // Additional debug info
    setDebugInfo({
      ...planSelectionData,
      checkoutRequestBody,
    })

    try {
      const res = await fetch("/api/stripe/create-checkout-session/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(checkoutRequestBody),
      })

      console.log("Checkout session response:", {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
      })

      // Get response as text first to handle both JSON and non-JSON responses
      const responseText = await res.text()
      console.log("Raw response body:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError)
        throw new Error(`Invalid JSON response: ${responseText}`)
      }

      if (!res.ok) {
        console.error("Checkout session creation failed:", {
          status: res.status,
          statusText: res.statusText,
          data: data,
        })

        // Clean up pending selection on error
        localStorage.removeItem("pendingPlanSelection")

        throw new Error(
          data.error || `Failed to create checkout session (${res.status}: ${res.statusText})`
        )
      }

      console.log("Checkout session created successfully:", data)

      // Store comprehensive plan selection data for success page
      const successPageData = {
        ...planSelectionData,
        sessionId: data.sessionId,
        checkoutUrl: data.url,
      }

      localStorage.setItem("selectedPlan", planName)
      localStorage.setItem("selectedBillingPeriod", billingPeriod)
      localStorage.setItem("checkoutSessionData", JSON.stringify(successPageData))

      // Redirect to Stripe Checkout
      if (data.url) {
        console.log("Redirecting to Stripe checkout:", data.url)
        window.location.href = data.url
      } else {
        console.error("No checkout URL in response:", data)
        localStorage.removeItem("pendingPlanSelection")
        throw new Error("No checkout URL received from server")
      }
    } catch (e: any) {
      console.error("Paid plan selection error:", e)
      console.log("=== PLAN SELECTION DEBUG END ===")

      // Clean up on error
      localStorage.removeItem("pendingPlanSelection")

      setError(e.message || "Failed to initiate payment process")
      setSaving(false)
    }
  }

  // Enhanced debug logging
  useEffect(() => {
    console.log("PlanSelection Component State:", {
      userId,
      userEmail,
      selectedPlan,
      billingPeriod,
      saving,
      error,
      debugInfo,
      localStorage_keys: Object.keys(localStorage),
      localStorage_email_related: {
        email: localStorage.getItem("email"),
        userEmail: localStorage.getItem("userEmail"),
        user_email: localStorage.getItem("user_email"),
      },
    })
  }, [userId, userEmail, selectedPlan, billingPeriod, saving, error, debugInfo])

  if (!userId) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">User ID is required. Please refresh the page.</p>
          <p className="mt-2 text-sm text-gray-500">
            Debug: userId prop is {typeof userId}: "{userId}"
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h2 className="mb-6 text-center text-3xl font-bold">Step 2: Choose Your Plan</h2>

      {/* Enhanced debug info */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 rounded bg-gray-100 p-4 text-sm">
          <p>
            <strong>Debug Info:</strong>
          </p>
          <p>
            User ID: {userId} (type: {typeof userId})
          </p>
          <p>
            Email: {userEmail || "Not found"} (type: {typeof userEmail})
          </p>
          <p>Selected Plan: {selectedPlan || "None"}</p>
          <p>Billing Period: {billingPeriod}</p>
          <p>Saving: {saving.toString()}</p>
          <p>Error: {error || "None"}</p>
          <details className="mt-2">
            <summary className="cursor-pointer font-semibold">LocalStorage Contents</summary>
            <pre className="mt-2 max-h-32 overflow-auto rounded bg-white p-2 text-xs">
              {JSON.stringify(
                {
                  email: localStorage.getItem("email"),
                  userEmail: localStorage.getItem("userEmail"),
                  user_email: localStorage.getItem("user_email"),
                  pendingPlanSelection: localStorage.getItem("pendingPlanSelection"),
                  checkoutSessionData: localStorage.getItem("checkoutSessionData"),
                  allKeys: Object.keys(localStorage),
                },
                null,
                2
              )}
            </pre>
          </details>
          {Object.keys(debugInfo).length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold">Last Request Debug</summary>
              <pre className="mt-2 max-h-32 overflow-auto rounded bg-white p-2 text-xs">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

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
          const priceId = billingPeriod === "monthly" ? plan.price_id_monthly : plan.price_id_yearly
          const isPaidPlan = priceId !== FREE_PLAN_ID
          const finalEmail =
            userEmail || localStorage.getItem("email") || localStorage.getItem("userEmail")
          const canSelect: boolean =
            !isPaidPlan || (finalEmail !== null && finalEmail.trim() !== "")

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

              {/* Enhanced button with better state management */}
              <button
                onClick={() => handlePlanSelect(plan.name)}
                disabled={saving || !canSelect}
                className={`mt-auto rounded-md px-4 py-2 font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSelected
                    ? "cursor-not-allowed bg-green-600 text-white"
                    : saving
                      ? "cursor-not-allowed bg-gray-400 text-white"
                      : canSelect
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "cursor-not-allowed bg-gray-400 text-white"
                }`}
              >
                {saving && isSelected ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin text-white"
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
                    Processing...
                  </div>
                ) : isSelected ? (
                  "✓ Selected"
                ) : !canSelect ? (
                  isPaidPlan ? (
                    "Email Required"
                  ) : (
                    "Unavailable"
                  )
                ) : (
                  plan.cta
                )}
              </button>

              {/* Debug info for each plan */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-2 text-xs text-gray-500">
                  Price ID: {priceId}
                  <br />
                  Can Select: {canSelect.toString()}
                  <br />
                  Is Paid: {isPaidPlan.toString()}
                  <br />
                  Final Email: {finalEmail || "None"}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {error && (
        <div className="mt-6 rounded border border-red-400 bg-red-50 px-4 py-3 text-red-700">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm">Show Technical Details</summary>
            <pre className="mt-1 max-h-32 overflow-auto rounded bg-white p-2 text-xs">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
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

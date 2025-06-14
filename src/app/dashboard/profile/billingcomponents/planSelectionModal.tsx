"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, X, AlertTriangle, Info } from "lucide-react"
import clsx from "clsx"

const plans = [
  {
    name: "Starter Kitchen", // Keep this as display name
    internal_name: "Free Plan", // Add internal name to match API
    monthly: "Free",
    yearly: "Free",
    price_id_monthly: null,
    price_id_yearly: null,
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
    name: "🧑‍🍳 Pro Kitchen",
    internal_name: "Pro Kitchen", // Add internal name
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
    internal_name: "Multi-Site Mastery", // Add internal name
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

interface Props {
  userid: string
  currentPlan: string
  currentBillingPeriod?: "monthly" | "yearly"
  subscriptionStatus?: "active" | "past_due" | "canceled" | "trialing"
  nextBillingDate?: string
  onClose: () => void
  onUpdate: (planName: string, billingPeriod: string) => void
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
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(currentBillingPeriod)
  const [selectedPlan, setSelectedPlan] = useState(currentPlan)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [changeType, setChangeType] = useState<"upgrade" | "downgrade" | "same" | "billing_change">(
    "same"
  )

  // Helper function to normalize plan names for comparison
  const normalizePlanName = (planName: string) => {
    // Handle both "Free Plan" from API and "Starter Kitchen" from UI
    if (planName === "Free Plan" || planName === "Starter Kitchen") {
      return "Starter Kitchen"
    }
    return planName
  }

  // Helper function to find plan by either display name or internal name
  const findPlan = (planName: string) => {
    return plans.find(
      (p) =>
        p.name === planName ||
        p.internal_name === planName ||
        (planName === "Free Plan" && p.name === "Starter Kitchen")
    )
  }

  useEffect(() => {
    // Normalize current plan name for consistent comparison
    const normalizedCurrent = normalizePlanName(currentPlan)
    const normalizedSelected = normalizePlanName(selectedPlan)

    const currentIndex = plans.findIndex((p) => normalizePlanName(p.name) === normalizedCurrent)
    const selectedIndex = plans.findIndex((p) => normalizePlanName(p.name) === normalizedSelected)

    if (normalizedSelected !== normalizedCurrent) {
      setChangeType(selectedIndex > currentIndex ? "upgrade" : "downgrade")
    } else if (billingPeriod !== currentBillingPeriod) {
      setChangeType("billing_change")
    } else {
      setChangeType("same")
    }
  }, [selectedPlan, billingPeriod, currentPlan, currentBillingPeriod])

  const getChangeMessage = () => {
    const selected = findPlan(selectedPlan)
    if (!selected) return null

    if (changeType === "upgrade") {
      return {
        type: "info" as const,
        message: `You'll be upgraded immediately with prorated billing. Any unused time from your current plan will be credited.`,
      }
    }

    if (changeType === "downgrade") {
      const isDowngradeToFree =
        selected.price_id_monthly === null && selected.price_id_yearly === null
      return {
        type: "warning" as const,
        message: isDowngradeToFree
          ? `Your subscription will be canceled and you'll switch to the free plan at the end of your billing period${nextBillingDate ? ` (${new Date(nextBillingDate).toLocaleDateString()})` : ""}.`
          : `You'll be downgraded at the end of your billing period${nextBillingDate ? ` (${new Date(nextBillingDate).toLocaleDateString()})` : ""}.`,
      }
    }

    if (changeType === "billing_change") {
      const newPrice = billingPeriod === "yearly" ? selected.yearly : selected.monthly
      return {
        type: "info" as const,
        message: `Your billing will change to ${billingPeriod} (${newPrice}) on your next cycle${nextBillingDate ? ` (${new Date(nextBillingDate).toLocaleDateString()})` : ""}.`,
      }
    }

    return null
  }

  async function updatePlan() {
    setSaving(true)
    setError(null)

    const plan = findPlan(selectedPlan)
    if (!plan) {
      setError("Invalid plan selection.")
      setSaving(false)
      return
    }

    const price_id = billingPeriod === "monthly" ? plan.price_id_monthly : plan.price_id_yearly
    const isFreePlan = price_id === null
    const isCurrentlyFree = normalizePlanName(currentPlan) === "Starter Kitchen"

    try {
      if (isFreePlan) {
        // Switching to free plan - use the subscriptions API
        const res = await fetch("/api/subscriptions", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userid,
            price_id: null, // This triggers free plan logic in your API
            status: "active",
            plan_name: plan.internal_name || "Free Plan",
            plan_amount: 0,
            billing_interval: null,
            next_amount_due: 0,
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Failed to switch to free plan")
        }

        await onUpdate(selectedPlan, billingPeriod)
        onClose()
      } else {
        // Switching to paid plan
        if (isCurrentlyFree) {
          console.log("email here", localStorage.getItem("email"))
          // Creating new subscription from free plan
          const res = await fetch("/api/stripe/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userid,
              email: localStorage.getItem("email"),
              price_id,
            }),
          })

          const data = await res.json()
          if (!res.ok) {
            throw new Error(data.error || "Failed to create checkout session")
          }

          if (data?.url) {
            window.location.href = data.url
          } else {
            throw new Error("No checkout URL received")
          }
        } else {
          // Updating existing paid subscription
          const res = await fetch("/api/stripe/update-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userid,
              price_id,
              prorate: changeType === "upgrade",
            }),
          })

          const data = await res.json()
          if (!res.ok) {
            throw new Error(data.error || "Failed to update subscription")
          }

          if (data.success) {
            await onUpdate(selectedPlan, billingPeriod)
            onClose()
          } else {
            throw new Error("Subscription update failed")
          }
        }
      }
    } catch (err: any) {
      console.error("Plan update error:", err)
      setError(err.message || "Something went wrong.")
    } finally {
      setSaving(false)
    }
  }

  const allFeatures = Array.from(new Set(plans.flatMap((p) => Object.keys(p.features))))
  const changeMessage = getChangeMessage()
  const normalizedCurrentPlan = normalizePlanName(currentPlan)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="animate-fade-up max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {normalizedCurrentPlan === "Starter Kitchen"
                ? "Choose A Plan That Fits"
                : "Update Your Plan"}
            </h2>
            {normalizedCurrentPlan !== "Starter Kitchen" && (
              <p className="text-sm text-gray-500">
                Currently on {normalizedCurrentPlan} ({currentBillingPeriod})
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-6 flex justify-center gap-4 rounded-full bg-gray-100 p-1">
          {(["yearly", "monthly"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setBillingPeriod(period)}
              className={clsx(
                "rounded-full px-5 py-2 text-sm font-semibold transition",
                billingPeriod === period
                  ? "bg-purple-700 text-white shadow"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              {period === "monthly" ? "Bill Monthly" : "Bill Yearly (Save 10%)"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = normalizePlanName(plan.name) === normalizedCurrentPlan
            const isSelected = normalizePlanName(plan.name) === normalizePlanName(selectedPlan)

            return (
              <div
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                className={clsx(
                  "relative cursor-pointer rounded-2xl border-2 p-6 transition hover:shadow-lg",
                  isSelected ? "bg-purple-700 text-white shadow" : "border-gray-200",
                  plan.highlight && !isSelected && "ring-2 ring-orange-400",
                  isCurrentPlan && !isSelected && "ring-2 ring-blue-400"
                )}
              >
                {isCurrentPlan && !isSelected && (
                  <div className="absolute -right-2 -top-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                    Current
                  </div>
                )}
                <div className="mb-2 text-xl font-semibold">{plan.name}</div>
                <div className="mb-2 text-lg font-semibold">
                  {billingPeriod === "monthly" ? plan.monthly : plan.yearly}
                </div>
                <div className="mb-4 text-sm opacity-90">{plan.description}</div>
              </div>
            )
          })}
        </div>

        {changeMessage && (
          <div
            className={clsx(
              "mt-6 flex items-start gap-3 rounded-lg border p-4",
              changeMessage.type === "warning"
                ? "border-amber-200 bg-amber-50"
                : "border-blue-200 bg-blue-50"
            )}
          >
            {changeMessage.type === "warning" ? (
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            ) : (
              <Info className="h-5 w-5 text-blue-600" />
            )}
            <p
              className={clsx(
                "text-sm",
                changeMessage.type === "warning" ? "text-amber-800" : "text-blue-800"
              )}
            >
              {changeMessage.message}
            </p>
          </div>
        )}

        <div className="mt-10">
          <h3 className="mb-4 text-lg font-semibold">Compare Features</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-gray-600">Feature</th>
                  {plans.map((plan) => {
                    const isCurrentPlan = normalizePlanName(plan.name) === normalizedCurrentPlan
                    return (
                      <th key={plan.name} className="p-2 text-center font-semibold text-gray-800">
                        {plan.name}
                        {isCurrentPlan && (
                          <div className="text-xs font-normal text-blue-500">Current</div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature) => (
                  <tr key={feature} className="border-t">
                    <td className="p-2 text-gray-700">{feature}</td>
                    {plans.map((plan) => {
                      const val = plan.features[feature as keyof typeof plan.features]
                      return (
                        <td key={plan.name} className="p-2 text-center">
                          {val === true && (
                            <CheckCircle2 className="mx-auto h-4 w-4 text-green-600" />
                          )}
                          {val === false && <span className="text-gray-400">✕</span>}
                          {typeof val === "string" && (
                            <span className="text-sm text-blue-600">{val}</span>
                          )}
                          {val === undefined && <span className="text-gray-300">—</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={updatePlan}
            disabled={saving || changeType === "same"}
            className={clsx(changeType === "downgrade" && "bg-amber-600 hover:bg-amber-700")}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {changeType === "upgrade"
                  ? "Upgrading..."
                  : changeType === "downgrade"
                    ? "Scheduling..."
                    : "Updating..."}
              </>
            ) : (
              <>
                {changeType === "upgrade"
                  ? "Upgrade Now"
                  : changeType === "downgrade"
                    ? "Schedule Downgrade"
                    : "Update Billing"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

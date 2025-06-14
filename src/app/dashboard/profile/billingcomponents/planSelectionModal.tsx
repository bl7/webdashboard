import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, X, AlertTriangle, Info } from "lucide-react"
import clsx from "clsx"

const plans = [
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
    name: "🧑‍🍳 Pro Kitchen",
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

  useEffect(() => {
    // Determine the type of change
    const currentPlanIndex = plans.findIndex((p) => p.name === currentPlan)
    const selectedPlanIndex = plans.findIndex((p) => p.name === selectedPlan)

    if (selectedPlan !== currentPlan) {
      if (selectedPlanIndex > currentPlanIndex) {
        setChangeType("upgrade")
      } else {
        setChangeType("downgrade")
      }
    } else if (billingPeriod !== currentBillingPeriod) {
      setChangeType("billing_change")
    } else {
      setChangeType("same")
    }
  }, [selectedPlan, billingPeriod, currentPlan, currentBillingPeriod])

  const getChangeMessage = () => {
    const selectedPlanObj = plans.find((p) => p.name === selectedPlan)
    const currentPlanObj = plans.find((p) => p.name === currentPlan)

    if (changeType === "same") return null

    if (changeType === "upgrade") {
      return {
        type: "info" as const,
        message: `You'll be upgraded immediately with prorated billing. Any unused time from your current plan will be credited toward your new plan.`,
      }
    }

    if (changeType === "downgrade") {
      if (selectedPlan === "Starter Kitchen") {
        return {
          type: "warning" as const,
          message: `Your subscription will be canceled and you'll switch to the free plan at the end of your current billing period${nextBillingDate ? ` (${new Date(nextBillingDate).toLocaleDateString()})` : ""}.`,
        }
      } else {
        return {
          type: "warning" as const,
          message: `You'll be downgraded at the end of your current billing period${nextBillingDate ? ` (${new Date(nextBillingDate).toLocaleDateString()})` : ""}. You'll keep your current features until then.`,
        }
      }
    }

    if (changeType === "billing_change") {
      const newPrice =
        billingPeriod === "yearly" ? selectedPlanObj?.yearly : selectedPlanObj?.monthly
      return {
        type: "info" as const,
        message: `Your billing period will change to ${billingPeriod} (${newPrice}) at your next billing cycle${nextBillingDate ? ` on ${new Date(nextBillingDate).toLocaleDateString()}` : ""}.`,
      }
    }

    return null
  }

  async function updatePlan() {
    setSaving(true)
    setError(null)

    const plan = plans.find((p) => p.name === selectedPlan)
    const price_id = billingPeriod === "monthly" ? plan?.price_id_monthly : plan?.price_id_yearly

    try {
      if (!price_id || price_id === "null") {
        // Free plan or downgrade - handle subscription cancellation
        if (currentPlan !== "Starter Kitchen") {
          const res = await fetch("/api/stripe/cancel-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userid,
              immediate: false, // Cancel at period end for downgrades
            }),
          })

          if (!res.ok) {
            throw new Error("Failed to cancel subscription")
          }
        }

        await onUpdate(selectedPlan, billingPeriod)
        onClose()
      } else {
        // Paid plan - create checkout session or update subscription
        const endpoint =
          currentPlan === "Starter Kitchen"
            ? "/api/stripe/create-checkout-session"
            : "/api/stripe/update-subscription"

        const payload =
          currentPlan === "Starter Kitchen"
            ? {
                user_id: userid,
                email: localStorage.getItem("email"), // Replace this with actual logged-in email
                price_id,
              }
            : {
                user_id: userid,
                price_id,
                prorate: changeType === "upgrade", // Only prorate for upgrades
              }

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        const data = await res.json()

        if (currentPlan === "Starter Kitchen" && data?.url) {
          // New subscription - redirect to Stripe
          window.location.href = data.url
        } else if (currentPlan !== "Starter Kitchen") {
          // Existing subscription updated
          if (data.success) {
            await onUpdate(selectedPlan, billingPeriod)
            onClose()
          } else {
            throw new Error(data.error || "Failed to update subscription")
          }
        } else {
          throw new Error("Failed to process plan change")
        }
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to update plan")
    } finally {
      setSaving(false)
    }
  }

  // Get all unique feature names from all plans
  const allFeatures = Array.from(new Set(plans.flatMap((plan) => Object.keys(plan.features))))
  const changeMessage = getChangeMessage()
  const isDowngrade = changeType === "downgrade"
  const isNoChange = changeType === "same"

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="animate-fade-up max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentPlan === "Starter Kitchen" ? "Choose A Plan That Fits" : "Update Your Plan"}
            </h2>
            <p className="text-sm text-gray-500">
              {currentPlan !== "Starter Kitchen" &&
                `Currently on ${currentPlan} (${currentBillingPeriod})`}
            </p>
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
              {period === "monthly" ? "Bill Monthly" : "Bill Yearly (Save up to 10%)"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              onClick={() => setSelectedPlan(plan.name)}
              className={clsx(
                "relative flex cursor-pointer flex-col rounded-2xl border-2 p-6 transition duration-300 hover:shadow-xl",
                selectedPlan === plan.name ? "bg-purple-700 text-white shadow" : "border-gray-200",
                plan.highlight && selectedPlan !== plan.name && "ring-2 ring-orange-400",
                plan.name === currentPlan && selectedPlan !== plan.name && "ring-2 ring-blue-400"
              )}
            >
              {plan.name === currentPlan && selectedPlan !== plan.name && (
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
          ))}
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
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            ) : (
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
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

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-gray-600">Feature</th>
                  {plans.map((plan) => (
                    <th
                      key={plan.name}
                      className={clsx(
                        "p-2 text-center font-semibold",
                        plan.name === currentPlan ? "text-blue-600" : "text-gray-900"
                      )}
                    >
                      {plan.name}
                      {plan.name === currentPlan && (
                        <div className="text-xs font-normal text-blue-500">Current</div>
                      )}
                    </th>
                  ))}
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
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={updatePlan}
            disabled={saving || isNoChange}
            className={clsx(isDowngrade && "bg-amber-600 hover:bg-amber-700")}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {changeType === "upgrade"
                  ? "Upgrading..."
                  : changeType === "downgrade"
                    ? "Scheduling Change..."
                    : "Updating..."}
              </>
            ) : (
              <>
                {changeType === "upgrade"
                  ? "Upgrade Now"
                  : changeType === "downgrade"
                    ? "Schedule Downgrade"
                    : changeType === "billing_change"
                      ? "Update Billing"
                      : "Update Plan"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

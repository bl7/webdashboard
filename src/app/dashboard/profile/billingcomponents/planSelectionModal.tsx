import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, X } from "lucide-react"
import clsx from "clsx"

const plans = [
  {
    name: "Starter Kitchen",
    monthly: "Free",
    yearly: "Free",
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
  onClose: () => void
  onUpdate: (planName: string, billingPeriod: string) => void
}

export default function PlanSelectionModal({ userid, currentPlan, onClose, onUpdate }: Props) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState(currentPlan)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updatePlan() {
    setSaving(true)
    setError(null)
    try {
      await onUpdate(selectedPlan, billingPeriod)
    } catch (err: any) {
      setError("Failed to update plan")
    } finally {
      setSaving(false)
    }
  }

  // Get all unique feature names from all plans
  const allFeatures = Array.from(new Set(plans.flatMap((plan) => Object.keys(plan.features))))

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="animate-fade-up w-full max-w-6xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose A Plan That Fits</h2>
            <p className="text-sm text-gray-500"></p>
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
                plan.highlight && "ring-4 ring-orange-400"
              )}
            >
              <div className="mb-2 text-xl font-semibold">{plan.name}</div>
              <div className="mb-2 text-lg font-semibold">
                {billingPeriod === "monthly" ? plan.monthly : plan.yearly}
              </div>
              <div className="mb-4 text-sm">{plan.description}</div>
              <Button variant="outline" className="mt-auto w-full text-black">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="mb-4 text-lg font-semibold">Compare Features</h3>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-gray-600">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="p-2 text-center font-semibold text-gray-900">
                      {plan.name}
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

        {error && <div className="mt-4 text-sm text-red-500">{error}</div>}

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={updatePlan} disabled={saving || !selectedPlan}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Update Plan"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

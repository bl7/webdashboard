import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Subscription } from "../hooks/useBillingData"

const PLANS = [
  { name: "Free Plan", monthlyAmount: 0, yearlyAmount: 0, description: "Free tier" },
  { name: "Basic", monthlyAmount: 10, yearlyAmount: 100, description: "Basic plan" },
  {
    name: "Company Start",
    monthlyAmount: 15,
    yearlyAmount: 150,
    description: "For growing companies",
  },
  { name: "Company Plus", monthlyAmount: 25, yearlyAmount: 250, description: "Advanced features" },
  { name: "Enterprise", monthlyAmount: 0, yearlyAmount: 0, description: "Custom pricing" },
]

interface Props {
  userid: string
  currentSubscription: Subscription
  onClose: () => void
  onUpdate: () => void
}

export default function PlanSelectionModal({
  userid,
  currentSubscription,
  onClose,
  onUpdate,
}: Props) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    currentSubscription.billing_interval === "yearly" ? "yearly" : "monthly"
  )
  const [selectedPlanName, setSelectedPlanName] = useState(currentSubscription.plan_name)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updatePlan() {
    setSaving(true)
    setError(null)
    try {
      const plan = PLANS.find((p) => p.name === selectedPlanName)
      if (!plan) throw new Error("Selected plan not found")

      const planAmount = billingPeriod === "monthly" ? plan.monthlyAmount : plan.yearlyAmount

      const res = await fetch("/api/subscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userid,
          plan_name: selectedPlanName,
          plan_amount: planAmount,
          billing_interval: billingPeriod,
          status: "active",
          // Add other required fields if needed
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to update subscription")
      }

      onUpdate()
    } catch (err: any) {
      setError(err.message || "Failed to update plan")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">Available Plans</h3>

        <div className="mb-4 flex justify-center gap-4">
          <button
            className={`rounded-full px-5 py-2 font-semibold ${
              billingPeriod === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setBillingPeriod("monthly")}
          >
            Monthly
          </button>
          <button
            className={`rounded-full px-5 py-2 font-semibold ${
              billingPeriod === "yearly" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setBillingPeriod("yearly")}
          >
            Yearly
          </button>
        </div>

        <ul className="mb-4 max-h-60 space-y-2 overflow-auto">
          {PLANS.map((plan) => {
            const isSelected = selectedPlanName === plan.name
            const price = billingPeriod === "monthly" ? plan.monthlyAmount : plan.yearlyAmount
            return (
              <li
                key={plan.name}
                className={`cursor-pointer rounded border p-4 ${
                  isSelected ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
                onClick={() => setSelectedPlanName(plan.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{plan.name}</div>
                  <div>
                    ${price}/ {billingPeriod}
                  </div>
                </div>
                <div className="text-sm text-gray-600">{plan.description}</div>
              </li>
            )
          })}
        </ul>

        {error && <div className="mb-2 text-red-600">{error}</div>}

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={updatePlan} disabled={saving || !selectedPlanName}>
            {saving ? "Saving..." : "Update Plan"}
          </Button>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from "react"
import { Subscription } from "../hooks/useBillingData"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { mapPlanNameToIdentifier } from "./planMapper" // Import the mapper

interface Props {
  subscription: Subscription | null
  onChangePlan: () => void
}

export default function SubscriptionInfo({ subscription, onChangePlan }: Props) {
  console.log(subscription, "subscriptions info")

  const [cancelMessage, setCancelMessage] = useState<string | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  // Handle loading state
  if (!subscription) {
    return (
      <div className="relative flex h-48 w-80 animate-pulse flex-col justify-between rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 p-4 text-white shadow-lg">
        <div className="absolute right-3 top-3">
          <div className="h-5 w-5 rounded bg-white/30"></div>
        </div>
        <div>
          <div className="mb-1 h-3 w-24 rounded bg-white/30"></div>
          <div className="mb-2 h-8 w-16 rounded bg-white/30"></div>
          <div className="h-4 w-20 rounded bg-white/30"></div>
        </div>
        <div className="h-8 w-24 rounded bg-white/30"></div>
      </div>
    )
  }

  const planAmount = subscription.plan_amount ?? 0
  const planName = subscription.plan_name || "Free Plan"
  const planIdentifier = mapPlanNameToIdentifier(planName)
  const isTrial = subscription.status === "trialing" || (subscription as any).in_trial
  const trialEnd = subscription.trial_end ? new Date(subscription.trial_end) : null
  const today = new Date()
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))) : null

  const hasPendingChange = !!(subscription && subscription.pending_plan_change && subscription.pending_plan_change_effective)
  const pendingPlanName = subscription?.pending_plan_change || ""
  const pendingPlanEffective = subscription?.pending_plan_change_effective ? new Date(subscription.pending_plan_change_effective) : null
  const pendingDaysLeft = pendingPlanEffective ? Math.max(0, Math.ceil((pendingPlanEffective.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null

  const formatPlanAmount = () => {
    if (typeof planAmount !== "number" || isNaN(planAmount)) {
      return "$0.00"
    }

    const dollarAmount = planAmount / 100
    return `$${dollarAmount.toFixed(2)}`
  }

  // Determine card gradient based on plan identifier
  const getCardGradient = () => {
    if (isTrial) return "from-yellow-500 to-yellow-600"
    switch (planIdentifier) {
      case "free":
        return "from-gray-500 to-gray-600"
      case "pro_kitchen":
        return "from-purple-500 to-purple-600"
      case "multi_site":
        return "from-pink-500 to-pink-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  // Get display name based on plan identifier
  const getDisplayName = () => {
    let base = ""
    switch (planIdentifier) {
      case "free":
        base = "Free Plan"
        break
      case "pro_kitchen":
        base = "🧑‍🍳 Pro Kitchen"
        break
      case "multi_site":
        base = "Multi-Site Mastery"
        break
      default:
        base = planName
    }
    if (isTrial) return `${base} (Trial)`
    return base
  }

  const handleCancelPendingChange = async () => {
    setCancelLoading(true)
    setCancelMessage(null)
    try {
      const res = await fetch("/api/subscriptions/cancel-pending-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: subscription?.user_id }),
      })
      const data = await res.json()
      if (data.success) {
        setCancelMessage("Pending plan change cancelled.")
        // Optionally, refresh subscription info
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setCancelMessage(data.message || "Failed to cancel pending change.")
      }
    } catch (err: any) {
      setCancelMessage(err.message || "Failed to cancel pending change.")
    } finally {
      setCancelLoading(false)
    }
  }

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl bg-gradient-to-r ${getCardGradient()} min-h-[12rem] w-full max-w-md p-4 text-white shadow-lg sm:min-h-[14rem]`}
    >
      {/* Pending Plan Change Banner */}
      {hasPendingChange && (
        <div className="mb-2 rounded bg-yellow-200 p-2 text-yellow-900 font-semibold">
          You have requested to change your plan to <span className="font-bold">{pendingPlanName}</span>.<br />
          This will take effect on <span className="font-bold">{pendingPlanEffective?.toLocaleDateString()}</span>
          {pendingDaysLeft !== null && pendingDaysLeft > 0 ? ` (${pendingDaysLeft} day${pendingDaysLeft === 1 ? '' : 's'} left)` : ''}.
        </div>
      )}
      {/* Star icon at top-right */}
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <Star className="h-5 w-5" fill={planAmount > 0 ? "currentColor" : "none"} />
        {isTrial && (
          <span className="rounded bg-white/80 px-2 py-0.5 text-xs font-bold text-yellow-900 shadow">TRIAL</span>
        )}
      </div>

      <div>
        <div className="mb-1 text-xs opacity-75">Your Current Plan</div>
        <div className="flex items-baseline gap-1">
          <div className="text-2xl font-bold">{planAmount > 0 ? `£${planAmount}` : 0}</div>
          {subscription.billing_interval && (
            <div className="text-sm opacity-75">
              /{subscription.billing_interval === "year" ? "yr" : "mo"}
            </div>
          )}
        </div>
        <div className="mt-1 text-sm font-medium">{getDisplayName()}</div>
        {isTrial && trialEnd && (
          <div className="mt-1 text-xs text-yellow-100">
            {daysLeft !== null && daysLeft > 0
              ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left in trial`
              : "Trial ends today"}
            <br />
            Ends: {trialEnd.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
          </div>
        )}
        {subscription.status && !isTrial && subscription.status !== "active" && (
          <div className="mt-1 text-xs capitalize opacity-75">Status: {subscription.status}</div>
        )}
      </div>

      <Button
        variant="outline"
        className="mt-2 self-start border-white text-black transition-colors hover:bg-white hover:text-current"
        onClick={onChangePlan}
        disabled={hasPendingChange}
        title={hasPendingChange ? "You cannot change your plan while a pending change is scheduled." : undefined}
      >
        Change Plan
      </Button>
      {/* Cancel Pending Change Button */}
      {hasPendingChange && (
        <Button
          variant="destructive"
          className="mt-2 self-start"
          onClick={handleCancelPendingChange}
          disabled={cancelLoading}
        >
          {cancelLoading ? "Cancelling..." : "Cancel Pending Change"}
        </Button>
      )}
      {cancelMessage && (
        <div className="mt-2 text-sm text-green-900 bg-green-100 rounded p-2">{cancelMessage}</div>
      )}
    </div>
  )
}

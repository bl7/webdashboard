import React from "react"
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

  // Safely handle plan amount with fallback
  const planAmount = subscription.plan_amount ?? 0
  const planName = subscription.plan_name || "Free Plan"

  // Get the internal plan identifier
  const planIdentifier = mapPlanNameToIdentifier(planName)
  console.log("🎯 Plan identifier:", planIdentifier)

  const formatPlanAmount = () => {
    if (typeof planAmount !== "number" || isNaN(planAmount)) {
      return "$0.00"
    }

    const dollarAmount = planAmount / 100
    return `$${dollarAmount.toFixed(2)}`
  }

  // Determine card gradient based on plan identifier
  const getCardGradient = () => {
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
    switch (planIdentifier) {
      case "free":
        return "Free Plan"
      case "pro_kitchen":
        return "🧑‍🍳 Pro Kitchen"
      case "multi_site":
        return "Multi-Site Mastery"
      default:
        return planName // Fallback to original name
    }
  }

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl bg-gradient-to-r ${getCardGradient()} min-h-[12rem] w-full max-w-md p-4 text-white shadow-lg sm:min-h-[14rem]`}
    >
      {/* Star icon at top-right */}
      <div className="absolute right-3 top-3">
        <Star className="h-5 w-5" fill={planAmount > 0 ? "currentColor" : "none"} />
      </div>

      <div>
        <div className="mb-1 text-xs opacity-75">Your Current Plan</div>
        <div className="flex items-baseline gap-1">
          <div className="text-2xl font-bold">{subscription.plan_amount}</div>
          {subscription.billing_interval && (
            <div className="text-sm opacity-75">
              /{subscription.billing_interval === "year" ? "yr" : "mo"}
            </div>
          )}
        </div>
        <div className="mt-1 text-sm font-medium">{getDisplayName()}</div>

        {subscription.status && subscription.status !== "active" && (
          <div className="mt-1 text-xs capitalize opacity-75">Status: {subscription.status}</div>
        )}
      </div>

      <Button
        variant="outline"
        className="mt-2 self-start border-white text-black transition-colors hover:bg-white hover:text-current"
        onClick={onChangePlan}
      >
        Change Plan
      </Button>
    </div>
  )
}

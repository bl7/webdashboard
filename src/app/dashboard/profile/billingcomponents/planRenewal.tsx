import React from "react"
import { Subscription } from "../hooks/useBillingData"
import { Button } from "@/components/ui/button"
import { CalendarCheck, Calendar, Infinity } from "lucide-react"

interface Props {
  subscription: Subscription | null
  onChangePlan: () => void
}

export default function PlanRenewal({ subscription, onChangePlan }: Props) {
  // Handle loading state
  if (!subscription) {
    return (
      <div className="relative flex h-48 w-80 animate-pulse flex-col justify-between rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 p-4 text-white shadow-lg">
        <div className="absolute right-3 top-3">
          <div className="h-5 w-5 rounded bg-white/30"></div>
        </div>
        <div>
          <div className="mb-1 h-3 w-28 rounded bg-white/30"></div>
          <div className="mb-2 h-8 w-32 rounded bg-white/30"></div>
          <div className="h-4 w-24 rounded bg-white/30"></div>
        </div>
        <div className="h-8 w-24 rounded bg-white/30"></div>
      </div>
    )
  }

  const planAmount = subscription.plan_amount ?? 0
  const planName = subscription.plan_name || "Free Plan"
  const currentPeriodEnd = subscription.current_period_end
  const billingInterval = subscription.billing_interval
  const status = subscription.status || "active"

  // Determine if this is a free plan
  const isFreeplan = planAmount === 0 || planName.toLowerCase().includes("free")

  // Format renewal date
  const formatRenewalInfo = () => {
    if (isFreeplan) {
      return {
        date: "Never",
        label: "Free Forever",
        icon: Infinity,
      }
    }

    if (status === "canceled") {
      return {
        date: currentPeriodEnd
          ? new Date(currentPeriodEnd).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Unknown",
        label: "Plan Expires On",
        icon: Calendar,
      }
    }

    if (!currentPeriodEnd) {
      return {
        date: "Not Set",
        label: "Renewal Date",
        icon: CalendarCheck,
      }
    }

    const renewalDate = new Date(currentPeriodEnd)
    const now = new Date()
    const isExpired = renewalDate < now

    return {
      date: renewalDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      label: isExpired ? "Plan Expired On" : getNextRenewalLabel(),
      icon: CalendarCheck,
    }
  }

  const getNextRenewalLabel = () => {
    if (!billingInterval) return "Plan Renews On"

    switch (billingInterval.toLowerCase()) {
      case "month":
      case "monthly":
        return "Next Monthly Billing"
      case "year":
      case "yearly":
      case "annual":
        return "Next Annual Billing"
      default:
        return "Plan Renews On"
    }
  }

  // Get card styling based on plan status
  const getCardGradient = () => {
    if (isFreeplan) {
      return "from-green-500 to-emerald-600"
    } else if (status === "canceled") {
      return "from-red-500 to-red-600"
    } else if (status === "past_due") {
      return "from-orange-500 to-red-500"
    } else {
      return "from-purple-500 to-pink-600"
    }
  }

  const renewalInfo = formatRenewalInfo()
  const IconComponent = renewalInfo.icon

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl bg-gradient-to-r ${getCardGradient()} min-h-[12rem] w-full max-w-md p-4 text-white shadow-lg sm:min-h-[14rem]`}
    >
      {/* Icon at top-right */}
      <div className="absolute right-3 top-3">
        <IconComponent className="h-5 w-5" />
      </div>

      <div>
        <div className="mb-1 text-xs opacity-75">{renewalInfo.label}</div>
        <div className="break-words text-2xl font-bold">{renewalInfo.date}</div>
        <div className="mt-1 text-sm font-medium"></div>

        {status !== "active" && !isFreeplan && (
          <div className="mt-1 text-xs capitalize opacity-75">
            Status: {status.replace("_", " ")}
          </div>
        )}

        {status === "active" && !isFreeplan && currentPeriodEnd && (
          <div className="mt-1 text-xs opacity-75">
            {(() => {
              const daysUntilRenewal = Math.ceil(
                (new Date(currentPeriodEnd).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              )
              if (daysUntilRenewal > 0) {
                return `${daysUntilRenewal} days remaining`
              } else if (daysUntilRenewal === 0) {
                return "Renews today"
              } else {
                return "Overdue"
              }
            })()}
          </div>
        )}
      </div>

      <Button
        className="mt-2 self-start border-none bg-gradient-to-r from-cyan-400 to-blue-500 text-white transition-all duration-200 hover:from-cyan-500 hover:to-blue-600"
        onClick={onChangePlan}
      >
        {isFreeplan ? "Upgrade Plan" : "Change Plan"}
      </Button>
    </div>
  )
}

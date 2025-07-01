import React from "react"
import { Subscription } from "../hooks/useBillingData"
import { Button } from "@/components/ui/button"
import { CalendarCheck, Calendar, Infinity } from "lucide-react"
import { getPlanNameFromPriceId } from '@/lib/formatPlanName'

interface Props {
  subscription: Subscription | null
  onChangePlan: () => void
}

export default function PlanRenewal({ subscription, onChangePlan }: Props) {
  if (!subscription) {
    return (
      <div className="relative flex h-48 w-80 animate-pulse flex-col justify-between rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 p-4 text-white shadow-lg" />
    )
  }
  const planAmount = subscription.amount ?? 0
  const planName = subscription.plan_name || ""
  const currentPeriodEnd = subscription.current_period_end
  const billingInterval = subscription.billing_interval || ""
  const status = subscription.status || "active"
  const isFreeplan = planAmount === 0 || planName.toLowerCase().includes("free")
  const hasPendingChange = !!subscription.pending_plan_change && !!subscription.pending_plan_change_effective;
  const pendingPlanName = hasPendingChange
    ? (subscription.pending_plan_name || getPlanNameFromPriceId(subscription.pending_plan_change))
    : null;
  const pendingPlanInterval = hasPendingChange ? subscription.pending_plan_interval : null;
  const currentPlanName = getPlanNameFromPriceId(subscription.plan_id);
  const pendingPlanEffective = hasPendingChange && subscription.pending_plan_change_effective ? new Date(subscription.pending_plan_change_effective) : null;
  const pendingDaysLeft = hasPendingChange && pendingPlanEffective ? Math.max(0, Math.ceil((pendingPlanEffective.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;
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
    <div className={`relative flex flex-col justify-between rounded-xl bg-gradient-to-r ${getCardGradient()} min-h-[12rem] w-full max-w-md p-4 text-white shadow-lg sm:min-h-[14rem]`}>
      <div className="absolute right-3 top-3">
        <IconComponent className="h-5 w-5" />
      </div>
      <div>
        <div className="mb-1 text-xs opacity-75">{renewalInfo.label}</div>
        <div className="break-words text-2xl font-bold">{renewalInfo.date}</div>
        <div className="mt-1 text-sm font-medium"></div>
        {status !== "active" && !isFreeplan && (
          <div className="mt-1 text-xs capitalize opacity-75">Status: {status.replace("_", " ")}</div>
        )}
        {status === "active" && !isFreeplan && currentPeriodEnd && (
          <div className="mt-1 text-xs opacity-75">
            {(() => {
              const daysUntilRenewal = Math.ceil((new Date(currentPeriodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
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
        {/* Pending Plan Change Banner (moved from SubscriptionInfo) */}
        {hasPendingChange && (
          <div className="mt-2 rounded bg-yellow-200 p-2 text-yellow-900 font-semibold">
            <div>
              <span className="font-bold">Plan Change Scheduled</span><br />
              <span>
                Your plan will change to <span className="font-bold">{pendingPlanName}</span>
                {pendingPlanInterval && (
                  <> (<span className="capitalize">{pendingPlanInterval}</span>)</>
                )}.
              </span><br />
              Takes effect on <span className="font-bold">{pendingPlanEffective?.toLocaleDateString()}</span>
              {pendingDaysLeft !== null && pendingDaysLeft > 0 ? ` (${pendingDaysLeft} day${pendingDaysLeft === 1 ? '' : 's'} left)` : ''}.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

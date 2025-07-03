import React, { useState } from "react"
import { Subscription } from "../hooks/useBillingData"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { getPlanNameFromPriceId } from '@/lib/formatPlanName'

interface Props {
  subscription: Subscription | null
  onChangePlan: () => void
}

export default function SubscriptionInfo({ subscription, onChangePlan }: Props) {
  const [cancelMessage, setCancelMessage] = useState<string | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  if (!subscription) {
    return (
      <div className="relative flex h-48 w-80 animate-pulse flex-col justify-between rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 p-4 text-white shadow-lg" />
    )
  }

  const isTrial = subscription.status === "trialing"
  const trialEnd = subscription.trial_end ? new Date(subscription.trial_end) : null
  const today = new Date()
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))) : null

  const hasPendingChange = !!subscription.pending_plan_change && !!subscription.pending_plan_change_effective;
  const pendingPlanName = hasPendingChange ? getPlanNameFromPriceId(subscription.pending_plan_change) : null;
  const currentPlanName = getPlanNameFromPriceId(subscription.plan_id);
  const pendingPlanEffective = hasPendingChange && subscription.pending_plan_change_effective ? new Date(subscription.pending_plan_change_effective) : null;
  const pendingDaysLeft = hasPendingChange && pendingPlanEffective ? Math.max(0, Math.ceil((pendingPlanEffective.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

  const isCancellationScheduled = (subscription.cancel_at_period_end || subscription.cancel_at) && subscription.status !== 'canceled';
  const isCanceled = subscription.status === 'canceled';

  return (
    <div className="relative flex flex-col justify-between rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 min-h-[12rem] w-full max-w-md p-4 text-white shadow-lg sm:min-h-[14rem]">
      
      {/* Star icon at top-right */}
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <Star className="h-5 w-5" fill={subscription.amount && subscription.amount > 0 ? "currentColor" : "none"} />
        {isTrial && (
          <span className="rounded bg-white/80 px-2 py-0.5 text-xs font-bold text-yellow-900 shadow">TRIAL</span>
        )}
      </div>
      <div>
        <div className="mb-1 text-xs opacity-75">Your Plan</div>
        <div className="mt-1 text-lg font-bold">{subscription.plan_name}</div>
        <div className="mt-1 text-sm"> {subscription.billing_interval ? subscription.billing_interval.charAt(0).toUpperCase() + subscription.billing_interval.slice(1) : 'N/A'}</div>
        <div className="mt-1 text-lg"> £{subscription.amount ? (subscription.amount / 100).toFixed(2) : "0.00"}</div>
      </div>
      {/* Button: Change Plan or Reactivate */}
      {!isCanceled && isCancellationScheduled ? (
        <Button
          variant="default"
          className="mt-2 self-start bg-green-600 hover:bg-green-700 text-white"
          onClick={onChangePlan}
          disabled={hasPendingChange}
          title={hasPendingChange ? "You cannot change your plan while a pending change is scheduled." : undefined}
        >
          Reactivate
        </Button>
      ) : !isCanceled ? (
        <Button
          variant="outline"
          className="mt-2 self-start border-white text-black transition-colors hover:bg-white hover:text-current"
          onClick={onChangePlan}
          disabled={hasPendingChange}
          title={hasPendingChange ? "You cannot change your plan while a pending change is scheduled." : undefined}
        >
          Change Plan
        </Button>
      ) : null}
    </div>
  )
}

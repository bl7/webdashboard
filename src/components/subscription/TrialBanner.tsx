"use client"

import { Badge } from "@/components/ui/badge"
import type { Subscription } from "@/app/dashboard/profile/hooks/useBillingData"

interface Props {
  subscription: Subscription | null
  variant?: "full" | "compact"
}

export function TrialBanner({ subscription, variant = "full" }: Props) {
  if (!subscription || subscription.status !== "trialing" || !subscription.trial_end) return null

  const trialEnd = new Date(subscription.trial_end)
  const today = new Date()
  const daysLeft = Math.max(
    0,
    Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  )
  const trialStart = subscription.trial_start ? new Date(subscription.trial_start) : null
  const totalTrialDays =
    trialStart && trialEnd
      ? Math.max(1, Math.ceil((trialEnd.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24)))
      : 14

  if (variant === "compact") {
    return (
      <div className="mb-6 rounded-xl border-l-4 border-yellow-400 bg-yellow-50 p-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">
            TRIAL
          </Badge>
          <div>
            <p className="font-semibold text-yellow-900">Free Trial Active</p>
            <p className="text-sm text-yellow-800">
              {daysLeft} of {totalTrialDays} days remaining • Ends{" "}
              {trialEnd.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8 flex w-full flex-col gap-4 rounded-xl border-l-8 border-yellow-400 bg-yellow-50 p-6 text-yellow-900 shadow md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-block rounded bg-yellow-400 px-3 py-1 text-sm font-bold text-yellow-900">
          TRIAL
        </span>
        <span className="text-lg font-semibold">You are on a free trial!</span>
      </div>
      <div className="text-base font-medium">
        {daysLeft}/{totalTrialDays} days left in your trial. &nbsp;|&nbsp; Ends:{" "}
        <span className="font-semibold">
          {trialEnd.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  )
}

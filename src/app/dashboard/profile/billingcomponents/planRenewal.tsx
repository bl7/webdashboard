import React from "react"
import { Subscription } from "../hooks/useBillingData"
import { Button } from "@/components/ui/button"
import { CalendarCheck } from "lucide-react"

interface Props {
  subscription: Subscription
  onChangePlan: () => void
}

export default function PlanRenewal({ subscription, onChangePlan }: Props) {
  // Format current_period_end date
  const renewalDate = subscription.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"

  return (
    <div className="relative flex h-48 w-80 flex-col justify-between rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white shadow-lg">
      {/* Calendar icon at top-right */}
      <div className="absolute right-3 top-3">
        <CalendarCheck className="h-5 w-5" />
      </div>

      <div>
        <div className="mb-1 text-xs opacity-75">Your Plan Ends On</div>
        <div className="text-2xl font-bold">{renewalDate}</div>
        <div className="mt-1 text-sm font-medium">Plan Renewal Date</div>
      </div>

      <Button
        className="mt-2 self-start border-none bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600"
        onClick={onChangePlan}
      >
        Change Plan
      </Button>
    </div>
  )
}

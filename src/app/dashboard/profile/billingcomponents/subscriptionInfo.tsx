import React from "react"
import { Subscription } from "../hooks/useBillingData"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface Props {
  subscription: Subscription
  onChangePlan: () => void
}

export default function SubscriptionInfo({ subscription, onChangePlan }: Props) {
  return (
    <div className="relative flex h-48 w-80 flex-col justify-between rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 p-4 text-white shadow-lg">
      {/* Star icon at top-right */}
      <div className="absolute right-3 top-3">
        <Star className="h-5 w-5" />
      </div>
      <div>
        <div className="mb-1 text-xs opacity-75">Your Current Plan</div>
        <div className="text-2xl font-bold">${subscription.plan_amount.toFixed(2)}</div>
        <div className="mt-1 text-sm font-medium">{subscription.plan_name}</div>
      </div>

      <Button
        variant="outline"
        className="mt-2 self-start border-white text-black hover:bg-white hover:text-pink-600"
        onClick={onChangePlan}
      >
        Change Plan
      </Button>
    </div>
  )
}

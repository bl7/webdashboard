import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Subscription } from "../hooks/useBillingData"

interface Props {
  subscription: Subscription
  onChangePlan: () => void
}

export default function SubscriptionInfo({ subscription, onChangePlan }: Props) {
  return (
    <Card>
      <CardContent className="space-y-2 p-6">
        <div className="text-sm text-muted-foreground">Current subscription plan</div>
        <div className="text-2xl font-semibold">${subscription.plan_amount.toFixed(2)}</div>
        <div className="text-sm">{subscription.plan_name}</div>
        <Button variant="outline" className="mt-4" onClick={onChangePlan}>
          Change Plan
        </Button>
      </CardContent>
    </Card>
  )
}

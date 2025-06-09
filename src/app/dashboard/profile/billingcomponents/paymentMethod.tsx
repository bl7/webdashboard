import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Subscription } from "../hooks/useBillingData"

interface Props {
  subscription: Subscription
}

export default function PaymentMethod({ subscription }: Props) {
  const hasCard = !!subscription.card_last4

  return (
    <Card>
      <CardContent className="space-y-2 p-6">
        <div className="text-sm text-muted-foreground">Payment Method</div>
        <div className="text-base">
          {hasCard ? `Card ending ${subscription.card_last4}` : "No payment method available"}
        </div>
        {subscription.card_exp_month && subscription.card_exp_year ? (
          <div className="text-sm text-muted-foreground">
            Exp. date {subscription.card_exp_month}/{subscription.card_exp_year}
          </div>
        ) : null}
        <Button variant="outline" className="mt-4" disabled={!hasCard}>
          Edit
        </Button>
      </CardContent>
    </Card>
  )
}

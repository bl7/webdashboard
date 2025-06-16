import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Subscription } from "../hooks/useBillingData"

interface Props {
  subscription: Subscription | null
}

export default function PaymentMethod({ subscription }: Props) {
  // Handle case where subscription is null
  if (!subscription) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Payment Method</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">No payment information available</p>
          </div>
          <Button variant="outline" className="mt-4" disabled>
            Edit
          </Button>
        </CardContent>
      </Card>
    )
  }

  const hasCard = !!subscription.card_last4

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Payment Method</h3>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {hasCard ? `Card ending in ${subscription.card_last4}` : "No payment method available"}
          </p>

          {subscription.card_exp_month && subscription.card_exp_year && (
            <p className="text-sm text-gray-500">
              Exp. date {subscription.card_exp_month}/{subscription.card_exp_year}
            </p>
          )}
        </div>

        <Button variant="outline" className="mt-4">
          {hasCard ? "Edit" : "Add Payment Method"}
        </Button>
      </CardContent>
    </Card>
  )
}

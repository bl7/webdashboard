import React from "react"
import { Card, CardContent } from "@/components/ui/card"
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
        </CardContent>
      </Card>
    )
  }

  const hasCard = !!subscription.card_last4
  const cardBrand = (subscription as any)?.card_brand || "CARD"
  const cardLast4 = subscription.card_last4 || "0000"

  return (
    <Card className="flex w-full max-w-sm flex-col justify-between rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white shadow-lg">
      <div className="mb-6 flex items-center">
        <div className="mr-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-900">
          {/* Placeholder for icon or emblem */}
          <svg className="h-8 w-8 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold tracking-wide">
          {cardBrand.toUpperCase()}
        </h3>
      </div>

      <div className="flex flex-grow flex-col space-y-1">
        <p className="font-mono text-xl tracking-widest">
          {hasCard ? `•••• •••• •••• ${cardLast4}` : "No payment method available"}
        </p>
        {subscription.card_exp_month && subscription.card_exp_year && (
          <p className="self-end text-sm opacity-80">
            Exp. {subscription.card_exp_month}/{subscription.card_exp_year}
          </p>
        )}
      </div>
    </Card>
  )
}

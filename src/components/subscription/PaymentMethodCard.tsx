"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2 } from "lucide-react"
import type { Subscription } from "@/app/dashboard/profile/hooks/useBillingData"

interface Props {
  subscription: Subscription | null
  onUpdate: () => void
  loading?: boolean
  variant?: "card" | "gradient"
}

export function PaymentMethodCard({
  subscription,
  onUpdate,
  loading = false,
  variant = "gradient",
}: Props) {
  if (!subscription) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Payment Method</h3>
          <p className="text-sm text-gray-600">No payment information available</p>
        </CardContent>
      </Card>
    )
  }

  const hasCard = !!subscription.card_last4
  const cardBrand = subscription.card_brand || "CARD"
  const cardLast4 = subscription.card_last4 || "0000"

  if (variant === "card") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">
                  {hasCard ? `**** **** **** ${cardLast4}` : "No payment method"}
                </p>
                {subscription.card_exp_month && subscription.card_exp_year && (
                  <p className="text-sm text-muted-foreground">
                    Expires {subscription.card_exp_month}/{subscription.card_exp_year}
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onUpdate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Opening...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex w-full max-w-sm flex-col justify-between rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white shadow-lg">
      <div className="mb-6 flex items-center">
        <div className="mr-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-900">
          <CreditCard className="h-8 w-8 text-purple-300" />
        </div>
        <h3 className="text-lg font-semibold tracking-wide">{cardBrand.toUpperCase()}</h3>
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
      <div className="mt-4">
        <Button
          onClick={onUpdate}
          disabled={loading}
          variant="outline"
          className="w-full border-white bg-transparent text-white hover:bg-white hover:text-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Opening...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Update Payment Method
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}

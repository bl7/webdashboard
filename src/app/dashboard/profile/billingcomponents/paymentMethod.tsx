import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Subscription } from "../hooks/useBillingData"
import { CreditCard, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Props {
  subscription: Subscription | null
}

export default function PaymentMethod({ subscription }: Props) {
  const [loading, setLoading] = useState(false)

  const handleUpdatePaymentMethod = async () => {
    if (!subscription) return

    setLoading(true)
    try {
      const userid = localStorage.getItem("userid")
      if (!userid) {
        throw new Error("User not found")
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("/api/subscription_better/create-payment-method-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userid }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment method update session")
      }

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No portal URL received")
      }
    } catch (error) {
      toast.error("Failed to open payment method settings")
      console.error("Payment method update error:", error)
    } finally {
      setLoading(false)
    }
  }

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
          onClick={handleUpdatePaymentMethod}
          disabled={loading}
          variant="outline"
          className="w-full border-white text-white hover:bg-white hover:text-blue-700"
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

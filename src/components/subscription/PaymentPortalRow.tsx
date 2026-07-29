"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { Subscription } from "@/app/dashboard/profile/hooks/useBillingData"

interface Props {
  subscription: Subscription | null
  onManage: () => void
  loading?: boolean
}

export function PaymentPortalRow({ subscription, onManage, loading = false }: Props) {
  if (!subscription) return null

  const cardLabel =
    subscription.card_brand && subscription.card_last4
      ? `${subscription.card_brand} •••• ${subscription.card_last4}`
      : "No payment method on file"

  const billing = subscription.stripe_billing
  const addressLabel = billing?.address?.formatted || "No billing address on Stripe yet"
  const nameEmail = [billing?.name, billing?.email].filter(Boolean).join(" · ")

  return (
    <section className="rounded-xl border border-zinc-200 bg-white px-5 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Payment</h2>
            <p className="mt-1 text-sm text-zinc-500">{cardLabel}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-900">Billing address</h3>
            {nameEmail && <p className="mt-1 text-sm text-zinc-600">{nameEmail}</p>}
            <p className="mt-0.5 text-sm text-zinc-500">{addressLabel}</p>
          </div>
        </div>
        <Button variant="outline" className="shrink-0" onClick={onManage} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Opening…
            </>
          ) : (
            "Manage in Stripe"
          )}
        </Button>
      </div>
    </section>
  )
}

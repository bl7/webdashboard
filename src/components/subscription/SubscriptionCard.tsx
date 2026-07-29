"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, AlertTriangle, CreditCard } from "lucide-react"
import type { Subscription } from "@/app/dashboard/profile/hooks/useBillingData"
import {
  normalizeBillingInterval,
  isMonthlyBilling,
  formatMoney,
  billingCycleLabel,
} from "@/lib/billing"

interface Props {
  subscription: Subscription | null
  cancellationRequestPending?: boolean
  onReactivate?: () => void
  onWithdrawCancellation?: () => Promise<boolean>
  onCancelPendingBillingChange?: () => Promise<boolean>
  onUpdatePaymentMethod?: () => void
  reactivateLoading?: boolean
  withdrawLoading?: boolean
  cancelPendingLoading?: boolean
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-800 border-emerald-200",
    trialing: "bg-amber-50 text-amber-900 border-amber-200",
    past_due: "bg-red-50 text-red-800 border-red-200",
    unpaid: "bg-red-50 text-red-800 border-red-200",
    canceled: "bg-zinc-100 text-zinc-700 border-zinc-200",
  }
  const labels: Record<string, string> = {
    active: "Active",
    trialing: "Trial",
    past_due: "Payment due",
    unpaid: "Unpaid",
    canceled: "Canceled",
  }
  return (
    <Badge variant="outline" className={styles[status] ?? "bg-zinc-100 text-zinc-700"}>
      {labels[status] ?? status}
    </Badge>
  )
}

function formatDate(value?: string | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function SubscriptionCard({
  subscription,
  cancellationRequestPending = false,
  onReactivate,
  onWithdrawCancellation,
  onCancelPendingBillingChange,
  onUpdatePaymentMethod,
  reactivateLoading = false,
  withdrawLoading = false,
  cancelPendingLoading = false,
}: Props) {
  const [withdrawConfirmOpen, setWithdrawConfirmOpen] = useState(false)

  if (!subscription) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white px-5 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">No active subscription</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Choose a plan to get started with InstaLabel.
            </p>
          </div>
          <Button asChild>
            <Link href="/setup">Choose a plan</Link>
          </Button>
        </div>
      </section>
    )
  }

  const monthly = isMonthlyBilling(subscription.billing_interval)
  const cycle = normalizeBillingInterval(subscription.billing_interval)
  const isCanceled = subscription.status === "canceled"
  const isScheduledCancel = !!(subscription.cancel_at_period_end || subscription.cancel_at)
  const hasPendingBillingChange = !!(
    subscription.pending_plan_interval || subscription.pending_price_id
  )
  const isPastDue = subscription.status === "past_due" || subscription.status === "unpaid"
  const renewDate = formatDate(subscription.current_period_end)
  const price = formatMoney(subscription.amount, subscription.currency ?? "gbp")
  const planTitle = `${subscription.plan_name || "InstaLabel"} ${price}/${monthly ? "mo" : "yr"}`

  let description = `${billingCycleLabel(cycle)} plan.`
  if (isCanceled && renewDate) {
    description = `Your subscription has ended. Access until ${renewDate}.`
  } else if (isScheduledCancel && renewDate) {
    description = `Your subscription will end on ${renewDate}. You'll keep access until then.`
  } else if (cancellationRequestPending) {
    description = `Cancellation request pending review. Your plan stays active${renewDate ? ` and renews on ${renewDate} unless processed` : ""}.`
  } else if (renewDate) {
    description = `Your subscription will auto renew on ${renewDate}.`
  }

  return (
    <>
      <AlertDialog open={withdrawConfirmOpen} onOpenChange={setWithdrawConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw cancellation request?</AlertDialogTitle>
            <AlertDialogDescription>
              Your request will be cancelled and your plan stays active. Billing continues as
              normal — nothing changes in Stripe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={withdrawLoading}>Keep request</AlertDialogCancel>
            <Button
              onClick={async () => {
                if (!onWithdrawCancellation) return
                const ok = await onWithdrawCancellation()
                if (ok) setWithdrawConfirmOpen(false)
              }}
              disabled={withdrawLoading}
            >
              {withdrawLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Withdrawing…
                </>
              ) : (
                "Withdraw request"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    <section className="rounded-xl border border-zinc-200 bg-white px-5 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">{planTitle}</h2>
            <StatusBadge status={subscription.status} />
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-500">{description}</p>
        </div>

        {(isScheduledCancel || isCanceled) && onReactivate && (
          <Button
            variant="outline"
            className="shrink-0"
            onClick={onReactivate}
            disabled={reactivateLoading}
          >
            {reactivateLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Keeping…
              </>
            ) : (
              "Keep subscription"
            )}
          </Button>
        )}

        {cancellationRequestPending && !isScheduledCancel && !isCanceled && onWithdrawCancellation && (
          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => setWithdrawConfirmOpen(true)}
            disabled={withdrawLoading}
          >
            Withdraw request
          </Button>
        )}
      </div>

      {isPastDue && (
        <div className="mt-4 flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-sm text-red-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Payment failed. Update your payment method to avoid interruption.</span>
          </div>
          {onUpdatePaymentMethod && (
            <Button size="sm" variant="outline" onClick={onUpdatePaymentMethod}>
              <CreditCard className="mr-2 h-4 w-4" />
              Update card
            </Button>
          )}
        </div>
      )}

      {hasPendingBillingChange && (
        <div className="mt-4 flex flex-col gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-sky-900">
            {subscription.pending_plan_name
              ? `Plan change to ${subscription.pending_plan_name} scheduled`
              : `Billing change to ${
                  subscription.pending_plan_interval === "monthly" ? "monthly" : "annual"
                } scheduled`}
            {subscription.pending_plan_change_effective && (
              <>
                {" "}
                on {formatDate(subscription.pending_plan_change_effective)}
              </>
            )}
          </p>
          {onCancelPendingBillingChange && (
            <Button
              size="sm"
              variant="outline"
              onClick={onCancelPendingBillingChange}
              disabled={cancelPendingLoading}
            >
              {cancelPendingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel change"}
            </Button>
          )}
        </div>
      )}
    </section>
    </>
  )
}

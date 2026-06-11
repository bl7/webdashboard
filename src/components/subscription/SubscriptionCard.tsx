"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Calendar,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  X,
  RefreshCw,
  CreditCard,
} from "lucide-react"
import type { Subscription } from "@/app/dashboard/profile/hooks/useBillingData"
import {
  normalizeBillingInterval,
  isMonthlyBilling,
  formatMoney,
  billingCycleLabel,
  type BillingCycle,
} from "@/lib/billing"

interface Props {
  subscription: Subscription | null
  cancellationRequestPending?: boolean
  onReactivate?: () => void
  onBillingCycleChange?: (cycle: BillingCycle) => Promise<boolean>
  onCancelPendingBillingChange?: () => Promise<boolean>
  onUpdatePaymentMethod?: () => void
  reactivateLoading?: boolean
  billingCycleLoading?: boolean
  cancelPendingLoading?: boolean
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    trialing: "bg-yellow-100 text-yellow-800",
    past_due: "bg-red-100 text-red-800",
    unpaid: "bg-red-100 text-red-800",
    canceled: "bg-gray-100 text-gray-800",
  }
  const labels: Record<string, string> = {
    active: "Active",
    trialing: "Trial",
    past_due: "Payment Due",
    unpaid: "Unpaid",
    canceled: "Canceled",
  }
  return (
    <Badge className={styles[status] ?? "bg-gray-100 text-gray-800"}>
      {labels[status] ?? status}
    </Badge>
  )
}

export function SubscriptionCard({
  subscription,
  cancellationRequestPending = false,
  onReactivate,
  onBillingCycleChange,
  onCancelPendingBillingChange,
  onUpdatePaymentMethod,
  reactivateLoading = false,
  billingCycleLoading = false,
  cancelPendingLoading = false,
}: Props) {
  const [billingConfirmOpen, setBillingConfirmOpen] = useState(false)
  const [pendingBillingCycle, setPendingBillingCycle] = useState<BillingCycle | null>(null)

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            Choose a plan to get started with InstaLabel label printing and dashboard access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/setup">Choose a Plan</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const monthly = isMonthlyBilling(subscription.billing_interval)
  const cycle = normalizeBillingInterval(subscription.billing_interval)
  const isCanceled = subscription.status === "canceled"
  const isScheduledCancel = subscription.cancel_at_period_end || subscription.cancel_at
  const hasPendingBillingChange = !!(
    subscription.pending_plan_interval || subscription.pending_price_id
  )
  const isPastDue = subscription.status === "past_due" || subscription.status === "unpaid"
  const needsReactivate = isCanceled || isScheduledCancel

  const requestBillingCycleChange = (newCycle: BillingCycle) => {
    setPendingBillingCycle(newCycle)
    setBillingConfirmOpen(true)
  }

  const confirmBillingCycleChange = async () => {
    if (!pendingBillingCycle || !onBillingCycleChange) return
    const ok = await onBillingCycleChange(pendingBillingCycle)
    if (ok) {
      setBillingConfirmOpen(false)
      setPendingBillingCycle(null)
    }
  }

  const pendingLabel = pendingBillingCycle === "yearly" ? "annual (yearly)" : "monthly"

  return (
    <>
      <AlertDialog open={billingConfirmOpen} onOpenChange={setBillingConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch billing cycle?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingBillingCycle === "yearly" ? (
                <>
                  You&apos;ll switch to annual billing. You&apos;ll be credited for unused monthly
                  time and charged for the annual plan immediately (proration applies).
                </>
              ) : (
                <>
                  You&apos;ll switch to monthly billing at the end of your current billing period.
                  No charge today — your annual plan continues until then.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingBillingCycle(null)}>
              Keep current billing
            </AlertDialogCancel>
            <Button onClick={confirmBillingCycleChange} disabled={billingCycleLoading}>
              {billingCycleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                `Switch to ${pendingLabel}`
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isCanceled ? (
                  <X className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                Current Plan
              </CardTitle>
              <CardDescription>
                {isCanceled
                  ? "Your subscription has been canceled"
                  : "Manage your subscription settings"}
              </CardDescription>
            </div>
            <StatusBadge status={subscription.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{subscription.plan_name || "InstaLabel Pro"}</h3>
              <p className="text-muted-foreground">{billingCycleLabel(cycle)} Billing</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {formatMoney(subscription.amount, subscription.currency ?? "gbp")}
              </p>
              <p className="text-sm text-muted-foreground">per {monthly ? "month" : "year"}</p>
            </div>
          </div>

          {subscription.current_period_end && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>
                {isCanceled || isScheduledCancel ? "Access until" : "Next billing"}:{" "}
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </span>
            </div>
          )}

          {isPastDue && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-800">
                    Payment failed. Please update your payment method to avoid service interruption.
                  </span>
                </div>
                {onUpdatePaymentMethod && (
                  <Button size="sm" variant="outline" onClick={onUpdatePaymentMethod}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Update Card
                  </Button>
                )}
              </div>
            </div>
          )}

          {cancellationRequestPending && !isScheduledCancel && !isCanceled && (
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-800">
                  Cancellation request submitted — pending review. We&apos;ll process it within 1–2
                  business days.
                </span>
              </div>
            </div>
          )}

          {isScheduledCancel && !isCanceled && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-800">
                  Cancellation scheduled for{" "}
                  {new Date(subscription.current_period_end!).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {isCanceled && subscription.current_period_end && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-800">
                  Subscription canceled. Access will end on{" "}
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {hasPendingBillingChange && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-800">
                    {subscription.pending_plan_name
                      ? `Plan change to ${subscription.pending_plan_name} scheduled`
                      : `Billing change to ${subscription.pending_plan_interval === "monthly" ? "monthly" : "annual"} billing scheduled`}
                    {subscription.pending_plan_change_effective && (
                      <>
                        {" "}
                        on{" "}
                        {new Date(subscription.pending_plan_change_effective).toLocaleDateString()}
                      </>
                    )}
                  </span>
                </div>
                {onCancelPendingBillingChange && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onCancelPendingBillingChange}
                    disabled={cancelPendingLoading}
                  >
                    {cancelPendingLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Cancel change"
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {needsReactivate && onReactivate && (
            <Button
              onClick={onReactivate}
              disabled={reactivateLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {reactivateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reactivating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reactivate Subscription
                </>
              )}
            </Button>
          )}

          {!isCanceled && !hasPendingBillingChange && onBillingCycleChange && (
            <>
              <Separator />
              <div className="flex gap-2">
                <Button
                  variant={monthly ? "default" : "outline"}
                  size="sm"
                  onClick={() => requestBillingCycleChange("monthly")}
                  disabled={billingCycleLoading || monthly}
                >
                  Monthly
                </Button>
                <Button
                  variant={!monthly ? "default" : "outline"}
                  size="sm"
                  onClick={() => requestBillingCycleChange("yearly")}
                  disabled={billingCycleLoading || !monthly}
                >
                  Annual (Save 10%)
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}

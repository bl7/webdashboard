"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import AppLoader from "@/components/AppLoader"
import { useAuth } from "@/context/AuthContext"
import useBillingData from "./hooks/useBillingData"
import PaymentHistory from "./billingcomponents/invoicesList"
import { TrialBanner } from "@/components/subscription/TrialBanner"
import { AnnualBillingBanner } from "@/components/subscription/AnnualBillingBanner"
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard"
import { PaymentPortalRow } from "@/components/subscription/PaymentPortalRow"
import { CancellationSection } from "@/components/subscription/CancellationSection"
import { useSubscriptionActions } from "@/hooks/useSubscriptionActions"

const Billing: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userId, token } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const { subscription, loading, error, cancellationRequestPending, refreshSubscription } =
    useBillingData(userId, token)

  const actions = useSubscriptionActions(userId, token, refreshSubscription)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const clearBillingParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("success")
    params.delete("canceled")
    params.delete("payment_method_updated")
    params.delete("payment_method_cancelled")
    params.delete("session_id")
    params.set("tab", "billing")
    router.replace(`/dashboard/profile?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  useEffect(() => {
    if (!isClient || loading) return

    const success = searchParams.get("success") === "true"
    const canceled = searchParams.get("canceled") === "true"
    const paymentUpdated = searchParams.get("payment_method_updated") === "true"
    const paymentCancelled = searchParams.get("payment_method_cancelled") === "true"

    if (!success && !canceled && !paymentUpdated && !paymentCancelled) return

    if (success || paymentUpdated) {
      let attempts = 0
      const poll = async () => {
        await refreshSubscription()
        attempts++
        if (attempts < 4) setTimeout(poll, 2000)
      }
      poll().finally(() => {
        toast.success(
          paymentUpdated
            ? "Payment method updated successfully!"
            : "Subscription updated successfully!"
        )
        clearBillingParams()
      })
    } else if (canceled || paymentCancelled) {
      toast.info(paymentCancelled ? "Payment method update cancelled." : "Checkout cancelled.")
      clearBillingParams()
    }
  }, [isClient, loading, searchParams, refreshSubscription, clearBillingParams])

  if (!isClient) return <AppLoader />

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-zinc-400" />
          <p className="text-zinc-500">Loading billing…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-red-500" />
          <p className="mb-4 text-red-600">{error}</p>
          <Button onClick={() => refreshSubscription()}>Retry</Button>
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-zinc-500">Please log in to view billing information</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-1 py-2 md:py-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Billing & Invoices</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your plan, payment method, and invoices.</p>
      </div>

      <TrialBanner subscription={subscription} variant="compact" />

      <AnnualBillingBanner
        subscription={subscription}
        onUpgrade={() => actions.changeBillingCycle("yearly")}
        loading={actions.isLoading("billing-cycle")}
      />

      <SubscriptionCard
        subscription={subscription}
        cancellationRequestPending={cancellationRequestPending}
        onReactivate={actions.reactivate}
        onWithdrawCancellation={actions.withdrawCancellationRequest}
        onCancelPendingBillingChange={actions.cancelPendingBillingChange}
        onUpdatePaymentMethod={actions.openCustomerPortal}
        reactivateLoading={actions.isLoading("reactivate")}
        withdrawLoading={actions.isLoading("withdraw-cancellation")}
        cancelPendingLoading={actions.isLoading("cancel-pending")}
      />

      <PaymentPortalRow
        subscription={subscription}
        onManage={actions.openCustomerPortal}
        loading={actions.isLoading("customer-portal")}
      />

      <PaymentHistory userId={userId} itemsPerPage={5} />

      <CancellationSection
        subscription={subscription}
        cancellationRequestPending={cancellationRequestPending}
        onSubmitRequest={actions.submitCancellationRequest}
        onWithdrawRequest={actions.withdrawCancellationRequest}
        loading={actions.isLoading("cancellation")}
        withdrawLoading={actions.isLoading("withdraw-cancellation")}
      />
    </div>
  )
}

export default Billing

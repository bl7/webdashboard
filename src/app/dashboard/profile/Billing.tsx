"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import AppLoader from "@/components/AppLoader"
import { useAuth } from "@/context/AuthContext"
import useBillingData from "./hooks/useBillingData"
import type { Profile } from "./hooks/useBillingData"
import BillingAddress from "./billingcomponents/billingAddress"
import BillingAddressModal from "./billingcomponents/BillingAddressModal"
import PaymentHistory from "./billingcomponents/invoicesList"
import { TrialBanner } from "@/components/subscription/TrialBanner"
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard"
import { PaymentMethodCard } from "@/components/subscription/PaymentMethodCard"
import { PlanTierChange } from "@/components/subscription/PlanTierChange"
import { CancellationSection } from "@/components/subscription/CancellationSection"
import { useSubscriptionActions } from "@/hooks/useSubscriptionActions"

const Billing: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userId, token } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { subscription, loading, error, profile, cancellationRequestPending, refreshProfile, refreshSubscription } =
    useBillingData(userId, token)
  const [localProfile, setLocalProfile] = useState<Profile | null>(null)

  const actions = useSubscriptionActions(userId, token, refreshSubscription)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setLocalProfile(profile)
  }, [profile])

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
      // The new card is written by the async Stripe webhook (setup_intent.succeeded),
      // which usually lands a few seconds after this redirect. Poll a few times so the
      // updated card is reflected instead of showing the stale one.
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

  const handleSaveProfile = async (updatedProfile: Profile) => {
    if (!userId) return
    setLocalProfile(updatedProfile)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          address_line1: updatedProfile.address_line1,
          address_line2: updatedProfile.address_line2,
          city: updatedProfile.city,
          state: updatedProfile.state,
          postal_code: updatedProfile.postal_code,
          country: updatedProfile.country,
          phone: updatedProfile.phone,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update profile")
      await refreshProfile()
      setIsModalOpen(false)
      toast.success("Billing address saved")
    } catch (err) {
      console.error("Error updating profile:", err)
      toast.error(err instanceof Error ? err.message : "Failed to update billing address")
      throw err
    }
  }

  if (!isClient) return <AppLoader />

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-gray-600">Loading billing information...</p>
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
        <p className="text-gray-600">Please log in to view billing information</p>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-[#f6f9fb] p-4 md:p-8">
        <TrialBanner subscription={subscription} />

        <div className="space-y-6">
          <SubscriptionCard
            subscription={subscription}
            cancellationRequestPending={cancellationRequestPending}
            onReactivate={actions.reactivate}
            onBillingCycleChange={actions.changeBillingCycle}
            onCancelPendingBillingChange={actions.cancelPendingBillingChange}
            onUpdatePaymentMethod={actions.openPaymentMethodUpdate}
            reactivateLoading={actions.isLoading("reactivate")}
            billingCycleLoading={actions.isLoading("billing-cycle")}
            cancelPendingLoading={actions.isLoading("cancel-pending")}
          />

          <PlanTierChange
            subscription={subscription}
            onChangePlan={actions.changePlan}
            loading={actions.isLoading("change-plan")}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <PaymentMethodCard
              subscription={subscription}
              onUpdate={actions.openPaymentMethodUpdate}
              loading={actions.isLoading("payment-method")}
            />
            <BillingAddress profile={localProfile} onEdit={() => setIsModalOpen(true)} />
          </div>

          <CancellationSection
            subscription={subscription}
            cancellationRequestPending={cancellationRequestPending}
            onSubmitRequest={actions.submitCancellationRequest}
            loading={actions.isLoading("cancellation")}
          />

          <PaymentHistory userId={userId} itemsPerPage={5} />
        </div>
      </div>

      <BillingAddressModal
        profile={localProfile}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </>
  )
}

export default Billing

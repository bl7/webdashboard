"use client"

import React, { useState, useEffect } from "react"
import SubscriptionInfo from "./billingcomponents/subscriptionInfo"
import PaymentHistory from "./billingcomponents/invoicesList"
import PaymentMethod from "./billingcomponents/paymentMethod"
import BillingAddressModal from "./billingcomponents/BillingAddressModal"
import PlanSelectionModal from "./billingcomponents/planSelectionModal"
import useBillingData, { Profile } from "./hooks/useBillingData"
import PlanRenewal from "./billingcomponents/planRenewal"
import { Button } from "@/components/ui/button"
import AppLoader from "@/components/AppLoader"

const Billing: React.FC = () => {
  const [isClient, setIsClient] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPlans, setShowPlans] = useState(false)
  const [localProfile, setLocalProfile] = useState<Profile | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const userid = localStorage.getItem("userid") || ""
  const {
    subscription,
    invoices,
    profile,
    loading,
    error,
    refreshSubscription,
    refreshInvoices,
    refreshProfile,
  } = useBillingData(userid)

  useEffect(() => {
    setLocalProfile(profile)
  }, [profile])

  const handleSaveProfile = async (updatedProfile: Profile) => {
    if (!userid) return
    setLocalProfile(updatedProfile)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userid, ...updatedProfile }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update profile")

      await refreshProfile()
      setIsModalOpen(false)
    } catch (err) {
      console.error("Error updating profile:", err)
    }
  }

  const handleUpdateSubscription = async (priceId: string | null) => {
    try {
      console.log("Updating subscription with price_id:", priceId)

      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userid,
          price_id: priceId,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        console.error("Subscription update error:", error)
        throw new Error(error.error || "Failed to update subscription")
      }

      const result = await res.json()
      console.log("Subscription updated successfully:", result)

      await refreshSubscription()
      setShowPlans(false)
    } catch (err) {
      console.error("Plan update failed:", err)
      alert(`Failed to update plan: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  // Trial widget
  const isTrial = subscription && (subscription.status === "trialing" || (subscription as any).in_trial)
  const trialEnd = subscription?.trial_end ? new Date(subscription.trial_end) : null
  const today = new Date()
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))) : null

  // Loading state
  if (!isClient || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9fb]">
        <AppLoader message="Loading billing information..." />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9fb]">
        <div className="text-center">
          <div className="mb-4 text-lg text-red-500">⚠️ Error loading billing data</div>
          <p className="mb-4 text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} variant="default">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Auth check
  if (!userid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9fb]">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view billing information</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex min-h-screen flex-col gap-6 bg-[#f6f9fb] p-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          {/* Trial Status Widget */}
          {isTrial && trialEnd && (
            <div className="mb-4 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 text-yellow-900 shadow">
              <div className="flex items-center gap-3">
                <span className="inline-block rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-yellow-900">TRIAL</span>
                <span className="font-semibold">You are currently on a free trial!</span>
              </div>
              <div className="mt-2 text-sm">
                {daysLeft !== null && daysLeft > 0
                  ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left in your trial.`
                  : 'Trial ends today!'}
                <br />
                Trial ends on: <span className="font-semibold">{trialEnd.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <SubscriptionInfo subscription={subscription} onChangePlan={() => setShowPlans(true)} />
            <PlanRenewal subscription={subscription} onChangePlan={() => setShowPlans(true)} />
            <PaymentMethod subscription={subscription} />
          </div>

          <PaymentHistory invoices={invoices || []} itemsPerPage={5} />
        </div>
      </div>

      <BillingAddressModal
        profile={localProfile || profile}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
      />

      {showPlans && (
        <PlanSelectionModal
          userid={userid}
          currentPlan={subscription?.plan_name || "Free Plan"}
          currentBillingPeriod={subscription?.billing_interval as "monthly" | "yearly"}
          subscriptionStatus={subscription?.status as any}
          nextBillingDate={(subscription as any)?.next_billing_date}
          onClose={() => setShowPlans(false)}
          onUpdate={handleUpdateSubscription}
        />
      )}
    </>
  )
}

export default Billing

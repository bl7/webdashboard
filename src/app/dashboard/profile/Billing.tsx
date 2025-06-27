"use client"

import React, { useState, useEffect } from "react"
import SubscriptionInfo from "./billingcomponents/subscriptionInfo"
import PaymentHistory from "./billingcomponents/invoicesList"
import PaymentMethod from "./billingcomponents/paymentMethod"
import BillingAddressModal from "./billingcomponents/BillingAddressModal"
import PlanSelectionModal from "./billingcomponents/planSelectionModal"
import useBillingData from "./hooks/useBillingData"
import PlanRenewal from "./billingcomponents/planRenewal"
import { Button } from "@/components/ui/button"
import AppLoader from "@/components/AppLoader"
import type { Profile } from "./hooks/useBillingData"
import BillingAddress from "./billingcomponents/billingAddress"
import { PLANS } from "./billingcomponents/planSelectionModal"
import { getPlanNameFromPriceId } from '@/lib/formatPlanName'

// Full-width Trial/Status Banner
function TrialBanner({ subscription }: { subscription: any }) {
  if (!subscription || subscription.status !== "trialing" || !subscription.trial_end) return null
  const trialEnd = new Date(subscription.trial_end)
  const today = new Date()
  const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  return (
    <div className="mb-8 w-full rounded-xl border-l-8 border-yellow-400 bg-yellow-50 p-6 text-yellow-900 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="inline-block rounded bg-yellow-400 px-3 py-1 text-sm font-bold text-yellow-900">TRIAL</span>
        <span className="font-semibold text-lg">You are on a free trial!</span>
      </div>
      <div className="text-base font-medium">
        {daysLeft}/10 days left in your trial. &nbsp;|&nbsp; Ends: <span className="font-semibold">{trialEnd.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  )
}

const Billing: React.FC = () => {
  const [isClient, setIsClient] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPlans, setShowPlans] = useState(false)
  const userid = localStorage.getItem("userid") || ""
  const {
    subscription,
    loading,
    error,
    profile,
    refreshSubscription,
    refreshProfile,
  } = useBillingData(userid)
  const [localProfile, setLocalProfile] = useState<Profile | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

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

      const res = await fetch("/api/subscription_better/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userid,
          new_plan_id: priceId,
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

  const handleCancelSubscription = async (immediate = false) => {
    if (!userid) return
    const res = await fetch("/api/subscription_better/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userid, immediate }),
    })
    const data = await res.json()
    if (res.ok) {
      alert(data.message)
      await refreshSubscription()
    } else {
      alert(data.error || "Failed to cancel subscription")
    }
  }

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
      <div className="min-h-screen bg-[#f6f9fb] p-4 md:p-8">
        {/* Full-width Trial Banner */}
        <TrialBanner subscription={subscription} />

        {/* Top Row: Plan, Payment Method */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Plan Card (SubscriptionInfo) */}
          {subscription && (
            <SubscriptionInfo
              subscription={{
                ...subscription,
                plan_name: getPlanNameFromPriceId(subscription.plan_id),
              }}
              onChangePlan={() => setShowPlans(true)}
            />
          )}
          {/* Plan Renewal Card */}
          {subscription && (
            <PlanRenewal
              subscription={{
                ...subscription,
                plan_name: getPlanNameFromPriceId(subscription.plan_id),
              }}
              onChangePlan={() => setShowPlans(true)}
            />
          )}
          {/* Payment Method Card */}
          <PaymentMethod subscription={subscription} />
        </div>

        {/* Invoices and Billing Address Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Invoices List - 2/3 width */}
          <div className="md:col-span-2">
            <PaymentHistory userId={userid} itemsPerPage={8} />
          </div>
          {/* Billing Address Card - 1/3 width */}
          <div className="md:col-span-1">
            {(() => {
              if (!localProfile) {
                return (
                  <div className="rounded-xl bg-white p-6 shadow flex items-center justify-center min-h-[180px] text-gray-500">
                    Billing address not loaded. Please refresh or update your profile.
                  </div>
                )
              }
              return <BillingAddress profile={localProfile} onEdit={() => setIsModalOpen(true)} />
            })()}
          </div>
        </div>

        {/* Cancel Subscription Buttons */}
        {subscription && subscription.status !== "canceled" && (
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Button variant="destructive" onClick={() => handleCancelSubscription(false)}>
              Cancel Subscription (at period end)
            </Button>
            <Button variant="destructive" onClick={() => handleCancelSubscription(true)}>
              Cancel Immediately
            </Button>
          </div>
        )}
      </div>

      <BillingAddressModal
        profile={localProfile}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
      />

      {showPlans && (
        subscription ? (
          <PlanSelectionModal
            userid={userid}
            currentPlan={getPlanNameFromPriceId(subscription.plan_id)}
            currentBillingPeriod={subscription.billing_interval as 'monthly' | 'yearly'}
            subscriptionStatus={subscription.status as any}
            nextBillingDate={subscription.current_period_end ? String(subscription.current_period_end) : undefined}
            subscriptionData={subscription}
            onClose={() => setShowPlans(false)}
            onUpdate={handleUpdateSubscription}
          />
        ) : null
      )}
    </>
  )
}

export default Billing

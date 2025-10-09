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
import { getPlanNameFromPriceId } from '@/lib/formatPlanName'
import { X, Loader2, AlertTriangle } from "lucide-react"
import UpgradePlanModal from "./billingcomponents/UpgradePlanModal"

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
        {daysLeft}/14 days left in your trial. &nbsp;|&nbsp; Ends: <span className="font-semibold">{trialEnd.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [reactivateLoading, setReactivateLoading] = useState(false)
  const [reactivateError, setReactivateError] = useState<string | null>(null)

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

  const handleUpdateSubscription = async (planId: string | null, priceId: string | null) => {
    try {
      if (!planId || !priceId) throw new Error("Missing plan or price id")
      console.log("Updating subscription with plan_id:", planId, "price_id:", priceId)
      const res = await fetch("/api/subscription_better/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userid,
          plan_id: planId,
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

  const handleReactivate = async () => {
    setReactivateLoading(true)
    setReactivateError(null)
    try {
      const res = await fetch("/api/subscription_better/reactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userid }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to reactivate subscription")
      await refreshSubscription()
    } catch (e: any) {
      setReactivateError(e.message)
    } finally {
      setReactivateLoading(false)
    }
  }

  // Helper to check for higher tier plans before opening modal
  const handleChangePlan = async () => {
    if (subscription && (subscription.cancel_at_period_end || subscription.cancel_at) && subscription.status !== 'canceled') {
      // Cancellation scheduled: check for higher tier plans
      try {
        const res = await fetch('/api/plans/secure')
        const plans = await res.json()
        const currentPlan = plans.find((plan: any) => String(plan.id) === String(subscription.plan_id))
        const currentTier = currentPlan ? currentPlan.tier : 0
        const currentPrice = subscription.amount || 0
        const upgradePlans = plans.filter((plan: any) => plan.tier > currentTier || (plan.tier === currentTier && plan.price_monthly > currentPrice))
        if (upgradePlans.length > 0) {
          setShowUpgradeModal(true)
        } else {
          await handleReactivate()
        }
      } catch (e) {
        // fallback: just open modal if error
        setShowUpgradeModal(true)
      }
    } else {
      setShowPlans(true)
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
          <Button onClick={() => window.location.reload()} variant="purple">
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
          {subscription && subscription.status !== 'canceled' && (
            <SubscriptionInfo
              subscription={subscription}
              onChangePlan={handleChangePlan}
            />
          )}
          {/* Plan Renewal Card */}
          {subscription && subscription.status !== 'canceled' && (
            <PlanRenewal
              subscription={subscription}
              onChangePlan={() => {}}
            />
          )}
          {/* New Plan Card for canceled subscriptions */}
          {subscription && subscription.status === 'canceled' && (
            <div className="relative flex flex-col justify-center items-center rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 min-h-[12rem] w-full max-w-md p-4 text-gray-700 shadow-lg sm:min-h-[14rem] col-span-2">
              <div className="text-lg font-bold mb-2">No Active Plan</div>
              <div className="mb-4 text-sm">Your subscription is canceled. Choose a new plan to continue using InstaLabel.</div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded" onClick={() => setShowPlans(true)}>
                Choose Plan
              </Button>
            </div>
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

        {/* Scheduled Cancellation Banner */}
        {subscription && subscription.cancel_at && subscription.status !== "canceled" && (
          <div className="mt-8 w-full rounded-xl border-l-8 border-red-400 bg-red-50 p-6 text-red-900 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-block rounded bg-red-400 px-3 py-1 text-sm font-bold text-white">CANCELLATION SCHEDULED</span>
              <span className="font-semibold text-lg">Your subscription will be canceled on <span className="underline">{new Date(subscription.cancel_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>.</span>
            </div>
            <div className="text-base font-medium">
              You will retain access until this date. No further renewals will occur after cancellation.
            </div>
          </div>
        )}
      </div>

      <BillingAddressModal
        profile={localProfile}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Plan Selection Modal */}
      {showPlans && !((subscription && (subscription.cancel_at_period_end || subscription.cancel_at)) && subscription.status !== 'canceled') && (
        <PlanSelectionModal
          userid={userid}
          currentPlan={subscription?.plan_id || ""}
          currentBillingPeriod={subscription?.billing_interval as 'monthly' | 'yearly' || "monthly"}
          subscriptionStatus={subscription?.status as any || "active"}
          nextBillingDate={subscription?.current_period_end ? new Date(subscription.current_period_end).toISOString() : undefined}
          subscriptionData={subscription}
          onClose={() => setShowPlans(false)}
          onUpdate={handleUpdateSubscription}
        />
      )}

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && subscription && (
        <UpgradePlanModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentPlanTier={0}
          currentPlanPrice={subscription.amount || 0}
          userId={userid}
          onUpgrade={refreshSubscription}
        />
      )}
    </>
  )
}

export default Billing

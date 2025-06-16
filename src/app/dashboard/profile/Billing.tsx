"use client"

import React, { useState, useEffect } from "react"
import SubscriptionInfo from "./billingcomponents/subscriptionInfo"
import PaymentHistory from "./billingcomponents/paymentHistory"
import PaymentMethod from "./billingcomponents/paymentMethod"
import BillingAddress from "./billingcomponents/billingAddress"
import BillingAddressModal from "./billingcomponents/BillingAddressModal"
import PlanSelectionModal from "./billingcomponents/planSelectionModal"
import useBillingData, { Profile } from "./hooks/useBillingData"
import PlanRenewal from "./billingcomponents/planRenewal"
import FreePrintsLeft from "./billingcomponents/freePlanLimit"

const Billing: React.FC = () => {
  const [isClient, setIsClient] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPlans, setShowPlans] = useState(false)
  const [localProfile, setLocalProfile] = useState<Profile | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const userid = typeof window !== "undefined" ? localStorage.getItem("userid") || "" : ""
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

  const handleUpdateSubscription = async (planName: string, billingPeriod: string) => {
    try {
      const planAmount = planName.toLowerCase().includes("pro") ? 2000 : 0
      const nextBillingDate = new Date()

      // Set next billing date based on period
      if (billingPeriod === "monthly") {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
      } else if (billingPeriod === "yearly") {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
      }

      const res = await fetch("/api/subscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userid,
          stripe_customer_id: planAmount > 0 ? `manual-customer-${userid}` : null,
          stripe_subscription_id: planAmount > 0 ? `manual-sub-${userid}` : null,
          price_id: planAmount > 0 ? `manual-price-${planName}` : null,
          status: "active",
          current_period_end: nextBillingDate.toISOString(),
          trial_end: null,
          plan_name: planName,
          plan_amount: planAmount,
          billing_interval: billingPeriod,
          next_amount_due: planAmount,
          card_last4: planAmount > 0 ? "4242" : null,
          card_exp_month: planAmount > 0 ? "12" : null,
          card_exp_year: planAmount > 0 ? "2029" : null,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        console.error("Update subscription error:", error)
        throw new Error(error.error || "Failed to update subscription")
      }

      // Refresh subscription data after successful update
      await refreshSubscription()
      setShowPlans(false)
    } catch (err) {
      console.error("Plan update failed:", err)
      // You might want to show an error toast here
    }
  }

  // Show loading state while data is being fetched
  if (!isClient || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9fb]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading billing information...</p>
        </div>
      </div>
    )
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9fb]">
        <div className="text-center">
          <div className="mb-4 text-lg text-red-500">⚠️ Error loading billing data</div>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Don't render if essential data is missing
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SubscriptionInfo subscription={subscription} onChangePlan={() => setShowPlans(true)} />
            <PlanRenewal subscription={subscription} onChangePlan={() => setShowPlans(true)} />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FreePrintsLeft printsUsed={2} maxPrintsPerWeek={20} />
            <div className="rounded-2xl bg-white p-6 shadow">
              {/* Placeholder for future billing feature */}
              <div className="text-center text-gray-500">
                <p>Additional billing features coming soon</p>
              </div>
            </div>
          </div>

          <PaymentHistory invoices={invoices || []} />
        </div>

        <div className="flex w-full flex-shrink-0 flex-col gap-6 lg:w-[320px]">
          <BillingAddress profile={localProfile || profile} onEdit={() => setIsModalOpen(true)} />
          <PaymentMethod subscription={subscription} />
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
          onClose={() => setShowPlans(false)}
          onUpdate={handleUpdateSubscription}
        />
      )}
    </>
  )
}

export default Billing

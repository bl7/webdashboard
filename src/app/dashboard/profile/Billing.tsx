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
      const res = await fetch("/api/subscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userid,
          stripe_customer_id: `manual-customer-${userid}`,
          stripe_subscription_id: `manual-sub-${userid}`,
          price_id: `manual-price-${planName}`,
          status: "active",
          current_period_end: new Date().toISOString(),
          trial_end: null,
          plan_name: planName,
          plan_amount: planName.includes("Pro") ? 2000 : 0,
          billing_interval: billingPeriod,
          next_amount_due: 0,
          card_last4: "0000",
          card_exp_month: "01",
          card_exp_year: "30",
        }),
      })
      console.log("res", res.body)
      if (!res.ok) {
        const error = await res.json()
        console.error("Update subscription error:", error)
        throw new Error("Failed to update subscription")
      }

      await refreshSubscription()
      setShowPlans(false)
    } catch (err) {
      console.error("Plan update failed", err)
    }
  }

  if (!isClient || !userid || !subscription || !profile || !localProfile) return null

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
            <div className="rounded-2xl bg-white p-6 shadow" />
          </div>

          <PaymentHistory invoices={invoices} />
        </div>

        <div className="flex w-full flex-shrink-0 flex-col gap-6 lg:w-[320px]">
          <BillingAddress profile={localProfile} onEdit={() => setIsModalOpen(true)} />
          <PaymentMethod subscription={subscription} />
        </div>
      </div>

      <BillingAddressModal
        profile={localProfile}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
      />

      {showPlans && (
        <PlanSelectionModal
          userid={userid}
          currentPlan={subscription.plan_name || "Starter Kitchen"}
          onClose={() => setShowPlans(false)}
          onUpdate={handleUpdateSubscription}
        />
      )}
    </>
  )
}

export default Billing

"use client"

import React, { useState, useEffect } from "react"
import SubscriptionInfo from "./billingcomponents/subscriptionInfo"
import PaymentHistory from "./billingcomponents/paymentHistory"
import PaymentMethod from "./billingcomponents/paymentMethod"
import BillingAddress from "./billingcomponents/billingAddress"
import BillingAddressModal from "./billingcomponents/BillingAddressModal"
import PlanSelectionModal from "./billingcomponents/planSelectionModal"
import useBillingData from "./hooks/useBillingData"
import PlanRenewal from "./billingcomponents/planRenewal"
import FreePrintsLeft from "./billingcomponents/freePlanLimit"

interface Profile {
  address: string
  city: string
  state: string
  country: string
  zip: string
}

const Billing: React.FC = () => {
  const [userid, setUserid] = useState<string | null>(null)

  useEffect(() => {
    const storedUserid = localStorage.getItem("userid")
    if (storedUserid) {
      setUserid(storedUserid)
    }
  }, [])

  const {
    subscription,
    invoices,
    profile,
    loading,
    error,
    refreshSubscription,
    refreshInvoices,
    refreshProfile,
  } = useBillingData(userid || "")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [localProfile, setLocalProfile] = useState<Profile | null>(profile)

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
        body: JSON.stringify({
          user_id: userid,
          ...updatedProfile,
        }),
      })

      const data = await res.json()
      console.log("Update API response:", data)

      if (!res.ok) throw new Error(data.error || "Failed to update profile")

      await refreshProfile()
      setIsModalOpen(false)
    } catch (err) {
      console.error("Error updating profile:", err)
    }
  }

  const [showPlans, setShowPlans] = useState(false)

  if (!userid || !subscription || !localProfile) return null

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 p-6 bg-[#f6f9fb] min-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SubscriptionInfo subscription={subscription} onChangePlan={() => setShowPlans(true)} />
            <PlanRenewal subscription={subscription} onChangePlan={() => setShowPlans(true)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FreePrintsLeft printsUsed={2} maxPrintsPerWeek={20} />
            <div className="bg-white rounded-2xl shadow p-6" />
          </div>

          <div>
            <PaymentHistory invoices={invoices} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6">
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
    </>
  )
}

export default Billing

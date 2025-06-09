"use client"

import React, { useState } from "react"
import SubscriptionInfo from "./billingcomponents/subscriptionInfo"
import PaymentHistory from "./billingcomponents/paymentHistory"
import PaymentMethod from "./billingcomponents/paymentMethod"
import BillingAddress from "./billingcomponents/billingAddress"
import PlanSelectionModal from "./billingcomponents/planSelectionModal"
import useBillingData from "./hooks/useBillingData"

const Billing: React.FC<{ userid: string }> = ({ userid }) => {
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

  const [showPlans, setShowPlans] = useState(false)

  if (loading) return <div>Loading billing info...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!subscription || !profile) return null

  return (
    <div>
      <SubscriptionInfo subscription={subscription} onChangePlan={() => setShowPlans(true)} />

      <PaymentHistory invoices={invoices} />

      <PaymentMethod subscription={subscription} />

      <BillingAddress profile={profile} />

      {showPlans && (
        <PlanSelectionModal
          userid={userid}
          currentSubscription={subscription}
          onClose={() => setShowPlans(false)}
          onUpdate={() => {
            refreshSubscription()
            refreshInvoices()
            setShowPlans(false)
          }}
        />
      )}
    </div>
  )
}

export default Billing

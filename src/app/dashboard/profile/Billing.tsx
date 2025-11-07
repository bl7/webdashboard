"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PaymentHistory from "./billingcomponents/invoicesList"
import PaymentMethod from "./billingcomponents/paymentMethod"
import BillingAddressModal from "./billingcomponents/BillingAddressModal"
import useBillingData from "./hooks/useBillingData"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AppLoader from "@/components/AppLoader"
import type { Profile } from "./hooks/useBillingData"
import BillingAddress from "./billingcomponents/billingAddress"
import {
  Calendar,
  CreditCard,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Settings,
  RefreshCw,
  X,
} from "lucide-react"

// Full-width Trial/Status Banner
function TrialBanner({ subscription }: { subscription: any }) {
  if (!subscription || subscription.status !== "trialing" || !subscription.trial_end) return null
  const trialEnd = new Date(subscription.trial_end)
  const today = new Date()
  const daysLeft = Math.max(
    0,
    Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  )
  return (
    <div className="mb-8 flex w-full flex-col gap-4 rounded-xl border-l-8 border-yellow-400 bg-yellow-50 p-6 text-yellow-900 shadow md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-block rounded bg-yellow-400 px-3 py-1 text-sm font-bold text-yellow-900">
          TRIAL
        </span>
        <span className="text-lg font-semibold">You are on a free trial!</span>
      </div>
      <div className="text-base font-medium">
        {daysLeft}/14 days left in your trial. &nbsp;|&nbsp; Ends:{" "}
        <span className="font-semibold">
          {trialEnd.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  )
}

// Subscription Summary Card
function SubscriptionSummary({
  subscription,
  onReactivate,
  reactivateLoading,
}: {
  subscription: any
  onReactivate?: () => void
  reactivateLoading?: boolean
}) {
  const router = useRouter()

  if (!subscription) return null

  const isMonthly = subscription.billing_interval === "monthly"
  const isCanceled = subscription.status === "canceled"
  const isScheduledCancel = subscription.cancel_at_period_end || subscription.cancel_at

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isCanceled ? (
            <X className="h-5 w-5 text-red-500" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
          Current Plan
        </CardTitle>
        <CardDescription>
          {isCanceled ? "Your subscription has been canceled" : "Manage your subscription settings"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">{subscription.plan_name || "InstaLabel Pro"}</h3>
            <p className="text-muted-foreground">
              {isMonthly ? "Monthly Billing" : "Annual Billing"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">£{(subscription.amount / 100).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">per {isMonthly ? "month" : "year"}</p>
          </div>
        </div>

        {subscription.current_period_end && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>
              {isCanceled ? "Expires" : "Next billing"}:{" "}
              {new Date(subscription.current_period_end).toLocaleDateString()}
            </span>
          </div>
        )}

        {isCanceled && (
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

        {isScheduledCancel && !isCanceled && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-800">
                Cancellation scheduled for{" "}
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {isCanceled && onReactivate && (
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

        {!isCanceled && (
          <Button onClick={() => router.push("/dashboard/subscription")} className="w-full">
            <Settings className="mr-2 h-4 w-4" />
            Manage Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

const Billing: React.FC = () => {
  const [isClient, setIsClient] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reactivateLoading, setReactivateLoading] = useState(false)
  const userid = typeof window !== "undefined" ? localStorage.getItem("userid") || "" : ""
  const { subscription, loading, error, profile, refreshProfile, refreshSubscription } =
    useBillingData(userid)
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

  const handleReactivate = async () => {
    if (!subscription || !userid) return

    setReactivateLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("/api/subscription_better/reactivate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userid,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to reactivate subscription")
      }

      if (refreshSubscription) {
        await refreshSubscription()
      }
      toast.success("Subscription reactivated successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to reactivate subscription")
      console.error("Reactivation error:", error)
    } finally {
      setReactivateLoading(false)
    }
  }

  if (!isClient) {
    return <AppLoader />
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9fb]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-gray-600">Loading billing information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9fb]">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-red-500" />
          <p className="mb-4 text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Subscription Summary */}
          <SubscriptionSummary
            subscription={subscription}
            onReactivate={handleReactivate}
            reactivateLoading={reactivateLoading}
          />

          {/* Payment Method Card */}
          <PaymentMethod subscription={subscription} />

          {/* Billing Address */}
          <BillingAddress profile={localProfile} onEdit={() => setIsModalOpen(true)} />
        </div>

        {/* Invoices Row */}
        <div className="mt-6">
          <PaymentHistory userId={userid} itemsPerPage={5} />
        </div>
      </div>

      {/* Billing Address Modal */}
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

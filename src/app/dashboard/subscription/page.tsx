"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  X,
  RefreshCw,
  MessageSquare,
} from "lucide-react"
import useBillingData from "../profile/hooks/useBillingData"
import { toast } from "sonner"

// Trial Banner Component
function TrialBanner({ subscription }: { subscription: any }) {
  if (!subscription || subscription.status !== "trialing" || !subscription.trial_end) return null

  const trialEnd = new Date(subscription.trial_end)
  const today = new Date()
  const daysLeft = Math.max(
    0,
    Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  )

  return (
    <div className="mb-6 rounded-xl border-l-4 border-yellow-400 bg-yellow-50 p-4">
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">
          TRIAL
        </Badge>
        <div>
          <p className="font-semibold text-yellow-900">Free Trial Active</p>
          <p className="text-sm text-yellow-800">
            {daysLeft} days remaining • Ends {trialEnd.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

// Current Plan Card
function CurrentPlanCard({
  subscription,
  onBillingCycleChange,
  loading,
}: {
  subscription: any
  onBillingCycleChange: (cycle: "monthly" | "yearly") => void
  loading: boolean
}) {
  if (!subscription) return null

  const isMonthly =
    subscription.billing_interval === "monthly" || subscription.billing_interval === "month"
  const isCanceled = subscription.status === "canceled"
  const isScheduledCancel = subscription.cancel_at_period_end || subscription.cancel_at
  const hasPendingChange = subscription.pending_plan_interval || subscription.pending_plan_change

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
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

        {hasPendingChange && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-800">
                Billing cycle change scheduled to{" "}
                {subscription.pending_plan_interval === "monthly" ? "monthly" : "annual"} billing
                {subscription.pending_plan_change_effective && (
                  <>
                    {" "}
                    on {new Date(subscription.pending_plan_change_effective).toLocaleDateString()}
                  </>
                )}
              </span>
            </div>
          </div>
        )}

        <Separator />

        <div className="flex gap-2">
          {!isCanceled && !hasPendingChange && (
            <>
              <Button
                variant={isMonthly ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  console.log("[DEBUG] Monthly button clicked")
                  onBillingCycleChange("monthly")
                }}
                disabled={loading || isMonthly}
              >
                Monthly
              </Button>
              <Button
                variant={!isMonthly ? "default" : "outline"}
                size="sm"
                onClick={() => onBillingCycleChange("yearly")}
                disabled={loading || !isMonthly}
              >
                Annual (Save 10%)
              </Button>
            </>
          )}
          {hasPendingChange && (
            <div className="text-sm text-muted-foreground">Billing cycle change in progress...</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Payment Method Card
function PaymentMethodCard({ subscription }: { subscription: any }) {
  const [loading, setLoading] = useState(false)

  const handleUpdatePaymentMethod = async () => {
    if (!subscription) return

    setLoading(true)
    try {
      const userid = localStorage.getItem("userid")
      if (!userid) {
        throw new Error("User not found")
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("/api/subscription_better/create-payment-method-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userid }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment method update session")
      }

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No portal URL received")
      }
    } catch (error) {
      toast.error("Failed to open payment method settings")
      console.error("Payment method update error:", error)
    } finally {
      setLoading(false)
    }
  }

  const hasCard = !!subscription?.card_last4
  const cardBrand = subscription?.card_brand || "CARD"
  const cardLast4 = subscription?.card_last4 || "0000"
  const cardExpMonth = subscription?.card_exp_month
  const cardExpYear = subscription?.card_exp_year

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
        <CardDescription>Manage your payment information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
              <CreditCard className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">
                {hasCard ? `**** **** **** ${cardLast4}` : "No payment method"}
              </p>
              {cardExpMonth && cardExpYear && (
                <p className="text-sm text-muted-foreground">
                  Expires {cardExpMonth}/{cardExpYear}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdatePaymentMethod}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Opening...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Invoice History Card
function InvoiceHistoryCard({ subscription }: { subscription: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Billing History
        </CardTitle>
        <CardDescription>View and download your invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">January 15, 2024</p>
              <p className="text-sm text-muted-foreground">Monthly subscription</p>
            </div>
            <div className="text-right">
              <p className="font-medium">£25.00</p>
              <Badge variant="secondary" className="text-green-600">
                Paid
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">December 15, 2023</p>
              <p className="text-sm text-muted-foreground">Monthly subscription</p>
            </div>
            <div className="text-right">
              <p className="font-medium">£25.00</p>
              <Badge variant="secondary" className="text-green-600">
                Paid
              </Badge>
            </div>
          </div>
        </div>
        <Button variant="outline" className="mt-4 w-full">
          View All Invoices
        </Button>
      </CardContent>
    </Card>
  )
}

// Cancellation Request Section
function CancellationRequestSection({
  subscription,
  onReactivate,
  loading,
}: {
  subscription: any
  onReactivate: () => void
  loading: boolean
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const isCanceled = subscription?.status === "canceled"
  const isScheduledCancel = subscription?.cancel_at_period_end || subscription?.cancel_at

  const handleSubmitRequest = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for cancellation")
      return
    }

    setSubmitting(true)
    try {
      const userid = localStorage.getItem("userid")
      const token = localStorage.getItem("token")

      if (!userid || !token) {
        throw new Error("Authentication required")
      }

      const response = await fetch("/api/subscription_better/cancellation-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userid,
          reason: reason.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit cancellation request")
      }

      const result = await response.json()
      toast.success(result.message)
      setIsDialogOpen(false)
      setReason("")
    } catch (error: any) {
      toast.error(error.message || "Failed to submit cancellation request")
      console.error("Cancellation request error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (isCanceled) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <X className="h-5 w-5" />
            Subscription Canceled
          </CardTitle>
          <CardDescription>
            Your subscription has been canceled and will expire on{" "}
            {new Date(subscription.current_period_end).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onReactivate} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Reactivate Subscription
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isScheduledCancel) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Cancellation Scheduled
          </CardTitle>
          <CardDescription>
            Your subscription will be canceled on{" "}
            {new Date(subscription.current_period_end).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onReactivate} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Reactivate Subscription
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <X className="h-5 w-5" />
          Request Cancellation
        </CardTitle>
        <CardDescription>
          Submit a cancellation request. We'll review it and process it within 1-2 business days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Request Cancellation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Request Subscription Cancellation</DialogTitle>
              <DialogDescription>
                Please tell us why you'd like to cancel your subscription. This helps us improve our
                service.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="reason" className="text-sm font-medium">
                  Reason for cancellation *
                </label>
                <Textarea
                  id="reason"
                  placeholder="Please provide your reason for cancelling..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  setReason("")
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitRequest}
                disabled={submitting || !reason.trim()}
                variant="destructive"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

// Main Subscription Management Page
export default function SubscriptionManagementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [reactivateLoading, setReactivateLoading] = useState(false)

  const userid = typeof window !== "undefined" ? localStorage.getItem("userid") || "" : ""
  const {
    subscription,
    loading: subscriptionLoading,
    error,
    refreshSubscription,
  } = useBillingData(userid)

  // Auth check
  if (!userid) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view subscription information</p>
        </div>
      </div>
    )
  }

  // Loading state
  if (subscriptionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-gray-600">Loading subscription information...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-red-500" />
          <p className="mb-4 text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const handleBillingCycleChange = async (newCycle: "monthly" | "yearly") => {
    console.log("[DEBUG] handleBillingCycleChange called with:", newCycle)

    if (!subscription) {
      console.log("[DEBUG] No subscription found, returning")
      return
    }

    console.log("[DEBUG] Setting loading to true")
    setLoading(true)
    try {
      // This would call a simplified API endpoint
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      console.log("[FRONTEND] Attempting billing cycle change:", {
        userid,
        newCycle,
        token: token ? "present" : "missing",
      })

      const response = await fetch("/api/subscription_better/change-billing-cycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userid,
          billing_cycle: newCycle,
        }),
      })

      console.log("[FRONTEND] Response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.log("[FRONTEND] Error response:", errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("[FRONTEND] Success response:", result)

      await refreshSubscription()
      toast.success(`Switched to ${newCycle} billing`)
    } catch (error: any) {
      console.error("[FRONTEND] Billing cycle change error:", error)
      toast.error(error.message || "Failed to update billing cycle")
    } finally {
      setLoading(false)
    }
  }

  const handleReactivate = async () => {
    if (!subscription) return

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
        throw new Error("Failed to reactivate subscription")
      }

      await refreshSubscription()
      toast.success("Subscription reactivated")
    } catch (error) {
      toast.error("Failed to reactivate subscription")
      console.error("Reactivation error:", error)
    } finally {
      setReactivateLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-bold">Manage Subscription</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your InstaLabel subscription, billing, and payment information
          </p>
        </div>

        {/* Trial Banner */}
        <TrialBanner subscription={subscription} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <CurrentPlanCard
              subscription={subscription}
              onBillingCycleChange={handleBillingCycleChange}
              loading={loading}
            />
            <PaymentMethodCard subscription={subscription} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <InvoiceHistoryCard subscription={subscription} />
            <CancellationRequestSection
              subscription={subscription}
              onReactivate={handleReactivate}
              loading={reactivateLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

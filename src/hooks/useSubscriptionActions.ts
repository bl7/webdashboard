"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import type { BillingCycle } from "@/lib/billing"

type ActionType =
  | "reactivate"
  | "billing-cycle"
  | "change-plan"
  | "payment-method"
  | "cancellation"
  | "cancel-pending"

export function useSubscriptionActions(
  userId: string | null,
  token: string | null,
  refreshSubscription: () => Promise<void>
) {
  const [activeAction, setActiveAction] = useState<ActionType | null>(null)

  const authHeaders = useCallback(() => {
    if (!token) throw new Error("No authentication token found")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }, [token])

  const reactivate = useCallback(async () => {
    if (!userId) return false
    setActiveAction("reactivate")
    try {
      const response = await fetch("/api/subscription_better/reactivate", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ user_id: userId }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to reactivate subscription")
      }
      await refreshSubscription()
      toast.success("Subscription reactivated successfully!")
      return true
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to reactivate subscription")
      return false
    } finally {
      setActiveAction(null)
    }
  }, [userId, authHeaders, refreshSubscription])

  const changeBillingCycle = useCallback(
    async (cycle: BillingCycle) => {
      if (!userId) return false
      setActiveAction("billing-cycle")
      try {
        const response = await fetch("/api/subscription_better/change-billing-cycle", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ user_id: userId, billing_cycle: cycle }),
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to update billing cycle")
        }
        const result = await response.json()
        await refreshSubscription()
        toast.success(result.message || `Switched to ${cycle} billing`)
        return true
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Failed to update billing cycle")
        return false
      } finally {
        setActiveAction(null)
      }
    },
    [userId, authHeaders, refreshSubscription]
  )

  const changePlan = useCallback(
    async (planId: string, priceId: string) => {
      if (!userId) return false
      setActiveAction("change-plan")
      try {
        const response = await fetch("/api/subscription_better/change-plan", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ user_id: userId, plan_id: planId, price_id: priceId }),
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to change plan")
        }
        const result = await response.json()
        await refreshSubscription()
        toast.success(result.message || "Plan updated successfully")
        return true
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Failed to change plan")
        return false
      } finally {
        setActiveAction(null)
      }
    },
    [userId, authHeaders, refreshSubscription]
  )

  const openPaymentMethodUpdate = useCallback(async () => {
    if (!userId) return false
    setActiveAction("payment-method")
    try {
      const response = await fetch("/api/subscription_better/create-payment-method-session", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ user_id: userId }),
      })
      if (!response.ok) throw new Error("Failed to create payment method update session")
      const data = await response.json()
      if (!data.url) throw new Error("No redirect URL received")
      window.location.href = data.url
      return true
    } catch (error: unknown) {
      toast.error("Failed to open payment method settings")
      console.error(error)
      return false
    } finally {
      setActiveAction(null)
    }
  }, [userId, authHeaders])

  const submitCancellationRequest = useCallback(
    async (reason: string) => {
      if (!userId) return false
      setActiveAction("cancellation")
      try {
        const response = await fetch("/api/subscription_better/cancellation-request", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ user_id: userId, reason: reason.trim() }),
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to submit cancellation request")
        }
        const result = await response.json()
        await refreshSubscription()
        toast.success(
          result.message ||
            "Your cancellation request has been submitted. We'll review it within 1–2 business days."
        )
        return true
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Failed to submit cancellation request")
        return false
      } finally {
        setActiveAction(null)
      }
    },
    [userId, authHeaders, refreshSubscription]
  )

  const cancelPendingBillingChange = useCallback(async () => {
    if (!userId) return false
    setActiveAction("cancel-pending")
    try {
      const response = await fetch("/api/subscription_better/cancel-pending-change", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ user_id: userId }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to cancel pending change")
      }
      const result = await response.json()
      await refreshSubscription()
      toast.success(result.message || "Pending billing change cancelled")
      return true
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel pending change")
      return false
    } finally {
      setActiveAction(null)
    }
  }, [userId, authHeaders, refreshSubscription])

  return {
    activeAction,
    isLoading: (action: ActionType) => activeAction === action,
    reactivate,
    changeBillingCycle,
    changePlan,
    openPaymentMethodUpdate,
    submitCancellationRequest,
    cancelPendingBillingChange,
  }
}

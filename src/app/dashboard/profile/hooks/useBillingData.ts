import { useState, useEffect, useCallback } from "react"

export interface Profile {
  user_id?: string
  name?: string
  full_name?: string
  email?: string
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  phone?: string
}

export interface Subscription {
  id?: string
  user_id: string
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  plan_id?: string | null
  plan_name?: string | null
  status: string
  trial_start?: string | null
  trial_end?: string | null
  current_period_start?: string | null
  current_period_end?: string | null
  billing_interval?: string | null
  amount?: number | null
  currency?: string | null
  cancel_at_period_end?: boolean | null
  pending_plan_change?: string | null
  pending_plan_change_effective?: string | null
  pending_plan_interval?: string | null
  pending_plan_name?: string | null
  pending_price_id?: string | null
  card_brand?: string | null
  card_last4?: string | null
  card_exp_month?: number | null
  card_exp_year?: number | null
  card_country?: string | null
  card_fingerprint?: string | null
  created_at?: string
  updated_at?: string
  cancel_at?: string | null
}

interface UseBillingDataReturn {
  subscription: Subscription | null
  profile: Profile | null
  cancellationRequestPending: boolean
  loading: boolean
  error: string | null
  refreshSubscription: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const useBillingData = (userId: string | null, token?: string | null): UseBillingDataReturn => {
  const effectiveToken =
    token ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null)

  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cancellationRequestPending, setCancellationRequestPending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscription = useCallback(async () => {
    if (!userId || !effectiveToken) return
    try {
      const response = await fetch(`/api/subscription_better/status`, {
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch subscription: ${response.statusText}`)
      }
      const data = await response.json()
      setSubscription(data.subscription || null)
      setCancellationRequestPending(!!data.cancellation_request_pending)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch subscription")
    }
  }, [userId, effectiveToken])

  const fetchProfile = useCallback(async () => {
    if (!userId) return
    try {
      const response = await fetch(`/api/profile?user_id=${userId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`)
      }
      const data = await response.json()
      setProfile(data.profile || { user_id: userId })
    } catch (err) {
      console.error("Error fetching profile:", err)
      setProfile({ user_id: userId })
    }
  }, [userId])

  const refreshSubscription = useCallback(async () => {
    await fetchSubscription()
  }, [fetchSubscription])

  const refreshProfile = useCallback(async () => {
    await fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    if (!userId || !effectiveToken) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    Promise.all([fetchSubscription(), fetchProfile()]).finally(() => setLoading(false))
  }, [userId, effectiveToken, fetchSubscription, fetchProfile])

  return {
    subscription,
    profile,
    cancellationRequestPending,
    loading,
    error,
    refreshSubscription,
    refreshProfile,
  }
}

export default useBillingData

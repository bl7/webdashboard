import { useState, useEffect, useCallback } from "react"
import { Invoice } from "@/types/invoice"

export interface Profile {
  user_id?: string
  name?: string
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
  invoices: Invoice[] | null
  profile: Profile | null
  loading: boolean
  error: string | null
  refreshSubscription: () => Promise<void>
  refreshInvoices: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const useBillingData = (userId: string): UseBillingDataReturn => {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[] | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch subscription data
  const fetchSubscription = useCallback(async () => {
    if (!userId) return
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`/api/subscription_better/status`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch subscription: ${response.statusText}`)
      }
      const data = await response.json()
      setSubscription(data.subscription || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch subscription")
    }
  }, [userId])

  // Fetch invoices data
  const fetchInvoices = useCallback(async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/invoices?user_id=${userId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch invoices: ${response.statusText}`)
      }
      const data = await response.json()
      setInvoices(data.invoices || [])
    } catch (err) {
      console.error("Error fetching invoices:", err)
      // Don't set error for invoices as it's not critical
      setInvoices([])
    }
  }, [userId])

  // Fetch profile data
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
      // Set default profile if fetch fails
      setProfile({ user_id: userId })
    }
  }, [userId])

  // Refresh functions
  const refreshSubscription = useCallback(async () => {
    await fetchSubscription()
  }, [fetchSubscription])

  const refreshInvoices = useCallback(async () => {
    await fetchInvoices()
  }, [fetchInvoices])

  const refreshProfile = useCallback(async () => {
    await fetchProfile()
  }, [fetchProfile])

  // Initial data fetch
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    Promise.all([fetchSubscription(), fetchProfile()]).finally(() => setLoading(false))
  }, [userId, fetchSubscription, fetchProfile])

  return {
    subscription,
    invoices,
    profile,
    loading,
    error,
    refreshSubscription,
    refreshInvoices,
    refreshProfile,
  }
}

export default useBillingData

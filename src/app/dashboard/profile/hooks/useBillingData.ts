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
  id?: number
  user_id: string
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  price_id?: string | null
  status: string
  current_period_end?: string | null
  trial_end?: string | null
  plan_name?: string
  plan_amount?: number
  billing_interval?: string | null
  next_amount_due?: number
  card_last4?: string | null
  card_exp_month?: string | null
  card_exp_year?: string | null
  created_at?: string
  updated_at?: string
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
      const response = await fetch(`/api/subscriptions?user_id=${userId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch subscription: ${response.statusText}`)
      }
      const data = await response.json()

      // If no subscription exists, create a default free plan
      if (!data.subscription) {
        const defaultSubscription: Subscription = {
          user_id: userId,
          status: "active",
          plan_name: "Free Plan",
          plan_amount: 0,
          billing_interval: null,
          next_amount_due: 0,
          stripe_customer_id: null,
          stripe_subscription_id: null,
          price_id: null,
          card_last4: null,
          card_exp_month: null,
          card_exp_year: null,
        }
        setSubscription(defaultSubscription)
      } else {
        setSubscription(data.subscription)
      }
    } catch (err) {
      console.error("Error fetching subscription:", err)
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

    const fetchAllData = async () => {
      setLoading(true)
      setError(null)

      try {
        await Promise.all([fetchSubscription(), fetchInvoices(), fetchProfile()])
      } catch (err) {
        console.error("Error fetching billing data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch billing data")
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [userId, fetchSubscription, fetchInvoices, fetchProfile])

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

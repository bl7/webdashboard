import { useEffect, useState } from "react"

export interface Subscription {
  plan_name: string
  plan_amount: number
  billing_interval: string
  next_amount_due: number
  card_last4: string
  card_exp_month: number
  card_exp_year: number
  current_period_end: string
  status: string
  stripe_subscription_id: string
  id: number
}

export interface Invoice {
  id: number
  amount: number
  status: string
  recipient_name: string
  payment_method_last4: string
  invoice_date: string
  metadata: any
}

export interface Profile {
  address: string
  city: string
  state: string
  country: string
  zip: string
  // other fields as needed
}

const FREE_PLAN: Subscription = {
  plan_name: "Free Plan",
  plan_amount: 0,
  billing_interval: "month",
  next_amount_due: 0,
  card_last4: "",
  card_exp_month: 0,
  card_exp_year: 0,
  current_period_end: "",
  status: "active",
  stripe_subscription_id: "",
  id: 0,
}

export default function useBillingData(userid: string) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchSubscription() {
    try {
      const res = await fetch(`/api/subscriptions?user_id=${userid}`)
      if (!res.ok) throw new Error("Failed to fetch subscription")
      const data = await res.json()
      if (!data.subscription) {
        setSubscription(FREE_PLAN)
      } else {
        setSubscription({
          ...data.subscription,
          plan_amount: Number(data.subscription.plan_amount) || 0,
          next_amount_due: Number(data.subscription.next_amount_due) || 0,
        })
      }
    } catch (err: any) {
      setError(err.message || "Could not load subscription.")
      setSubscription(FREE_PLAN)
    }
  }

  async function fetchInvoices() {
    if (!subscription || subscription.id === 0) {
      setInvoices([])
      return
    }
    try {
      const res = await fetch(`/api/invoices?subscription_id=${subscription.id}`)
      if (!res.ok) throw new Error("Failed to fetch invoices")
      const data = await res.json()
      setInvoices(data.invoices || [])
    } catch {
      setError("Could not load invoices.")
    }
  }

  async function fetchProfile() {
    try {
      const res = await fetch(`/api/profile?user_id=${userid}`)
      if (!res.ok) throw new Error("Failed to fetch profile")
      const data = await res.json()
      console.log("Billing data fetched:", data)
      setProfile(data.profile || null)
    } catch {
      setError("Could not load profile.")
    }
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      await fetchSubscription()
      setLoading(false)
    }
    fetchData()
  }, [userid])

  useEffect(() => {
    fetchInvoices()
  }, [subscription])

  useEffect(() => {
    fetchProfile()
  }, [userid])

  return {
    subscription,
    invoices,
    profile,
    loading,
    error,
    refreshSubscription: fetchSubscription,
    refreshInvoices: fetchInvoices,
    refreshProfile: fetchProfile,
  }
}

// lib/subscription.ts

export async function getSubscription(userid: string) {
  const res = await fetch(`/api/subscription?user_id=${userid}`)
  if (!res.ok) throw new Error("Failed to fetch subscription")
  const data = await res.json()
  return data.subscription
}

export async function updateSubscription(
  userid: string,
  planName: string,
  billingInterval: string
) {
  const res = await fetch("/api/subscription", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userid,
      stripe_customer_id: "manual", // add actual ID if needed
      stripe_subscription_id: "manual-plan", // or generate / map per plan if not Stripe-driven
      price_id: "manual-price-id",
      status: "active",
      current_period_end: new Date().toISOString(),
      trial_end: null,
      plan_name: planName,
      plan_amount: 0, // adjust accordingly
      billing_interval: billingInterval,
      next_amount_due: 0,
      card_last4: "0000",
      card_exp_month: "01",
      card_exp_year: "30",
    }),
  })

  if (!res.ok) throw new Error("Failed to update subscription")
  return await res.json()
}

// src/lib/getUserSubscriptionStatus.ts
import pool from "@/lib/pg"

export async function getUserSubscriptionStatus(userId: string) {
  try {
    const result = await pool.query(`SELECT * FROM subscriptions WHERE user_id = $1`, [userId])
    if (result.rows.length === 0) {
      return {
        hasSubscription: false,
        planType: "free",
        status: null,
        subscription: null,
      }
    }
    const subscription = result.rows[0]
    const isFakeFreeSubscription = subscription.stripe_subscription_id?.startsWith("free-")
    return {
      hasSubscription: true,
      planType: isFakeFreeSubscription ? "free" : "paid",
      status: subscription.status,
      subscription: subscription,
      isLegacyFreeRecord: isFakeFreeSubscription,
    }
  } catch (error) {
    console.error("Error checking user subscription:", error)
    return {
      hasSubscription: false,
      planType: "free",
      status: null,
      subscription: null,
      error: true,
    }
  }
}

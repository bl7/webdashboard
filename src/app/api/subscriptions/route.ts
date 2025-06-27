import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"
import { formatPlanName } from "@/lib/formatPlanName"

const VALID_STATUSES = [
  "active",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "past_due",
  "trialing",
  "unpaid",
] as const
type SubStatus = (typeof VALID_STATUSES)[number]

function isValidStatus(status: string): status is SubStatus {
  return VALID_STATUSES.includes(status as SubStatus)
}

interface SubscriptionData {
  user_id: string
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  price_id?: string | null
  status?: SubStatus
  current_period_end?: string | null
  trial_end?: string | null
  trial_start?: string | null
  plan_name?: string | null
  plan_amount?: number | null
  billing_interval?: string | null
  next_amount_due?: number | null
  card_last4?: string | null
  card_exp_month?: number | null
  card_exp_year?: number | null
  card_brand?: string | null
  currency?: string | null
  collection_method?: string | null
  default_payment_method?: string | null
  cancel_at_period_end?: boolean | null
  canceled_at?: string | null
  plan_type?: string | null
  next_due_date?: string | null
}

// Plan configuration with policy details
const PLAN_CONFIG = {
  price_1RZnHW6acbqNMwXigvqDdo8I: {
    name: "Pro Kitchen - Monthly",
    type: "pro_kitchen",
    requiresDevice: false,
    trialDays: 10,
  },
  price_1RZnI76acbqNMwXiW5y61Vfl: {
    name: "Pro Kitchen - Annual",
    type: "pro_kitchen",
    requiresDevice: false,
    trialDays: 10,
  },
  price_1RZnIb6acbqNMwXiSMZnDKvH: {
    name: "Multi-Site Mastery - Monthly",
    type: "multi_site",
    requiresDevice: false,
    trialDays: 10,
  },
  price_1RZnIv6acbqNMwXi4cEZhKU8: {
    name: "Multi-Site Mastery - Annual",
    type: "multi_site",
    requiresDevice: false,
    trialDays: 10,
  },
  price_premium_kitchen_monthly: {
    name: "Premium Kitchen - Monthly",
    type: "premium_kitchen",
    requiresDevice: true,
    trialDays: 10,
  },
  price_premium_kitchen_annual: {
    name: "Premium Kitchen - Annual",
    type: "premium_kitchen",
    requiresDevice: true,
    trialDays: 10,
  },
} as const

function getPlanConfig(priceId: string | null) {
  if (!priceId) return null
  return PLAN_CONFIG[priceId as keyof typeof PLAN_CONFIG] || null
}

function getPlanNameFromPriceId(price_id: string | null): string {
  const config = getPlanConfig(price_id)
  if (config) return config.name
  const formattedName = formatPlanName(price_id)
  if (formattedName && formattedName !== price_id) {
    return formattedName
  }
  return "Unknown Plan"
}

async function getPlanNameWithStripeCheck(price_id: string | null): Promise<string> {
  if (!price_id || typeof price_id !== 'string') {
    throw new Error('Invalid price_id: must be a non-null string for paid plans')
  }
  const config = getPlanConfig(price_id)
  if (config) return config.name
  try {
    const price = await stripe.prices.retrieve(price_id, {
      expand: ["product"],
    })
    if (price.nickname) {
      return price.nickname
    }
    if (price.product && typeof price.product === "object") {
      const product = price.product as Stripe.Product
      if (product.name && !product.deleted) {
        const interval = price.recurring?.interval || "monthly"
        const intervalDisplay = interval === "year" ? "Annual" : "Monthly"
        return `${product.name} - ${intervalDisplay}`
      }
    }
    return `${price.recurring?.interval || "monthly"} plan`
  } catch (error) {
    console.error(`Error fetching price ${price_id} from Stripe:`, error)
    return "Unknown Plan"
  }
}

// Log subscription events for audit trail
async function logSubscriptionEvent(
  client: any,
  subscriptionId: number,
  eventType: string,
  eventData: any = null,
  notes: string | null = null,
  createdBy: string = "system"
) {
  try {
    await client.query(
      `INSERT INTO subscription_events (subscription_id, event_type, event_data, notes, created_by)
       VALUES ($1, $2, $3, $4, $5)`,
      [subscriptionId, eventType, eventData ? JSON.stringify(eventData) : null, notes, createdBy]
    )
  } catch (error) {
    console.error("Failed to log subscription event:", error)
  }
}

// Handle cancellation at period end
async function handleCancellationAtPeriodEnd(client: any, subscription: any) {
  // Always cancel at period end
  const now = new Date()
  const effectiveDate = new Date(subscription.current_period_end)

  // Determine plan interval (monthly/yearly)
  const planConfig = getPlanConfig(subscription.price_id)
  let interval = 'monthly'
  if (planConfig?.name?.toLowerCase().includes('year') || (subscription.price_id && subscription.price_id.toLowerCase().includes('year'))) {
    interval = 'yearly'
  }

  let refundInfo = null
  if (interval === 'yearly') {
    // Calculate unused months after current month
    const start = new Date(subscription.current_period_start)
    const end = new Date(subscription.current_period_end)
    const nowDate = new Date()
    // Find the first day of the next month after cancellation
    const nextMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 1)
    // Unused months = months between nextMonth and end
    let unusedMonths = (end.getFullYear() - nextMonth.getFullYear()) * 12 + (end.getMonth() - nextMonth.getMonth())
    if (unusedMonths < 0) unusedMonths = 0
    // Refund = 50% of unused months' value
    const monthlyAmount = subscription.plan_amount
    const refundAmount = Math.floor(unusedMonths * monthlyAmount * 0.5 * 100) / 100
    refundInfo = { unusedMonths, refundAmount }
    // Store refund info in DB for webhook
    await client.query(
      `UPDATE subscriptions SET
        pending_refund_amount = $1,
        pending_refund_months = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3`,
      [refundAmount, unusedMonths, subscription.id]
    )
  }

  // Update Stripe subscription to cancel at period end
  if (subscription.stripe_subscription_id) {
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    })
  }

  // Update DB
  await client.query(
    `UPDATE subscriptions SET
      cancel_at_period_end = true,
      cancellation_effective_date = $1,
      cancellation_notice_given_at = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3`,
    [
      effectiveDate,
      now,
      subscription.id,
    ]
  )

  await logSubscriptionEvent(
    client,
    subscription.id,
    "cancellation_scheduled",
    {
      effective_date: effectiveDate,
      scheduled_at: now,
      interval,
      refundInfo,
    },
    "Cancellation scheduled at period end"
  )

  return { type: "scheduled", effectiveDate, interval, refundInfo }
}

// Handle device management for Premium Kitchen plans
async function handleDeviceManagement(
  client: any,
  subscription: any,
  action: "ship" | "return_required"
) {
  if (action === "ship") {
    const shippedAt = new Date()
    const serialNumber = `SUNMI-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    await client.query(
      `UPDATE subscriptions SET
        device_shipped_at = $1,
        device_serial_number = $2,
        device_return_required = true,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3`,
      [shippedAt, serialNumber, subscription.id]
    )

    await logSubscriptionEvent(
      client,
      subscription.id,
      "device_shipped",
      {
        shipped_at: shippedAt,
        serial_number: serialNumber,
        device_type: "sunmi",
      },
      "Sunmi device shipped for Premium Kitchen plan"
    )

    return { serialNumber, shippedAt }
  } else if (action === "return_required") {
    const returnDeadline = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days

    await client.query(
      `UPDATE subscriptions SET
        device_return_deadline = $1,
        device_condition = 'pending_return',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2`,
      [returnDeadline, subscription.id]
    )

    await logSubscriptionEvent(
      client,
      subscription.id,
      "device_return_required",
      {
        return_deadline: returnDeadline,
        deadline_days: 14,
      },
      "Device return required due to plan change/cancellation"
    )

    return { returnDeadline }
  }
}

// Handle failed payments with grace period
async function handleFailedPayment(client: any, subscription: any) {
  const now = new Date()
  const gracePeriodEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days grace period
  const failedAttempts = (subscription.failed_payment_attempts || 0) + 1

  await client.query(
    `UPDATE subscriptions SET
      failed_payment_attempts = $1,
      last_failed_payment_at = $2,
      grace_period_start = COALESCE(grace_period_start, $3),
      grace_period_end = COALESCE(grace_period_end, $4),
      status = CASE 
        WHEN failed_payment_attempts >= 3 THEN 'past_due'
        ELSE status
      END,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5`,
    [failedAttempts, now, now, gracePeriodEnd, subscription.id]
  )

  await logSubscriptionEvent(
    client,
    subscription.id,
    "payment_failed",
    {
      failed_attempts: failedAttempts,
      grace_period_start: now,
      grace_period_end: gracePeriodEnd,
      failed_at: now,
    },
    `Payment failed - attempt ${failedAttempts}/3. Grace period active.`
  )

  // Suspend service after grace period expires
  if (failedAttempts >= 3) {
    const suspensionDate = new Date(gracePeriodEnd.getTime() + 24 * 60 * 60 * 1000) // 1 day after grace period

    await client.query(
      `UPDATE subscriptions SET
        service_suspended_at = $1,
        status = 'unpaid',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND grace_period_end < CURRENT_TIMESTAMP`,
      [suspensionDate, subscription.id]
    )
  }
}

// Handle plan upgrades with immediate effect and proration
async function handlePlanUpgrade(client: any, currentSub: any, newPriceId: string, userId: string) {
  if (!currentSub?.stripe_subscription_id) {
    throw new Error("No valid subscription to upgrade")
  }

  try {
    // Get new price details
    const newPrice = await stripe.prices.retrieve(newPriceId)
    const newPlanConfig = getPlanConfig(newPriceId)
    const currentPlanConfig = getPlanConfig(currentSub.price_id)
    // Determine intervals
    const getInterval = (planConfig: any, priceId: string) => {
      if (planConfig?.name?.toLowerCase().includes('year') || (priceId && priceId.toLowerCase().includes('year'))) return 'yearly'
      return 'monthly'
    }
    const currentInterval = getInterval(currentPlanConfig, currentSub.price_id)
    const newInterval = getInterval(newPlanConfig, newPriceId)
    // If interval changes, schedule new plan at period end (no proration)
    if (currentInterval !== newInterval) {
      const currentPeriodEnd = new Date(currentSub.current_period_end)
      // Log event and update DB
      await logSubscriptionEvent(
        client,
        currentSub.id,
        "interval_change_scheduled",
        {
          old_price_id: currentSub.price_id,
          new_price_id: newPriceId,
          old_plan: currentSub.plan_name,
          new_plan: newPlanConfig?.name,
          effective_date: currentPeriodEnd,
          current_period_retained: true,
          interval_change: `${currentInterval} -> ${newInterval}`,
        },
        `Interval change scheduled from ${currentSub.plan_name} (${currentInterval}) to ${newPlanConfig?.name} (${newInterval}) at period end`
      )
      // Optionally, store pending plan change in DB for later processing
      await client.query(
        `UPDATE subscriptions SET
          pending_plan_change = $1,
          pending_plan_change_effective = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $3`,
        [newPriceId, currentPeriodEnd, userId]
      )
      return {
        success: true,
        planName: newPlanConfig?.name,
        effectiveDate: currentPeriodEnd,
        intervalChange: true,
        message: `Your new plan will start after your current billing period ends.`
      }
    }
    // Otherwise, proceed with immediate/prorated upgrade
    // Calculate prorated amount
    let proratedAmount = 0
    if (currentSub.stripe_subscription_id) {
      // First, retrieve the current subscription to get the subscription item ID
      const currentStripeSubscription = await stripe.subscriptions.retrieve(
        currentSub.stripe_subscription_id,
        { expand: ['items'] }
      )
      
      // Get the subscription item ID from the first item
      const subscriptionItemId = currentStripeSubscription.items.data[0]?.id
      if (!subscriptionItemId) {
        throw new Error("No subscription item found in the subscription")
      }

      const updatedSubscription = await stripe.subscriptions.update(
        currentSub.stripe_subscription_id,
        {
          items: [
            {
              id: subscriptionItemId, // Use the correct subscription item ID
              price: newPriceId,
            },
          ],
          proration_behavior: "create_prorations", // Always prorate upgrades
          expand: ["default_payment_method", "latest_invoice"],
        }
      )
      
      // Handle invoice to calculate prorated amount
      if (updatedSubscription.latest_invoice) {
        let invoice
        if (typeof updatedSubscription.latest_invoice === 'string') {
          // If it's an ID, retrieve the invoice
          invoice = await stripe.invoices.retrieve(updatedSubscription.latest_invoice)
        } else {
          // If it's already expanded, use it directly
          invoice = updatedSubscription.latest_invoice
        }
        proratedAmount = (invoice.amount_due || 0) / 100
      }
    }

    // Update database
    const planName = await getPlanNameWithStripeCheck(newPriceId)
    await client.query(
      `UPDATE subscriptions SET
        price_id = $1,
        plan_name = $2,
        plan_type = $3,
        plan_amount = $4,
        billing_interval = $5,
        next_amount_due = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $7`,
      [
        newPriceId,
        planName,
        newPlanConfig?.type || "paid",
        (newPrice.unit_amount || 0) / 100,
        newPrice.recurring?.interval || "month",
        proratedAmount,
        userId,
      ]
    )

    // Log upgrade event
    await logSubscriptionEvent(
      client,
      currentSub.id,
      "plan_upgraded",
      {
        old_price_id: currentSub.price_id,
        new_price_id: newPriceId,
        old_plan: currentSub.plan_name,
        new_plan: planName,
        prorated_amount: proratedAmount,
        effective_immediately: true,
      },
      `Plan upgraded from ${currentSub.plan_name} to ${planName} with proration`
    )

    // Handle device shipping for Premium Kitchen upgrades
    if (newPlanConfig?.requiresDevice && newPlanConfig.type === "premium_kitchen") {
      await handleDeviceManagement(client, currentSub, "ship")
    }

    return {
      success: true,
      planName,
      proratedAmount,
      effectiveImmediately: true,
      message: `Plan upgraded from ${currentSub.plan_name} to ${planName} with proration`
    }
  } catch (error: any) {
    console.error("Upgrade failed:", error)
    return { success: false, message: error.message || String(error) }
  }
}

// Handle plan downgrades with end-of-period effect
async function handlePlanDowngrade(
  client: any,
  currentSub: any,
  newPriceId: string,
  userId: string
) {
  if (!currentSub?.stripe_subscription_id) {
    throw new Error("No valid subscription to downgrade")
  }

  try {
    const newPrice = await stripe.prices.retrieve(newPriceId)
    const newPlanConfig = getPlanConfig(newPriceId)
    const currentPlanConfig = getPlanConfig(currentSub.price_id)
    // Determine intervals
    const getInterval = (planConfig: any, priceId: string) => {
      if (planConfig?.name?.toLowerCase().includes('year') || (priceId && priceId.toLowerCase().includes('year'))) return 'yearly'
      return 'monthly'
    }
    const currentInterval = getInterval(currentPlanConfig, currentSub.price_id)
    const newInterval = getInterval(newPlanConfig, newPriceId)
    // If interval changes, schedule new plan at period end (no proration)
    if (currentInterval !== newInterval) {
      const currentPeriodEnd = new Date(currentSub.current_period_end)
      // Log event and update DB
      await logSubscriptionEvent(
        client,
        currentSub.id,
        "interval_change_scheduled",
        {
          old_price_id: currentSub.price_id,
          new_price_id: newPriceId,
          old_plan: currentSub.plan_name,
          new_plan: newPlanConfig?.name,
          effective_date: currentPeriodEnd,
          current_period_retained: true,
          interval_change: `${currentInterval} -> ${newInterval}`,
        },
        `Interval change scheduled from ${currentSub.plan_name} (${currentInterval}) to ${newPlanConfig?.name} (${newInterval}) at period end`
      )
      // Optionally, store pending plan change in DB for later processing
      await client.query(
        `UPDATE subscriptions SET
          pending_plan_change = $1,
          pending_plan_change_effective = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $3`,
        [newPriceId, currentPeriodEnd, userId]
      )
      return {
        success: true,
        planName: newPlanConfig?.name,
        effectiveDate: currentPeriodEnd,
        intervalChange: true,
        message: `Your new plan will start after your current billing period ends.`
      }
    }
    // Otherwise, proceed with scheduled downgrade
    // Schedule downgrade at end of current period
    const currentPeriodEnd = new Date(currentSub.current_period_end)

    // Update Stripe subscription to change at period end
    // First, retrieve the current subscription to get the subscription item ID
    const currentStripeSubscription = await stripe.subscriptions.retrieve(
      currentSub.stripe_subscription_id,
      { expand: ['items'] }
    )
    
    // Get the subscription item ID from the first item
    const subscriptionItemId = currentStripeSubscription.items.data[0]?.id
    if (!subscriptionItemId) {
      throw new Error("No subscription item found in the subscription")
    }

    await stripe.subscriptions.update(currentSub.stripe_subscription_id, {
      items: [
        {
          id: subscriptionItemId, // Use the correct subscription item ID
          price: newPriceId,
        },
      ],
      proration_behavior: "none", // No proration for downgrades
      billing_cycle_anchor: "unchanged", // Keep current billing cycle
    })

    const planName = await getPlanNameWithStripeCheck(newPriceId)

    // Update database with pending downgrade info
    await client.query(
      `UPDATE subscriptions SET
        -- Store pending downgrade info in event system, keep current plan active
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1`,
      [userId]
    )

    // Log downgrade event
    await logSubscriptionEvent(
      client,
      currentSub.id,
      "plan_downgrade_scheduled",
      {
        old_price_id: currentSub.price_id,
        new_price_id: newPriceId,
        old_plan: currentSub.plan_name,
        new_plan: planName,
        effective_date: currentPeriodEnd,
        current_period_retained: true,
      },
      `Plan downgrade scheduled from ${currentSub.plan_name} to ${planName} at period end`
    )

    // Handle device return requirement for Premium Kitchen downgrades
    if (currentPlanConfig?.requiresDevice && currentPlanConfig.type === "premium_kitchen") {
      if (!newPlanConfig?.requiresDevice) {
        await handleDeviceManagement(client, currentSub, "return_required")
      }
    }

    return {
      success: true,
      planName,
      effectiveDate: currentPeriodEnd,
      retainCurrentFeatures: true,
      message: `Plan downgraded from ${currentSub.plan_name} to ${planName} at period end`
    }
  } catch (error: any) {
    console.error("Downgrade failed:", error)
    return { success: false, message: error.message || String(error) }
  }
}

// GET endpoint - enhanced with policy checks
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")
  if (!userId) {
    return NextResponse.json({ error: "Missing user_id parameter" }, { status: 400 })
  }

  try {
    const result = await pool.query(
      `SELECT s.*, 
        CASE 
          WHEN s.current_period_end < CURRENT_TIMESTAMP AND s.status = 'active' THEN 'past_due'
          WHEN s.grace_period_end < CURRENT_TIMESTAMP AND s.status = 'past_due' THEN 'unpaid'
          WHEN s.cancellation_effective_date <= CURRENT_TIMESTAMP AND s.cancellation_effective_date IS NOT NULL THEN 'canceled'
          ELSE s.status
        END as computed_status,
        CASE
          WHEN s.trial_end > CURRENT_TIMESTAMP THEN true
          ELSE false
        END as in_trial,
        CASE
          WHEN s.grace_period_end > CURRENT_TIMESTAMP AND s.failed_payment_attempts > 0 THEN true
          ELSE false
        END as in_grace_period,
        CASE
          WHEN s.cancellation_effective_date > CURRENT_TIMESTAMP AND s.cancellation_notice_given_at IS NOT NULL THEN true
          ELSE false
        END as pending_cancellation,
        CASE
          WHEN s.device_return_deadline > CURRENT_TIMESTAMP AND s.device_condition = 'pending_return' THEN true
          ELSE false
        END as device_return_pending
       FROM subscriptions s
       WHERE s.user_id = $1 
       ORDER BY s.created_at DESC 
       LIMIT 1`,
      [userId]
    )

    const subscription = result.rows[0] || null
    const planName = subscription ? getPlanNameFromPriceId(subscription.price_id) : "Free Plan"

    // Debug logging for renewal date issue
    if (subscription) {
      console.log("🔍 Subscription data for renewal debugging:", {
        user_id: subscription.user_id,
        stripe_subscription_id: subscription.stripe_subscription_id,
        current_period_end: subscription.current_period_end,
        current_period_end_type: typeof subscription.current_period_end,
        billing_interval: subscription.billing_interval,
        plan_name: subscription.plan_name,
        status: subscription.status
      })
    }

    // If subscription exists but current_period_end is missing, try to fetch it from Stripe
    if (subscription && !subscription.current_period_end && subscription.stripe_subscription_id) {
      try {
        console.log(`🔧 Fetching missing current_period_end for subscription ${subscription.stripe_subscription_id}`)
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
        
        if (stripeSubscription.current_period_end) {
          const currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000).toISOString()
          
          // Update the database with the correct current_period_end
          await pool.query(
            `UPDATE subscriptions 
             SET current_period_end = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2`,
            [currentPeriodEnd, subscription.id]
          )
          
          // Update the subscription object for the response
          subscription.current_period_end = currentPeriodEnd
          console.log(`✅ Updated current_period_end to ${currentPeriodEnd}`)
        }
      } catch (stripeError) {
        console.error("Failed to fetch current_period_end from Stripe:", stripeError)
        // Don't fail the request, just log the error
      }
    }

    // Ensure current_period_end is properly formatted as ISO string for frontend
    if (subscription && (subscription as any).current_period_end) {
      // Convert timestamp to ISO string if it's not already
      if (typeof (subscription as any).current_period_end === 'string') {
        // Already a string, ensure it's in ISO format
        try {
          const date = new Date((subscription as any).current_period_end)
          ;(subscription as any).current_period_end = date.toISOString()
        } catch (e) {
          console.error("Failed to parse current_period_end as date:", (subscription as any).current_period_end)
        }
      } else if ((subscription as any).current_period_end instanceof Date) {
        // Convert Date object to ISO string
        ;(subscription as any).current_period_end = (subscription as any).current_period_end.toISOString()
      }
    }

    // Update status if computed status is different
    if (subscription && subscription.computed_status !== subscription.status) {
      await pool.query(
        `UPDATE subscriptions 
         SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [subscription.computed_status, subscription.id]
      )
      subscription.status = subscription.computed_status
    }

    return NextResponse.json({
      subscription,
      plan_name: planName,
      policy_status: {
        in_trial: subscription?.in_trial || false,
        in_grace_period: subscription?.in_grace_period || false,
        pending_cancellation: subscription?.pending_cancellation || false,
        device_return_pending: subscription?.device_return_pending || false,
        days_until_trial_end: subscription?.trial_end
          ? Math.max(
              0,
              Math.ceil(
                (new Date(subscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )
            )
          : 0,
        days_until_cancellation: subscription?.cancellation_effective_date
          ? Math.max(
              0,
              Math.ceil(
                (new Date(subscription.cancellation_effective_date).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )
            )
          : 0,
        days_until_grace_period_end: subscription?.grace_period_end
          ? Math.max(
              0,
              Math.ceil(
                (new Date(subscription.grace_period_end).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )
            )
          : 0,
      },
      pending_plan_change: subscription?.pending_plan_change || null,
      pending_plan_change_effective: subscription?.pending_plan_change_effective || null,
      message: subscription ? "Subscription found" : "No subscription found",
    })
  } catch (error) {
    console.error("Database error in GET /subscriptions:", error)
    return NextResponse.json({ error: "Failed to retrieve subscription" }, { status: 500 })
  }
}

// POST endpoint - enhanced with full policy implementation
export async function POST(req: NextRequest) {
  const url = req.nextUrl.pathname
  if (url.endsWith('/cancel-pending-change')) {
    const { user_id } = await req.json()
    if (!user_id) {
      return NextResponse.json({ success: false, message: 'Missing user_id' }, { status: 400 })
    }
    const client = await pool.connect()
    try {
      // Find the subscription
      const { rows } = await client.query('SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [user_id])
      const sub = rows[0]
      if (!sub || !sub.pending_plan_change) {
        return NextResponse.json({ success: false, message: 'No pending plan change to cancel.' }, { status: 400 })
      }
      // Clear pending plan change and refund info
      await client.query(`UPDATE subscriptions SET pending_plan_change = NULL, pending_plan_change_effective = NULL, pending_refund_amount = NULL, pending_refund_months = NULL, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1`, [user_id])
      await logSubscriptionEvent(client, sub.id, 'pending_change_cancelled', { old_pending_plan_change: sub.pending_plan_change }, 'User cancelled pending plan change', user_id)
      return NextResponse.json({ success: true, message: 'Pending plan change cancelled.' })
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message || String(error) }, { status: 500 })
    } finally {
      client.release()
    }
  }
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const { user_id, price_id, prorate = true, upgrade = null } = await req.json()
    if (!user_id) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "user_id is required" }, { status: 400 })
    }
    if (!price_id || typeof price_id !== 'string') {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "A valid paid plan price_id is required" }, { status: 400 })
    }
    // Get current subscription
    const currentSubResult = await client.query(`SELECT * FROM subscriptions WHERE user_id = $1`, [
      user_id,
    ])
    const currentSub = currentSubResult.rows[0]
    // Validate new price
    let price
    try {
      price = await stripe.prices.retrieve(price_id)
    } catch (stripeError) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "Invalid Stripe price ID" }, { status: 400 })
    }
    if (!price.active) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "Inactive Stripe price" }, { status: 400 })
    }
    // Determine if this is an upgrade or downgrade
    const isUpgrade =
      upgrade !== null ? upgrade : (currentSub?.plan_amount || 0) < (price.unit_amount || 0) / 100
    if (isUpgrade) {
      const result = await handlePlanUpgrade(client, currentSub, price_id, user_id)
      await client.query("COMMIT")
      return NextResponse.json(result)
    } else {
      const result = await handlePlanDowngrade(client, currentSub, price_id, user_id)
      await client.query("COMMIT")
      return NextResponse.json(result)
    }
  } catch (error: any) {
    await client.query("ROLLBACK")
    console.error("Subscription update error:", error)
    return NextResponse.json(
      { error: error.message || "Unknown error occurred during subscription update" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// DELETE endpoint - enhanced with 30-day notice policy
export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")
  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  }
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    // Get current subscription
    const result = await client.query(`SELECT * FROM subscriptions WHERE user_id = $1`, [userId])
    const subscription = result.rows[0]
    if (!subscription) {
      await client.query("ROLLBACK")
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }
    // Always schedule cancellation at period end
    const cancellationResult = await handleCancellationAtPeriodEnd(client, subscription)
    await client.query("COMMIT")
    return NextResponse.json({
      success: true,
      cancellation_type: cancellationResult.type,
      effective_date: cancellationResult.effectiveDate,
      message: "Subscription will be canceled at the end of the current billing period.",
    })
  } catch (error: any) {
    await client.query("ROLLBACK")
    console.error("Cancellation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to cancel subscription" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

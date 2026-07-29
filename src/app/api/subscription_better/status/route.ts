import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { verifyAuthToken } from "@/lib/auth"
import {
  ensureCancellationStatusColumn,
  PENDING_CANCELLATION_SQL,
} from "@/lib/cancellationRequest"

// CORS helper
function withCORS(res: Response | NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*")
  res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS")
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  return res
}

export async function OPTIONS(req: NextRequest) {
  return withCORS(new Response(null, { status: 204 }))
}

function formatStripeAddress(address?: {
  line1?: string | null
  line2?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  country?: string | null
} | null) {
  if (!address) return null
  const line = [address.line1, address.line2].filter(Boolean).join(", ")
  const cityLine = [address.city, address.state, address.postal_code].filter(Boolean).join(", ")
  const parts = [line, cityLine, address.country].filter(Boolean)
  if (parts.length === 0) return null
  return {
    line1: address.line1 || null,
    line2: address.line2 || null,
    city: address.city || null,
    state: address.state || null,
    postal_code: address.postal_code || null,
    country: address.country || null,
    formatted: parts.join(" · "),
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)

    const client = await pool.connect()
    try {
      const result = await client.query("SELECT * FROM subscription_better WHERE user_id = $1", [
        userUuid,
      ])
      if (result.rows.length === 0) {
        return withCORS(
          NextResponse.json({ subscription: null, cancellation_request_pending: false })
        )
      }
      const subscription = result.rows[0]
      let cancellation_request_pending = false
      if (
        subscription.stripe_subscription_id &&
        !subscription.cancel_at_period_end &&
        !subscription.cancel_at &&
        subscription.status !== "canceled"
      ) {
        await ensureCancellationStatusColumn(client)
        const cancelReq = await client.query(
          `SELECT 1 FROM subscription_cancellations
           WHERE user_id = $1 AND subscription_id = $2 AND ${PENDING_CANCELLATION_SQL}
           LIMIT 1`,
          [userUuid, subscription.stripe_subscription_id]
        )
        cancellation_request_pending = cancelReq.rows.length > 0
      }

      // Billing address comes from Stripe customer (not local user_profiles)
      let stripe_billing: {
        name: string | null
        email: string | null
        phone: string | null
        address: ReturnType<typeof formatStripeAddress>
      } | null = null

      if (subscription.stripe_customer_id) {
        try {
          const customer = await stripe.customers.retrieve(subscription.stripe_customer_id)
          if (!customer.deleted) {
            stripe_billing = {
              name: customer.name || null,
              email: customer.email || null,
              phone: customer.phone || null,
              address: formatStripeAddress(customer.address),
            }
          }
        } catch (err) {
          console.error("[STATUS] Failed to load Stripe customer billing:", err)
        }
      }

      return withCORS(
        NextResponse.json({
          subscription: { ...subscription, stripe_billing },
          cancellation_request_pending,
        })
      )
    } finally {
      client.release()
    }
  } catch (error: any) {
    if (error.message.includes("Unauthorized")) {
      return withCORS(NextResponse.json({ error: error.message }, { status: 401 }))
    }
    return withCORS(NextResponse.json({ error: "Internal Server Error" }, { status: 500 }))
  }
}

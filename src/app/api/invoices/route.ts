import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15" as any,
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get("user_id")

  if (!user_id) {
    return NextResponse.json({ error: "Missing or invalid user_id" }, { status: 400 })
  }

  try {
    const result = await pool.query(
      `SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1 LIMIT 1`,
      [user_id]
    )

    if (result.rowCount === 0 || !result.rows[0].stripe_customer_id) {
      return NextResponse.json({ error: "Stripe customer ID not found for user" }, { status: 404 })
    }

    const stripeCustomerId = result.rows[0].stripe_customer_id

    const invoices = await stripe.invoices.list({
      customer: stripeCustomerId,
    })

    return NextResponse.json({ invoices: invoices.data })
  } catch (error) {
    console.error("Error fetching invoices from Stripe:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get("user_id")
  if (!user_id) return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  const client = await pool.connect()
  try {
    const result = await client.query("SELECT stripe_customer_id FROM subscription_better WHERE user_id = $1", [user_id])
    if (result.rowCount === 0 || !result.rows[0].stripe_customer_id) {
      return NextResponse.json({ invoices: [] })
    }
    const stripeCustomerId = result.rows[0].stripe_customer_id
    const invoices = await stripe.invoices.list({ customer: stripeCustomerId })
    return NextResponse.json({ invoices: invoices.data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message, invoices: [] }, { status: 200 })
  } finally {
    client.release()
  }
} 
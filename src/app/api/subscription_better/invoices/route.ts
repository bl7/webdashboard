import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { verifyAuthToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const { role, userUuid } = await verifyAuthToken(req)

  // Allow both users and bosses to access invoices
  // Users can only see their own invoices, bosses can see all
  if (role === "user") {
    // For users, ensure they can only access their own invoices
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get("user_id")

    // Ensure user can only access their own data
    if (user_id !== userUuid) {
      return NextResponse.json(
        { error: "Unauthorized: Can only access own invoices" },
        { status: 401 }
      )
    }
  }

  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get("user_id")
  const dateFrom = searchParams.get("date_from")
  const dateTo = searchParams.get("date_to")
  const client = await pool.connect()
  try {
    let stripeCustomerIds: string[] = []
    if (user_id) {
      const result = await client.query(
        "SELECT stripe_customer_id FROM subscription_better WHERE user_id = $1",
        [user_id]
      )
      if (result.rowCount === 0 || !result.rows[0].stripe_customer_id) {
        return NextResponse.json({ invoices: [] })
      }
      stripeCustomerIds = [result.rows[0].stripe_customer_id]
    } else {
      // Only bosses can see all invoices without user_id filter
      if (role !== "boss") {
        return NextResponse.json(
          { error: "Unauthorized: User ID required for non-boss users" },
          { status: 401 }
        )
      }
      const result = await client.query(
        "SELECT DISTINCT stripe_customer_id FROM subscription_better WHERE stripe_customer_id IS NOT NULL"
      )
      stripeCustomerIds = result.rows.map((row: any) => row.stripe_customer_id)
    }
    let allInvoices: any[] = []
    for (const customerId of stripeCustomerIds) {
      const invoices = await stripe.invoices.list({ customer: customerId, limit: 100 })
      allInvoices = allInvoices.concat(invoices.data)
    }
    // Filter by date if provided
    if (dateFrom && dateTo) {
      const fromTs = new Date(dateFrom).getTime() / 1000
      const toTs = new Date(dateTo).getTime() / 1000
      allInvoices = allInvoices.filter((inv) => inv.created >= fromTs && inv.created <= toTs)
    }
    // Sort by date desc
    allInvoices.sort((a, b) => b.created - a.created)
    return NextResponse.json({ invoices: allInvoices })
  } catch (error: any) {
    return NextResponse.json({ error: error.message, invoices: [] }, { status: 200 })
  } finally {
    client.release()
  }
}

import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { stripe } from "@/lib/stripe"
import { verifyAuthToken } from "@/lib/auth"

const PROFILE_QUERY = `
  SELECT s.stripe_customer_id, u.company_name, u.email, s.plan_name
  FROM subscription_better s
  LEFT JOIN user_profiles u ON u.user_id::text = s.user_id::text
`

function enrichInvoice(
  inv: {
    id?: string
    customer: string | null
    customer_email?: string | null
    customer_name?: string | null
    number?: string | null
    amount_due?: number
    amount_paid?: number
    total?: number
    status?: string
    created: number
    description?: string | null
    invoice_pdf?: string | null
    lines?: { data?: { description?: string }[] }
  },
  profile?: { company_name?: string; email?: string; plan_name?: string }
) {
  const customerId = typeof inv.customer === "string" ? inv.customer : null
  const lineDesc = inv.lines?.data?.[0]?.description
  const amountCents =
    inv.status === "paid" ? inv.amount_paid ?? inv.amount_due ?? 0 : inv.amount_due ?? 0

  return {
    id: inv.id || "",
    number: inv.number || null,
    company_name: profile?.company_name || inv.customer_name || null,
    email: profile?.email || inv.customer_email || null,
    plan_name: profile?.plan_name || null,
    stripe_customer_id: customerId,
    description: inv.description || lineDesc || null,
    amount_cents: amountCents,
    amount_paid: inv.amount_paid ?? 0,
    amount_due: inv.amount_due ?? 0,
    total: inv.total ?? amountCents,
    status: inv.status,
    created: inv.created,
    invoice_pdf: inv.invoice_pdf ?? null,
    lines: inv.lines,
  }
}

export async function GET(req: NextRequest) {
  const { role, userUuid } = await verifyAuthToken(req)

  if (role === "user") {
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get("user_id")
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
    const customerProfiles: Record<
      string,
      { company_name?: string; email?: string; plan_name?: string }
    > = {}
    let stripeCustomerIds: string[] = []

    if (user_id) {
      const result = await client.query(`${PROFILE_QUERY} WHERE s.user_id = $1`, [user_id])
      const row = result.rows[0]
      if (!row?.stripe_customer_id) {
        return NextResponse.json({ invoices: [] })
      }
      stripeCustomerIds = [row.stripe_customer_id]
      customerProfiles[row.stripe_customer_id] = {
        company_name: row.company_name,
        email: row.email,
        plan_name: row.plan_name,
      }
    } else {
      if (role !== "boss") {
        return NextResponse.json(
          { error: "Unauthorized: User ID required for non-boss users" },
          { status: 401 }
        )
      }
      const result = await client.query(`${PROFILE_QUERY} WHERE s.stripe_customer_id IS NOT NULL`)
      result.rows.forEach(
        (row: {
          stripe_customer_id: string
          company_name?: string
          email?: string
          plan_name?: string
        }) => {
          stripeCustomerIds.push(row.stripe_customer_id)
          customerProfiles[row.stripe_customer_id] = {
            company_name: row.company_name,
            email: row.email,
            plan_name: row.plan_name,
          }
        }
      )
    }

    let allInvoices: Awaited<ReturnType<typeof stripe.invoices.list>>["data"] = []
    for (const customerId of stripeCustomerIds) {
      try {
        let hasMore = true
        let startingAfter: string | undefined
        while (hasMore) {
          const page = await stripe.invoices.list({
            customer: customerId,
            limit: 100,
            ...(startingAfter ? { starting_after: startingAfter } : {}),
          })
          allInvoices = allInvoices.concat(page.data)
          hasMore = page.has_more
          if (page.data.length > 0) {
            startingAfter = page.data[page.data.length - 1].id
          } else {
            hasMore = false
          }
        }
      } catch (e: unknown) {
        const code = (e as { code?: string })?.code
        if (code !== "resource_missing") {
          console.error("Failed to fetch invoices for customer:", customerId, e)
        }
      }
    }

    if (dateFrom && dateTo) {
      const fromTs = new Date(`${dateFrom}T00:00:00`).getTime() / 1000
      const toTs = new Date(`${dateTo}T23:59:59`).getTime() / 1000
      allInvoices = allInvoices.filter((inv) => inv.created >= fromTs && inv.created <= toTs)
    }

    allInvoices.sort((a, b) => b.created - a.created)

    const invoices = allInvoices.map((inv) => {
      const customerId = typeof inv.customer === "string" ? inv.customer : null
      return enrichInvoice(inv as Parameters<typeof enrichInvoice>[0], customerId ? customerProfiles[customerId] : undefined)
    })

    return NextResponse.json({ invoices })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch invoices"
    return NextResponse.json({ error: message, invoices: [] }, { status: 200 })
  } finally {
    client.release()
  }
}

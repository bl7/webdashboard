import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function GET(req: NextRequest) {
  const subscriptionId = req.nextUrl.searchParams.get("subscription_id")
  if (!subscriptionId) {
    return NextResponse.json({ error: "Missing subscription_id" }, { status: 400 })
  }

  const result = await pool.query(
    `SELECT * FROM invoices WHERE subscription_id = $1 ORDER BY invoice_date DESC`,
    [subscriptionId]
  )

  return NextResponse.json({ invoices: result.rows || [] })
}

export async function PUT(req: NextRequest) {
  try {
    const {
      subscription_id,
      amount,
      status,
      recipient_name,
      payment_method_last4,
      invoice_date,
      metadata,
    } = await req.json()

    if (!subscription_id || !amount || !status || !recipient_name || !invoice_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Optional: check if invoice exists (e.g. via id) to decide update or insert.
    // For simplicity, assume insert only here.

    await pool.query(
      `
      INSERT INTO invoices (
        subscription_id,
        amount,
        status,
        recipient_name,
        payment_method_last4,
        invoice_date,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        subscription_id,
        amount,
        status,
        recipient_name,
        payment_method_last4,
        invoice_date,
        metadata ? JSON.stringify(metadata) : null,
      ]
    )

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    let message = "Internal Server Error"
    if (error instanceof Error) message = error.message
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

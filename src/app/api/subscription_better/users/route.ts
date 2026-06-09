import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const dateFrom = searchParams.get("date_from")
    const dateTo = searchParams.get("date_to")

    const conditions: string[] = []
    const values: string[] = []
    if (dateFrom && dateTo) {
      conditions.push(
        `s.created_at >= $${values.length + 1}::date AND s.created_at < ($${values.length + 2}::date + interval '1 day')`
      )
      values.push(dateFrom, dateTo)
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""

    const client = await pool.connect()
    const { rows } = await client.query(
      `
      SELECT 
        u.user_id, 
        u.company_name,
        u.full_name,
        u.email,
        u.address_line1,
        u.address_line2,
        u.country,
        u.city,
        u.state,
        u.postal_code,
        u.phone,
        s.plan_name, 
        s.status, 
        s.billing_interval, 
        s.current_period_end, 
        s.trial_end, 
        s.pending_plan_change, 
        s.pending_plan_change_effective, 
        s.created_at
      FROM user_profiles u
      LEFT JOIN subscription_better s ON u.user_id::text = s.user_id::text
      ${where}
      ORDER BY s.created_at DESC NULLS LAST
    `,
      values
    )
    client.release()
    return NextResponse.json(rows)
  } catch (e) {
    console.error("Error fetching users:", e)
    return NextResponse.json({ error: "Failed to fetch users data" }, { status: 500 })
  }
}

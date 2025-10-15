import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// GET /api/logs/summary?date=YYYY-MM-DD OR ?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD
// Returns aggregated print counts (sum of quantities) for the given day or range (defaults to today)
export async function GET(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get("date") // YYYY-MM-DD (single day)
    const dateFrom = searchParams.get("date_from") // range start
    const dateTo = searchParams.get("date_to") // range end

    // Default to server current date if not provided
    const client = await pool.connect()
    try {
      // Build dynamic where clause for day vs range
      let where = "action = 'print_label'"
      const params: any[] = []
      if (dateFrom && dateTo) {
        where += ` AND timestamp::date BETWEEN $1::date AND $2::date`
        params.push(dateFrom, dateTo)
      } else {
        where += ` AND (timestamp::date = COALESCE($1::date, CURRENT_DATE))`
        params.push(dateParam)
      }

      const sql = `
        SELECT 
          COALESCE(SUM((details->>'quantity')::int), 0) AS total_prints,
          COUNT(*) AS entries
        FROM activity_logs
        WHERE ${where}
      `
      const { rows } = await client.query(sql, params)

      // Optional breakdown by labelType if needed later
      const breakdownSql = `
        SELECT 
          (details->>'labelType') AS label_type,
          COALESCE(SUM((details->>'quantity')::int), 0) AS prints
        FROM activity_logs
        WHERE ${where}
        GROUP BY label_type
        ORDER BY prints DESC NULLS LAST
      `
      const breakdownRes = await client.query(breakdownSql, params)

      return NextResponse.json({
        date: dateParam || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        totalPrints: Number(rows[0]?.total_prints || 0),
        entries: Number(rows[0]?.entries || 0),
        byLabelType: breakdownRes.rows,
      })
    } finally {
      client.release()
    }
  } catch (e: any) {
    console.error("/api/logs/summary error:", e)
    return NextResponse.json({ error: "Failed to fetch logs summary" }, { status: 500 })
  }
}

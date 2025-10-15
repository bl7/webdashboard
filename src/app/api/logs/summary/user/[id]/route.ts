import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// GET /api/logs/summary/user/[id]?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD&page=1&limit=20
// Boss-only: per-user prints totals and recent entries
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const params = await context.params
    const userId = params.id
    if (!userId) return NextResponse.json({ error: "Missing user id" }, { status: 400 })

    const { searchParams } = new URL(req.url)
    const dateFrom = searchParams.get("date_from")
    const dateTo = searchParams.get("date_to")
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const offset = (page - 1) * limit

    const whereParts: string[] = ["al.action = 'print_label'", "al.user_id::text = $1"]
    const paramsArr: any[] = [userId]
    let p = 2
    if (dateFrom && dateTo) {
      whereParts.push(`al.timestamp::date BETWEEN $${p++}::date AND $${p++}::date`)
      paramsArr.push(dateFrom, dateTo)
    } else {
      whereParts.push(`al.timestamp::date = CURRENT_DATE`)
    }
    const where = whereParts.join(" AND ")

    const totalsSql = `
      SELECT 
        COALESCE(SUM((al.details->>'quantity')::int), 0) AS total_prints,
        COUNT(*) AS entries
      FROM activity_logs al
      WHERE ${where}
    `
    const totalsRes = await pool.query(totalsSql, paramsArr)

    const breakdownSql = `
      SELECT (al.details->>'labelType') AS label_type,
             COALESCE(SUM((al.details->>'quantity')::int), 0) AS prints
      FROM activity_logs al
      WHERE ${where}
      GROUP BY label_type
      ORDER BY prints DESC NULLS LAST
    `
    const breakdownRes = await pool.query(breakdownSql, paramsArr)

    const logsSql = `
      SELECT id, user_id, action, details, timestamp
      FROM activity_logs al
      WHERE ${where}
      ORDER BY timestamp DESC
      LIMIT $${p} OFFSET $${p + 1}
    `
    const logsRes = await pool.query(logsSql, [...paramsArr, limit, offset])

    const logs = logsRes.rows.map((row: any) => ({
      ...row,
      details: typeof row.details === "string" ? JSON.parse(row.details) : row.details,
    }))

    return NextResponse.json({
      totalPrints: Number(totalsRes.rows[0]?.total_prints || 0),
      entries: Number(totalsRes.rows[0]?.entries || 0),
      byLabelType: breakdownRes.rows,
      logs,
      pagination: { page, limit },
    })
  } catch (e: any) {
    console.error("/api/logs/summary/user/[id] error:", e)
    return NextResponse.json({ error: "Failed to fetch user prints" }, { status: 500 })
  }
}

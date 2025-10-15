import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// GET /api/logs/summary/users?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD&page=1&limit=20
// Boss-only: grouped totals of prints by user
export async function GET(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const dateFrom = searchParams.get("date_from")
    const dateTo = searchParams.get("date_to")
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const offset = (page - 1) * limit

    const whereParts: string[] = ["al.action = 'print_label'"]
    const params: any[] = []
    let p = 1
    if (dateFrom && dateTo) {
      whereParts.push(`al.timestamp::date BETWEEN $${p++}::date AND $${p++}::date`)
      params.push(dateFrom, dateTo)
    } else {
      whereParts.push(`al.timestamp::date = CURRENT_DATE`)
    }
    const where = whereParts.join(" AND ")

    const countSql = `
      SELECT COUNT(*) FROM (
        SELECT al.user_id
        FROM activity_logs al
        WHERE ${where}
        GROUP BY al.user_id
      ) t
    `
    const countRes = await pool.query(countSql, params)
    const totalGroups = parseInt(countRes.rows[0].count || "0")

    const sql = `
      SELECT 
        al.user_id,
        up.company_name,
        up.email,
        COALESCE(SUM((al.details->>'quantity')::int), 0) AS total_prints,
        COUNT(*) AS entries
      FROM activity_logs al
      LEFT JOIN user_profiles up ON up.user_id::text = al.user_id::text
      WHERE ${where}
      GROUP BY al.user_id, up.company_name, up.email
      ORDER BY total_prints DESC
      LIMIT $${p} OFFSET $${p + 1}
    `
    const listRes = await pool.query(sql, [...params, limit, offset])

    return NextResponse.json({
      data: listRes.rows,
      pagination: {
        page,
        limit,
        totalGroups,
        totalPages: Math.ceil(totalGroups / limit),
      },
    })
  } catch (e: any) {
    console.error("/api/logs/summary/users error:", e)
    return NextResponse.json({ error: "Failed to fetch grouped prints" }, { status: 500 })
  }
}

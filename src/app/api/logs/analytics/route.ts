import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

function formatHourLabel(hour: number): string {
  if (hour === 0) return "12am"
  if (hour < 12) return `${hour}am`
  if (hour === 12) return "12pm"
  return `${hour - 12}pm`
}

// GET /api/logs/analytics?date=YYYY-MM-DD (defaults to today, server date)
export async function GET(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get("date")

    const client = await pool.connect()
    try {
      const dateRes = await client.query(
        `SELECT COALESCE($1::date, CURRENT_DATE) AS target_date`,
        [dateParam]
      )
      const targetDate: string = dateRes.rows[0].target_date
      const lastWeekRes = await client.query(`SELECT ($1::date - INTERVAL '7 days')::date AS d`, [
        targetDate,
      ])
      const lastWeekDate: string = lastWeekRes.rows[0].d

      const hourlySql = `
        WITH prints AS (
          SELECT
            COALESCE(NULLIF(details->>'printedAt', '')::timestamptz, timestamp) AS printed_at,
            COALESCE((details->>'quantity')::int, 1) AS qty
          FROM activity_logs
          WHERE user_id = $1 AND action = 'print_label'
        )
        SELECT
          EXTRACT(HOUR FROM printed_at)::int AS hour,
          printed_at::date AS day,
          SUM(qty)::int AS prints
        FROM prints
        WHERE printed_at::date IN ($2::date, $3::date)
        GROUP BY hour, day
        ORDER BY hour
      `
      const hourlyRes = await client.query(hourlySql, [userUuid, targetDate, lastWeekDate])

      const todayByHour: Record<number, number> = {}
      const lastWeekByHour: Record<number, number> = {}
      for (const row of hourlyRes.rows) {
        const h = Number(row.hour)
        const day = String(row.day).slice(0, 10)
        if (day === targetDate) todayByHour[h] = Number(row.prints)
        else lastWeekByHour[h] = Number(row.prints)
      }

      const hourlyComparison = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        label: formatHourLabel(hour),
        today: todayByHour[hour] || 0,
        lastWeek: lastWeekByHour[hour] || 0,
      }))

      const categorySql = `
        SELECT
          id,
          COALESCE(NULLIF(details->>'labelType', ''), 'other') AS label_type,
          COALESCE((details->>'quantity')::int, 1) AS quantity,
          COALESCE(details->>'itemName', 'Unknown') AS item_name,
          COALESCE(NULLIF(details->>'printedAt', ''), timestamp::text) AS printed_at,
          COALESCE(details->>'initial', '') AS initial
        FROM activity_logs
        WHERE user_id = $1
          AND action = 'print_label'
          AND COALESCE(NULLIF(details->>'printedAt', '')::timestamptz, timestamp)::date = $2::date
        ORDER BY COALESCE(NULLIF(details->>'printedAt', '')::timestamptz, timestamp) DESC
      `
      const categoryRes = await client.query(categorySql, [userUuid, targetDate])

      const byCategoryMap: Record<
        string,
        { type: string; count: number; jobs: Array<{ id: number; itemName: string; quantity: number; printedAt: string; initial: string }> }
      > = {}

      for (const row of categoryRes.rows) {
        const type = row.label_type as string
        if (!byCategoryMap[type]) {
          byCategoryMap[type] = { type, count: 0, jobs: [] }
        }
        byCategoryMap[type].count += Number(row.quantity)
        byCategoryMap[type].jobs.push({
          id: row.id,
          itemName: row.item_name,
          quantity: Number(row.quantity),
          printedAt: row.printed_at,
          initial: row.initial || "",
        })
      }

      const byCategory = Object.values(byCategoryMap).sort((a, b) => b.count - a.count)
      const todayTotal = byCategory.reduce((s, c) => s + c.count, 0)
      const lastWeekTotal = Object.values(lastWeekByHour).reduce((s, n) => s + n, 0)

      return NextResponse.json({
        date: targetDate,
        lastWeekDate,
        todayTotal,
        lastWeekTotal,
        hourlyComparison,
        byCategory,
      })
    } finally {
      client.release()
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error"
    if (msg.includes("Unauthorized")) {
      return NextResponse.json({ error: msg }, { status: 401 })
    }
    console.error("/api/logs/analytics error:", e)
    return NextResponse.json({ error: "Failed to fetch print analytics" }, { status: 500 })
  }
}

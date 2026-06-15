import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"
import {
  APP_DEVICE_ACTIVE_WINDOW_MINUTES,
  APP_DEVICE_RECENT_WINDOW_DAYS,
} from "@/lib/appDevices"

function mapSummaryRow(row: Record<string, unknown>) {
  return {
    activeNow: Number(row.active_now || 0),
    activeLast30Days: Number(row.active_last_30_days || 0),
    totalRegistered: Number(row.total_registered || 0),
    mobileActiveNow: Number(row.mobile_active_now || 0),
    mobileActiveLast30Days: Number(row.mobile_active_last_30_days || 0),
    webActiveNow: Number(row.web_active_now || 0),
    webActiveLast30Days: Number(row.web_active_last_30_days || 0),
  }
}

const SUMMARY_COUNT_SQL = `
  COUNT(*) FILTER (
    WHERE last_seen_at >= NOW() - ($ACTIVE_MIN::text || ' minutes')::interval
  ) AS active_now,
  COUNT(*) FILTER (
    WHERE last_seen_at >= NOW() - ($RECENT_DAYS::text || ' days')::interval
  ) AS active_last_30_days,
  COUNT(*) AS total_registered,
  COUNT(*) FILTER (
    WHERE platform = 'mobile'
      AND last_seen_at >= NOW() - ($ACTIVE_MIN::text || ' minutes')::interval
  ) AS mobile_active_now,
  COUNT(*) FILTER (
    WHERE platform = 'mobile'
      AND last_seen_at >= NOW() - ($RECENT_DAYS::text || ' days')::interval
  ) AS mobile_active_last_30_days,
  COUNT(*) FILTER (
    WHERE platform = 'web'
      AND last_seen_at >= NOW() - ($ACTIVE_MIN::text || ' minutes')::interval
  ) AS web_active_now,
  COUNT(*) FILTER (
    WHERE platform = 'web'
      AND last_seen_at >= NOW() - ($RECENT_DAYS::text || ' days')::interval
  ) AS web_active_last_30_days
`

// GET /api/app-devices/summary — boss-only bulk counts per user
export async function GET(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const activeMin = String(APP_DEVICE_ACTIVE_WINDOW_MINUTES)
    const recentDays = String(APP_DEVICE_RECENT_WINDOW_DAYS)

    const result = await pool.query(
      `SELECT
         user_id::text AS user_id,
         ${SUMMARY_COUNT_SQL.replace(/\$ACTIVE_MIN/g, "$1").replace(/\$RECENT_DAYS/g, "$2")}
       FROM user_app_devices
       GROUP BY user_id`,
      [activeMin, recentDays]
    )

    const byUserId: Record<string, ReturnType<typeof mapSummaryRow>> = {}
    for (const row of result.rows) {
      byUserId[row.user_id] = mapSummaryRow(row)
    }

    return NextResponse.json({
      byUserId,
      activeWindowMinutes: APP_DEVICE_ACTIVE_WINDOW_MINUTES,
      recentWindowDays: APP_DEVICE_RECENT_WINDOW_DAYS,
    })
  } catch (error: any) {
    console.error("GET /api/app-devices/summary error:", error)

    if (error.code === "42P01") {
      return NextResponse.json(
        { error: "user_app_devices table missing. Run add_user_app_devices_table.sql first." },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: "Failed to fetch app device summaries" }, { status: 500 })
  }
}

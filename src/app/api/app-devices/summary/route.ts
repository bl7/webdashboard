import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"
import {
  APP_DEVICE_ACTIVE_WINDOW_MINUTES,
  APP_DEVICE_RECENT_WINDOW_DAYS,
} from "@/lib/appDevices"

// GET /api/app-devices/summary — boss-only bulk counts per user
export async function GET(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await pool.query(
      `SELECT
         user_id::text AS user_id,
         COUNT(*) FILTER (
           WHERE last_seen_at >= NOW() - ($1::text || ' minutes')::interval
         ) AS active_now,
         COUNT(*) FILTER (
           WHERE last_seen_at >= NOW() - ($2::text || ' days')::interval
         ) AS active_last_30_days,
         COUNT(*) AS total_registered
       FROM user_app_devices
       GROUP BY user_id`,
      [String(APP_DEVICE_ACTIVE_WINDOW_MINUTES), String(APP_DEVICE_RECENT_WINDOW_DAYS)]
    )

    const byUserId: Record<
      string,
      { activeNow: number; activeLast30Days: number; totalRegistered: number }
    > = {}

    for (const row of result.rows) {
      byUserId[row.user_id] = {
        activeNow: Number(row.active_now || 0),
        activeLast30Days: Number(row.active_last_30_days || 0),
        totalRegistered: Number(row.total_registered || 0),
      }
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

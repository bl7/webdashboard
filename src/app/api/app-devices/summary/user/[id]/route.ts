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

// GET /api/app-devices/summary/user/[id] — boss-only session counts (mobile + web)
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await context.params
    const userId = params.id
    if (!userId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 })
    }

    const countsRes = await pool.query(
      `SELECT
         COUNT(*) FILTER (
           WHERE last_seen_at >= NOW() - ($2::text || ' minutes')::interval
         ) AS active_now,
         COUNT(*) FILTER (
           WHERE last_seen_at >= NOW() - ($3::text || ' days')::interval
         ) AS active_last_30_days,
         COUNT(*) AS total_registered,
         COUNT(*) FILTER (
           WHERE platform = 'mobile'
             AND last_seen_at >= NOW() - ($2::text || ' minutes')::interval
         ) AS mobile_active_now,
         COUNT(*) FILTER (
           WHERE platform = 'mobile'
             AND last_seen_at >= NOW() - ($3::text || ' days')::interval
         ) AS mobile_active_last_30_days,
         COUNT(*) FILTER (
           WHERE platform = 'web'
             AND last_seen_at >= NOW() - ($2::text || ' minutes')::interval
         ) AS web_active_now,
         COUNT(*) FILTER (
           WHERE platform = 'web'
             AND last_seen_at >= NOW() - ($3::text || ' days')::interval
         ) AS web_active_last_30_days
       FROM user_app_devices
       WHERE user_id::text = $1`,
      [userId, String(APP_DEVICE_ACTIVE_WINDOW_MINUTES), String(APP_DEVICE_RECENT_WINDOW_DAYS)]
    )

    const devicesRes = await pool.query(
      `SELECT
         id,
         device_id,
         platform,
         device_model,
         app_version,
         first_seen_at,
         last_seen_at,
         (last_seen_at >= NOW() - ($2::text || ' minutes')::interval) AS is_active_now
       FROM user_app_devices
       WHERE user_id::text = $1
       ORDER BY last_seen_at DESC
       LIMIT 50`,
      [userId, String(APP_DEVICE_ACTIVE_WINDOW_MINUTES)]
    )

    const counts = countsRes.rows[0] || {}

    return NextResponse.json({
      ...mapSummaryRow(counts),
      activeWindowMinutes: APP_DEVICE_ACTIVE_WINDOW_MINUTES,
      recentWindowDays: APP_DEVICE_RECENT_WINDOW_DAYS,
      devices: devicesRes.rows.map((row: any) => ({
        id: row.id,
        deviceId: row.device_id,
        platform: row.platform,
        deviceModel: row.device_model,
        appVersion: row.app_version,
        firstSeenAt: row.first_seen_at,
        lastSeenAt: row.last_seen_at,
        isActiveNow: row.is_active_now,
      })),
    })
  } catch (error: any) {
    console.error("GET /api/app-devices/summary/user/[id] error:", error)

    if (error.code === "42P01") {
      return NextResponse.json(
        { error: "user_app_devices table missing. Run add_user_app_devices_table.sql first." },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: "Failed to fetch app device summary" }, { status: 500 })
  }
}

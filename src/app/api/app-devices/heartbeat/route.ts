import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

const APP_PLATFORMS = new Set(["web", "mobile"])
const DEVICE_ID_PATTERN = /^[a-zA-Z0-9_-]{16,128}$/

function withCORS(res: Response | NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*")
  res.headers.set("Access-Control-Allow-Methods", "POST,OPTIONS")
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  return res
}

function normalizeOptionalString(value: unknown, maxLength: number): string | null {
  if (value === undefined || value === null) return null
  const trimmed = String(value).trim()
  if (!trimmed) return null
  return trimmed.slice(0, maxLength)
}

// POST /api/app-devices/heartbeat — mobile (and optional web) device presence
export async function OPTIONS() {
  return withCORS(new Response(null, { status: 204 }))
}

export async function POST(req: NextRequest) {
  try {
    const { userUuid, role } = await verifyAuthToken(req)
    if (role === "boss") {
      return withCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }))
    }

    const body = await req.json()
    const deviceId = typeof body.deviceId === "string" ? body.deviceId.trim() : ""
    const platform = typeof body.platform === "string" ? body.platform.trim().toLowerCase() : "mobile"
    const deviceModel = normalizeOptionalString(body.deviceModel, 255)
    const appVersion = normalizeOptionalString(body.appVersion, 64)

    if (!deviceId) {
      return withCORS(NextResponse.json({ error: "deviceId is required" }, { status: 400 }))
    }

    if (!DEVICE_ID_PATTERN.test(deviceId)) {
      return withCORS(
        NextResponse.json(
          {
            error:
              "Invalid deviceId. Send a stable 16–128 character device id (letters, numbers, _ or -).",
          },
          { status: 400 }
        )
      )
    }

    if (!APP_PLATFORMS.has(platform)) {
      return withCORS(
        NextResponse.json({ error: 'platform must be "mobile" or "web"' }, { status: 400 })
      )
    }

    const result = await pool.query(
      `INSERT INTO user_app_devices (
         user_id, device_id, platform, device_model, app_version,
         first_seen_at, last_seen_at, created_at, updated_at
       )
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW(), NOW())
       ON CONFLICT (user_id, device_id)
       DO UPDATE SET
         platform = EXCLUDED.platform,
         device_model = COALESCE(EXCLUDED.device_model, user_app_devices.device_model),
         app_version = COALESCE(EXCLUDED.app_version, user_app_devices.app_version),
         last_seen_at = NOW(),
         updated_at = NOW()
       RETURNING id, user_id, device_id, platform, device_model, app_version, first_seen_at, last_seen_at`,
      [userUuid, deviceId, platform, deviceModel, appVersion]
    )

    return withCORS(
      NextResponse.json(
        {
          ok: true,
          device: result.rows[0],
        },
        { status: 200 }
      )
    )
  } catch (error: any) {
    console.error("POST /api/app-devices/heartbeat error:", error)

    if (error.message?.includes("Unauthorized")) {
      return withCORS(NextResponse.json({ error: error.message }, { status: 401 }))
    }

    if (error.code === "42P01") {
      return withCORS(
        NextResponse.json(
          { error: "user_app_devices table missing. Run add_user_app_devices_table.sql first." },
          { status: 500 }
        )
      )
    }

    return withCORS(
      NextResponse.json(
        { error: "Failed to record device heartbeat", details: error.message || "Unknown error" },
        { status: 500 }
      )
    )
  }
}

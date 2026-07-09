import { NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth"
import {
  DEFAULT_MESSAGE,
  DEFAULT_UPDATE_URL,
  ensureMobileAppVersionConfig,
  getAppVersionConfig,
  updateAppVersionConfig,
} from "@/lib/app-version"

// GET /api/app-version/admin — boss dashboard read
export async function GET(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let config = await getAppVersionConfig("mobile")
    if (!config) {
      config = await ensureMobileAppVersionConfig()
    }

    return NextResponse.json({ success: true, config })
  } catch (error: any) {
    console.error("GET /api/app-version/admin error:", error)

    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (error.code === "42P01") {
      return NextResponse.json(
        { error: "app_version_config table missing. Run create_app_version_config_table.sql first." },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: "Failed to fetch app version config" }, { status: 500 })
  }
}

// PUT /api/app-version/admin — boss dashboard update
export async function PUT(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const minSupportedVersionCode = parseInt(String(body.minSupportedVersionCode ?? ""), 10)

    if (!Number.isFinite(minSupportedVersionCode) || minSupportedVersionCode < 1) {
      return NextResponse.json(
        { error: "minSupportedVersionCode must be a positive integer" },
        { status: 400 }
      )
    }

    const latestVersionCodeRaw = body.latestVersionCode
    const latestVersionCode =
      latestVersionCodeRaw === undefined || latestVersionCodeRaw === null || latestVersionCodeRaw === ""
        ? null
        : parseInt(String(latestVersionCodeRaw), 10)

    if (latestVersionCode !== null && (!Number.isFinite(latestVersionCode) || latestVersionCode < 1)) {
      return NextResponse.json(
        { error: "latestVersionCode must be a positive integer when provided" },
        { status: 400 }
      )
    }

    const config = await updateAppVersionConfig("mobile", {
      minSupportedVersionCode,
      minSupportedVersion: body.minSupportedVersion?.trim() || null,
      latestVersionCode,
      latestVersion: body.latestVersion?.trim() || null,
      updateUrl: body.updateUrl?.trim() || DEFAULT_UPDATE_URL,
      message: body.message?.trim() || DEFAULT_MESSAGE,
    })

    return NextResponse.json({ success: true, config })
  } catch (error: any) {
    console.error("PUT /api/app-version/admin error:", error)

    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (error.code === "42P01") {
      return NextResponse.json(
        { error: "app_version_config table missing. Run create_app_version_config_table.sql first." },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: "Failed to update app version config" }, { status: 500 })
  }
}

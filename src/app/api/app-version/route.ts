import { NextRequest, NextResponse } from "next/server"

const DEFAULT_UPDATE_URL =
  "https://play.google.com/store/apps/details?id=com.instalabel.co.app"

const DEFAULT_MESSAGE =
  "A new version of InstaLabel is available. Please update to continue."

function parseIntEnv(name: string, fallback: number): number {
  const raw = process.env[name]
  if (raw === undefined || raw === "") return fallback
  const n = parseInt(raw, 10)
  return Number.isFinite(n) ? n : fallback
}

function parseOptionalEnv(name: string, fallback?: string): string | undefined {
  const raw = process.env[name]
  if (raw === undefined || raw === "") return fallback
  return raw
}

// GET /api/app-version?platform=mobile — version gate for mobile app (no auth)
export async function OPTIONS() {
  return new Response(null, { status: 204 })
}

export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get("platform")?.trim().toLowerCase()

  if (platform !== "mobile") {
    return NextResponse.json({ error: 'platform must be "mobile"' }, { status: 400 })
  }

  try {
    const minSupportedVersionCode = parseIntEnv("APP_MIN_SUPPORTED_VERSION_CODE", 8)

    const response: Record<string, string | number> = {
      minSupportedVersionCode,
    }

    const minSupportedVersion = parseOptionalEnv("APP_MIN_SUPPORTED_VERSION", "6.1.0")
    if (minSupportedVersion) response.minSupportedVersion = minSupportedVersion

    const latestVersionCode = parseIntEnv("APP_LATEST_VERSION_CODE", 8)
    response.latestVersionCode = latestVersionCode

    const latestVersion = parseOptionalEnv("APP_LATEST_VERSION", "6.1.0")
    if (latestVersion) response.latestVersion = latestVersion

    const updateUrl = parseOptionalEnv("APP_UPDATE_URL", DEFAULT_UPDATE_URL)
    if (updateUrl) response.updateUrl = updateUrl

    const message = parseOptionalEnv("APP_UPDATE_MESSAGE", DEFAULT_MESSAGE)
    if (message) response.message = message

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error("GET /api/app-version error:", error)
    return NextResponse.json({ error: "Failed to fetch app version config" }, { status: 500 })
  }
}

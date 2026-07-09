import { NextRequest, NextResponse } from "next/server"
import { ensureMobileAppVersionConfig, getAppVersionConfig, toPublicResponse } from "@/lib/app-version"

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
    let config = await getAppVersionConfig(platform)
    if (!config) {
      config = await ensureMobileAppVersionConfig()
    }

    return NextResponse.json(toPublicResponse(config), { status: 200 })
  } catch (error: any) {
    console.error("GET /api/app-version error:", error)

    if (error.code === "42P01") {
      return NextResponse.json(
        { error: "app_version_config table missing. Run create_app_version_config_table.sql first." },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: "Failed to fetch app version config" }, { status: 500 })
  }
}

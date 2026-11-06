import { NextResponse } from "next/server"
import { listFlyerLocations } from "@/lib/flyerLocations"
import { listPromoSignupCounts } from "@/lib/promoSignups"

export async function GET() {
  try {
    const locations = await listFlyerLocations()
    const bournemouth = locations.find(
      (location) => location.id === "bournemouth" || location.name.trim().toLowerCase() === "bournemouth"
    )
    const signups = await listPromoSignupCounts()
    const start30 = signups.find((row) => row.code.trim().toUpperCase() === "START30")

    return NextResponse.json(
      {
        bournemouthQr: {
          users: bournemouth?.devices ?? 0,
          scans: bournemouth?.scans ?? 0,
        },
        start30: {
          signups: start30?.signups ?? 0,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (error) {
    console.error("GET /api/public/campaign-stats", error)
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 })
  }
}

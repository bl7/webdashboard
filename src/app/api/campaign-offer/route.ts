import { NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth"
import { checkCampaignStripe, getCampaignCode, setCampaignCode } from "@/lib/campaignOffer"

async function requireBoss(req: NextRequest) {
  const { role } = await verifyAuthToken(req)
  if (role !== "boss") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}

export async function GET(req: NextRequest) {
  try {
    const denied = await requireBoss(req)
    if (denied) return denied
    const saved = await getCampaignCode()
    const stripe = await checkCampaignStripe(saved.code)
    return NextResponse.json({ ...saved, stripe })
  } catch (error: any) {
    console.error("GET /api/campaign-offer", error)
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to load offer code" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const denied = await requireBoss(req)
    if (denied) return denied
    const body = await req.json().catch(() => ({}))
    const code = typeof body.code === "string" ? body.code : ""
    const saved = await setCampaignCode(code)
    const stripe = await checkCampaignStripe(saved.code)
    return NextResponse.json({ ...saved, stripe })
  } catch (error: any) {
    console.error("PUT /api/campaign-offer", error)
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to save offer code" }, { status: 500 })
  }
}

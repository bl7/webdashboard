import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { previewCampaignCode } from "@/lib/campaignOffer"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const code = typeof body.code === "string" ? body.code : ""
    const userId = typeof body.user_id === "string" ? body.user_id : ""

    let isNewCustomer = true
    if (userId) {
      const subCheck = await pool.query(
        `SELECT 1 FROM subscription_better WHERE user_id = $1 LIMIT 1`,
        [userId]
      )
      isNewCustomer = subCheck.rows.length === 0
    }

    const preview = await previewCampaignCode(code, isNewCustomer)
    if (!preview.ok) {
      return NextResponse.json({ error: preview.error }, { status: 400 })
    }
    return NextResponse.json(preview)
  } catch (error) {
    console.error("POST /api/campaign-offer/preview", error)
    return NextResponse.json({ error: "Could not check that code." }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)

    await pool.query(
      `UPDATE user_profiles SET setup_completed = true WHERE user_id = $1`,
      [userUuid]
    )

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ""
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

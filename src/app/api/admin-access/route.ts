import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const result = await pool.query("SELECT pin FROM admin_access WHERE user_id = $1", [userUuid])
    const stored = result.rows[0]?.pin
    const hasPin = Boolean(stored) && stored !== "0000"

    return NextResponse.json({ hasPin })
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ hasPin: false, message: "Unauthorized" }, { status: 401 })
    }
    console.error("Error checking admin PIN:", error)
    return NextResponse.json({ hasPin: false, message: "Internal server error" }, { status: 500 })
  }
}

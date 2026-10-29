import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const result = await pool.query("SELECT * FROM user_profiles ORDER BY id ASC")
    const rows = result.rows.map((row: Record<string, unknown>) => {
      const copy = { ...row }
      delete copy.square_access_token
      delete copy.square_refresh_token
      return copy
    })
    return NextResponse.json(rows, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

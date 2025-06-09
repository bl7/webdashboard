import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  }

  const result = await pool.query("SELECT profile_picture FROM user_profiles WHERE user_id = $1", [
    userId,
  ])

  if (result.rowCount === 0) {
    return NextResponse.json({ profile_picture: null })
  }

  return NextResponse.json({ profile_picture: result.rows[0].profile_picture || null })
}

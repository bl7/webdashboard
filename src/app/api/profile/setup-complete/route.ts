import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function POST(req: NextRequest) {
  try {
    const { user_id } = await req.json()

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
    }

    // Mark setup as completed
    await pool.query(
      `UPDATE user_profiles SET setup_completed = true WHERE user_id = $1`,
      [user_id]
    )

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    let message = "Internal Server Error"
    if (error instanceof Error) message = error.message
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

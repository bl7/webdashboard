import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function POST(req: Request) {
  try {
    const { userId, pin } = await req.json()

    if (!userId || !pin) {
      return NextResponse.json(
        { success: false, message: "Missing userId or pin" },
        { status: 400 }
      )
    }

    // Upsert: insert new or update existing PIN for the user
    await pool.query(
      `INSERT INTO admin_access (user_id, pin)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET pin = EXCLUDED.pin`,
      [userId, pin]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting admin PIN:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

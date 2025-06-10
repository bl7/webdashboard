import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function POST(req: Request) {
  const { userId, pin } = await req.json()

  if (!userId || !pin) {
    return NextResponse.json({ valid: false, message: "Missing userId or pin" }, { status: 400 })
  }

  const result = await pool.query("SELECT pin FROM admin_access WHERE user_id = $1", [userId])

  const storedPin = (result.rows[0]?.pin || "0000").trim()
  const receivedPin = pin.trim()

  console.log("Stored PIN:", storedPin)
  console.log("Received PIN:", receivedPin)

  return NextResponse.json({ valid: storedPin === receivedPin })
}

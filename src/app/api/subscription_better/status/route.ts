import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get("user_id")
  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  }
  const client = await pool.connect()
  try {
    const result = await client.query("SELECT * FROM subscription_better WHERE user_id = $1", [user_id])
    if (result.rows.length === 0) {
      return NextResponse.json({ subscription: null })
    }
    return NextResponse.json({ subscription: result.rows[0] })
  } finally {
    client.release()
  }
} 
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    // Verify JWT token and get user UUID
    const { userUuid } = await verifyAuthToken(req)
    
    const client = await pool.connect()
    try {
      const result = await client.query("SELECT * FROM subscription_better WHERE user_id = $1", [userUuid])
      if (result.rows.length === 0) {
        return NextResponse.json({ subscription: null })
      }
      return NextResponse.json({ subscription: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (error: any) {
    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 
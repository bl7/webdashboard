import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

// Check if user has admin access PIN set (not default '0000')
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("user_id")

  if (!userId) {
    return NextResponse.json({ hasPin: false, message: "Missing user_id" }, { status: 400 })
  }

  const result = await pool.query("SELECT pin FROM admin_access WHERE user_id = $1", [userId])

  const hasPin = result.rows.length > 0 && result.rows[0].pin !== "0000"

  return NextResponse.json({ hasPin })
}

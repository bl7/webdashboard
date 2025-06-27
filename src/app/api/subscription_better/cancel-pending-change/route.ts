import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function POST(req: NextRequest) {
  const { user_id } = await req.json()
  if (!user_id) return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  const client = await pool.connect()
  try {
    await client.query("UPDATE subscription_better SET pending_plan_change = NULL, pending_plan_change_effective = NULL, updated_at = NOW() WHERE user_id = $1", [user_id])
    return NextResponse.json({ message: "Pending plan change cancelled." })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    client.release()
  }
} 
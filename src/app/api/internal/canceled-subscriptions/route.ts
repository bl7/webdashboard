import { createHmac, timingSafeEqual } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

function sign(secret: string, ids: string[]) {
  return createHmac("sha256", secret).update(ids.join("\n")).digest("hex")
}

function same(sent: string, expected: string) {
  const a = Buffer.from(sent)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(req: NextRequest) {
  const secret = process.env.JWT_SECRET
  if (!secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => null)
  const raw = Array.isArray(body?.userIds) ? body.userIds : null
  if (!raw || raw.length > 2000) {
    return NextResponse.json({ error: "Invalid userIds" }, { status: 400 })
  }

  const seen = new Set<string>()
  for (const id of raw) {
    const value = String(id || "").trim()
    if (value) seen.add(value)
  }
  const userIds = [...seen].sort()
  if (userIds.some((id) => id.length > 80)) {
    return NextResponse.json({ error: "Invalid userIds" }, { status: 400 })
  }

  const sent = req.headers.get("x-internal-sign") || ""
  if (!same(sent, sign(secret, userIds))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await pool.query(
      `SELECT user_id, status
       FROM subscription_better
       WHERE user_id = ANY($1::text[])`,
      [userIds]
    )
    const statuses: Record<string, string> = {}
    for (const row of result.rows) statuses[String(row.user_id)] = String(row.status || "")
    return NextResponse.json({ statuses }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("POST /api/internal/canceled-subscriptions", error)
    return NextResponse.json({ error: "Failed to load subscriptions" }, { status: 500 })
  }
}

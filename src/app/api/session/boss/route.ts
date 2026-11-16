import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { BOSS_COOKIE } from "@/lib/sessionCookie"

export async function GET(request: NextRequest) {
  const token = request.cookies.get(BOSS_COOKIE)?.value
  const payload = token ? await verifyToken(token) : null
  if (!payload || payload.role !== "boss") {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  return NextResponse.json({
    ok: true,
    email: payload.email ?? null,
    username: payload.username ?? null,
  })
}

import { NextResponse } from "next/server"
import { BOSS_COOKIE } from "@/lib/sessionCookie"

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(BOSS_COOKIE, "", { path: "/", maxAge: 0 })
  return response
}

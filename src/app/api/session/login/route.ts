import { NextRequest, NextResponse } from "next/server"
import { CUSTOMER_COOKIE, CUSTOMER_MAX_AGE, publicLoginBody, sessionCookieOptions } from "@/lib/sessionCookie"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body?.email === "string" ? body.email : ""
    const password = typeof body?.password === "string" ? body.password : ""
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
    if (!base) {
      return NextResponse.json({ message: "Login failed" }, { status: 500 })
    }

    const upstream = await fetch(`${base}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await upstream.json().catch(() => ({}))
    if (!upstream.ok || typeof data?.token !== "string") {
      return NextResponse.json(
        { message: data?.message || "Login failed" },
        { status: upstream.ok ? 502 : upstream.status }
      )
    }

    const response = NextResponse.json(publicLoginBody(data))
    response.cookies.set(
      CUSTOMER_COOKIE,
      data.token,
      sessionCookieOptions(CUSTOMER_MAX_AGE, process.env.NODE_ENV === "production")
    )
    return response
  } catch (error) {
    console.error("[session] login failed", error instanceof Error ? error.name : "error")
    return NextResponse.json({ message: "Login failed" }, { status: 500 })
  }
}

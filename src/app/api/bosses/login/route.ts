import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import bcrypt from "bcryptjs"
import { createToken } from "@/lib/auth"
import { BOSS_COOKIE, BOSS_MAX_AGE, sessionCookieOptions } from "@/lib/sessionCookie"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Get user from database
    const result = await pool.query(
      "SELECT id, username, email, password_hash FROM bossess WHERE email = $1",
      [email]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const user = result.rows[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await createToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: "boss"
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    })
    response.cookies.set(
      BOSS_COOKIE,
      token,
      sessionCookieOptions(BOSS_MAX_AGE, process.env.NODE_ENV === "production")
    )
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

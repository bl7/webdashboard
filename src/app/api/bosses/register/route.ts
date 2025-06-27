// src/app/api/bosses/register/route.ts
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import pool from "@/lib/pg"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password } = body

    if (!username || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 12)

    // Insert new boss
    const result = await pool.query(
      "INSERT INTO bossess (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, hash]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (err: any) {
    console.error("Error creating boss:", err)

    // Handle specific database errors
    if (err.code === "23505") {
      // Unique constraint violation
      return NextResponse.json({ message: "Username or email already exists" }, { status: 409 })
    }

    // Generic error response
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import pool from "@/lib/pg"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, email, password } = body

    if (!username || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12)

    // Insert new boss/admin
    const result = await pool.query(
      "INSERT INTO bossess (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, hash]
    )

    return NextResponse.json(
      {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email,
        created_at: result.rows[0].created_at,
        message: "Signup successful",
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error("Public signup error:", err)

    if (err.code === "23505") {
      // unique violation
      return NextResponse.json({ message: "Username or email already exists" }, { status: 409 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

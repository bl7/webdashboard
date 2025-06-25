import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "@/lib/pg"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 })
    }

    const result = await pool.query("SELECT * FROM bossess WHERE email = $1", [email])

    if (!result.rows.length) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const boss = result.rows[0]
    const valid = await bcrypt.compare(password, boss.password_hash)

    if (!valid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const token = jwt.sign(
      { id: boss.id, email: boss.email, role: "boss" },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    )

    return NextResponse.json({
      token,
      boss: { id: boss.id, username: boss.username, email: boss.email },
    })
  } catch (error) {
    console.error("Login Error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

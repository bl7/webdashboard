// app/api/users/route.js
import { NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM user_profiles ORDER BY id ASC")
    return NextResponse.json(result.rows, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

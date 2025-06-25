import { NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function GET(request: Request) {
  try {
    const query = "SELECT * FROM subscriptions ORDER BY id ASC"
    const { rows } = await pool.query(query)
    return NextResponse.json(rows, { status: 200 })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

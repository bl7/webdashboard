import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// GET - Get all waitlist entries (for boss dashboard)
export async function GET(req: NextRequest) {
  try {
    // Verify boss authentication
    const { role } = await verifyAuthToken(req)
    if (role !== 'boss') {
      return NextResponse.json(
        { error: "Unauthorized: Boss access required" },
        { status: 401 }
      )
    }

    const result = await pool.query(
      "SELECT * FROM waitlist ORDER BY created_at DESC"
    )
    
    return NextResponse.json({ 
      success: true, 
      waitlist: result.rows 
    })
  } catch (error) {
    console.error("Error fetching waitlist:", error)
    return NextResponse.json(
      { error: "Failed to fetch waitlist" },
      { status: 500 }
    )
  }
}

// POST - Add new waitlist entry (public)
export async function POST(req: NextRequest) {
  try {
    const { email, full_name, company_name, phone } = await req.json()

    // Validate required fields
    if (!email || !full_name) {
      return NextResponse.json(
        { error: "Email and full name are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT id FROM waitlist WHERE email = $1",
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "This email is already on the waitlist" },
        { status: 409 }
      )
    }

    // Insert new waitlist entry
    const result = await pool.query(
      `INSERT INTO waitlist (email, full_name, company_name, phone) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, full_name, company_name, created_at`,
      [email, full_name, company_name || null, phone || null]
    )

    return NextResponse.json({
      success: true,
      message: "Successfully joined the waitlist!",
      entry: result.rows[0]
    })
  } catch (error) {
    console.error("Error adding to waitlist:", error)
    return NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 }
    )
  }
} 
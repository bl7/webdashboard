import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// POST - Submit a testimonial (public, unlisted form)
export async function POST(req: NextRequest) {
  try {
    const { name, email, company, role, rating, message, consent } = await req.json()

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and testimonial are required." },
        { status: 400 }
      )
    }

    const parsedRating =
      rating === undefined || rating === null || rating === ""
        ? null
        : Math.max(1, Math.min(5, parseInt(String(rating), 10) || 0)) || null

    const result = await pool.query(
      `INSERT INTO testimonials (name, email, company, role, rating, message, consent, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, created_at`,
      [
        name,
        email || null,
        company || null,
        role || null,
        parsedRating,
        message,
        Boolean(consent),
        "web",
      ]
    )

    return NextResponse.json({
      success: true,
      message: "Thank you for your testimonial!",
      entry: result.rows[0],
    })
  } catch (err) {
    console.error("Testimonials POST error:", err)
    return NextResponse.json(
      { error: "Failed to submit testimonial." },
      { status: 500 }
    )
  }
}

// GET - List testimonials (boss only)
export async function GET(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const result = await pool.query(
      "SELECT * FROM testimonials ORDER BY created_at DESC"
    )
    return NextResponse.json({ success: true, testimonials: result.rows })
  } catch (err) {
    console.error("Testimonials GET error:", err)
    return NextResponse.json(
      { error: "Failed to fetch testimonials." },
      { status: 500 }
    )
  }
}

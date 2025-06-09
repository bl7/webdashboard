import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")
  if (!userId) return NextResponse.json({ error: "Missing user_id" }, { status: 400 })

  const result = await pool.query(
    `SELECT user_id, company_name, address, city, state, country, zip, profile_picture 
     FROM user_profiles WHERE user_id = $1`,
    [userId]
  )

  if (result.rowCount === 0) {
    return NextResponse.json({ profile: null })
  }

  return NextResponse.json({ profile: result.rows[0] })
}

export async function PUT(req: NextRequest) {
  try {
    // Destructure with default null to allow partial updates
    const {
      user_id,
      company_name = null,
      address = null,
      city = null,
      state = null,
      country = null,
      zip = null,
      profile_picture = null,
    } = await req.json()

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
    }

    const existingResult = await pool.query("SELECT * FROM user_profiles WHERE user_id = $1", [
      user_id,
    ])

    if (existingResult.rowCount > 0) {
      await pool.query(
        `UPDATE user_profiles SET 
          company_name = COALESCE($1, company_name), 
          address = COALESCE($2, address), 
          city = COALESCE($3, city),
          state = COALESCE($4, state),
          country = COALESCE($5, country),
          zip = COALESCE($6, zip),
          profile_picture = COALESCE($7, profile_picture)
         WHERE user_id = $8`,
        [company_name, address, city, state, country, zip, profile_picture, user_id]
      )
    } else {
      await pool.query(
        `INSERT INTO user_profiles (
          user_id, company_name, address, city, state, country, zip, profile_picture
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [user_id, company_name, address, city, state, country, zip, profile_picture]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    let message = "Internal Server Error"
    if (error instanceof Error) message = error.message
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

// CORS helper
function withCORS(res: Response | NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")
  if (!userId) return NextResponse.json({ error: "Missing user_id" }, { status: 400 })

  const result = await pool.query(
    `SELECT user_id, full_name, email, company_name, address_line1, address_line2, city, state, country, postal_code, phone, profile_picture 
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
    const {
      user_id,
      full_name = null,
      email = null,
      company_name = null,
      address_line1 = null,
      address_line2 = null,
      city = null,
      state = null,
      country = null,
      postal_code = null,
      phone = null,
      profile_picture = null,
      avatar = null,
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
          full_name = COALESCE($1, full_name),
          email = COALESCE($2, email),
          company_name = COALESCE($3, company_name),
          address_line1 = COALESCE($4, address_line1),
          address_line2 = COALESCE($5, address_line2),
          city = COALESCE($6, city),
          state = COALESCE($7, state),
          country = COALESCE($8, country),
          postal_code = COALESCE($9, postal_code),
          phone = COALESCE($10, phone),
          profile_picture = COALESCE($11, profile_picture)
         WHERE user_id = $12`,
        [full_name, email, company_name, address_line1, address_line2, city, state, country, postal_code, phone, profile_picture, user_id]
      )
    } else {
      await pool.query(
        `INSERT INTO user_profiles (
          user_id, full_name, email, company_name, address_line1, address_line2, city, state, country, postal_code, phone, profile_picture
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [user_id, full_name, email, company_name, address_line1, address_line2, city, state, country, postal_code, phone, profile_picture]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    let message = "Internal Server Error"
    if (error instanceof Error) message = error.message
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

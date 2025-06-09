import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")
  if (!userId) return NextResponse.json({ error: "Missing user_id" }, { status: 400 })

  const result = await pool.query(
    "SELECT label_type, expiry_days FROM label_settings WHERE user_id = $1",
    [userId]
  )

  return NextResponse.json({ settings: result.rows })
}

export async function PUT(req: NextRequest) {
  try {
    const { user_id, expiryDays } = await req.json()

    if (!user_id || !Array.isArray(expiryDays)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      for (const { labelType, expiryDays: days } of expiryDays) {
        await client.query(
          `
          INSERT INTO label_settings (user_id, label_type, expiry_days)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, label_type)
          DO UPDATE SET expiry_days = EXCLUDED.expiry_days
        `,
          [user_id, labelType, days]
        )
      }

      await client.query("COMMIT")
    } catch (err) {
      await client.query("ROLLBACK")
      throw err
    } finally {
      client.release()
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    let message = "Internal Server Error"
    if (error instanceof Error) message = error.message
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

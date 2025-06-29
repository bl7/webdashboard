import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    // Verify JWT token and get user UUID
    const { userUuid } = await verifyAuthToken(req)
    
    const result = await pool.query(
      "SELECT label_type, expiry_days FROM label_settings WHERE user_id = $1",
      [userUuid]
    )

    return NextResponse.json({ settings: result.rows })
  } catch (error: any) {
    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
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

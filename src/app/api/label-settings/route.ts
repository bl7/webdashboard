import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// CORS helper
function withCORS(res: Response | NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,PUT,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function OPTIONS(req: NextRequest) {
  return withCORS(new Response(null, { status: 204 }));
}

export async function GET(req: NextRequest) {
  try {
    // Verify JWT token and get user UUID
    const { userUuid } = await verifyAuthToken(req)
    
    const result = await pool.query(
      "SELECT label_type, expiry_days FROM label_settings WHERE user_id = $1",
      [userUuid]
    )

    return withCORS(NextResponse.json({ settings: result.rows }))
  } catch (error: any) {
    if (error.message.includes("Unauthorized")) {
      return withCORS(NextResponse.json({ error: error.message }, { status: 401 }))
    }
    return withCORS(NextResponse.json({ error: "Internal Server Error" }, { status: 500 }))
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { settings } = await req.json()

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      for (const { label_type, expiry_days } of settings) {
        await client.query(
          `
          INSERT INTO label_settings (user_id, label_type, expiry_days)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, label_type)
          DO UPDATE SET expiry_days = EXCLUDED.expiry_days
          `,
          [userUuid, label_type, expiry_days]
        )
      }

      await client.query("COMMIT")
      return withCORS(NextResponse.json({ success: true }))
    } catch (err) {
      await client.query("ROLLBACK")
      throw err
    } finally {
      client.release()
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ""
    if (message.includes("Unauthorized")) {
      return withCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }))
    }
    return withCORS(NextResponse.json({ error: "Internal Server Error" }, { status: 500 }))
  }
}

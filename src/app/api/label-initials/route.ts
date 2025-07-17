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
    
    const [settingsResult, initialsResult] = await Promise.all([
      pool.query("SELECT use_initials FROM label_initials WHERE user_id = $1", [userUuid]),
      pool.query("SELECT initial FROM label_initial_items WHERE user_id = $1", [userUuid]),
    ])

    return withCORS(NextResponse.json({
      use_initials: settingsResult.rows[0]?.use_initials ?? true,
      initials: initialsResult.rows.map((r: { initial: string }) => r.initial),
    }))
  } catch (error: any) {
    if (error.message.includes("Unauthorized")) {
      return withCORS(NextResponse.json({ error: error.message }, { status: 401 }))
    }
    return withCORS(NextResponse.json({ error: "Internal Server Error" }, { status: 500 }))
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user_id, use_initials, initials } = await req.json()

    if (!user_id || typeof use_initials !== "boolean" || !Array.isArray(initials)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      // Upsert use_initials flag
      await client.query(
        `
        INSERT INTO label_initials (user_id, use_initials)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET use_initials = EXCLUDED.use_initials
        `,
        [user_id, use_initials]
      )

      // Delete all previous initials for user
      await client.query("DELETE FROM label_initial_items WHERE user_id = $1", [user_id])

      // Insert new initials, if any
      for (const initial of initials) {
        // Optional: you could validate 'initial' format here if desired
        await client.query(
          `
          INSERT INTO label_initial_items (user_id, initial)
          VALUES ($1, $2)
          `,
          [user_id, initial]
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
    let message = "Internal Server Error"
    if (error instanceof Error) message = error.message
    return withCORS(NextResponse.json({ error: message }, { status: 500 }))
  }
}

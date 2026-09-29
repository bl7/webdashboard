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
      pool.query("SELECT initial, full_name FROM label_initial_items WHERE user_id = $1", [userUuid]),
    ])

    const rows = initialsResult.rows as { initial: string; full_name: string | null }[]
    return withCORS(NextResponse.json({
      use_initials: settingsResult.rows[0]?.use_initials ?? true,
      initials: rows.map((row) => row.initial),
      staff: rows.map((row) => ({ initial: row.initial, name: row.full_name || "" })),
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
    const { user_id, use_initials, initials, staff } = await req.json()

    if (!user_id || typeof use_initials !== "boolean" || (!Array.isArray(initials) && !Array.isArray(staff))) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const people = Array.isArray(staff)
      ? staff.map((person: { initial?: unknown; name?: unknown }) => ({
          initial: String(person?.initial ?? "").trim().toUpperCase(),
          name: String(person?.name ?? "").trim(),
        }))
      : (initials as unknown[]).map((initial) => ({
          initial: String(initial ?? "").trim().toUpperCase(),
          name: "",
        }))
    const entries = people.filter((person: { initial: string }) => person.initial)
    if (entries.some((person: { initial: string; name: string }) => person.initial.length > 10 || person.name.length > 80)) {
      return NextResponse.json({ error: "Initials must be 10 characters or fewer, and names 80 or fewer." }, { status: 400 })
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

      for (const person of entries) {
        await client.query(
          `
          INSERT INTO label_initial_items (user_id, initial, full_name)
          VALUES ($1, $2, $3)
          `,
          [user_id, person.initial, person.name || null]
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

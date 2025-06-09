import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")
  if (!userId) return NextResponse.json({ error: "Missing user_id" }, { status: 400 })

  const [settingsResult, initialsResult] = await Promise.all([
    pool.query("SELECT use_initials FROM label_initials WHERE user_id = $1", [userId]),
    pool.query("SELECT initial FROM label_initial_items WHERE user_id = $1", [userId]),
  ])

  return NextResponse.json({
    use_initials: settingsResult.rows[0]?.use_initials ?? true,
    initials: initialsResult.rows.map((r: { initial: string }) => r.initial),
  })
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
      return NextResponse.json({ success: true })
    } catch (err) {
      await client.query("ROLLBACK")
      throw err
    } finally {
      client.release()
    }
  } catch (error: unknown) {
    let message = "Internal Server Error"
    if (error instanceof Error) message = error.message
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// app/api/logs/route.ts
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

// CREATE log
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("Received log POST body:", body)

    const { user_id, action, details } = body

    if (!user_id || !action) {
      console.log("Missing user_id or action in request")
      return NextResponse.json({ error: "Missing user_id or action" }, { status: 400 })
    }

    const result = await pool.query(
      `INSERT INTO activity_logs (user_id, action, details)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, action, details || {}]
    )

    console.log("Inserted log:", result.rows[0])
    return NextResponse.json({ log: result.rows[0] }, { status: 201 })
  } catch (err) {
    console.error("POST /api/logs error:", err)

    if (err instanceof Error) {
      return NextResponse.json(
        { error: "Failed to create log", details: err.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create log", details: "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("user_id")

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id in query parameters" }, { status: 400 })
  }

  // UUID v4 validation regex
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidV4Regex.test(userId)) {
    return NextResponse.json(
      { error: "Invalid user_id format (not a valid UUID)" },
      { status: 400 }
    )
  }

  try {
    const result = await pool.query(
      `SELECT id, user_id, action, details, timestamp
       FROM activity_logs
       WHERE user_id = $1
       ORDER BY timestamp DESC`,
      [userId]
    )

    const logs = result.rows.map((row: any) => ({
      ...row,
      details: typeof row.details === "string" ? JSON.parse(row.details) : row.details,
    }))
    return NextResponse.json({ logs }, { status: 200 })
  } catch (error) {
    console.error("Error fetching logs in GET /api/logs:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch logs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// UPDATE a log (e.g., to add more details)
export async function PUT(req: NextRequest) {
  try {
    const { id, user_id, action, details } = await req.json()

    if (!id || !user_id || !action) {
      return NextResponse.json({ error: "Missing id, user_id, or action" }, { status: 400 })
    }

    const result = await pool.query(
      `UPDATE activity_logs
       SET action = $1, details = $2
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [action, details || {}, id, user_id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Log not found or not owned by user" }, { status: 404 })
    }

    return NextResponse.json({ log: result.rows[0] }, { status: 200 })
  } catch (err) {
    console.error("PUT /api/logs error:", err)
    return NextResponse.json({ error: "Failed to update log" }, { status: 500 })
  }
}

// DELETE a log
export async function DELETE(req: NextRequest) {
  try {
    const { id, user_id } = await req.json()

    if (!id || !user_id) {
      return NextResponse.json({ error: "Missing id or user_id" }, { status: 400 })
    }

    const result = await pool.query(
      `DELETE FROM activity_logs WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, user_id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Log not found or not owned by user" }, { status: 404 })
    }

    return NextResponse.json({ deleted: result.rows[0] }, { status: 200 })
  } catch (err) {
    console.error("DELETE /api/logs error:", err)
    return NextResponse.json({ error: "Failed to delete log" }, { status: 500 })
  }
}

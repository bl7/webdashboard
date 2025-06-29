// app/api/logs/route.ts
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// CREATE log
export async function POST(req: NextRequest) {
  try {
    // Verify JWT token and get user UUID
    const { userUuid } = await verifyAuthToken(req)
    
    const body = await req.json()
    console.log("Received log POST body:", body)

    const { action, details } = body

    if (!action) {
      console.log("Missing action in request")
      return NextResponse.json({ error: "Missing action" }, { status: 400 })
    }

    const result = await pool.query(
      `INSERT INTO activity_logs (user_id, action, details)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userUuid, action, details || {}]
    )

    console.log("Inserted log:", result.rows[0])
    return NextResponse.json({ log: result.rows[0] }, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/logs error:", error)
    
    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to create log", details: error.message },
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
  try {
    // Verify JWT token and get user UUID
    const { userUuid } = await verifyAuthToken(req)

    const result = await pool.query(
      `SELECT id, user_id, action, details, timestamp
       FROM activity_logs
       WHERE user_id = $1
       ORDER BY timestamp DESC`,
      [userUuid]
    )

    const logs = result.rows.map((row: any) => ({
      ...row,
      details: typeof row.details === "string" ? JSON.parse(row.details) : row.details,
    }))
    return NextResponse.json({ logs }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching logs in GET /api/logs:", error)
    
    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

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

// app/api/logs/route.ts
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// CORS helper
function withCORS(res: Response | NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*")
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  return res
}

export async function OPTIONS(req: NextRequest) {
  return withCORS(new Response(null, { status: 204 }))
}

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
    return withCORS(NextResponse.json({ log: result.rows[0] }, { status: 201 }))
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

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const dateFrom = searchParams.get("dateFrom")
    const action = searchParams.get("action")

    // Validate parameters
    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: "Invalid page parameter" }, { status: 400 })
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json({ error: "Invalid limit parameter (1-100)" }, { status: 400 })
    }

    if (dateFrom && isNaN(Date.parse(dateFrom))) {
      return NextResponse.json({ error: "Invalid dateFrom format (YYYY-MM-DD)" }, { status: 400 })
    }

    // Build query conditions
    let whereConditions = ["user_id = $1"]
    let queryParams: any[] = [userUuid]
    let paramIndex = 2

    // Add date filter if provided
    if (dateFrom) {
      whereConditions.push(`timestamp >= $${paramIndex}`)
      queryParams.push(new Date(dateFrom).toISOString())
      paramIndex++
    }

    // Add action filter if provided
    if (action) {
      whereConditions.push(`action = $${paramIndex}`)
      queryParams.push(action)
      paramIndex++
    }

    const whereClause = whereConditions.join(" AND ")

    // Calculate pagination
    const offset = (page - 1) * limit

    // Get total count for pagination metadata
    const countQuery = `SELECT COUNT(*) FROM activity_logs WHERE ${whereClause}`
    const countResult = await pool.query(countQuery, queryParams)
    const totalCount = parseInt(countResult.rows[0].count)

    // Execute query with pagination
    const logsQuery = `
      SELECT id, user_id, action, details, timestamp
      FROM activity_logs
      WHERE ${whereClause}
      ORDER BY timestamp DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    queryParams.push(limit, offset)

    const result = await pool.query(logsQuery, queryParams)

    const logs = result.rows.map((row: any) => ({
      ...row,
      details: typeof row.details === "string" ? JSON.parse(row.details) : row.details,
    }))

    const totalPages = Math.ceil(totalCount / limit)

    // Response format with pagination metadata
    const response = {
      logs,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasMore: page < totalPages,
        limit,
      },
    }

    return withCORS(NextResponse.json(response, { status: 200 }))
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

    return withCORS(NextResponse.json({ log: result.rows[0] }, { status: 200 }))
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

    return withCORS(NextResponse.json({ deleted: result.rows[0] }, { status: 200 }))
  } catch (err) {
    console.error("DELETE /api/logs error:", err)
    return NextResponse.json({ error: "Failed to delete log" }, { status: 500 })
  }
}

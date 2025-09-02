import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// GET /api/bulk-print/lists - Get user's bulk print lists
export async function GET(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)

    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        description, 
        created_at, 
        updated_at,
        (SELECT COUNT(*) FROM bulk_print_list_items WHERE list_id = bulk_print_lists.id) as item_count
       FROM bulk_print_lists 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userUuid]
    )

    return NextResponse.json({ lists: result.rows })
  } catch (error: any) {
    console.error("GET /api/bulk-print/lists error:", error)

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to fetch bulk print lists" }, { status: 500 })
  }
}

// POST /api/bulk-print/lists - Create new bulk print list
export async function POST(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { name, description } = await req.json()

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "List name is required" }, { status: 400 })
    }

    const result = await pool.query(
      `INSERT INTO bulk_print_lists (user_id, name, description) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userUuid, name.trim(), description?.trim() || null]
    )

    return NextResponse.json({ list: result.rows[0] }, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/bulk-print/lists error:", error)

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to create bulk print list" }, { status: 500 })
  }
}

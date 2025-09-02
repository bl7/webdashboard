import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// GET /api/bulk-print/lists/[id] - Get specific list with items
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { id: listId } = await params

    // Get list details
    const listResult = await pool.query(
      `SELECT * FROM bulk_print_lists 
       WHERE id = $1 AND user_id = $2`,
      [listId, userUuid]
    )

    if (listResult.rows.length === 0) {
      return NextResponse.json({ error: "List not found" }, { status: 404 })
    }

    // Get list items
    const itemsResult = await pool.query(
      `SELECT * FROM bulk_print_list_items 
       WHERE list_id = $1 
       ORDER BY created_at ASC`,
      [listId]
    )

    return NextResponse.json({
      list: listResult.rows[0],
      items: itemsResult.rows,
    })
  } catch (error: any) {
    console.error("GET /api/bulk-print/lists/[id] error:", error)

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to fetch list" }, { status: 500 })
  }
}

// PUT /api/bulk-print/lists/[id] - Update list name/description
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { id: listId } = await params
    const { name, description } = await req.json()

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "List name is required" }, { status: 400 })
    }

    const result = await pool.query(
      `UPDATE bulk_print_lists 
       SET name = $1, description = $2, updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [name.trim(), description?.trim() || null, listId, userUuid]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "List not found" }, { status: 404 })
    }

    return NextResponse.json({ list: result.rows[0] })
  } catch (error: any) {
    console.error("PUT /api/bulk-print/lists/[id] error:", error)

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to update list" }, { status: 500 })
  }
}

// DELETE /api/bulk-print/lists/[id] - Delete list and all its items
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { id: listId } = await params

    const result = await pool.query(
      `DELETE FROM bulk_print_lists 
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [listId, userUuid]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "List not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "List deleted successfully" })
  } catch (error: any) {
    console.error("DELETE /api/bulk-print/lists/[id] error:", error)

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to delete list" }, { status: 500 })
  }
}

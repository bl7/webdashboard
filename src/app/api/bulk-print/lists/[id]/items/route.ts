import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// GET /api/bulk-print/lists/[id]/items - Get all items in a list
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { id: listId } = await params

    // Verify user owns the list
    const listCheck = await pool.query(
      `SELECT id FROM bulk_print_lists 
       WHERE id = $1 AND user_id = $2`,
      [listId, userUuid]
    )

    if (listCheck.rows.length === 0) {
      return NextResponse.json({ error: "List not found" }, { status: 404 })
    }

    // Get list items
    const result = await pool.query(
      `SELECT * FROM bulk_print_list_items 
       WHERE list_id = $1 
       ORDER BY created_at ASC`,
      [listId]
    )

    return NextResponse.json({ items: result.rows })
  } catch (error: any) {
    console.error("GET /api/bulk-print/lists/[id]/items error:", error)

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to fetch list items" }, { status: 500 })
  }
}

// POST /api/bulk-print/lists/[id]/items - Add items to list
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { id: listId } = await params
    const { items } = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items array is required" }, { status: 400 })
    }

    // Verify user owns the list
    const listCheck = await pool.query(
      `SELECT id FROM bulk_print_lists 
       WHERE id = $1 AND user_id = $2`,
      [listId, userUuid]
    )

    if (listCheck.rows.length === 0) {
      return NextResponse.json({ error: "List not found" }, { status: 404 })
    }

    // Validate items
    for (const item of items) {
      if (!item.item_id || !item.item_type || !item.item_name) {
        return NextResponse.json(
          { error: "Each item must have item_id, item_type, and item_name" },
          { status: 400 }
        )
      }

      if (!["ingredient", "menu"].includes(item.item_type)) {
        return NextResponse.json(
          { error: 'item_type must be either "ingredient" or "menu"' },
          { status: 400 }
        )
      }

      // Validate label_type for menu items
      if (item.item_type === "menu" && !item.label_type) {
        return NextResponse.json({ error: "Menu items must have a label_type" }, { status: 400 })
      }

      if (
        item.item_type === "menu" &&
        !["cooked", "prep", "ppds", "default"].includes(item.label_type)
      ) {
        return NextResponse.json({ error: "Invalid label_type for menu item" }, { status: 400 })
      }

      // Ingredients should not have label_type
      if (item.item_type === "ingredient" && item.label_type) {
        return NextResponse.json(
          { error: "Ingredients should not have label_type" },
          { status: 400 }
        )
      }
    }

    // Insert items
    const insertedItems = []
    for (const item of items) {
      const result = await pool.query(
        `INSERT INTO bulk_print_list_items 
         (list_id, item_id, item_type, item_name, quantity, label_type) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [
          listId,
          item.item_id,
          item.item_type,
          item.item_name,
          item.quantity || 1,
          item.item_type === "menu" ? item.label_type : null,
        ]
      )
      insertedItems.push(result.rows[0])
    }

    return NextResponse.json({ items: insertedItems }, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/bulk-print/lists/[id]/items error:", error)

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to add items to list" }, { status: 500 })
  }
}

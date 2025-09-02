import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// PUT /api/bulk-print/lists/[id]/items/[itemId] - Update item quantity or label type
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { id: listId, itemId } = await params
    const { quantity, label_type } = await req.json()

    // Verify user owns the list
    const listCheck = await pool.query(
      `SELECT id FROM bulk_print_lists 
       WHERE id = $1 AND user_id = $2`,
      [listId, userUuid]
    )

    if (listCheck.rows.length === 0) {
      return NextResponse.json({ error: "List not found" }, { status: 404 })
    }

    // Get current item to check type
    const currentItem = await pool.query(
      `SELECT * FROM bulk_print_list_items 
       WHERE id = $1 AND list_id = $2`,
      [itemId, listId]
    )

    if (currentItem.rows.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const item = currentItem.rows[0]

    // Validate label_type for menu items
    if (label_type !== undefined) {
      if (item.item_type === "menu") {
        if (!["cooked", "prep", "ppds", "default"].includes(label_type)) {
          return NextResponse.json({ error: "Invalid label_type for menu item" }, { status: 400 })
        }
      } else if (item.item_type === "ingredient" && label_type !== null) {
        return NextResponse.json(
          { error: "Ingredients should not have label_type" },
          { status: 400 }
        )
      }
    }

    // Build update query dynamically
    const updates = []
    const values = []
    let paramCount = 1

    if (quantity !== undefined) {
      updates.push(`quantity = $${paramCount}`)
      values.push(Math.max(1, quantity))
      paramCount++
    }

    if (label_type !== undefined) {
      updates.push(`label_type = $${paramCount}`)
      values.push(item.item_type === "menu" ? label_type : null)
      paramCount++
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    values.push(itemId, listId)

    const result = await pool.query(
      `UPDATE bulk_print_list_items 
       SET ${updates.join(", ")}
       WHERE id = $${paramCount} AND list_id = $${paramCount + 1}
       RETURNING *`,
      values
    )

    return NextResponse.json({ item: result.rows[0] })
  } catch (error: any) {
    console.error("PUT /api/bulk-print/lists/[id]/items/[itemId] error:", error)

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

// DELETE /api/bulk-print/lists/[id]/items/[itemId] - Remove item from list
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { id: listId, itemId } = await params

    // Verify user owns the list
    const listCheck = await pool.query(
      `SELECT id FROM bulk_print_lists 
       WHERE id = $1 AND user_id = $2`,
      [listId, userUuid]
    )

    if (listCheck.rows.length === 0) {
      return NextResponse.json({ error: "List not found" }, { status: 404 })
    }

    const result = await pool.query(
      `DELETE FROM bulk_print_list_items 
       WHERE id = $1 AND list_id = $2
       RETURNING *`,
      [itemId, listId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Item removed successfully" })
  } catch (error: any) {
    console.error("DELETE /api/bulk-print/lists/[id]/items/[itemId] error:", error)

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 })
  }
}

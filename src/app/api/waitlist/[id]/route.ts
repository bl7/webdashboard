import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// PUT - Update waitlist entry (for boss dashboard)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify boss authentication
    const { role } = await verifyAuthToken(req)
    if (role !== 'boss') {
      return NextResponse.json(
        { error: "Unauthorized: Boss access required" },
        { status: 401 }
      )
    }

    const { id } = await params
    const { status, notes, contacted_at, contacted_by } = await req.json()

    // Validate status if provided
    const validStatuses = ['pending', 'contacted', 'converted', 'rejected']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    // Build update query dynamically
    const updateFields = []
    const values = []
    let paramCount = 0

    if (status !== undefined) {
      updateFields.push(`status = $${++paramCount}`)
      values.push(status)
    }

    if (notes !== undefined) {
      updateFields.push(`notes = $${++paramCount}`)
      values.push(notes)
    }

    if (contacted_at !== undefined) {
      updateFields.push(`contacted_at = $${++paramCount}`)
      values.push(contacted_at)
    }

    if (contacted_by !== undefined) {
      updateFields.push(`contacted_by = $${++paramCount}`)
      values.push(contacted_by)
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      )
    }

    values.push(id)
    const query = `
      UPDATE waitlist 
      SET ${updateFields.join(', ')} 
      WHERE id = $${++paramCount}
      RETURNING *
    `

    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Waitlist entry not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Waitlist entry updated successfully",
      entry: result.rows[0]
    })
  } catch (error) {
    console.error("Error updating waitlist entry:", error)
    return NextResponse.json(
      { error: "Failed to update waitlist entry" },
      { status: 500 }
    )
  }
}

// DELETE - Delete waitlist entry (for boss dashboard)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify boss authentication
    const { role } = await verifyAuthToken(req)
    if (role !== 'boss') {
      return NextResponse.json(
        { error: "Unauthorized: Boss access required" },
        { status: 401 }
      )
    }

    const { id } = await params

    const result = await pool.query(
      "DELETE FROM waitlist WHERE id = $1 RETURNING id",
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Waitlist entry not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Waitlist entry deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting waitlist entry:", error)
    return NextResponse.json(
      { error: "Failed to delete waitlist entry" },
      { status: 500 }
    )
  }
} 
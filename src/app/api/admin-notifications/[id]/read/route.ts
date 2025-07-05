import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const result = await pool.query(`
      UPDATE admin_notifications 
      SET read = true, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      notification: result.rows[0]
    })
    
  } catch (error: any) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const result = await pool.query(`
      UPDATE admin_notifications 
      SET read = true, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      notification: result.rows[0]
    })
    
  } catch (error: any) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 
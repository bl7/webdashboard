import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const result = await pool.query(`
      DELETE FROM admin_notifications 
      WHERE id = $1
      RETURNING id
    `, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Notification deleted successfully"
    })
    
  } catch (error: any) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 
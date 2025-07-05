import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function PATCH(req: NextRequest) {
  try {
    // First get the count of unread notifications
    const countResult = await pool.query(`
      SELECT COUNT(*) as unread_count
      FROM admin_notifications 
      WHERE read = false
    `)
    
    const unreadCount = parseInt(countResult.rows[0].unread_count)
    
    // Then update all unread notifications
    const result = await pool.query(`
      UPDATE admin_notifications 
      SET read = true, updated_at = NOW()
      WHERE read = false
    `)
    
    return NextResponse.json({ 
      success: true, 
      updatedCount: unreadCount
    })
    
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const read = searchParams.get('read')
    const limit = searchParams.get('limit')
    
    let query = `
      SELECT 
        id,
        type,
        title,
        message,
        timestamp,
        read,
        data,
        created_at,
        updated_at
      FROM admin_notifications 
    `
    
    const params: any[] = []
    let paramIndex = 1
    
    // Add read filter if specified
    if (read !== null) {
      query += ` WHERE read = $${paramIndex}`
      params.push(read === 'true')
      paramIndex++
    }
    
    query += ` ORDER BY timestamp DESC`
    
    // Add limit if specified
    if (limit) {
      query += ` LIMIT $${paramIndex}`
      params.push(parseInt(limit))
    }

    const result = await pool.query(query, params)

    return NextResponse.json({ notifications: result.rows })
  } catch (error: any) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 
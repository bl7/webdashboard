import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()
    
    // Check if this is a status update or device details update
    if (body.status) {
      // Status update logic
      let statusRaw = body.status
      const status = typeof statusRaw === 'string' ? statusRaw.trim() : statusRaw
      
      if (!status) {
        return NextResponse.json({ error: "Status is required" }, { status: 400 })
      }
      
      // Build the update query with appropriate timestamp fields
      let updateFields = ["status = $1", "updated_at = NOW()"]
      let queryParams = [status, id]
      
      // Add timestamp fields based on status
      switch (status) {
        case 'shipped':
          updateFields.push(`shipped_at = NOW()`)
          break
        case 'delivered':
          updateFields.push(`delivered_at = NOW()`)
          break
        case 'return_requested':
          updateFields.push(`return_requested_at = NOW()`)
          break
        case 'returned':
          updateFields.push(`returned_at = NOW()`)
          break
      }
      
      const query = `
        UPDATE devices 
        SET ${updateFields.join(', ')}
        WHERE id = $2
        RETURNING *
      `
      
      const result = await pool.query(query, queryParams)
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Device not found" }, { status: 404 })
      }
      
      return NextResponse.json({ 
        success: true, 
        device: result.rows[0],
        message: `Device status updated to ${status}`
      })
      
    } else if (body.device_type !== undefined || body.device_identifier !== undefined || body.notes !== undefined) {
      // Device details update logic
      let updateFields = ["updated_at = NOW()"]
      let queryParams = [id]
      let paramIndex = 2
      
      if (body.device_type !== undefined) {
        // Handle empty string as NULL
        const deviceType = body.device_type === '' ? null : body.device_type
        updateFields.push(`device_type = $${paramIndex}`)
        queryParams.push(deviceType)
        paramIndex++
      }
      
      if (body.device_identifier !== undefined) {
        // Handle empty string as NULL
        const deviceIdentifier = body.device_identifier === '' ? null : body.device_identifier
        updateFields.push(`device_identifier = $${paramIndex}`)
        queryParams.push(deviceIdentifier)
        paramIndex++
      }
      
      if (body.notes !== undefined) {
        // Handle empty string as NULL
        const notes = body.notes === '' ? null : body.notes
        updateFields.push(`notes = $${paramIndex}`)
        queryParams.push(notes)
        paramIndex++
      }
      
      const query = `
        UPDATE devices 
        SET ${updateFields.join(', ')}
        WHERE id = $1
        RETURNING *
      `
      
      console.log('Update query:', query)
      console.log('Query params:', queryParams)
      
      const result = await pool.query(query, queryParams)
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Device not found" }, { status: 404 })
      }
      
      console.log('Updated device:', result.rows[0])
      
      return NextResponse.json({ 
        success: true, 
        device: result.rows[0],
        message: "Device details updated successfully"
      })
      
    } else {
      return NextResponse.json({ error: "No valid update fields provided" }, { status: 400 })
    }
    
  } catch (error: any) {
    console.error("Error updating device:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 
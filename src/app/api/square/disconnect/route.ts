import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/pg'
import { verifyAuthToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)

    // Clear Square credentials from database
    await pool.query(
      `UPDATE user_profiles SET 
        square_access_token = NULL,
        square_merchant_id = NULL,
        square_location_id = NULL,
        square_sync_enabled = false
       WHERE user_id = $1`,
      [userUuid]
    )

    return NextResponse.json({ success: true, message: 'Square disconnected successfully' })
  } catch (error: any) {
    console.error('Square disconnect error:', error)
    return NextResponse.json({ error: error.message || 'Failed to disconnect Square' }, { status: 500 })
  }
} 
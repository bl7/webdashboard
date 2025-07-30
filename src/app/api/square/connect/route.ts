import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/pg'
import { verifyAuthToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { square_access_token, square_merchant_id, square_location_id } = await req.json()

    if (!square_access_token || !square_merchant_id) {
      return NextResponse.json({ error: 'Square access token and merchant ID are required' }, { status: 400 })
    }

    // Store Square credentials in database
    await pool.query(
      `UPDATE user_profiles SET 
        square_access_token = $1,
        square_merchant_id = $2,
        square_location_id = $3,
        square_sync_enabled = true
       WHERE user_id = $4`,
      [square_access_token, square_merchant_id, square_location_id, userUuid]
    )

    return NextResponse.json({ success: true, message: 'Square credentials saved successfully' })
  } catch (error: any) {
    console.error('Square connect error:', error)
    return NextResponse.json({ error: error.message || 'Failed to save Square credentials' }, { status: 500 })
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/pg'
import { verifyAuthToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')

    if (userId !== userUuid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's Square access token
    const userResult = await pool.query(
      'SELECT square_access_token FROM user_profiles WHERE user_id = $1',
      [userUuid]
    )

    if (userResult.rows.length === 0 || !userResult.rows[0].square_access_token) {
      return NextResponse.json({ error: 'Square not connected' }, { status: 400 })
    }

    const { square_access_token } = userResult.rows[0]

    // Validate access token format
    if (!square_access_token || typeof square_access_token !== 'string') {
      return NextResponse.json({ error: 'Invalid Square access token' }, { status: 400 })
    }

    // Fetch locations from Square API
    const response = await fetch('https://connect.squareup.com/v2/locations', {
      headers: {
        'Authorization': `Bearer ${square_access_token}`,
        'Square-Version': '2024-01-17',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      let errorMessage = 'Unknown error'
      try {
        const error = await response.json()
        errorMessage = error.errors?.[0]?.detail || error.message || 'Unknown error'
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(`Failed to fetch Square locations: ${errorMessage}`)
    }

    const data = await response.json()
    const locations = data.locations || []

    return NextResponse.json({ locations })
  } catch (error: any) {
    console.error('Square locations error:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch Square locations' }, { status: 500 })
  }
} 
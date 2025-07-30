import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/pg'
import { verifyAuthToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    
    console.log('Square debug check for user:', userUuid)

    // Get user's Square integration status
    const result = await pool.query(
      `SELECT 
        user_id,
        square_access_token,
        square_merchant_id,
        square_location_id,
        square_sync_enabled,
        last_square_sync,
        created_at,
        updated_at
       FROM user_profiles WHERE user_id = $1`,
      [userUuid]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({
        error: 'No user profile found',
        userUuid,
        debug: {
          hasUserProfile: false,
          tokenExists: false,
          tokenLength: 0
        }
      })
    }

    const user = result.rows[0]
    const hasToken = !!user.square_access_token
    const tokenLength = user.square_access_token?.length || 0

    // Test Square API if token exists
    let squareApiTest = null
    if (hasToken) {
      try {
        const response = await fetch('https://connect.squareup.com/v2/locations', {
          headers: {
            'Authorization': `Bearer ${user.square_access_token}`,
            'Square-Version': '2024-01-17',
            'Content-Type': 'application/json'
          }
        })
        
        squareApiTest = {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        }
      } catch (error: any) {
        squareApiTest = {
          error: error.message,
          status: 'error'
        }
      }
    }

    return NextResponse.json({
      userUuid,
      debug: {
        hasUserProfile: true,
        tokenExists: hasToken,
        tokenLength,
        merchantId: user.square_merchant_id,
        locationId: user.square_location_id,
        syncEnabled: user.square_sync_enabled,
        lastSync: user.last_square_sync,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        squareApiTest
      }
    })
  } catch (error: any) {
    console.error('Square debug error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to debug Square connection',
      stack: error.stack
    }, { status: 500 })
  }
} 
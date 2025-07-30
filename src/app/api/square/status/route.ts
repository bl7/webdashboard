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

    // Get user's Square integration status
    const result = await pool.query(
      `SELECT 
        square_access_token,
        square_merchant_id,
        square_location_id,
        square_sync_enabled,
        last_square_sync
       FROM user_profiles WHERE user_id = $1`,
      [userUuid]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({
        connected: false,
        merchantId: '',
        lastSync: null,
        syncEnabled: false,
        syncFrequency: 24,
        itemsSynced: 0,
        itemsPending: 0,
        itemsFailed: 0
      })
    }

    const user = result.rows[0]
    const connected = !!user.square_access_token

    // Get sync statistics from sync logs
    let itemsSynced = 0
    let itemsPending = 0
    let itemsFailed = 0

    if (connected) {
      const syncStats = await pool.query(
        `SELECT 
          SUM(items_created) as total_created,
          SUM(items_failed) as total_failed,
          COUNT(*) as total_syncs
         FROM square_sync_logs WHERE user_id = $1`,
        [userUuid]
      )

      if (syncStats.rows.length > 0) {
        const stats = syncStats.rows[0]
        itemsSynced = parseInt(stats.total_created) || 0
        itemsFailed = parseInt(stats.total_failed) || 0
        itemsPending = 0 // We don't track pending items in this simple implementation
      }
    }

    return NextResponse.json({
      connected,
      merchantId: user.square_merchant_id || '',
      lastSync: user.last_square_sync,
      syncEnabled: user.square_sync_enabled || false,
      syncFrequency: 24, // Default to 24 hours
      itemsSynced,
      itemsPending,
      itemsFailed
    })
  } catch (error: any) {
    console.error('Square status error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get Square status' }, { status: 500 })
  }
} 
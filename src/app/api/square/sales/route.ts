import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/pg'
import { verifyAuthToken } from '@/lib/auth'

interface SalesData {
  date: string
  totalSales: number
  itemSales: Array<{
    itemId: string
    itemName: string
    quantity: number
    revenue: number
  }>
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAuthToken(req)
    const userUuid = authResult.userUuid as string
    
    if (!userUuid) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Get user's Square tokens
    const userResult = await pool.query(
      'SELECT square_access_token, square_merchant_id FROM user_profiles WHERE user_id = $1',
      [userUuid]
    )

    if (userResult.rows.length === 0 || !userResult.rows[0].square_access_token) {
      return NextResponse.json({ error: 'Square not connected' }, { status: 400 })
    }

    const { square_access_token } = userResult.rows[0]

    // Get yesterday's date
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    // Fetch sales data from Square
    const salesData = await fetchSquareSales(square_access_token, yesterdayStr)

    return NextResponse.json(salesData)
  } catch (error: any) {
    console.error('Sales fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function fetchSquareSales(accessToken: string, date: string): Promise<SalesData> {
  // Get locations first
  const locationsResponse = await fetch('https://connect.squareup.com/v2/locations', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Square-Version': '2024-01-17',
      'Content-Type': 'application/json'
    }
  })

  if (!locationsResponse.ok) {
    throw new Error('Failed to fetch Square locations')
  }

  const locationsData = await locationsResponse.json()
  const locationId = locationsData.locations?.[0]?.id

  if (!locationId) {
    throw new Error('No Square location found')
  }

  // Fetch orders for yesterday
  const ordersResponse = await fetch(`https://connect.squareup.com/v2/orders/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Square-Version': '2024-01-17',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      location_ids: [locationId],
      date_time_filter: {
        created_at: {
          start_at: `${date}T00:00:00Z`,
          end_at: `${date}T23:59:59Z`
        }
      }
    })
  })

  if (!ordersResponse.ok) {
    throw new Error('Failed to fetch Square orders')
  }

  const ordersData = await ordersResponse.json()
  
  // Process orders to get item sales
  const itemSales = new Map<string, { itemId: string; itemName: string; quantity: number; revenue: number }>()
  let totalSales = 0

  for (const order of ordersData.orders || []) {
    if (order.total_money?.amount) {
      totalSales += order.total_money.amount / 100 // Convert from cents
    }

    for (const lineItem of order.line_items || []) {
      const itemId = lineItem.catalog_object_id
      const itemName = lineItem.name || 'Unknown Item'
      const quantity = lineItem.quantity || 0
      const revenue = (lineItem.total_money?.amount || 0) / 100

      if (itemSales.has(itemId)) {
        const existing = itemSales.get(itemId)!
        existing.quantity += quantity
        existing.revenue += revenue
      } else {
        itemSales.set(itemId, { itemId, itemName, quantity, revenue })
      }
    }
  }

  return {
    date,
    totalSales,
    itemSales: Array.from(itemSales.values())
  }
} 
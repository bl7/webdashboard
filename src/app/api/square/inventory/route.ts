import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/pg'
import { verifyAuthToken } from '@/lib/auth'

interface InventoryItem {
  id: string
  name: string
  currentStock: number
  lowStockThreshold: number
  isLowStock: boolean
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

    // Fetch inventory data from Square
    const inventoryData = await fetchSquareInventory(square_access_token)

    return NextResponse.json(inventoryData)
  } catch (error: any) {
    console.error('Inventory fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function fetchSquareInventory(accessToken: string): Promise<{ items: InventoryItem[]; lowStockCount: number }> {
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

  // Fetch inventory counts
  const inventoryResponse = await fetch(`https://connect.squareup.com/v2/inventory/counts/batch-retrieve`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Square-Version': '2024-01-17',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      location_ids: [locationId]
    })
  })

  if (!inventoryResponse.ok) {
    throw new Error('Failed to fetch Square inventory')
  }

  const inventoryData = await inventoryResponse.json()
  
  // Get catalog items to match with inventory
  const catalogResponse = await fetch('https://connect.squareup.com/v2/catalog/list?types=ITEM', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Square-Version': '2024-01-17',
      'Content-Type': 'application/json'
    }
  })

  if (!catalogResponse.ok) {
    throw new Error('Failed to fetch Square catalog')
  }

  const catalogData = await catalogResponse.json()
  const catalogItems = new Map()
  
  for (const item of catalogData.objects || []) {
    if (item.type === 'ITEM') {
      catalogItems.set(item.id, item.item_data?.name || 'Unknown Item')
    }
  }

  // Process inventory counts
  const items: InventoryItem[] = []
  let lowStockCount = 0

  for (const count of inventoryData.counts || []) {
    const itemName = catalogItems.get(count.catalog_object_id) || 'Unknown Item'
    const currentStock = parseInt(count.quantity) || 0
    const lowStockThreshold = 10 // Default threshold, could be configurable
    const isLowStock = currentStock <= lowStockThreshold

    if (isLowStock) {
      lowStockCount++
    }

    items.push({
      id: count.catalog_object_id,
      name: itemName,
      currentStock,
      lowStockThreshold,
      isLowStock
    })
  }

  return {
    items: items.filter(item => item.isLowStock), // Only return low stock items
    lowStockCount
  }
} 
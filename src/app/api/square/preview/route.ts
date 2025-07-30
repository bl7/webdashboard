import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/pg'
import { verifyAuthToken } from '@/lib/auth'
import { getAllCustomAllergens, getAllIngredients, getAllMenuItems } from '@/lib/api'

interface SquareItem {
  id: string
  type: 'ITEM' | 'ITEM_VARIATION' | 'CATEGORY'
  item_data?: {
    name: string
    description?: string
    category_id?: string
    variations?: any[]
    custom_attribute_values?: Record<string, any>
  }
}

interface PreviewResult {
  itemsProcessed: number
  itemsToCreate: number
  itemsToSkip: number
  items: Array<{
    name: string
    description: string
    ingredients: string[]
    allergens: string[]
    action: 'create' | 'skip'
  }>
}

// Normalize name function (same as sync process)
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/ies$/, "y") // berries -> berry
    .replace(/ves$/, "f") // leaves -> leaf
    .replace(/es$/, "") // tomatoes -> tomato
    .replace(/s$/, "") // eggs -> egg
}

function extractIngredientsAndAllergens(description: string): { ingredients: string[], allergens: string[] } {
  const ingredients: string[] = []
  const allergens: string[] = []
  
  // Standard allergen mapping (like upload process)
  const allergenKeywords = {
    'gluten': ['wheat', 'barley', 'rye', 'oats', 'flour', 'bread', 'pasta'],
    'milk': ['milk', 'dairy', 'cheese', 'cream', 'butter', 'yogurt', 'coconut milk'],
    'eggs': ['egg', 'mayonnaise', 'custard'],
    'fish': ['fish', 'salmon', 'tuna', 'cod', 'fish sauce'],
    'peanuts': ['peanut', 'groundnut'],
    'soy': ['soy', 'soya', 'tofu'],
    'nuts': ['almond', 'walnut', 'cashew', 'pistachio', 'nuts', 'nut'],
    'celery': ['celery'],
    'mustard': ['mustard'],
    'sesame': ['sesame', 'tahini'],
    'sulphites': ['sulphite', 'sulfite'],
    'lupin': ['lupin'],
    'molluscs': ['mollusc', 'mussel', 'oyster'],
    'crustaceans': ['shrimp', 'prawn', 'crab', 'lobster']
  }

  const lowerDescription = description.toLowerCase()
  
  // Extract allergens (like upload process)
  for (const [allergen, keywords] of Object.entries(allergenKeywords)) {
    for (const keyword of keywords) {
      if (lowerDescription.includes(keyword)) {
        allergens.push(allergen)
        break
      }
    }
  }

  // Extract ingredients (improved pattern matching)
  const ingredientPatterns = [
    /ingredients?:\s*([^\.]+)/i,
    /contains?:\s*([^\.]+)/i,
    /made with:\s*([^\.]+)/i,
    /with\s+([^\.]+)/i,
    /([^\.]+)\s+curry/i,
    /curry\s+([^\.]+)/i
  ]

  for (const pattern of ingredientPatterns) {
    const match = description.match(pattern)
    if (match) {
      const ingredientList = match[1].split(/[,\s]+/).map(item => item.trim()).filter(item => item.length > 2)
      ingredients.push(...ingredientList)
      break
    }
  }

  // If no ingredients found with patterns, extract meaningful words
  if (ingredients.length === 0) {
    const words = description.toLowerCase().split(/\s+/)
    const commonIngredients = [
      'curry', 'nuts', 'ox', 'mad', 'sauted', 'boiled', 'rice', 'chicken', 'beef', 'lamb', 'fish',
      'vegetables', 'onion', 'garlic', 'ginger', 'tomato', 'potato', 'carrot', 'peas', 'beans',
      'coconut', 'lemongrass', 'chili', 'peppers', 'turmeric', 'coriander', 'cumin', 'brown', 'sugar', 'lime'
    ]
    
    for (const word of words) {
      if (commonIngredients.includes(word) && word.length > 2) {
        ingredients.push(word)
      }
    }
  }

  return { ingredients, allergens }
}

async function fetchSquareCatalog(accessToken: string, locationId?: string): Promise<SquareItem[]> {
  const params = new URLSearchParams({
    types: 'ITEM,ITEM_VARIATION,CATEGORY'
  })
  
  if (locationId) {
    params.append('location_ids', locationId)
  }

  const response = await fetch(`https://connect.squareup.com/v2/catalog/list?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Square-Version': '2024-01-17',
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to fetch Square catalog: ${error.errors?.[0]?.detail || 'Unknown error'}`)
  }

  const data = await response.json()
  return data.objects || []
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyAuthToken(req)
    const userUuid = authResult.userUuid as string
    const body = await req.json()
    const { location_id } = body || {}
    
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

    const { square_access_token, square_merchant_id } = userResult.rows[0]

    // Get the user's token for API calls
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || ''

    // Pre-load existing data for comparison
    const existingAllergens = await getAllCustomAllergens(token)
    const existingIngredients = await getAllIngredients(token)
    const existingMenuItems = await getAllMenuItems(token)

    // Create ID maps for quick lookups
    const menuItemIdMap = new Map<string, string>()
    if (existingMenuItems && Array.isArray(existingMenuItems)) {
      for (const menuItem of existingMenuItems) {
        const key1 = menuItem.menuItemName.toLowerCase()
        const key2 = normalizeName(menuItem.menuItemName)
        menuItemIdMap.set(key1, menuItem.menuItemID)
        menuItemIdMap.set(key2, menuItem.menuItemID)
      }
    }

    // Fetch Square catalog items
    const squareItems = await fetchSquareCatalog(square_access_token, location_id)
    
    const result: PreviewResult = {
      itemsProcessed: 0,
      itemsToCreate: 0,
      itemsToSkip: 0,
      items: []
    }

    // Process each Square item
    for (const squareItem of squareItems) {
      if (squareItem.type !== 'ITEM') continue

      const itemName = squareItem.item_data?.name || 'Unknown Item'
      const description = squareItem.item_data?.description || ''
      const { ingredients, allergens } = extractIngredientsAndAllergens(description)
      
      // Check if menu item already exists
      const normalizedItemName = normalizeName(itemName)
      const existingMenuItemId = menuItemIdMap.get(itemName.toLowerCase()) || menuItemIdMap.get(normalizedItemName)
      
      const action = existingMenuItemId ? 'skip' : 'create'
      
      if (action === 'create') {
        result.itemsToCreate++
      } else {
        result.itemsToSkip++
      }
      
      result.items.push({
        name: itemName,
        description: description,
        ingredients: ingredients,
        allergens: allergens,
        action: action
      })
      
      result.itemsProcessed++
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Preview error:', error)
    return NextResponse.json({ error: error.message || 'Preview failed' }, { status: 500 })
  }
} 
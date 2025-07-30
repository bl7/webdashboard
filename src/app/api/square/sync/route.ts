import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/pg'
import { verifyAuthToken } from '@/lib/auth'
import { addCustomAllergen, addIngredient, addMenuItems, getAllCustomAllergens, getAllIngredients, getAllMenuItems } from '@/lib/api'
import { extractIngredientsAndAllergensSmart } from '@/lib/smartIngredientExtractor'

// Normalize name function (same as upload process)
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

// Type-safe find functions for each data type
function findExistingAllergen(searchName: string, allergens: any[]): any | undefined {
  if (!searchName?.trim()) return undefined;
  const normalizedSearch = searchName.trim().toLowerCase();
  return allergens.find((item) => item.name?.trim().toLowerCase() === normalizedSearch);
}

function findExistingIngredient(searchName: string, ingredients: any[]): any | undefined {
  if (!searchName?.trim()) return undefined;
  const normalizedSearch = searchName.trim().toLowerCase();
  return ingredients.find((item) => item.ingredientName?.trim().toLowerCase() === normalizedSearch);
}

function findExistingMenuItem(searchName: string, menuItems: any[]): any | undefined {
  if (!searchName?.trim()) return undefined;
  const normalizedSearch = searchName.trim().toLowerCase();
  return menuItems.find((item) => item.menuItemName?.trim().toLowerCase() === normalizedSearch);
}

interface SquareItem {
  id: string
  type: 'ITEM' | 'ITEM_VARIATION' | 'CATEGORY' | 'MODIFIER' | 'MODIFIER_LIST'
  item_data?: {
    name: string
    description?: string
    category_id?: string
    variations?: any[]
    custom_attribute_values?: Record<string, any>
    modifier_list_info?: Array<{
      modifier_list_id: string
      enabled: boolean
    }>
  }
  modifier_list_data?: {
    name: string
    description?: string
    selection_type?: string
    modifiers?: Array<{
      type: 'MODIFIER'
      id: string
      modifier_data?: {
        name: string
        description?: string
        custom_attribute_values?: Record<string, any>
      }
    }>
  }
}

interface SyncResult {
  success: boolean
  itemsProcessed: number
  itemsCreated: number
  itemsFailed: number
  errors: string[]
  duration: number
  stats: {
    allergens: { existing: number; created: number }
    ingredients: { existing: number; created: number }
    menuItems: { existing: number; created: number; skipped: number }
  }
  warnings: string[]
  syncedItems: Array<{
    name: string
    ingredients: string[]
    allergens: string[]
    status: 'created' | 'skipped'
  }>
  failedItems: Array<{
    name: string
    error: string
  }>
  existingItems: {
    allergens: { name: string; id: string }[]
    ingredients: { name: string; id: string }[]
    menuItems: { name: string; id: string }[]
  }
  newItems: {
    allergens: { name: string; id: string }[]
    ingredients: { name: string; id: string }[]
    menuItems: { name: string; id: string; ingredientIds: string[] }[]
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  const result: SyncResult = {
    success: false,
    itemsProcessed: 0,
    itemsCreated: 0,
    itemsFailed: 0,
    errors: [],
    duration: 0,
    stats: {
      allergens: { existing: 0, created: 0 },
      ingredients: { existing: 0, created: 0 },
      menuItems: { existing: 0, created: 0, skipped: 0 },
    },
    warnings: [],
    syncedItems: [],
    failedItems: [],
    existingItems: {
      allergens: [],
      ingredients: [],
      menuItems: [],
    },
    newItems: {
      allergens: [],
      ingredients: [],
      menuItems: [],
    }
  }

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

    // ========== STEP 1: PRE-LOAD ALL EXISTING DATA ==========
    
    // Pre-load existing allergens (same as upload page)
    const existingAllergensResponse = await getAllCustomAllergens(token)
    const existingAllergens = existingAllergensResponse?.data || []
    
    // Map allergens to the same structure as upload page
    const localAllergens = existingAllergens.map((item: any) => ({
      id: item.uuid,
      name: item.allergenName,
      category: item.isCustom ? "Custom" : "Standard",
      severity: "Medium" as const,
      status: item.isActive ? "Active" : "Inactive" as const,
      addedAt: item.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
      isCustom: item.isCustom,
    }))
    
    const allergenIdMap = new Map<string, string>()
    for (const allergen of localAllergens) {
      if (!allergen?.name) continue
      const key1 = allergen.name.toLowerCase()
      const key2 = normalizeName(allergen.name)
      allergenIdMap.set(key1, allergen.id)
      allergenIdMap.set(key2, allergen.id)
    }

    // Pre-load existing ingredients (same as upload page)
    const existingIngredientsResponse = await getAllIngredients(token)
    const existingIngredients = Array.isArray(existingIngredientsResponse) ? existingIngredientsResponse : existingIngredientsResponse?.data || []
    
    // Map ingredients to the same structure as upload page
    const localIngredients = existingIngredients.map((item: any) => ({
      uuid: item.uuid,
      ingredientName: item.ingredientName,
      expiryDays: item.expiryDays || 7,
      allergens: item.allergens || [],
    }))
    
    const ingredientIdMap = new Map<string, string>()
    for (const ingredient of localIngredients) {
      if (!ingredient?.ingredientName) continue
      const key1 = ingredient.ingredientName.toLowerCase()
      const key2 = normalizeName(ingredient.ingredientName)
      ingredientIdMap.set(key1, ingredient.uuid)
      ingredientIdMap.set(key2, ingredient.uuid)
    }

    // Pre-load existing menu items (same as upload page)
    const existingMenuItemsResponse = await getAllMenuItems(token)
    const existingMenuItems = existingMenuItemsResponse?.data || []
    
    // Flatten menu items to the same structure as upload page
    const localMenuItems: any[] = []
    for (const category of existingMenuItems) {
      if (!category.items) continue
      for (const item of category.items) {
        localMenuItems.push({
          menuItemID: item.menuItemID,
          menuItemName: item.menuItemName,
          expiryDays: item.expiryDays,
          categoryID: item.categoryID,
          ingredients: item.ingredients || [],
          allergens: item.allergens || [],
        })
      }
    }
    
    const menuItemIdMap = new Map<string, string>()
    for (const menuItem of localMenuItems) {
      if (!menuItem?.menuItemName) continue
      const key1 = menuItem.menuItemName.toLowerCase()
      const key2 = normalizeName(menuItem.menuItemName)
      menuItemIdMap.set(key1, menuItem.menuItemID)
      menuItemIdMap.set(key2, menuItem.menuItemID)
    }

    // Fetch Square catalog items
    const squareItems = await fetchSquareCatalog(square_access_token, location_id)
    result.itemsProcessed = squareItems.length

    // ========== STEP 2: COLLECT ALL REQUIRED ALLERGENS AND INGREDIENTS ==========
    console.log("Collecting all required allergens and ingredients...")
    
    // Collect all allergens from Square items
    const allRequiredAllergens = new Set<string>()
    const allRequiredIngredients = new Map<string, { expiryDays: number; allergenNames: string[] }>()
    
    // Process each Square item to collect requirements
    for (const squareItem of squareItems) {
      if (squareItem.type === 'MODIFIER_LIST') {
        // PRIORITY 1: Extract ingredients from MODIFIER_LIST objects (structured data)
        const modifierListName = squareItem.modifier_list_data?.name || ''
        
        // Check if this is an ingredient modifier list (starts with "Ingredients - ")
        if (modifierListName.startsWith('Ingredients - ')) {
          const ingredientName = modifierListName.replace('Ingredients - ', '')
          console.log(`🔍 Found ingredient modifier list: "${ingredientName}"`)
          
          if (!allRequiredIngredients.has(ingredientName)) {
            allRequiredIngredients.set(ingredientName, {
              expiryDays: 7, // Default expiry days
              allergenNames: [] // Will be populated based on ingredient name matching
            })
          }
          
          // Extract allergens from the modifier list description
          const description = squareItem.modifier_list_data?.description || ''
          const { allergens } = extractIngredientsAndAllergensSmart(description)
          allergens.forEach(allergen => allRequiredAllergens.add(allergen))
        }
      } else if (squareItem.type === 'ITEM') {
        // PRIORITY 2: Extract from item descriptions only if no structured data available
        const itemName = squareItem.item_data?.name || 'Unknown Item'
        const description = squareItem.item_data?.description || ''
        
        // Only extract from description if no linked modifier lists
        if (!squareItem.item_data?.modifier_list_info || squareItem.item_data.modifier_list_info.length === 0) {
          const { ingredients, allergens, confidence } = extractIngredientsAndAllergensSmart(description)
          
          // Add allergens to required set
          allergens.forEach(allergen => allRequiredAllergens.add(allergen))
          
          // Add ingredients with default values
          ingredients.forEach(ingredientName => {
            if (!allRequiredIngredients.has(ingredientName)) {
              allRequiredIngredients.set(ingredientName, {
                expiryDays: 7, // Default expiry days
                allergenNames: [] // Will be populated based on ingredient name matching
              })
            }
          })
        } else {
          console.log(`📋 Item "${itemName}" has linked modifier lists - skipping description extraction`)
        }
      }
    }
    
    // Resolve allergen-ingredient relationships based on name matching
    allRequiredIngredients.forEach((ingredientData, ingredientName) => {
      const lowerIngredient = ingredientName.toLowerCase()
      for (const allergenName of allRequiredAllergens) {
        if (lowerIngredient.includes(allergenName.toLowerCase())) {
          ingredientData.allergenNames.push(allergenName)
        }
      }
    })

    // ========== STEP 3: PROCESS ALLERGENS ==========
    console.log("Processing allergens...")

    for (const allergenName of allRequiredAllergens) {
      if (!allergenName?.trim()) continue

      const existingAllergen = findExistingAllergen(allergenName, localAllergens)

      if (existingAllergen && existingAllergen.id) {
        const key1 = allergenName.toLowerCase()
        const key2 = normalizeName(allergenName)
        allergenIdMap.set(key1, existingAllergen.id)
        allergenIdMap.set(key2, existingAllergen.id)
        result.stats.allergens.existing++
        console.log(`✓ Found existing allergen: "${allergenName}"`)
        result.existingItems.allergens.push({ name: existingAllergen.name, id: existingAllergen.id })
      } else {
        console.log(`+ Creating new allergen: "${allergenName}"`)
        const allergenId = await createOrGetAllergen(allergenName, token)
        if (allergenId) {
          // Add to localAllergens for immediate lookup
          localAllergens.push({
            id: allergenId,
            name: allergenName,
            category: "Custom" as const,
            severity: "Medium" as const,
            status: "Active" as const,
            addedAt: new Date().toISOString().split("T")[0],
            isCustom: true,
          })
          
          const key1 = allergenName.toLowerCase()
          const key2 = normalizeName(allergenName)
          allergenIdMap.set(key1, allergenId)
          allergenIdMap.set(key2, allergenId)
          result.stats.allergens.created++
          console.log(`✓ Created allergen: "${allergenName}"`)
          result.newItems.allergens.push({ name: allergenName, id: allergenId })
        }
      }
    }

    // ========== STEP 4: PROCESS INGREDIENTS ==========
    console.log("Processing ingredients...")

    for (const [ingredientName, ingredientData] of allRequiredIngredients) {
      if (!ingredientName?.trim()) continue

      const existingIngredient = findExistingIngredient(ingredientName, localIngredients)

      if (existingIngredient && existingIngredient.uuid) {
        const key1 = ingredientName.toLowerCase()
        const key2 = normalizeName(ingredientName)
        ingredientIdMap.set(key1, existingIngredient.uuid)
        ingredientIdMap.set(key2, existingIngredient.uuid)
        result.stats.ingredients.existing++
        console.log(`✓ Found existing ingredient: "${ingredientName}"`)
        result.existingItems.ingredients.push({ name: existingIngredient.ingredientName, id: existingIngredient.uuid })
      } else {
        console.log(`+ Creating new ingredient: "${ingredientName}"`)

        // Resolve allergen IDs for this ingredient
        const resolvedAllergenIds: string[] = []

        for (const allergenName of ingredientData.allergenNames) {
          if (!allergenName?.trim()) continue

          // Try direct lookup first
          let allergenId =
            allergenIdMap.get(allergenName.toLowerCase()) ||
            allergenIdMap.get(normalizeName(allergenName))

          if (!allergenId) {
            // Try fuzzy matching against existing allergens
            const existingAllergen = findExistingAllergen(allergenName, localAllergens)
            if (existingAllergen) {
              allergenId = existingAllergen.id
              allergenIdMap.set(allergenName.toLowerCase(), existingAllergen.id)
              allergenIdMap.set(normalizeName(allergenName), existingAllergen.id)
            }
          }

          if (allergenId) {
            resolvedAllergenIds.push(allergenId)
          } else {
            console.warn(`Warning: Could not resolve allergen "${allergenName}" for ingredient "${ingredientName}"`)
            result.warnings.push(`Could not resolve allergen "${allergenName}" for ingredient "${ingredientName}"`)
          }
        }

        // Create new ingredient
        const ingredientId = await createOrGetIngredient(ingredientName, resolvedAllergenIds, token)
        if (ingredientId) {
          // Add to localIngredients for immediate lookup
          localIngredients.push({
            uuid: ingredientId,
            ingredientName: ingredientName,
            expiryDays: ingredientData.expiryDays,
            allergens: resolvedAllergenIds.map(id => ({ uuid: id, allergenName: '' })), // Simplified
          })
          
          const key1 = ingredientName.toLowerCase()
          const key2 = normalizeName(ingredientName)
          ingredientIdMap.set(key1, ingredientId)
          ingredientIdMap.set(key2, ingredientId)
          result.stats.ingredients.created++
          console.log(`✓ Created ingredient: "${ingredientName}"`)
          result.newItems.ingredients.push({ name: ingredientName, id: ingredientId })
        } else {
          result.warnings.push(`Failed to create ingredient: ${ingredientName}`)
        }
      }
    }

      // ========== STEP 5: PROCESS MENU ITEMS ==========
  console.log("Processing menu items...")

  for (const squareItem of squareItems) {
    if (squareItem.type !== 'ITEM') continue

    const itemName = squareItem.item_data?.name || 'Unknown Item'
    const description = squareItem.item_data?.description || ''
    const { ingredients, allergens, confidence } = extractIngredientsAndAllergensSmart(description)

      try {
        const syncResult = await processSquareItem(squareItem, token, allergenIdMap, ingredientIdMap, menuItemIdMap, localAllergens, localIngredients, localMenuItems, result)
        if (syncResult.created) {
          result.itemsCreated++
          result.syncedItems.push({
            name: itemName,
            ingredients: ingredients,
            allergens: allergens,
            status: 'created'
          })
        } else {
          result.syncedItems.push({
            name: itemName,
            ingredients: ingredients,
            allergens: allergens,
            status: 'skipped'
          })
        }
      } catch (error: any) {
        result.itemsFailed++
        result.failedItems.push({
          name: itemName,
          error: error.message
        })
        result.errors.push(`Failed to process ${itemName}: ${error.message}`)
      }
    }

    // Update last sync time
    await pool.query(
      'UPDATE user_profiles SET last_square_sync = NOW() WHERE user_id = $1',
      [userUuid]
    )

    // Log sync result
    await pool.query(
      `INSERT INTO square_sync_logs (user_id, sync_type, status, items_processed, items_created, items_failed, error_message, completed_at, duration_ms)
       VALUES ($1, 'menu_items', $2, $3, $4, $5, $6, NOW(), $7)`,
      [
        userUuid,
        result.itemsFailed === 0 ? 'success' : 'failed',
        result.itemsProcessed,
        result.itemsCreated,
        result.itemsFailed,
        result.errors.join('; '),
        Date.now() - startTime
      ]
    )

    result.success = result.itemsFailed === 0
    result.duration = Date.now() - startTime

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Sync error details:', error)
    console.error('Sync error stack:', error.stack)
    result.errors.push(`Sync failed: ${error.message}`)
    result.duration = Date.now() - startTime
    return NextResponse.json(result, { status: 500 })
  }
}

async function fetchSquareCatalog(accessToken: string, locationId?: string): Promise<SquareItem[]> {
  const params = new URLSearchParams({
    types: 'ITEM,ITEM_VARIATION,CATEGORY,MODIFIER,MODIFIER_LIST'
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
    console.error('Square API error:', error)
    throw new Error(`Failed to fetch Square catalog: ${error.errors?.[0]?.detail || 'Unknown error'}`)
  }

  const data = await response.json()
  return data.objects || []
}

async function processSquareItem(
  squareItem: SquareItem, 
  token: string, 
  allergenIdMap: Map<string, string>,
  ingredientIdMap: Map<string, string>,
  menuItemIdMap: Map<string, string>,
  localAllergens: any[],
  localIngredients: any[],
  localMenuItems: any[],
  result: SyncResult
): Promise<{ created: boolean }> {
  const itemName = squareItem.item_data?.name || 'Unknown Item'
  
  // ========== STEP 1: CHECK IF MENU ITEM EXISTS ==========
  const existingMenuItem = findExistingMenuItem(itemName, localMenuItems || [])
  
  if (existingMenuItem) {
    console.log(`✓ Found existing menu item: "${itemName}" - skipping`)
    result.stats.menuItems.existing++
    result.existingItems.menuItems.push({ name: existingMenuItem.menuItemName, id: existingMenuItem.menuItemID })
    return { created: false }
  }
  
  // ========== STEP 2: EXTRACT INGREDIENTS FROM STRUCTURED MODIFIER DATA ==========
  const description = squareItem.item_data?.description || ''
  const linkedIngredients: string[] = []
  const linkedAllergens: string[] = []
  
  // Extract ingredients from linked modifier lists (Square's structured approach)
  if (squareItem.item_data?.modifier_list_info) {
    console.log(`  🔗 Found ${squareItem.item_data.modifier_list_info.length} linked modifier lists`)
    
    // For each linked modifier list, we need to find the corresponding ingredient
    // This would require a second pass through the catalog to find the modifier list details
    // For now, we'll rely on the description extraction as fallback
  }
  
  // Only use description extraction as fallback if no structured data is available
  let allIngredients: string[] = []
  let allAllergens: string[] = []
  
  if (linkedIngredients.length > 0) {
    // Use structured modifier data (preferred)
    allIngredients = linkedIngredients
    allAllergens = linkedAllergens
    console.log(`  📋 Using structured modifier data: ${allIngredients.join(", ")}`)
  } else {
    // Fallback to description extraction (less reliable)
    const { ingredients: descriptionIngredients, allergens: descriptionAllergens } = extractIngredientsAndAllergensSmart(description)
    allIngredients = descriptionIngredients
    allAllergens = descriptionAllergens
    console.log(`  📝 Using description extraction (fallback): ${allIngredients.join(", ")}`)
  }
  
  console.log(`Processing "${itemName}":`)
  console.log(`  Description: "${description}"`)
  console.log(`  Ingredients: ${allIngredients.join(", ")}`)
  console.log(`  Allergens: ${allAllergens.join(", ")}`)
  
  // Skip items with no ingredients (either structured or extracted)
  if (allIngredients.length === 0) {
    console.log(`⚠ Skipping "${itemName}" - no ingredients found`)
    result.stats.menuItems.skipped++
    result.warnings.push(`No ingredients found for menu item "${itemName}"`)
    return { created: false }
  }
  
  // ========== STEP 3: PROCESS ALLERGENS AND CREATE INGREDIENTS ==========
  const resolvedIngredientIds: string[] = []
  const foundIngredients: string[] = []
  const createdIngredients: string[] = []

  // First, resolve allergen IDs for the extracted allergens
  const allergenIds: string[] = []
  for (const allergenName of allAllergens) {
    const allergenId = await createOrGetAllergen(allergenName, token)
    if (allergenId) {
      allergenIds.push(allergenId)
      console.log(`  ✓ Resolved allergen: ${allergenName}`)
    } else {
      console.log(`  ⚠ Could not resolve allergen: ${allergenName}`)
    }
  }

  // Process each ingredient
  for (const ingredientName of allIngredients) {
    if (!ingredientName?.trim()) continue

    // Try direct lookup first
    let ingredientId: string | undefined =
      ingredientIdMap.get(ingredientName.toLowerCase()) ||
      ingredientIdMap.get(normalizeName(ingredientName))

    if (!ingredientId) {
      // Try fuzzy matching against existing ingredients
      const existingIngredient = findExistingIngredient(ingredientName, localIngredients)
      if (existingIngredient && existingIngredient.uuid) {
        ingredientId = existingIngredient.uuid
        ingredientIdMap.set(ingredientName.toLowerCase(), existingIngredient.uuid)
        ingredientIdMap.set(normalizeName(ingredientName), existingIngredient.uuid)
        console.log(`  ✓ Found existing ingredient: ${ingredientName}`)
      }
    }

    if (!ingredientId) {
      // Create new ingredient with allergen associations
      console.log(`  + Creating new ingredient: ${ingredientName}`)
      const newIngredientId = await createOrGetIngredient(ingredientName, allergenIds, token)
      if (newIngredientId) {
        ingredientId = newIngredientId
        ingredientIdMap.set(ingredientName.toLowerCase(), ingredientId)
        ingredientIdMap.set(normalizeName(ingredientName), ingredientId)
        createdIngredients.push(ingredientName)
        console.log(`  ✓ Created ingredient: ${ingredientName}`)
      }
    }

    if (ingredientId) {
      resolvedIngredientIds.push(ingredientId)
      foundIngredients.push(ingredientName)
    } else {
      console.log(`  ⚠ Could not create/find ingredient: ${ingredientName}`)
      result.warnings.push(`Could not resolve ingredient "${ingredientName}" for menu item "${itemName}"`)
    }
  }

  console.log(`  Found ingredients: ${foundIngredients.join(", ")}`)
  
  // ========== STEP 4: CREATE MENU ITEM ==========
  if (resolvedIngredientIds.length === 0) {
    console.log(`⚠ No ingredients resolved for menu item "${itemName}" - skipping`)
    result.stats.menuItems.skipped++
    result.warnings.push(`No ingredients could be resolved for menu item "${itemName}"`)
    return { created: false }
  }

  console.log(`+ Creating new menu item: "${itemName}" with ${resolvedIngredientIds.length} ingredients`)
  const created = await createMenuItem(itemName, resolvedIngredientIds, token)
  
  if (created) {
    console.log(`✓ Created menu item: "${itemName}"`)
    result.stats.menuItems.created++
    result.newItems.menuItems.push({ 
      name: itemName, 
      id: resolvedIngredientIds[0], 
      ingredientIds: resolvedIngredientIds 
    })
  } else {
    result.stats.menuItems.skipped++
    result.warnings.push(`Failed to create menu item: ${itemName}`)
  }
  
  return { created }
}



async function createOrGetAllergen(allergenName: string, token: string): Promise<string | null> {
  try {
    // Only use standard allergens - don't create custom ones
    const standardAllergens = [
      'gluten', 'milk', 'eggs', 'fish', 'peanuts', 'soy', 'nuts', 
      'celery', 'mustard', 'sesame', 'sulphites', 'lupin', 'molluscs', 'crustaceans'
    ]
    
    if (!standardAllergens.includes(allergenName.toLowerCase())) {
      console.log(`Skipping non-standard allergen: ${allergenName}`)
      return null
    }
    
    // Check if standard allergen exists in the system
    const existingResult = await pool.query(
      'SELECT uuid FROM allergens WHERE LOWER(allergen_name) = LOWER($1)',
      [allergenName]
    )
    
    if (existingResult.rows.length > 0) {
      return existingResult.rows[0].uuid
    }
    
    // If not found in standard allergens, try custom allergens as fallback
    const customResult = await pool.query(
      'SELECT uuid FROM custom_allergens WHERE LOWER(allergen_name) = LOWER($1) AND user_id = $2',
      [allergenName, token]
    )
    
    if (customResult.rows.length > 0) {
      return customResult.rows[0].uuid
    }
    
    return null
  } catch (error: any) {
    console.error(`Error getting allergen ${allergenName}:`, error)
    return null
  }
}

async function createOrGetIngredient(ingredientName: string, allergenIds: string[], token: string): Promise<string | null> {
  try {
    // Clean up ingredient name
    const cleanIngredientName = ingredientName.trim().toLowerCase()
    
    // Skip if ingredient name is too short or generic
    if (cleanIngredientName.length < 3 || 
        ['and', 'or', 'the', 'a', 'an', 'with', 'made', 'contains', 'ingredients'].includes(cleanIngredientName)) {
      console.log(`Skipping generic ingredient: ${ingredientName}`)
      return null
    }
    
    const result = await addIngredient({
      ingredientName: ingredientName.trim(),
      expiryDays: 7, // Default 7 days expiry
      allergenIDs: allergenIds.filter(id => id !== null) // Filter out null allergen IDs
    }, token)
    
    return result.data?.uuid || result.data?.id || null
  } catch (error: any) {
    // If ingredient already exists, try to get it from the database
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      const existingResult = await pool.query(
        'SELECT uuid FROM ingredients WHERE LOWER(ingredient_name) = LOWER($1) AND user_id = (SELECT user_id FROM user_profiles WHERE user_id = $2)',
        [ingredientName, token]
      )
      if (existingResult.rows.length > 0) {
        return existingResult.rows[0].uuid
      }
    }
    return null
  }
}



async function createMenuItem(itemName: string, ingredientIds: string[], token: string): Promise<boolean> {
  try {
    const result = await addMenuItems({
      menuItemName: itemName,
      ingredientIDs: ingredientIds || []
    }, token)
    
    return true // Item was created
  } catch (error: any) {
    // If menu item already exists, return false (skipped)
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      return false
    }
    // Check if it's the "Something missing" error
    if (error.message.includes('Something missing')) {
      return false
    }
    throw error
  }
}
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/pg'
import { verifyAuthToken } from '@/lib/auth'
import { getAllCustomAllergens, getAllIngredients, getAllMenuItems } from '@/lib/api'
import { createSquareItemWithDietaryRestrictions, createSquareModifierWithDietaryRestrictions, createComprehensiveAllergenAttributes } from '@/lib/squareAllergenMapping'
import { createSquareItem as createSquareItemStructure, createSquareCategory as createSquareCategoryStructure, createIngredientAsModifier, createSquareModifier, SQUARE_API_ENDPOINTS } from '@/lib/squareApiStructure'

interface SquareCatalogItem {
  id?: string
  type: 'ITEM' | 'CATEGORY' | 'MODIFIER' | 'MODIFIER_LIST'
  item_data?: {
    name: string
    description?: string
    category_id?: string
    variations?: any[]
    custom_attribute_values?: Record<string, any>
  }
  category_data?: {
    name: string
  }
  modifier_data?: {
    name: string
    description?: string
    custom_attribute_values?: Record<string, any>
  }
  modifier_list_data?: {
    name: string
    description?: string
    selection_type?: string
    modifiers?: any[]
  }
}

interface SyncToSquareResult {
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
    type: 'allergen' | 'ingredient' | 'menuItem'
    status: 'created' | 'skipped' | 'failed'
    squareId?: string
  }>
  failedItems: Array<{
    name: string
    type: 'allergen' | 'ingredient' | 'menuItem'
    error: string
  }>
}

// Normalize name function for consistent matching
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

// Check if Square item already exists
function findExistingSquareItem(searchName: string, squareItems: SquareCatalogItem[]): SquareCatalogItem | undefined {
  if (!searchName?.trim()) return undefined;
  const normalizedSearch = normalizeName(searchName);
  console.log(`🔍 SYNC TO SQUARE: Looking for item: "${searchName}" (normalized: "${normalizedSearch}")`);
  
  const found = squareItems.find((item) => {
    const itemName = item.item_data?.name || item.category_data?.name || item.modifier_data?.name || item.modifier_list_data?.name;
    const normalizedItemName = itemName ? normalizeName(itemName) : '';
    const matches = itemName && normalizedItemName === normalizedSearch;
    
    if (matches) {
      console.log(`✅ SYNC TO SQUARE: Found existing item: "${itemName}" (type: ${item.type})`);
    }
    
    return matches;
  });
  
  if (!found) {
    console.log(`❌ SYNC TO SQUARE: No existing item found for: "${searchName}"`);
  }
  
  return found;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  console.log('🚀 SYNC TO SQUARE: Starting export process...')
  
  const result: SyncToSquareResult = {
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
  }

  try {
    const authResult = await verifyAuthToken(req)
    const userUuid = authResult.userUuid as string
    const body = await req.json()
    const { location_id, syncOptions = {} } = body || {}
    
    console.log('🔐 SYNC TO SQUARE: Authentication successful for user:', userUuid)
    console.log('📋 SYNC TO SQUARE: Request body:', { location_id, syncOptions })
    
    if (!userUuid) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Get user's Square tokens
    console.log('🔑 SYNC TO SQUARE: Fetching Square tokens for user...')
    const userResult = await pool.query(
      'SELECT square_access_token, square_merchant_id FROM user_profiles WHERE user_id = $1',
      [userUuid]
    )

    if (userResult.rows.length === 0 || !userResult.rows[0].square_access_token) {
      console.log('❌ SYNC TO SQUARE: Square not connected for user:', userUuid)
      return NextResponse.json({ error: 'Square not connected' }, { status: 400 })
    }

    const { square_access_token, square_merchant_id } = userResult.rows[0]
    console.log('✅ SYNC TO SQUARE: Square tokens found. Merchant ID:', square_merchant_id)
    console.log('🔑 SYNC TO SQUARE: Access token length:', square_access_token?.length || 0)

    // Get the user's token for API calls
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || ''

    // ========== STEP 1: FETCH EXISTING SQUARE CATALOG ==========
    console.log("📥 SYNC TO SQUARE: Fetching existing Square catalog...")
    const existingSquareItems = await fetchSquareCatalog(square_access_token, location_id)
    console.log(`📊 SYNC TO SQUARE: Found ${existingSquareItems.length} existing items in Square catalog`)
    
    // Log existing items for debugging
    const existingItems = existingSquareItems.map(item => ({
      type: item.type,
      name: item.item_data?.name || item.category_data?.name || item.modifier_data?.name || item.modifier_list_data?.name
    }))
    console.log(`🔍 SYNC TO SQUARE: Existing Square items:`, existingItems.slice(0, 5)) // Show first 5
    
    result.itemsProcessed = existingSquareItems.length

    // ========== STEP 2: FETCH OUR DATA ==========
    console.log("📥 SYNC TO SQUARE: Fetching our local data...")
    
    // Fetch allergens
    console.log("🔍 SYNC TO SQUARE: Fetching allergens...")
    const allergensResponse = await getAllCustomAllergens(token)
    const allergens = allergensResponse?.data || []
    console.log(`📊 SYNC TO SQUARE: Found ${allergens.length} allergens`)
    console.log("🔍 SYNC TO SQUARE: Sample allergen data:", allergens.slice(0, 2))
    
    // Fetch ingredients
    console.log("🔍 SYNC TO SQUARE: Fetching ingredients...")
    const ingredientsResponse = await getAllIngredients(token)
    const ingredients = Array.isArray(ingredientsResponse) ? ingredientsResponse : (ingredientsResponse?.data || [])
    console.log(`📊 SYNC TO SQUARE: Found ${ingredients?.length || 0} ingredients`)
    console.log("🔍 SYNC TO SQUARE: Sample ingredient data:", ingredients?.slice(0, 2) || [])
    
    // Fetch menu items
    console.log("🔍 SYNC TO SQUARE: Fetching menu items...")
    const menuItemsResponse = await getAllMenuItems(token)
    const menuItems = menuItemsResponse?.data || []
    console.log(`📊 SYNC TO SQUARE: Found ${menuItems?.length || 0} menu item categories`)
    console.log("🔍 SYNC TO SQUARE: Sample menu items data:", menuItems?.slice(0, 2) || [])

    // ========== STEP 3: SYNC ALLERGENS TO SQUARE ==========
    // Note: Square has their own allergen system, we don't create allergen categories
    // Instead, allergens are handled as dietary restrictions in item custom attributes
    console.log("ℹ️ SYNC TO SQUARE: Square has built-in allergen system - skipping allergen category creation")
    console.log("ℹ️ SYNC TO SQUARE: Allergens will be added as dietary restrictions to items")

    // ========== STEP 4: SYNC INGREDIENTS TO SQUARE ==========
    if (syncOptions.syncIngredients !== false) {
      console.log("🔄 SYNC TO SQUARE: Starting ingredient sync...")
      console.log(`📋 SYNC TO SQUARE: Processing ${ingredients?.length || 0} ingredients`)
      
      for (const ingredient of ingredients) {
        if (!ingredient?.ingredientName?.trim()) {
          console.log(`⚠️ SYNC TO SQUARE: Skipping ingredient with empty name:`, ingredient)
          continue;
        }

        console.log(`🔍 SYNC TO SQUARE: Processing ingredient: "${ingredient.ingredientName}"`)
        console.log(`🔍 SYNC TO SQUARE: Looking for MODIFIER_LIST: "Ingredients - ${ingredient.ingredientName}"`)
        
        try {
          // Search for the MODIFIER_LIST name (which includes "Ingredients - " prefix)
          const modifierListName = `Ingredients - ${ingredient.ingredientName}`
          const existingSquareItem = findExistingSquareItem(modifierListName, existingSquareItems)
          
          if (existingSquareItem) {
            console.log(`✅ SYNC TO SQUARE: Ingredient already exists in Square: "${ingredient.ingredientName}"`)
            result.stats.ingredients.existing++
            result.syncedItems.push({
              name: ingredient.ingredientName,
              type: 'ingredient',
              status: 'skipped',
              squareId: existingSquareItem.id
            })
          } else {
            console.log(`🚀 SYNC TO SQUARE: Creating ingredient in Square: "${ingredient.ingredientName}"`)
            
            // Extract allergen names and map to Square dietary restrictions
            const rawAllergenNames = ingredient.allergens?.map((a: any) => a.allergenName || a.name) || []
            console.log(`🔍 SYNC TO SQUARE: Raw ingredient allergens:`, rawAllergenNames)
            
            // Map to Square dietary restrictions
            const allergenNames = rawAllergenNames.map((allergen: string) => {
              const normalized = allergen.toLowerCase().trim()
              // Map common allergen names to Square dietary restrictions
              const mapping: Record<string, string> = {
                'eggs': 'EGG_FREE',
                'egg': 'EGG_FREE',
                'crustaceans': 'SHELLFISH_FREE',
                'gluten': 'GLUTEN_FREE',
                'wheat': 'WHEAT_FREE',
                'milk': 'DAIRY_FREE',
                'dairy': 'DAIRY_FREE',
                'peanuts': 'PEANUT_FREE',
                'peanut': 'PEANUT_FREE',
                'nuts': 'NUT_FREE',
                'soy': 'SOY_FREE',
                'fish': 'FISH_FREE',
                'shellfish': 'SHELLFISH_FREE',
                'celery': 'CELERY_FREE',
                'mustard': 'MUSTARD_FREE',
                'sesame': 'SESAME_FREE',
                'sulphites': 'SULFITE_FREE',
                'sulfites': 'SULFITE_FREE',
                'lupin': 'LUPIN_FREE',
                'molluscs': 'MOLLUSC_FREE',
                'mollusks': 'MOLLUSC_FREE'
              }
              return mapping[normalized] || allergen // Return mapped restriction or original if not found
            })
            console.log(`🔍 SYNC TO SQUARE: Mapped ingredient allergens:`, allergenNames)
            
            // Create description
            let description = `Ingredient: ${ingredient.ingredientName}`
            if (allergenNames.length > 0) {
              description += `\nContains allergens: ${allergenNames.join(', ')}`
            }
            if (ingredient.expiryDays) {
              description += `\nExpiry: ${ingredient.expiryDays} days`
            }
            
            console.log(`📝 SYNC TO SQUARE: Creating ingredient with description:`, description)
            
            // Create Square ingredient as modifier list with comprehensive allergen handling
            const modifierData = createSquareModifierWithDietaryRestrictions(
              ingredient.ingredientName,
              description,
              allergenNames
            )
            
            // Create a modifier list containing this ingredient
            const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
            const itemData = {
              type: 'MODIFIER_LIST',
              id: `#modifier_list_${uniqueId}`,
              modifier_list_data: {
                name: `Ingredients - ${ingredient.ingredientName}`,
                description: `Ingredient: ${ingredient.ingredientName}`,
                selection_type: 'SINGLE',
                modifiers: [modifierData]
              }
            }
            
            console.log(`📝 SYNC TO SQUARE: Ingredient data with proper structure:`, JSON.stringify(itemData, null, 2))
            const squareId = await createSquareItemWithCustomAttributes(itemData, square_access_token)
            
            if (squareId) {
              result.stats.ingredients.created++
              result.syncedItems.push({
                name: ingredient.ingredientName,
                type: 'ingredient',
                status: 'created',
                squareId
              })
              console.log(`✅ SYNC TO SQUARE: Created ingredient in Square: "${ingredient.ingredientName}" with ID: ${squareId}`)
            } else {
              console.log(`❌ SYNC TO SQUARE: Failed to create ingredient: "${ingredient.ingredientName}"`)
              result.itemsFailed++
              result.failedItems.push({
                name: ingredient.ingredientName,
                type: 'ingredient',
                error: 'Failed to create ingredient in Square'
              })
            }
          }
        } catch (error: any) {
          console.log(`❌ SYNC TO SQUARE: Error processing ingredient "${ingredient.ingredientName}":`, error.message)
          result.itemsFailed++
          result.failedItems.push({
            name: ingredient.ingredientName,
            type: 'ingredient',
            error: error.message
          })
          result.errors.push(`Failed to sync ingredient "${ingredient.ingredientName}": ${error.message}`)
        }
      }
    } else {
      console.log("⏭️ SYNC TO SQUARE: Skipping ingredient sync (disabled)")
    }

    // ========== STEP 5: SYNC MENU ITEMS TO SQUARE ==========
    if (syncOptions.syncMenuItems !== false) {
      console.log("🔄 SYNC TO SQUARE: Starting menu item sync...")
      
      // Flatten menu items from categories
      const flatMenuItems: any[] = []
      for (const category of menuItems) {
        if (category.items && Array.isArray(category.items)) {
          for (const item of category.items) {
            flatMenuItems.push({
              ...item,
              categoryName: category.categoryName
            })
          }
        }
      }
      
      console.log(`📋 SYNC TO SQUARE: Processing ${flatMenuItems?.length || 0} menu items from ${menuItems?.length || 0} categories`)
      
      for (const menuItem of flatMenuItems) {
        if (!menuItem?.menuItemName?.trim()) {
          console.log(`⚠️ SYNC TO SQUARE: Skipping menu item with empty name:`, menuItem)
          continue;
        }

        console.log(`🔍 SYNC TO SQUARE: Processing menu item: "${menuItem.menuItemName}"`)
        
        try {
          const existingSquareItem = findExistingSquareItem(menuItem.menuItemName, existingSquareItems)
          
          if (existingSquareItem) {
            console.log(`✅ SYNC TO SQUARE: Menu item already exists in Square: "${menuItem.menuItemName}"`)
            result.stats.menuItems.existing++
            result.syncedItems.push({
              name: menuItem.menuItemName,
              type: 'menuItem',
              status: 'skipped',
              squareId: existingSquareItem.id
            })
          } else {
            console.log(`🚀 SYNC TO SQUARE: Creating menu item in Square: "${menuItem.menuItemName}"`)
            
            // Extract allergen names and map to Square dietary restrictions
            const rawAllergenNames = menuItem.allergens?.map((a: any) => a.allergenName || a.name) || []
            console.log(`🔍 SYNC TO SQUARE: Raw menu item allergens:`, rawAllergenNames)
            
            // Map to Square dietary restrictions
            const allergenNames = rawAllergenNames.map((allergen: string) => {
              const normalized = allergen.toLowerCase().trim()
              // Map common allergen names to Square dietary restrictions
              const mapping: Record<string, string> = {
                'eggs': 'EGG_FREE',
                'egg': 'EGG_FREE',
                'crustaceans': 'SHELLFISH_FREE',
                'gluten': 'GLUTEN_FREE',
                'wheat': 'WHEAT_FREE',
                'milk': 'DAIRY_FREE',
                'dairy': 'DAIRY_FREE',
                'peanuts': 'PEANUT_FREE',
                'peanut': 'PEANUT_FREE',
                'nuts': 'NUT_FREE',
                'soy': 'SOY_FREE',
                'fish': 'FISH_FREE',
                'shellfish': 'SHELLFISH_FREE',
                'celery': 'CELERY_FREE',
                'mustard': 'MUSTARD_FREE',
                'sesame': 'SESAME_FREE',
                'sulphites': 'SULFITE_FREE',
                'sulfites': 'SULFITE_FREE',
                'lupin': 'LUPIN_FREE',
                'molluscs': 'MOLLUSC_FREE',
                'mollusks': 'MOLLUSC_FREE'
              }
              return mapping[normalized] || allergen // Return mapped restriction or original if not found
            })
            console.log(`🔍 SYNC TO SQUARE: Mapped menu item allergens:`, allergenNames)
            
            // Create rich description with ingredients and allergens
            let description = `Menu Item: ${menuItem.menuItemName}`
            if (menuItem.categoryName) {
              description += `\nCategory: ${menuItem.categoryName}`
            }
            if (menuItem.ingredients && menuItem.ingredients.length > 0) {
              const ingredientNames = menuItem.ingredients.map((i: any) => i.ingredientName || i.name).join(', ')
              description += `\nIngredients: ${ingredientNames}`
            }
            if (allergenNames.length > 0) {
              description += `\nAllergens: ${allergenNames.join(', ')}`
            }
            if (menuItem.expiryDays) {
              description += `\nExpiry: ${menuItem.expiryDays} days`
            }
            
            console.log(`📝 SYNC TO SQUARE: Creating menu item with description:`, description)
            
            // Find the modifier list IDs for this menu item's ingredients
            const modifierListIds: string[] = []
            if (menuItem.ingredients && menuItem.ingredients.length > 0) {
              for (const ingredient of menuItem.ingredients) {
                const ingredientName = ingredient.ingredientName || ingredient.name
                if (ingredientName) {
                  // Look for the corresponding modifier list in Square
                  const modifierListName = `Ingredients - ${ingredientName}`
                  const existingModifierList = findExistingSquareItem(modifierListName, existingSquareItems)
                  if (existingModifierList?.id) {
                    modifierListIds.push(existingModifierList.id)
                    console.log(`🔗 SYNC TO SQUARE: Linking ingredient "${ingredientName}" (ID: ${existingModifierList.id}) to menu item "${menuItem.menuItemName}"`)
                  } else {
                    console.log(`⚠️ SYNC TO SQUARE: Ingredient "${ingredientName}" not found in Square, skipping link`)
                  }
                }
              }
            }
            
            console.log(`🔗 SYNC TO SQUARE: Menu item "${menuItem.menuItemName}" will be linked to ${modifierListIds.length} modifier lists:`, modifierListIds)
            
            // Create Square menu item with comprehensive allergen handling and modifier links
            const itemData = createSquareItemWithDietaryRestrictions(
              menuItem.menuItemName,
              description,
              allergenNames
            )
            
            // Add modifier list info to the item data
            if (modifierListIds.length > 0) {
              const modifierListInfo = modifierListIds.map(id => ({
                modifier_list_id: id,
                enabled: true
              }))
              itemData.item_data = {
                ...itemData.item_data,
                modifier_list_info: modifierListInfo
              }
            }
            
            console.log(`📝 SYNC TO SQUARE: Menu item data with proper structure:`, JSON.stringify(itemData, null, 2))
            const squareId = await createSquareItemWithCustomAttributes(itemData, square_access_token)
            
            if (squareId) {
              result.stats.menuItems.created++
              result.syncedItems.push({
                name: menuItem.menuItemName,
                type: 'menuItem',
                status: 'created',
                squareId
              })
              console.log(`✅ SYNC TO SQUARE: Created menu item in Square: "${menuItem.menuItemName}" with ID: ${squareId}`)
            } else {
              console.log(`❌ SYNC TO SQUARE: Failed to create menu item: "${menuItem.menuItemName}"`)
              result.stats.menuItems.skipped++
              result.failedItems.push({
                name: menuItem.menuItemName,
                type: 'menuItem',
                error: 'Failed to create menu item in Square'
              })
            }
          }
        } catch (error: any) {
          console.log(`❌ SYNC TO SQUARE: Error processing menu item "${menuItem.menuItemName}":`, error.message)
          result.stats.menuItems.skipped++
          result.failedItems.push({
            name: menuItem.menuItemName,
            type: 'menuItem',
            error: error.message
          })
          result.errors.push(`Failed to sync menu item "${menuItem.menuItemName}": ${error.message}`)
        }
      }
    } else {
      console.log("⏭️ SYNC TO SQUARE: Skipping menu item sync (disabled)")
    }

    // Update last sync time
    console.log("💾 SYNC TO SQUARE: Updating last sync time...")
    await pool.query(
      'UPDATE user_profiles SET last_square_sync = NOW() WHERE user_id = $1',
      [userUuid]
    )

    // Log sync result
    console.log("📝 SYNC TO SQUARE: Logging sync result...")
    await pool.query(
      `INSERT INTO square_sync_logs (user_id, sync_type, status, items_processed, items_created, items_failed, error_message, completed_at, duration_ms)
       VALUES ($1, 'export_to_square', $2, $3, $4, $5, $6, NOW(), $7)`,
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

    console.log("🎉 SYNC TO SQUARE: Process completed!")
    console.log("📊 SYNC TO SQUARE: Final results:", {
      success: result.success,
      itemsProcessed: result.itemsProcessed,
      itemsCreated: result.itemsCreated,
      itemsFailed: result.itemsFailed,
      duration: result.duration
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('❌ SYNC TO SQUARE: Error details:', error)
    console.error('❌ SYNC TO SQUARE: Error stack:', error.stack)
    result.errors.push(`Sync to Square failed: ${error.message}`)
    result.duration = Date.now() - startTime
    console.log("💥 SYNC TO SQUARE: Process failed with error:", error.message)
    return NextResponse.json(result, { status: 500 })
  }
}

async function fetchExistingObject(objectName: string, accessToken: string): Promise<string | null> {
  try {
    console.log(`🔍 SYNC TO SQUARE: Fetching existing object: "${objectName}"`)
    
    // Search for the object in the catalog
    const params = new URLSearchParams({
      types: 'ITEM,ITEM_VARIATION,CATEGORY,MODIFIER,MODIFIER_LIST'
    })
    
    const url = `https://connect.squareup.com/v2/catalog/search?${params.toString()}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-17',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text_filter: objectName
      })
    })

    if (!response.ok) {
      console.error('❌ SYNC TO SQUARE: Failed to search for existing object')
      return null
    }

    const data = await response.json()
    const existingObject = data.objects?.find((obj: any) => {
      const objName = obj.item_data?.name || obj.modifier_data?.name || obj.modifier_list_data?.name
      return objName && normalizeName(objName) === normalizeName(objectName)
    })

    if (existingObject) {
      console.log(`✅ SYNC TO SQUARE: Found existing object: ${existingObject.id}`)
      return existingObject.id
    }

    console.log(`❌ SYNC TO SQUARE: No existing object found for: "${objectName}"`)
    return null
  } catch (error) {
    console.error('❌ SYNC TO SQUARE: Error fetching existing object:', error)
    return null
  }
}

async function fetchSquareCatalog(accessToken: string, locationId?: string): Promise<SquareCatalogItem[]> {
  console.log('🔍 SYNC TO SQUARE: Fetching Square catalog...')
  console.log('🔍 SYNC TO SQUARE: Access token length:', accessToken?.length || 0)
  console.log('🔍 SYNC TO SQUARE: Location ID:', locationId || 'none')
  
  const params = new URLSearchParams({
    types: 'ITEM,ITEM_VARIATION,CATEGORY,MODIFIER,MODIFIER_LIST'
  })
  
  if (locationId) {
    params.append('location_ids', locationId)
  }

  const url = `https://connect.squareup.com/v2/catalog/list?${params.toString()}`
  console.log('🔍 SYNC TO SQUARE: Fetching from URL:', url)

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Square-Version': '2024-01-17',
      'Content-Type': 'application/json'
    }
  })

  console.log('🔍 SYNC TO SQUARE: Square API response status:', response.status)

  if (!response.ok) {
    const error = await response.json()
    console.error('❌ SYNC TO SQUARE: Square API error:', error)
    throw new Error(`Failed to fetch Square catalog: ${error.errors?.[0]?.detail || 'Unknown error'}`)
  }

  const data = await response.json()
  console.log('✅ SYNC TO SQUARE: Successfully fetched Square catalog with', data.objects?.length || 0, 'items')
  
  // Debug: Log what types of items we got
  if (data.objects && data.objects.length > 0) {
    const typeCounts = data.objects.reduce((acc: any, item: any) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    }, {})
    console.log('🔍 SYNC TO SQUARE: Item types fetched:', typeCounts)
    
    // Show some sample MODIFIER_LIST items
    const modifierLists = data.objects.filter((item: any) => item.type === 'MODIFIER_LIST')
    console.log('🔍 SYNC TO SQUARE: Sample MODIFIER_LIST items:', modifierLists.slice(0, 3).map((item: any) => ({
      name: item.modifier_list_data?.name,
      id: item.id
    })))
  }
  
  return data.objects || []
}

async function createSquareCategory(name: string, accessToken: string): Promise<string | null> {
  try {
    console.log(`🚀 SYNC TO SQUARE: Creating Square category: ${name}`)
    console.log(`🔑 SYNC TO SQUARE: Access token length: ${accessToken?.length || 0}`)
    
    const requestBody = {
      idempotency_key: `category_${name}_${Date.now()}`,
      object: {
        type: 'CATEGORY',
        id: `#category_${Date.now()}`,
        category_data: {
          name: name
        }
      }
    }
    
    console.log(`📝 SYNC TO SQUARE: Request body for category:`, JSON.stringify(requestBody, null, 2))
    
    const response = await fetch('https://connect.squareup.com/v2/catalog/object', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-17',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    console.log(`📡 SYNC TO SQUARE: Square API response status for category "${name}":`, response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ SYNC TO SQUARE: Square API error creating category:', error)
      throw new Error(`Square API error: ${error.errors?.[0]?.detail || 'Unknown error'}`)
    }

    const data = await response.json()
    console.log(`✅ SYNC TO SQUARE: Successfully created Square category: ${name}`, data)
    return data.catalog_object?.id || null
  } catch (error: any) {
    console.error('❌ SYNC TO SQUARE: Error creating Square category:', error)
    throw error
  }
}

async function createSquareItem(name: string, description: string, accessToken: string): Promise<string | null> {
  try {
    console.log(`🚀 SYNC TO SQUARE: Creating Square item: ${name}`)
    console.log(`🔑 SYNC TO SQUARE: Access token length: ${accessToken?.length || 0}`)
    console.log(`📝 SYNC TO SQUARE: Item description: ${description}`)
    
    const requestBody = {
      idempotency_key: `item_${name}_${Date.now()}`,
      object: {
        type: 'ITEM',
        id: `#item_${Date.now()}`,
        item_data: {
          name: name,
          description: description,
          variations: [
            {
              type: 'ITEM_VARIATION',
              id: `#variation_${Date.now()}`,
                      item_variation_data: {
          name: 'Regular',
          pricing_type: 'VARIABLE_PRICING'
        }
            }
          ]
        }
      }
    }
    
    console.log(`📝 SYNC TO SQUARE: Request body for item:`, JSON.stringify(requestBody, null, 2))
    
    const response = await fetch('https://connect.squareup.com/v2/catalog/object', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-17',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    console.log(`📡 SYNC TO SQUARE: Square API response status for item "${name}":`, response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ SYNC TO SQUARE: Square API error creating item:', error)
      throw new Error(`Square API error: ${error.errors?.[0]?.detail || 'Unknown error'}`)
    }

    const data = await response.json()
    console.log(`✅ SYNC TO SQUARE: Successfully created Square item: ${name}`, data)
    return data.catalog_object?.id || null
  } catch (error: any) {
    console.error('❌ SYNC TO SQUARE: Error creating Square item:', error)
    throw error
  }
}

async function createSquareItemWithCustomAttributes(itemData: any, accessToken: string): Promise<string | null> {
  try {
    console.log(`🚀 SYNC TO SQUARE: Creating Square object with custom attributes: ${itemData.item_data?.name || itemData.modifier_data?.name || itemData.name}`)
    console.log(`🔑 SYNC TO SQUARE: Access token length: ${accessToken?.length || 0}`)
    console.log(`📝 SYNC TO SQUARE: Item data:`, itemData)
    
    // Handle both items and modifiers
    let processedData = itemData
    if (itemData.item_data) {
      // This is an item - ensure proper pricing structure
      processedData = {
        ...itemData,
        item_data: {
          ...itemData.item_data,
          variations: itemData.item_data?.variations?.map((variation: any) => ({
            ...variation,
            item_variation_data: {
              ...variation.item_variation_data,
              pricing_type: 'VARIABLE_PRICING' // Use variable pricing to avoid price requirement
            }
          })) || []
        }
      }
    }
    
    // Create a unique idempotency key that includes timestamp to prevent reuse
    const objectName = itemData.item_data?.name || itemData.modifier_data?.name || itemData.modifier_list_data?.name || itemData.name
    const normalizedName = objectName?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'unknown'
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const idempotencyKey = `${itemData.type}_${normalizedName}_${timestamp}_${randomSuffix}`
    
    const requestBody = {
      idempotency_key: idempotencyKey,
      object: processedData
    }
    
    console.log(`📝 SYNC TO SQUARE: Request body for item with custom attributes:`, JSON.stringify(requestBody, null, 2))
    console.log(`📝 SYNC TO SQUARE: Square API URL: https://connect.squareup.com/v2/catalog/object`)
    console.log(`📝 SYNC TO SQUARE: Authorization header length: ${accessToken?.length || 0}`)
    
    const response = await fetch('https://connect.squareup.com/v2/catalog/object', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-17',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    console.log(`📡 SYNC TO SQUARE: Square API response status for item "${itemData.name}":`, response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ SYNC TO SQUARE: Square API error creating item with custom attributes:', error)
      
      // Check if this is a duplicate error (Square should return existing object)
      if (error.errors?.[0]?.code === 'DUPLICATE_OBJECT') {
        console.log(`ℹ️ SYNC TO SQUARE: Object already exists, this is expected behavior`)
        // Try to fetch the existing object
        const existingObject = await fetchExistingObject(objectName, accessToken)
        return existingObject
      }
      
      // Handle idempotency key reuse - this means the object was already created
      if (error.errors?.[0]?.code === 'IDEMPOTENCY_KEY_REUSED') {
        console.log(`ℹ️ SYNC TO SQUARE: Idempotency key reused, object was already created`)
        // Try to fetch the existing object
        const existingObject = await fetchExistingObject(objectName, accessToken)
        return existingObject
      }
      
      throw new Error(`Square API error: ${error.errors?.[0]?.detail || 'Unknown error'}`)
    }

    const data = await response.json()
    console.log(`✅ SYNC TO SQUARE: Successfully created Square item with custom attributes: ${itemData.name}`, data)
    return data.catalog_object?.id || null
  } catch (error: any) {
    console.error('❌ SYNC TO SQUARE: Error creating Square item with custom attributes:', error)
    throw error
  }
} 
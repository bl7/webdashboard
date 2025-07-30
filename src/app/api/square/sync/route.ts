import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/pg'
import { verifyAuthToken } from '@/lib/auth'
import { addCustomAllergen, addIngredient, addMenuItems, getAllCustomAllergens, getAllIngredients, getAllMenuItems } from '@/lib/api'
import { calculateSmartExpiryDays } from '@/lib/smartIngredientExtractor'

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
  return allergens.find((item) => item.allergenName?.trim().toLowerCase() === normalizedSearch);
}

function findExistingIngredient(searchName: string, ingredients: any[]): any | undefined {
  if (!searchName?.trim()) return undefined;
  const normalizedSearch = searchName.trim().toLowerCase();
  return ingredients.find((item) => item.ingredientName?.trim().toLowerCase() === normalizedSearch);
}

function findExistingMenuItem(searchName: string, menuItems: any[]): any | undefined {
  if (!searchName?.trim()) return undefined;
  const normalizedSearch = searchName.trim().toLowerCase();
  
  // Handle nested menu items structure
  for (const category of menuItems) {
    if (category.items && Array.isArray(category.items)) {
      const found = category.items.find((item: any) => 
        item.menuItemName?.trim().toLowerCase() === normalizedSearch
      );
      if (found) return found;
    }
  }
  
  return undefined;
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
  
  try {
    const { userUuid } = await verifyAuthToken(req)
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || ''
    
    if (!token) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    // Parse sync options from request body
    const body = await req.json()
    const syncOptions = body?.syncOptions || {}
    const syncType = syncOptions.syncType || 'import' // 'import', 'export', 'bidirectional', or 'create-only'
    
    console.log(`🔄 Starting Square sync for user: ${userUuid} - Type: ${syncType}`)

    // Initialize result tracking
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
        menuItems: { existing: 0, created: 0, skipped: 0 }
      },
      warnings: [],
      syncedItems: [],
      failedItems: [],
      existingItems: { allergens: [], ingredients: [], menuItems: [] },
      newItems: { allergens: [], ingredients: [], menuItems: [] }
    }

    // ========== STEP 1: FETCH EXISTING DATA ==========
    console.log("Fetching existing data...")
    
    const [allergensResponse, ingredientsResponse, menuItemsResponse] = await Promise.all([
      getAllCustomAllergens(token),
      getAllIngredients(token),
      getAllMenuItems(token)
    ])

    // Extract data from responses
    const localAllergens = allergensResponse?.data || []
    const localIngredients = Array.isArray(ingredientsResponse) ? ingredientsResponse : ingredientsResponse?.data || []
    const localMenuItems = menuItemsResponse?.data || []
    
    console.log('Debug - localAllergens structure:', localAllergens.length, 'items')
    console.log('Debug - localIngredients structure:', localIngredients.length, 'items')
    console.log('Debug - localMenuItems structure:', localMenuItems.length, 'categories')
    if (localMenuItems.length > 0) {
      console.log('Debug - First menu category:', localMenuItems[0])
    }

    // Create lookup maps for efficient matching
    const allergenIdMap = new Map<string, string>()
    const ingredientIdMap = new Map<string, string>()
    const menuItemIdMap = new Map<string, string>()

    // Populate maps with existing data
    localAllergens.forEach((allergen: any) => {
      const key1 = allergen.allergenName.toLowerCase()
      const key2 = normalizeName(allergen.allergenName)
      allergenIdMap.set(key1, allergen.uuid)
      allergenIdMap.set(key2, allergen.uuid)
    })

    localIngredients.forEach((ingredient: any) => {
      const key1 = ingredient.ingredientName.toLowerCase()
      const key2 = normalizeName(ingredient.ingredientName)
      ingredientIdMap.set(key1, ingredient.uuid)
      ingredientIdMap.set(key2, ingredient.uuid)
    })

    // Handle menu items - they might be nested in categories
    const flatMenuItems: any[] = []
    if (Array.isArray(localMenuItems)) {
      for (const category of localMenuItems) {
        if (category.items && Array.isArray(category.items)) {
          flatMenuItems.push(...category.items)
        }
      }
    }
    
    flatMenuItems.forEach((menuItem: any) => {
      if (menuItem?.menuItemName) {
        const key1 = menuItem.menuItemName.toLowerCase()
        const key2 = normalizeName(menuItem.menuItemName)
        menuItemIdMap.set(key1, menuItem.menuItemID)
        menuItemIdMap.set(key2, menuItem.menuItemID)
      }
    })

    // ========== STEP 2: FETCH SQUARE CATALOG ==========
    console.log("Fetching Square catalog...")
    
    // Get user's Square tokens
    const userResult = await pool.query(
      'SELECT square_access_token, square_merchant_id FROM user_profiles WHERE user_id = $1',
      [userUuid]
    )

    if (userResult.rows.length === 0 || !userResult.rows[0].square_access_token) {
      return NextResponse.json({ error: 'Square not connected' }, { status: 400 })
    }

    const { square_access_token, square_merchant_id } = userResult.rows[0]

    // Get Square location
    const locationResult = await pool.query(
      'SELECT square_location_id FROM user_profiles WHERE user_id = $1',
      [userUuid]
    )
    const location_id = locationResult.rows[0]?.square_location_id

    // Fetch Square catalog items
    const squareItems = await fetchSquareCatalog(square_access_token, location_id)
    result.itemsProcessed = squareItems.length
    
    // Debug: Log what we got from Square
    console.log(`📦 Fetched ${squareItems.length} items from Square`)
    const itemTypes = squareItems.reduce((acc: any, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    }, {})
    console.log(`📊 Square item types:`, itemTypes)
    
    // Log a few sample items for debugging
    squareItems.slice(0, 3).forEach((item, index) => {
      console.log(`🔍 Sample item ${index + 1}:`, {
        type: item.type,
        name: item.item_data?.name || item.modifier_list_data?.name || 'Unknown',
        description: item.item_data?.description || item.modifier_list_data?.description || 'No description',
        hasModifiers: item.modifier_list_data?.modifiers?.length || 0,
        hasModifierLists: item.item_data?.modifier_list_info?.length || 0
      })
    })

    // ========== STEP 3: COLLECT ALL REQUIRED DATA FROM SQUARE ==========
    console.log("Collecting all required data from Square...")
    
    // Collect all allergens and ingredients from Square data
    const allRequiredAllergens = new Set<string>()
    const allRequiredIngredients = new Map<string, { expiryDays: number; allergenNames: string[] }>()
    const allRequiredMenuItems = new Map<string, string[]>() // menu item name -> ingredient names
    
    // First pass: collect all modifier lists and their data
    const modifierListMap = new Map<string, { ingredients: string[], allergens: string[] }>()
    
    console.log(`🔍 Looking for MODIFIER_LIST items...`)
    const modifierLists = squareItems.filter(item => item.type === 'MODIFIER_LIST')
    console.log(`📋 Found ${modifierLists.length} modifier lists`)
    
    for (const squareItem of modifierLists) {
      const modifierListName = squareItem.modifier_list_data?.name || ''
      const { ingredients, allergens } = extractFromModifierList(squareItem)
      
      console.log(`📋 Processing modifier list: "${modifierListName}"`)
      console.log(`  - Raw modifiers: ${squareItem.modifier_list_data?.modifiers?.length || 0}`)
      console.log(`  - Extracted ingredients: ${ingredients.join(", ") || "none"}`)
      console.log(`  - Extracted allergens: ${allergens.join(", ") || "none"}`)
      
      modifierListMap.set(squareItem.id, { ingredients, allergens })
      
      // Add to required ingredients and allergens
      ingredients.forEach(ingredient => {
        if (!allRequiredIngredients.has(ingredient)) {
          allRequiredIngredients.set(ingredient, {
            expiryDays: calculateSmartExpiryDays(ingredient),
            allergenNames: allergens
          })
        }
      })
      allergens.forEach(allergen => allRequiredAllergens.add(allergen))
    }
    
    // Second pass: collect menu items and their ingredients
    console.log(`🔍 Looking for ITEM objects...`)
    const menuItems = squareItems.filter(item => item.type === 'ITEM')
    console.log(`🍽️ Found ${menuItems.length} menu items`)
    
    for (const squareItem of menuItems) {
      const itemName = squareItem.item_data?.name || 'Unknown Item'
      const description = squareItem.item_data?.description || ''
      
      console.log(`🍽️ Processing menu item: "${itemName}"`)
      console.log(`  - Description: "${description}"`)
      console.log(`  - Has modifier lists: ${squareItem.item_data?.modifier_list_info?.length || 0}`)
      
      let menuItemIngredients: string[] = []
      let menuItemAllergens: string[] = []
      
      // Extract ingredients from linked modifier lists (Square's structured approach)
      if (squareItem.item_data?.modifier_list_info && squareItem.item_data.modifier_list_info.length > 0) {
        console.log(`  🔗 Found ${squareItem.item_data.modifier_list_info.length} linked modifier lists`)
        for (const modifierListInfo of squareItem.item_data.modifier_list_info) {
          const modifierList = modifierListMap.get(modifierListInfo.modifier_list_id)
          if (modifierList) {
            menuItemIngredients.push(...modifierList.ingredients)
            menuItemAllergens.push(...modifierList.allergens)
            console.log(`  📋 Using modifier list: ${modifierList.ingredients.join(", ") || "none"}`)
          } else {
            console.log(`  ⚠ Modifier list ${modifierListInfo.modifier_list_id} not found in map`)
          }
        }
      }
      
      // Only use description extraction as fallback if no structured data is available
      if (menuItemIngredients.length === 0) {
        console.log(`  📝 No modifier lists found, using description extraction`)
        const { ingredients: descriptionIngredients, allergens: descriptionAllergens } = extractFromDescription(description)
        menuItemIngredients = descriptionIngredients
        menuItemAllergens = descriptionAllergens
        console.log(`  📝 Extracted from description: ${descriptionIngredients.join(", ") || "none"}`)
        
        // If still no ingredients, try to extract from menu item name and allergens
        if (menuItemIngredients.length === 0) {
          console.log(`  🔍 Trying to extract ingredients from menu item name and allergens...`)
          
          // Extract potential ingredients from menu item name
          const itemNameWords = itemName.toLowerCase().split(/\s+/).filter(word => word.length > 2)
          const commonIngredients = [
            'beef', 'chicken', 'pork', 'lamb', 'fish', 'shrimp', 'salmon', 'tuna',
            'bread', 'bun', 'pasta', 'rice', 'potato', 'tomato', 'lettuce', 'onion',
            'cheese', 'milk', 'cream', 'butter', 'egg', 'flour', 'sugar', 'salt',
            'garlic', 'ginger', 'curry', 'sauce', 'dressing', 'mayonnaise'
          ]
          
          const foundIngredients = itemNameWords.filter(word => 
            commonIngredients.includes(word) || 
            word.includes('cheese') || 
            word.includes('bread') || 
            word.includes('meat') ||
            word.includes('chicken') ||
            word.includes('beef') ||
            word.includes('fish')
          )
          
          if (foundIngredients.length > 0) {
            menuItemIngredients = foundIngredients
            console.log(`  📝 Extracted ingredients from menu item name: ${foundIngredients.join(", ")}`)
          }
        }
      }
      
      // Remove duplicates
      menuItemIngredients = [...new Set(menuItemIngredients)]
      menuItemAllergens = [...new Set(menuItemAllergens)]
      
      console.log(`  📊 Final ingredients: ${menuItemIngredients.join(", ") || "none"}`)
      console.log(`  📊 Final allergens: ${menuItemAllergens.join(", ") || "none"}`)
      
      // Skip items with no ingredients
      if (menuItemIngredients.length === 0) {
        console.log(`⚠ Skipping "${itemName}" - no ingredients found`)
        result.stats.menuItems.skipped++
        result.warnings.push(`No ingredients found for menu item "${itemName}"`)
        continue
      }
      
      // Add to required data
      allRequiredMenuItems.set(itemName, menuItemIngredients)
      menuItemAllergens.forEach(allergen => allRequiredAllergens.add(allergen))
      
      // Add ingredients that weren't in modifier lists
      menuItemIngredients.forEach(ingredient => {
        if (!allRequiredIngredients.has(ingredient)) {
          allRequiredIngredients.set(ingredient, {
            expiryDays: calculateSmartExpiryDays(ingredient),
            allergenNames: menuItemAllergens
          })
        }
      })
    }
    
    console.log(`📊 Collected ${allRequiredAllergens.size} allergens, ${allRequiredIngredients.size} ingredients, ${allRequiredMenuItems.size} menu items`)

    // ========== STEP 4: PROCESS ALLERGENS (LIKE UPLOAD PAGE) ==========
    if (syncType === 'import' || syncType === 'bidirectional') {
      console.log("Processing allergens...")
      
      for (const allergenName of allRequiredAllergens) {
        if (!allergenName?.trim()) continue

        // Check if allergen exists in DB (using fuzzy matching)
        const existingAllergen = findExistingAllergen(allergenName, localAllergens)

        if (existingAllergen) {
          // EXISTS: Use existing ID, don't create
          const key1 = allergenName.toLowerCase()
          const key2 = normalizeName(allergenName)
          allergenIdMap.set(key1, existingAllergen.id)
          allergenIdMap.set(key2, existingAllergen.id)
          result.stats.allergens.existing++
          console.log(`✓ Found existing allergen: "${allergenName}" matches "${existingAllergen.allergenName}" (ID: ${existingAllergen.id})`)
          result.existingItems.allergens.push({ name: existingAllergen.allergenName, id: existingAllergen.id })
        } else {
          // NEW: Create custom allergen
          console.log(`+ Creating new allergen: "${allergenName}"`)
          const newAllergenId = await createOrGetAllergen(allergenName, token)
          if (newAllergenId) {
            const key1 = allergenName.toLowerCase()
            const key2 = normalizeName(allergenName)
            allergenIdMap.set(key1, newAllergenId)
            allergenIdMap.set(key2, newAllergenId)
            result.stats.allergens.created++
            console.log(`✓ Created allergen: "${allergenName}" (ID: ${newAllergenId})`)
            result.newItems.allergens.push({ name: allergenName, id: newAllergenId })
          }
        }
      }

      // ========== STEP 5: PROCESS INGREDIENTS (LIKE UPLOAD PAGE) ==========
      console.log("Processing ingredients...")
      
      for (const [ingredientName, ingredientData] of allRequiredIngredients) {
        if (!ingredientName?.trim()) continue

        // Check if ingredient exists in DB (using fuzzy matching)
        const existingIngredient = findExistingIngredient(ingredientName, localIngredients)

        if (existingIngredient) {
          // EXISTS: Use existing ID, don't create
          const key1 = ingredientName.toLowerCase()
          const key2 = normalizeName(ingredientName)
          ingredientIdMap.set(key1, existingIngredient.uuid)
          ingredientIdMap.set(key2, existingIngredient.uuid)
          result.stats.ingredients.existing++
          console.log(`✓ Found existing ingredient: "${ingredientName}" matches "${existingIngredient.ingredientName}" (ID: ${existingIngredient.uuid})`)
          result.existingItems.ingredients.push({ name: existingIngredient.ingredientName, id: existingIngredient.uuid })
        } else {
          // NEW: Create ingredient with resolved allergen IDs
          console.log(`+ Creating new ingredient: "${ingredientName}"`)

          // Resolve allergen IDs for this ingredient
          const resolvedAllergenIds: string[] = []
          for (const allergenName of ingredientData.allergenNames) {
            if (!allergenName?.trim()) continue

            // Try direct lookup first
            let allergenId = allergenIdMap.get(allergenName.toLowerCase()) || allergenIdMap.get(normalizeName(allergenName))

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
            }
          }

          // Create new ingredient
          const newIngredientId = await createOrGetIngredient(ingredientName, resolvedAllergenIds, token, ingredientData.expiryDays)
          if (newIngredientId) {
            const key1 = ingredientName.toLowerCase()
            const key2 = normalizeName(ingredientName)
            ingredientIdMap.set(key1, newIngredientId)
            ingredientIdMap.set(key2, newIngredientId)
            result.stats.ingredients.created++
            console.log(`✓ Created ingredient: "${ingredientName}" (ID: ${newIngredientId})`)
            result.newItems.ingredients.push({ name: ingredientName, id: newIngredientId })
          } else {
            result.warnings.push(`Failed to create ingredient: ${ingredientName}`)
          }
        }
      }

      // ========== STEP 6: PROCESS MENU ITEMS (LIKE UPLOAD PAGE) ==========
      console.log("Processing menu items...")
      
      for (const [itemName, ingredientNames] of allRequiredMenuItems) {
        if (!itemName?.trim()) continue

        // Check if menu item exists in DB (using fuzzy matching)
        const existingMenuItem = findExistingMenuItem(itemName, localMenuItems)

        if (existingMenuItem && existingMenuItem.menuItemID) {
          // EXISTS: Skip completely, don't create
          result.stats.menuItems.existing++
          console.log(`✓ Found existing menu item: "${itemName}" matches "${existingMenuItem.menuItemName}" - skipping`)
          result.existingItems.menuItems.push({ name: existingMenuItem.menuItemName, id: existingMenuItem.menuItemID })
          continue
        }

        // NEW: Create menu item with resolved ingredient IDs
        console.log(`+ Creating new menu item: "${itemName}"`)

        const resolvedIngredientIds: string[] = []
        const foundIngredients: string[] = []

        for (const ingredientName of ingredientNames) {
          if (!ingredientName?.trim()) continue

          // Try direct lookup first
          let ingredientId = ingredientIdMap.get(ingredientName.toLowerCase()) || ingredientIdMap.get(normalizeName(ingredientName))

          if (!ingredientId) {
            // Try fuzzy matching against existing ingredients
            const existingIngredient = findExistingIngredient(ingredientName, localIngredients)
            if (existingIngredient) {
              ingredientId = existingIngredient.uuid
              ingredientIdMap.set(ingredientName.toLowerCase(), existingIngredient.uuid)
              ingredientIdMap.set(normalizeName(ingredientName), existingIngredient.uuid)
            }
          }

          if (ingredientId) {
            resolvedIngredientIds.push(ingredientId)
            foundIngredients.push(ingredientName)
          } else {
            console.error(`Error: Could not find ingredient "${ingredientName}" for menu item "${itemName}"`)
            result.warnings.push(`Could not resolve ingredient "${ingredientName}" for menu item "${itemName}"`)
          }
        }

        console.log(`  Found ingredients: ${foundIngredients.join(", ")}`)
        
        if (resolvedIngredientIds.length === 0) {
          console.error(`Error: No ingredients resolved for menu item "${itemName}"`)
          result.warnings.push(`No ingredients could be resolved for menu item "${itemName}"`)
          result.stats.menuItems.skipped++
          continue
        }

        // Create the menu item
        const success = await createMenuItem(itemName, resolvedIngredientIds, token)
        if (success) {
          result.stats.menuItems.created++
          console.log(`✓ Created menu item: "${itemName}" with ${resolvedIngredientIds.length} ingredients`)
          result.newItems.menuItems.push({ 
            name: itemName, 
            id: `new-${Date.now()}`, 
            ingredientIds: resolvedIngredientIds 
          })
        } else {
          result.warnings.push(`Failed to create menu item: ${itemName}`)
          result.stats.menuItems.skipped++
        }
      }
    } // Close the if block for import/bidirectional

    // ========== STEP 5: SAFE BIDIRECTIONAL SYNC (CREATE-ONLY) ==========
    if (syncType === 'create-only') {
      console.log("🛡️ Starting SAFE bidirectional sync (create-only mode)...")
      
      // This mode only creates missing items, never updates existing ones
      // It's safe for production use
      
      // Step 5A: Import missing items from Square to InstaLabel
      console.log("📥 Importing missing items from Square...")
      await performSafeImport(squareItems, localAllergens, localIngredients, flatMenuItems, token, result)
      
      // Step 5B: Export missing items from InstaLabel to Square  
      console.log("📤 Exporting missing items to Square...")
      await performSafeExport(square_access_token, localAllergens, localIngredients, flatMenuItems, result)
      
    } else if (syncType === 'export' || syncType === 'bidirectional') {
      console.log("Exporting to Square...")
      
      // Get our ingredients and menu items for export
      const [ingredientsResponse, menuItemsResponse] = await Promise.all([
        getAllIngredients(token),
        getAllMenuItems(token)
      ])
      
      // Extract data from responses
      const exportIngredients = Array.isArray(ingredientsResponse) ? ingredientsResponse : ingredientsResponse?.data || []
      const exportMenuItems = menuItemsResponse?.data || []
      
      console.log(`📦 Exporting ${exportIngredients.length} ingredients and ${exportMenuItems.length} menu categories`)
      
      // ========== STEP 5A: CREATE INGREDIENTS AS MODIFIER LISTS (OPTIMIZED) ==========
      console.log("🔧 Creating ingredients as modifier lists...")
      const ingredientModifierMap = new Map<string, string>() // ingredient name -> modifier list ID
      
      // Batch fetch existing modifier lists to avoid individual API calls
      const existingModifierLists = await fetchAllModifierLists(square_access_token)
      const existingModifierListMap = new Map<string, string>()
      existingModifierLists.forEach((ml: any) => {
        existingModifierListMap.set(ml.modifier_list_data?.name || '', ml.id)
      })
      
      // Update existing modifier lists to ensure they have present_at_all_locations
      console.log("🔧 Updating existing modifier lists...")
      const modifierListsToUpdate = existingModifierLists.filter((ml: any) => !ml.present_at_all_locations)
      console.log(`Found ${modifierListsToUpdate.length} modifier lists that need updating`)
      
      for (const modifierList of modifierListsToUpdate) {
        try {
          console.log(`🔄 Updating modifier list: ${modifierList.modifier_list_data?.name} (ID: ${modifierList.id})`)
          const success = await updateModifierListWithPresentAtAllLocations(square_access_token, modifierList.id)
          if (success) {
            console.log(`✅ Updated modifier list: ${modifierList.modifier_list_data?.name}`)
          } else {
            console.error(`❌ Failed to update modifier list: ${modifierList.modifier_list_data?.name}`)
          }
        } catch (error) {
          console.error(`❌ Error updating modifier list: ${modifierList.modifier_list_data?.name}`, error)
        }
      }
      
      // Add delay after updating modifier lists to ensure changes are propagated
      if (modifierListsToUpdate.length > 0) {
        console.log("⏳ Waiting for modifier list updates to propagate...")
        await new Promise(resolve => setTimeout(resolve, 3000)) // Wait 3 seconds
      }
      
      // Prepare batch creation data
      const ingredientsToCreate: Array<{
        ingredient: any,
        modifierListName: string,
        allergenNames: string[]
      }> = []
      
      for (const ingredient of exportIngredients) {
        if (!ingredient?.ingredientName) continue
        
        const modifierListName = `Ingredients - ${ingredient.ingredientName}`
        const allergenNames = ingredient.allergens?.map((a: any) => a.allergenName) || []
        
        // Only log if allergens exist
        if (allergenNames.length > 0) {
          console.log(`🔍 ${ingredient.ingredientName}: ${allergenNames.join(', ')}`)
        }
        
        // Check if modifier list already exists (using cached data)
        const existingModifierList = existingModifierListMap.get(modifierListName)
        
        if (existingModifierList) {
          ingredientModifierMap.set(ingredient.ingredientName, existingModifierList)
        } else {
          // Queue for batch creation
          ingredientsToCreate.push({
            ingredient,
            modifierListName,
            allergenNames
          })
        }
      }
      
      // Batch create modifier lists (process in chunks of 5 to avoid rate limiting)
      const BATCH_SIZE = 5
      for (let i = 0; i < ingredientsToCreate.length; i += BATCH_SIZE) {
        const batch = ingredientsToCreate.slice(i, i + BATCH_SIZE)
        const batchPromises = batch.map(async ({ ingredient, modifierListName, allergenNames }) => {
          try {
            const modifierListId = await createModifierList(
              square_access_token,
              modifierListName,
              `Contains ${ingredient.ingredientName}`,
              [ingredient.ingredientName],
              allergenNames
            )
            
            if (modifierListId) {
              ingredientModifierMap.set(ingredient.ingredientName, modifierListId)
              result.itemsCreated++
            }
          } catch (error) {
            console.error(`❌ Failed to create modifier list for ${ingredient.ingredientName}`)
            result.errors.push(`Failed to create modifier list for ${ingredient.ingredientName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        })
        
        await Promise.all(batchPromises)
        console.log(`✅ Processed batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(ingredientsToCreate.length/BATCH_SIZE)}`)
        
        // Add delay between batches to avoid rate limiting
        if (i + BATCH_SIZE < ingredientsToCreate.length) {
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second between batches
        }
      }
      
      // Add delay after creating all modifier lists to ensure they're fully processed
      console.log("⏳ Waiting for modifier list creation to propagate...")
      await new Promise(resolve => setTimeout(resolve, 3000)) // Wait 3 seconds
      
      // ========== STEP 5B: CREATE/UPDATE MENU ITEMS (OPTIMIZED) ==========
      console.log("🍽️ Creating/updating menu items...")
      
      // Batch fetch existing menu items to avoid individual API calls
      const existingMenuItems = await fetchAllMenuItems(square_access_token)
      const existingMenuItemMap = new Map<string, string>()
      existingMenuItems.forEach((item: any) => {
        existingMenuItemMap.set(item.item_data?.name || '', item.id)
      })
      
      // Prepare batch creation data
      const menuItemsToCreate: Array<{
        menuItem: any,
        modifierListIds: string[],
        allergenNames: string[]
      }> = []
      
      const menuItemsToUpdate: Array<{
        menuItem: any,
        menuItemId: string,
        modifierListIds: string[]
      }> = []
      
      for (const category of exportMenuItems) {
        if (!category.items) continue
        
        for (const menuItem of category.items) {
          if (!menuItem?.menuItemName) continue
          
          const modifierListIds = [...new Set(menuItem.ingredients?.map((ing: any) => ingredientModifierMap.get(ing.ingredientName)).filter(Boolean) || [])] as string[]
          const allergenNames = menuItem.allergens?.map((a: any) => a.allergenName) || []
          
                  // Check if menu item exists (using cached data)
        const existingMenuItemId = existingMenuItemMap.get(menuItem.menuItemName)
        
        if (existingMenuItemId) {
          // Queue for batch update
          if (modifierListIds.length > 0) {
            menuItemsToUpdate.push({
              menuItem,
              menuItemId: existingMenuItemId,
              modifierListIds
            })
          }
        } else {
          // Queue for batch creation
          if (modifierListIds.length > 0) {
            console.log(`🔍 Menu item "${menuItem.menuItemName}" will link to modifier lists: ${modifierListIds.join(', ')}`)
          }
          menuItemsToCreate.push({
            menuItem,
            modifierListIds,
            allergenNames
          })
        }
        }
      }
      
      // Batch create menu items (process in chunks of 3 to avoid rate limiting)
      const MENU_BATCH_SIZE = 3
      for (let i = 0; i < menuItemsToCreate.length; i += MENU_BATCH_SIZE) {
        const batch = menuItemsToCreate.slice(i, i + MENU_BATCH_SIZE)
        const batchPromises = batch.map(async ({ menuItem, modifierListIds, allergenNames }) => {
          try {
            console.log(`+ Creating new menu item in Square: "${menuItem.menuItemName}"`)
            
            const menuItemId = await createMenuItemInSquare(
              square_access_token,
              menuItem.menuItemName,
              modifierListIds,
              `Menu item: ${menuItem.menuItemName}`,
              allergenNames
            )
            
            if (menuItemId) {
              result.itemsCreated++
              console.log(`✅ Created menu item: "${menuItem.menuItemName}"`)
            }
          } catch (error) {
            console.error(`❌ Failed to process menu item ${menuItem.menuItemName}`)
            result.errors.push(`Failed to process menu item ${menuItem.menuItemName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        })
        
        await Promise.all(batchPromises)
        console.log(`✅ Processed menu batch ${Math.floor(i/MENU_BATCH_SIZE) + 1}/${Math.ceil(menuItemsToCreate.length/MENU_BATCH_SIZE)}`)
        
        // Add delay between batches to avoid rate limiting
        if (i + MENU_BATCH_SIZE < menuItemsToCreate.length) {
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second between batches
        }
      }
      
      // Batch update existing menu items
      for (let i = 0; i < menuItemsToUpdate.length; i += MENU_BATCH_SIZE) {
        const batch = menuItemsToUpdate.slice(i, i + MENU_BATCH_SIZE)
        const batchPromises = batch.map(async ({ menuItem, menuItemId, modifierListIds }) => {
          try {
            const success = await updateMenuItemWithModifiers(
              square_access_token,
              menuItemId,
              modifierListIds
            )
            
            if (success) {
              result.itemsCreated++
              console.log(`✅ Updated existing menu item: "${menuItem.menuItemName}"`)
            }
          } catch (error) {
            console.error(`❌ Failed to update menu item ${menuItem.menuItemName}`)
            result.errors.push(`Failed to update menu item ${menuItem.menuItemName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        })
        
        await Promise.all(batchPromises)
        console.log(`✅ Processed update batch ${Math.floor(i/MENU_BATCH_SIZE) + 1}/${Math.ceil(menuItemsToUpdate.length/MENU_BATCH_SIZE)}`)
        
        // Add delay between batches to avoid rate limiting
        if (i + MENU_BATCH_SIZE < menuItemsToUpdate.length) {
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second between batches
        }
      }
    }

    // ========== STEP 8: UPDATE SYNC STATUS ==========
    await pool.query(
      'UPDATE user_profiles SET last_square_sync = NOW() WHERE user_id = $1',
      [userUuid]
    )

    // Log sync results
    await pool.query(
      `INSERT INTO square_sync_logs (user_id, sync_type, status, items_processed, items_created, items_failed, error_message, completed_at, duration_ms)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8)`,
      [
        userUuid,
        'full_sync',
        result.itemsFailed === 0 ? 'success' : 'partial_success',
        result.itemsProcessed,
        result.itemsCreated,
        result.itemsFailed,
        result.errors.length > 0 ? result.errors.join('; ') : null,
        Date.now() - startTime
      ]
    )

    result.success = result.itemsFailed === 0
    result.duration = Date.now() - startTime

    console.log(`✅ Square sync completed in ${result.duration}ms`)
    console.log(`📊 Results: ${result.itemsProcessed} processed, ${result.itemsCreated} created, ${result.itemsFailed} failed`)

    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Square sync error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Extract ingredients and allergens from modifier list
function extractFromModifierList(squareItem: SquareItem): { ingredients: string[], allergens: string[] } {
  const ingredients: string[] = []
  const allergens: string[] = []
  
  if (!squareItem.modifier_list_data?.modifiers) {
    return { ingredients, allergens }
  }
  
  // Extract from modifier names and descriptions
  for (const modifier of squareItem.modifier_list_data.modifiers) {
    const modifierName = modifier.modifier_data?.name || ''
    const modifierDescription = modifier.modifier_data?.description || ''
    
    // Add modifier name as ingredient
    if (modifierName && modifierName.length > 2) {
      ingredients.push(modifierName)
    }
    
    // Extract allergens from modifier description
    const { allergens: descAllergens } = extractFromDescription(modifierDescription)
    allergens.push(...descAllergens)
  }
  
  return { ingredients, allergens }
}

// Extract ingredients and allergens from description (fallback)
function extractFromDescription(description: string): { ingredients: string[], allergens: string[] } {
  const ingredients: string[] = []
  const allergens: string[] = []
  
  if (!description) {
    return { ingredients, allergens }
  }
  
  const lowerDescription = description.toLowerCase()
  
  // First, try to extract structured allergen data from our export format
  // Look for "Allergens: [list]" pattern
  const allergenMatch = description.match(/Allergens:\s*([^\.]+)/i)
  if (allergenMatch) {
    const allergenList = allergenMatch[1].split(',').map(a => a.trim()).filter(a => a.length > 0)
    allergens.push(...allergenList)
  } else {
    // Fallback to keyword detection
    const allergenKeywords = {
      'gluten': ['wheat', 'barley', 'rye', 'oats', 'flour', 'bread', 'pasta'],
      'milk': ['milk', 'dairy', 'cheese', 'cream', 'butter', 'yogurt'],
      'eggs': ['egg', 'eggs', 'mayonnaise', 'custard'],
      'fish': ['fish', 'salmon', 'tuna', 'cod', 'fish sauce'],
      'peanuts': ['peanut', 'groundnut', 'peanuts'],
      'soy': ['soy', 'soya', 'tofu', 'soybean'],
      'nuts': ['almond', 'walnut', 'cashew', 'pistachio', 'nuts', 'nut'],
      'celery': ['celery'],
      'mustard': ['mustard'],
      'sesame': ['sesame', 'tahini'],
      'sulphites': ['sulphite', 'sulfite'],
      'lupin': ['lupin'],
      'molluscs': ['mollusc', 'mussel', 'oyster'],
      'crustaceans': ['shrimp', 'prawn', 'crab', 'lobster']
    }
    
    for (const [allergen, keywords] of Object.entries(allergenKeywords)) {
      for (const keyword of keywords) {
        if (lowerDescription.includes(keyword)) {
          allergens.push(allergen)
          break
        }
      }
    }
  }
  
  // Extract ingredients using pattern matching
  const ingredientPatterns = [
    /ingredients?:\s*([^\.]+)/i,
    /contains?:\s*([^\.]+)/i,
    /made with:\s*([^\.]+)/i,
    /with\s+([^\.]+)/i,
    /includes?:\s*([^\.]+)/i
  ]
  
  for (const pattern of ingredientPatterns) {
    const match = description.match(pattern)
    if (match) {
      const ingredientList = match[1].split(/[,\s]+/).map(item => item.trim()).filter(item => item.length > 2)
      ingredients.push(...ingredientList)
      break
    }
  }
  
  return { ingredients, allergens }
}

async function fetchSquareCatalog(accessToken: string, locationId?: string): Promise<SquareItem[]> {
  const allObjects: SquareItem[] = []
  
  // Fetch all object types separately to ensure we get everything
  const objectTypes = ['ITEM', 'ITEM_VARIATION', 'CATEGORY', 'MODIFIER', 'MODIFIER_LIST']
  
  for (const objectType of objectTypes) {
    try {
      const params = new URLSearchParams({
        types: objectType
      })
      
      if (locationId) {
        params.append('location_ids', locationId)
      }

      console.log(`🔍 Fetching ${objectType} objects from Square...`)
      
      const response = await fetch(`https://connect.squareup.com/v2/catalog/list?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-01-17',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        console.error(`Square API error fetching ${objectType}:`, error)
        continue // Skip this type if it fails
      }

      const data = await response.json()
      const objects = data.objects || []
      allObjects.push(...objects)
      
      console.log(`✅ Fetched ${objects.length} ${objectType} objects`)
    } catch (error) {
      console.error(`Error fetching ${objectType}:`, error)
    }
  }
  
  return allObjects
}

async function createOrGetAllergen(allergenName: string, token: string): Promise<string | null> {
  try {
    const data = await addCustomAllergen(allergenName, token)
    return data.uuid || data.id
  } catch (error) {
    console.error('Error creating allergen:', error)
    return null
  }
}

async function createOrGetIngredient(ingredientName: string, allergenIds: string[], token: string, expiryDays: number = 7): Promise<string | null> {
  try {
    const data = await addIngredient({
      ingredientName: ingredientName,
      expiryDays: expiryDays,
      allergenIDs: allergenIds
    }, token)
    return data.uuid
  } catch (error) {
    console.error('Error creating ingredient:', error)
    return null
  }
}

async function createMenuItem(itemName: string, ingredientIds: string[], token: string): Promise<boolean> {
  try {
    await addMenuItems({
      menuItemName: itemName,
      ingredientIDs: ingredientIds
    }, token)
    return true
  } catch (error) {
    console.error('Error creating menu item:', error)
    return false
  }
}

// ========== SAFE BIDIRECTIONAL SYNC FUNCTIONS ==========

// Safe import function - only creates missing items
async function performSafeImport(
  squareItems: SquareItem[], 
  localAllergens: any[], 
  localIngredients: any[], 
  localMenuItems: any[], 
  token: string, 
  result: SyncResult
): Promise<void> {
  console.log("🛡️ Performing safe import (create-only)...")
  
  // Create lookup maps for existing items
  const existingAllergenNames = new Set(localAllergens.map(a => a.allergenName?.toLowerCase()))
  const existingIngredientNames = new Set(localIngredients.map(i => i.ingredientName?.toLowerCase()))
  const existingMenuItemNames = new Set(localMenuItems.map(m => m.menuItemName?.toLowerCase()))
  
  // Collect all allergens and ingredients from Square
  const squareAllergens = new Set<string>()
  const squareIngredients = new Map<string, { expiryDays: number; allergenNames: string[] }>()
  const squareMenuItems = new Map<string, string[]>()
  
  // Process modifier lists (ingredients)
  const modifierLists = squareItems.filter(item => item.type === 'MODIFIER_LIST')
  for (const squareItem of modifierLists) {
    const { ingredients, allergens } = extractFromModifierList(squareItem)
    
    // Only add if ingredient doesn't exist locally
    ingredients.forEach(ingredient => {
      if (!existingIngredientNames.has(ingredient.toLowerCase())) {
        squareIngredients.set(ingredient, {
          expiryDays: calculateSmartExpiryDays(ingredient),
          allergenNames: allergens
        })
      }
    })
    
    allergens.forEach(allergen => {
      if (!existingAllergenNames.has(allergen.toLowerCase())) {
        squareAllergens.add(allergen)
      }
    })
  }
  
  // Process menu items
  const menuItems = squareItems.filter(item => item.type === 'ITEM')
  for (const squareItem of menuItems) {
    const itemName = squareItem.item_data?.name || ''
    if (!itemName || existingMenuItemNames.has(itemName.toLowerCase())) continue
    
    // Extract ingredients from linked modifier lists
    const menuItemIngredients: string[] = []
    const modifierListInfo = squareItem.item_data?.modifier_list_info || []
    
    for (const modifierInfo of modifierListInfo) {
      const modifierList = squareItems.find(item => item.id === modifierInfo.modifier_list_id)
      if (modifierList) {
        const { ingredients } = extractFromModifierList(modifierList)
        menuItemIngredients.push(...ingredients)
      }
    }
    
    if (menuItemIngredients.length > 0) {
      squareMenuItems.set(itemName, menuItemIngredients)
    }
  }
  
  // Create missing allergens
  console.log(`📝 Creating ${squareAllergens.size} missing allergens...`)
  for (const allergenName of squareAllergens) {
    console.log(`+ Creating allergen: "${allergenName}"`)
    const newAllergenId = await createOrGetAllergen(allergenName, token)
    if (newAllergenId) {
      result.stats.allergens.created++
      result.newItems.allergens.push({ name: allergenName, id: newAllergenId })
    }
  }
  
  // Create missing ingredients
  console.log(`📝 Creating ${squareIngredients.size} missing ingredients...`)
  for (const [ingredientName, ingredientData] of squareIngredients) {
    console.log(`+ Creating ingredient: "${ingredientName}"`)
    
    // Resolve allergen IDs
    const resolvedAllergenIds: string[] = []
    for (const allergenName of ingredientData.allergenNames) {
      const existingAllergen = findExistingAllergen(allergenName, localAllergens)
      if (existingAllergen) {
        resolvedAllergenIds.push(existingAllergen.id)
      }
    }
    
    const newIngredientId = await createOrGetIngredient(ingredientName, resolvedAllergenIds, token, ingredientData.expiryDays)
    if (newIngredientId) {
      result.stats.ingredients.created++
      result.newItems.ingredients.push({ name: ingredientName, id: newIngredientId })
    }
  }
  
  // Create missing menu items
  console.log(`📝 Creating ${squareMenuItems.size} missing menu items...`)
  for (const [itemName, ingredientNames] of squareMenuItems) {
    console.log(`+ Creating menu item: "${itemName}"`)
    
    // Resolve ingredient IDs
    const resolvedIngredientIds: string[] = []
    for (const ingredientName of ingredientNames) {
      const existingIngredient = findExistingIngredient(ingredientName, localIngredients)
      if (existingIngredient) {
        resolvedIngredientIds.push(existingIngredient.uuid)
      }
    }
    
    if (resolvedIngredientIds.length > 0) {
      const success = await createMenuItem(itemName, resolvedIngredientIds, token)
      if (success) {
        result.stats.menuItems.created++
        result.newItems.menuItems.push({ name: itemName, id: 'new', ingredientIds: resolvedIngredientIds })
      }
    }
  }
}

// Safe export function - only creates missing items in Square
async function performSafeExport(
  squareAccessToken: string,
  localAllergens: any[],
  localIngredients: any[],
  localMenuItems: any[],
  result: SyncResult
): Promise<void> {
  console.log("🛡️ Performing safe export (create-only)...")
  
  // Get existing Square items
  const existingModifierLists = await fetchAllModifierLists(squareAccessToken)
  const existingMenuItems = await fetchAllMenuItems(squareAccessToken)
  
  // Create lookup maps
  const existingModifierListNames = new Set(existingModifierLists.map(ml => ml.modifier_list_data?.name?.toLowerCase()))
  const existingMenuItemNames = new Set(existingMenuItems.map(mi => mi.item_data?.name?.toLowerCase()))
  
  // Create missing ingredients as modifier lists
  console.log(`📝 Creating missing ingredients in Square...`)
  for (const ingredient of localIngredients) {
    const modifierListName = `Ingredients - ${ingredient.ingredientName}`
    
    if (!existingModifierListNames.has(modifierListName.toLowerCase())) {
      console.log(`+ Creating modifier list: "${modifierListName}"`)
      const allergenNames = ingredient.allergens?.map((a: any) => a.allergenName) || []
      
      const modifierListId = await createModifierList(
        squareAccessToken,
        modifierListName,
        `Contains ${ingredient.ingredientName}`,
        [ingredient.ingredientName],
        allergenNames
      )
      
      if (modifierListId) {
        result.stats.ingredients.created++
      }
    }
  }
  
  // Create missing menu items
  console.log(`📝 Creating missing menu items in Square...`)
  for (const menuItem of localMenuItems) {
    if (!existingMenuItemNames.has(menuItem.menuItemName?.toLowerCase())) {
      console.log(`+ Creating menu item: "${menuItem.menuItemName}"`)
      
      // Get ingredient names for this menu item
      const ingredientNames = menuItem.ingredients?.map((i: any) => i.ingredientName) || []
      
      // Get modifier list IDs for these ingredients
      const modifierListIds: string[] = []
      for (const ingredientName of ingredientNames) {
        const modifierListName = `Ingredients - ${ingredientName}`
        const existingModifierList = existingModifierLists.find(ml => 
          ml.modifier_list_data?.name === modifierListName
        )
        if (existingModifierList) {
          modifierListIds.push(existingModifierList.id)
        }
      }
      
      if (modifierListIds.length > 0) {
        const menuItemId = await createMenuItemInSquare(
          squareAccessToken,
          menuItem.menuItemName,
          modifierListIds,
          `Menu item: ${menuItem.menuItemName}`,
          menuItem.allergens?.map((a: any) => a.allergenName) || []
        )
        
        if (menuItemId) {
          result.stats.menuItems.created++
        }
      }
    }
  }
}

// Create a modifier list in Square
async function createModifierList(accessToken: string, name: string, description: string, modifiers: string[], allergens?: string[]): Promise<string | null> {
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const modifierObjects = modifiers.map((modifierName, index) => ({
        type: 'MODIFIER',
        id: `#modifier_${Date.now()}_${index}`,
        modifier_data: {
          name: modifierName,
          description: allergens && allergens.length > 0 
            ? `Contains ${modifierName}. Allergens: ${allergens.join(', ')}`
            : `Contains ${modifierName}`
        }
      }))

      const response = await fetch('https://connect.squareup.com/v2/catalog/object', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-01-17',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idempotency_key: `modifier_list_${name}_${Date.now()}_${attempt}`,
          object: {
            type: 'MODIFIER_LIST',
            id: `#${name.replace(/\s+/g, '_').toLowerCase()}`,
            modifier_list_data: {
              name: name,
              description: description,
              selection_type: 'SINGLE',
              modifiers: modifierObjects
            },
            present_at_all_locations: true
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        
        // Check if it's a rate limit error
        if (error.errors?.[0]?.code === 'RATE_LIMITED' && attempt < maxRetries) {
          console.log(`⚠️ Rate limited, retrying... (attempt ${attempt}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
          continue
        }
        
        console.error('Square API error:', error)
        return null
      }
      
      const data = await response.json()
      return data.catalog_object?.id || null
    } catch (error) {
      console.error('Error creating modifier list:', error)
      return null
    }
  }
  
  return null
}

// Get modifier list IDs for ingredients
async function getModifierListIdsForIngredients(accessToken: string, ingredientNames: string[]): Promise<string[]> {
  try {
    const response = await fetch('https://connect.squareup.com/v2/catalog/list?types=MODIFIER_LIST', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-17',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Square API error:', error)
      return []
    }

    const data = await response.json()
    const modifierLists = data.objects || []
    
    const modifierListIds: string[] = []
    
    for (const ingredientName of ingredientNames) {
      const modifierListName = `Ingredients - ${ingredientName}`
      const modifierList = modifierLists.find((ml: any) => 
        ml.modifier_list_data?.name === modifierListName
      )
      
      if (modifierList) {
        modifierListIds.push(modifierList.id)
      }
    }
    
    return modifierListIds
  } catch (error) {
    console.error('Error getting modifier list IDs:', error)
    return []
  }
}

// Fetch all modifier lists (optimized for batch operations)
async function fetchAllModifierLists(accessToken: string): Promise<any[]> {
  try {
    const response = await fetch('https://connect.squareup.com/v2/catalog/list?types=MODIFIER_LIST', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-17',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Square API error:', error)
      return []
    }
    
    const data = await response.json()
    return data.objects || []
  } catch (error) {
    console.error('Error fetching modifier lists:', error)
    return []
  }
}

// Find modifier list by name
async function findModifierListByName(accessToken: string, name: string): Promise<string | null> {
  try {
    const response = await fetch('https://connect.squareup.com/v2/catalog/list?types=MODIFIER_LIST', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-17',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Square API error:', error)
      return null
    }
    
    const data = await response.json()
    const modifierLists = data.objects || []
    
    const modifierList = modifierLists.find((ml: any) => 
      ml.modifier_list_data?.name === name
    )
    
    return modifierList?.id || null
  } catch (error) {
    console.error('Error finding modifier list:', error)
    return null
  }
}

// Fetch all menu items (optimized for batch operations)
async function fetchAllMenuItems(accessToken: string): Promise<any[]> {
  try {
    const response = await fetch('https://connect.squareup.com/v2/catalog/list?types=ITEM', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-17',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Square API error:', error)
      return []
    }

    const data = await response.json()
    return data.objects || []
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return []
  }
}

// Find menu item by name
async function findMenuItemByName(accessToken: string, name: string): Promise<string | null> {
  try {
    const response = await fetch('https://connect.squareup.com/v2/catalog/list?types=ITEM', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-17',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Square API error:', error)
      return null
    }

    const data = await response.json()
    const items = data.objects || []
    
    const menuItem = items.find((item: any) => 
      item.item_data?.name === name
    )
    
    return menuItem?.id || null
  } catch (error) {
    console.error('Error finding menu item:', error)
    return null
  }
}

// Create menu item in Square
async function createMenuItemInSquare(accessToken: string, name: string, modifierListIds: string[], description?: string, allergens?: string[]): Promise<string | null> {
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Build description with allergen information
      let finalDescription = description || `Menu item: ${name}`
      if (allergens && allergens.length > 0) {
        finalDescription += `. Allergens: ${allergens.join(', ')}`
      }

      const itemData: any = {
        name: name,
        description: finalDescription,
        modifier_list_info: modifierListIds.map(id => ({
          modifier_list_id: id,
          enabled: true
        })),
        // Add required variation
        variations: [
          {
            type: 'ITEM_VARIATION',
            id: `#${name.replace(/\s+/g, '_').toLowerCase()}_variation`,
            item_variation_data: {
              name: 'Regular',
              pricing_type: 'FIXED_PRICING',
              track_inventory: false,
              price_money: {
                amount: 0,
                currency: 'NPR'
              }
            }
          }
        ]
      }

      const response = await fetch('https://connect.squareup.com/v2/catalog/object', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-01-17',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idempotency_key: `menu_item_${name}_${Date.now()}_${attempt}`,
          object: {
            type: 'ITEM',
            id: `#${name.replace(/\s+/g, '_').toLowerCase()}`,
            item_data: itemData,
            present_at_all_locations: true
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        
        // Check if it's a rate limit error
        if (error.errors?.[0]?.code === 'RATE_LIMITED' && attempt < maxRetries) {
          console.log(`⚠️ Rate limited, retrying... (attempt ${attempt}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
          continue
        }
        
        console.error('Square API error:', error)
        return null
      }
      
      const data = await response.json()
      return data.catalog_object?.id || null
    } catch (error) {
      console.error('Error creating menu item:', error)
      return null
    }
  }
  
  return null
}

// Update modifier list to include present_at_all_locations
async function updateModifierListWithPresentAtAllLocations(accessToken: string, modifierListId: string): Promise<boolean> {
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // First, get the current modifier list
      const getResponse = await fetch(`https://connect.squareup.com/v2/catalog/object/${modifierListId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-01-17',
          'Content-Type': 'application/json'
        }
      })

      if (!getResponse.ok) {
        console.error(`❌ Failed to get modifier list: ${getResponse.status} ${getResponse.statusText}`)
        return false
      }

      const modifierListData = await getResponse.json()
      const catalogObject = modifierListData.object

      if (!catalogObject) {
        console.error('❌ No catalog object found in response')
        return false
      }

      // Update the modifier list with present_at_all_locations
      const updateResponse = await fetch('https://connect.squareup.com/v2/catalog/object', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-01-17',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idempotency_key: `update_modifier_list_${modifierListId}_${Date.now()}_${attempt}`,
          object: {
            type: 'MODIFIER_LIST',
            id: modifierListId,
            version: catalogObject.version,
            modifier_list_data: catalogObject.modifier_list_data,
            present_at_all_locations: true
          }
        })
      })

      if (!updateResponse.ok) {
        const error = await updateResponse.json()
        
        // Check if it's a version mismatch error
        if (error.errors?.[0]?.code === 'VERSION_MISMATCH' && attempt < maxRetries) {
          console.log(`⚠️ Version mismatch, retrying... (attempt ${attempt}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
          continue
        }
        
        // Check if it's a rate limit error
        if (error.errors?.[0]?.code === 'RATE_LIMITED' && attempt < maxRetries) {
          console.log(`⚠️ Rate limited, retrying... (attempt ${attempt}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
          continue
        }
        
        console.error('Failed to update modifier list:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating modifier list:', error)
      return false
    }
  }
  
  return false
}

// Update menu item with modifier lists
async function updateMenuItemWithModifiers(accessToken: string, menuItemId: string, modifierListIds: string[]): Promise<boolean> {
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // First, get the current menu item
      const getResponse = await fetch(`https://connect.squareup.com/v2/catalog/object/${menuItemId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-01-17',
          'Content-Type': 'application/json'
        }
      })

      if (!getResponse.ok) {
        console.error(`❌ Failed to get menu item: ${getResponse.status} ${getResponse.statusText}`)
        return false
      }

      const menuItemData = await getResponse.json()
      const catalogObject = menuItemData.object

      if (!catalogObject) {
        console.error('❌ No catalog object found in response')
        return false
      }

      // Prepare the updated item_data
      const updatedItemData = {
        ...catalogObject.item_data,
        modifier_list_info: modifierListIds.map(id => ({
          modifier_list_id: id,
          enabled: true
        })),
        // Ensure variations exist (required by Square)
        variations: catalogObject.item_data.variations || [
          {
            type: 'ITEM_VARIATION',
            id: `#${catalogObject.item_data.name.replace(/\s+/g, '_').toLowerCase()}_variation`,
            item_variation_data: {
              name: 'Regular',
              pricing_type: 'FIXED_PRICING',
              track_inventory: false,
              price_money: {
                amount: 0,
                currency: 'NPR'
              }
            }
          }
        ]
      }

      // Update the menu item with modifier lists
      const updateResponse = await fetch('https://connect.squareup.com/v2/catalog/object', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-01-17',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idempotency_key: `update_menu_item_${menuItemId}_${Date.now()}_${attempt}`,
          object: {
            type: 'ITEM',
            id: menuItemId,
            version: catalogObject.version,
            item_data: updatedItemData
          }
        })
      })

      if (!updateResponse.ok) {
        const error = await updateResponse.json()
        
        // Check if it's a version mismatch error
        if (error.errors?.[0]?.code === 'VERSION_MISMATCH' && attempt < maxRetries) {
          console.log(`⚠️ Version mismatch, retrying... (attempt ${attempt}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second before retry
          continue
        }
        
        // Check if it's a rate limit error
        if (error.errors?.[0]?.code === 'RATE_LIMITED' && attempt < maxRetries) {
          console.log(`⚠️ Rate limited, retrying... (attempt ${attempt}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
          continue
        }
        
        console.error('Failed to update menu item:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating menu item:', error)
      return false
    }
  }
  
  return false
}
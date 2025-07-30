import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/pg'
import { verifyAuthToken } from '@/lib/auth'
import { getAllIngredients, getAllMenuItems } from '@/lib/api'

interface SyncToSquareResult {
  success: boolean
  modifierListsCreated: number
  menuItemsUpdated: number
  errors: string[]
  duration: number
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { userUuid } = await verifyAuthToken(req)
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || ''
    
    if (!token) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    console.log(`🔄 Starting sync to Square for user: ${userUuid}`)

    const result: SyncToSquareResult = {
      success: false,
      modifierListsCreated: 0,
      menuItemsUpdated: 0,
      errors: [],
      duration: 0
    }

    // ========== STEP 1: GET USER'S SQUARE TOKENS ==========
    const userResult = await pool.query(
      'SELECT square_access_token, square_merchant_id FROM user_profiles WHERE user_id = $1',
      [userUuid]
    )

    if (userResult.rows.length === 0 || !userResult.rows[0].square_access_token) {
      return NextResponse.json({ error: 'Square not connected' }, { status: 400 })
    }

    const { square_access_token, square_merchant_id } = userResult.rows[0]

    // ========== STEP 2: FETCH OUR INGREDIENTS ==========
    console.log("Fetching our ingredients...")
    const ingredientsResponse = await getAllIngredients(token)
    const ingredients = Array.isArray(ingredientsResponse) ? ingredientsResponse : ingredientsResponse?.data || []

    // ========== STEP 3: CREATE MODIFIER LISTS FOR INGREDIENTS ==========
    console.log("Creating modifier lists for ingredients...")
    
    for (const ingredient of ingredients) {
      try {
        const modifierListName = `Ingredients - ${ingredient.ingredientName}`
        const modifierListDescription = `Contains ${ingredient.ingredientName}`
        
        // Create modifier list in Square
        const modifierListId = await createModifierList(
          square_access_token,
          modifierListName,
          modifierListDescription,
          [ingredient.ingredientName]
        )
        
        if (modifierListId) {
          result.modifierListsCreated++
          console.log(`✅ Created modifier list: "${modifierListName}"`)
        }
      } catch (error) {
        console.error(`❌ Failed to create modifier list for ${ingredient.ingredientName}:`, error)
        result.errors.push(`Failed to create modifier list for ${ingredient.ingredientName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // ========== STEP 4: UPDATE MENU ITEMS WITH MODIFIER LISTS ==========
    console.log("Updating menu items with modifier lists...")
    
    const menuItemsResponse = await getAllMenuItems(token)
    const menuItems = menuItemsResponse?.data || []
    
    for (const category of menuItems) {
      if (!category.items) continue
      
      for (const menuItem of category.items) {
        try {
          if (menuItem.ingredients && menuItem.ingredients.length > 0) {
            // Get modifier list IDs for this menu item's ingredients
            const modifierListIds = await getModifierListIdsForIngredients(
              square_access_token,
              menuItem.ingredients.map((ing: any) => ing.ingredientName)
            )
            
            if (modifierListIds.length > 0) {
              // Update menu item with modifier lists
              const success = await updateMenuItemWithModifiers(
                square_access_token,
                menuItem.menuItemID,
                modifierListIds
              )
              
              if (success) {
                result.menuItemsUpdated++
                console.log(`✅ Updated menu item: "${menuItem.menuItemName}"`)
              }
            }
          }
        } catch (error) {
          console.error(`❌ Failed to update menu item ${menuItem.menuItemName}:`, error)
          result.errors.push(`Failed to update menu item ${menuItem.menuItemName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    }

    result.success = result.errors.length === 0
    result.duration = Date.now() - startTime

    console.log(`✅ Sync to Square completed in ${result.duration}ms`)
    console.log(`📊 Results: ${result.modifierListsCreated} modifier lists created, ${result.menuItemsUpdated} menu items updated`)

    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Sync to Square error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Create a modifier list in Square
async function createModifierList(accessToken: string, name: string, description: string, modifiers: string[]): Promise<string | null> {
  try {
    const modifierObjects = modifiers.map(modifierName => ({
      type: 'MODIFIER',
      modifier_data: {
        name: modifierName,
        description: `Contains ${modifierName}`,
        price_money: {
          amount: 0,
          currency: 'USD'
        }
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
        idempotency_key: `modifier_list_${name}_${Date.now()}`,
        object: {
          type: 'MODIFIER_LIST',
          id: `#${name.replace(/\s+/g, '_').toLowerCase()}`,
          modifier_list_data: {
            name: name,
            description: description,
            selection_type: 'SINGLE',
            modifiers: modifierObjects
          }
        }
      })
    })

    if (!response.ok) {
      const error = await response.json()
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

// Update menu item with modifier lists
async function updateMenuItemWithModifiers(accessToken: string, menuItemId: string, modifierListIds: string[]): Promise<boolean> {
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
      console.error('Failed to get menu item')
      return false
    }

    const menuItemData = await getResponse.json()
    const catalogObject = menuItemData.catalog_object

    if (!catalogObject) {
      console.error('No catalog object found')
      return false
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
        idempotency_key: `update_menu_item_${menuItemId}_${Date.now()}`,
        object: {
          ...catalogObject,
          item_data: {
            ...catalogObject.item_data,
            modifier_list_info: modifierListIds.map(id => ({
              modifier_list_id: id,
              enabled: true
            }))
          }
        }
      })
    })

    if (!updateResponse.ok) {
      const error = await updateResponse.json()
      console.error('Failed to update menu item:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error updating menu item:', error)
    return false
  }
} 
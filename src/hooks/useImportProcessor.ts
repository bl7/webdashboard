import { useAllergens, Allergen } from "@/hooks/useAllergens"
import { useIngredients, Ingredient } from "@/hooks/useIngredients"
import { useMenuItems, MenuItem } from "@/hooks/useMenuItem"
import { useState } from "react"

export type ParsedAllergen = { name: string }
export type ParsedIngredient = {
  name: string
  expiryDays: number
  allergenNames: string[]
}
export type ParsedMenuItem = {
  name: string
  ingredientNames: string[]
}

type ProcessingResults = {
  stats: {
    allergens: { existing: number; created: number }
    ingredients: { existing: number; created: number }
    menuItems: { existing: number; created: number; skipped: number }
  }
  warnings: string[]
  createdMenuItems: { name: string; ingredientIds: string[] }[]
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

export function useImportProcessor() {
  const { allergens, addAllergen } = useAllergens()
  const { ingredients, addNewIngredient } = useIngredients()
  const { menuItems, addNewMenuItem } = useMenuItems()
  const [processing, setProcessing] = useState(false)

  // Enhanced name normalization for better matching
  const normalizeName = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/ies$/, "y") // berries -> berry
      .replace(/ves$/, "f") // leaves -> leaf
      .replace(/es$/, "") // tomatoes -> tomato
      .replace(/s$/, "") // eggs -> egg
  }

  // Exact (case-insensitive, trimmed) matching only
  const findExistingByName = <T extends { name?: string; ingredientName?: string; menuItemName?: string }>(
    searchName: string,
    items: T[],
    getNameFn: (item: T) => string
  ): T | undefined => {
    if (!searchName?.trim()) return undefined;
    const normalizedSearch = searchName.trim().toLowerCase();
    return items.find((item) => getNameFn(item).trim().toLowerCase() === normalizedSearch);
  }

  // Main import processing function
  async function processImport(
    parsedAllergens: ParsedAllergen[],
    parsedIngredients: ParsedIngredient[],
    parsedMenuItems: ParsedMenuItem[]
  ): Promise<ProcessingResults> {
    setProcessing(true)

    const results: ProcessingResults = {
      stats: {
        allergens: { existing: 0, created: 0 },
        ingredients: { existing: 0, created: 0 },
        menuItems: { existing: 0, created: 0, skipped: 0 },
      },
      warnings: [],
      createdMenuItems: [],
      existingItems: {
        allergens: [],
        ingredients: [],
        menuItems: [],
      },
      newItems: {
        allergens: [],
        ingredients: [],
        menuItems: [],
      },
    }

    // Master ID mapping for all entities
    const allergenIdMap = new Map<string, string>()
    const ingredientIdMap = new Map<string, string>()

    // --- Use local arrays for up-to-date lookups ---
    let localAllergens: Allergen[] = [...allergens]
    let localIngredients: Ingredient[] = [...ingredients]

    try {
      // ========== STEP 1: PRE-LOAD ALL EXISTING DATA ==========
      console.log("Pre-loading all existing data from database...")

      // Pre-load ALL existing allergens
      for (const existingAllergen of localAllergens) {
        const key1 = existingAllergen.name.toLowerCase()
        const key2 = normalizeName(existingAllergen.name)
        allergenIdMap.set(key1, existingAllergen.id)
        allergenIdMap.set(key2, existingAllergen.id)
      }
      console.log(`Pre-loaded ${localAllergens.length} existing allergens`)

      // Pre-load ALL existing ingredients
      for (const existingIngredient of localIngredients) {
        const key1 = existingIngredient.ingredientName.toLowerCase()
        const key2 = normalizeName(existingIngredient.ingredientName)
        ingredientIdMap.set(key1, existingIngredient.uuid)
        ingredientIdMap.set(key2, existingIngredient.uuid)
      }
      console.log(`Pre-loaded ${localIngredients.length} existing ingredients`)

      // ========== STEP 2: COLLECT ALL REQUIRED ALLERGENS AND INGREDIENTS ==========
      console.log("Collecting all required allergens and ingredients...")
      
      // Collect all allergens from parsed ingredients
      const allRequiredAllergens = new Set<string>()
      parsedAllergens.forEach(allergen => allRequiredAllergens.add(allergen.name))
      
      // Collect all ingredients from parsed ingredients and menu items
      const allRequiredIngredients = new Map<string, { expiryDays: number; allergenNames: string[] }>()
      
      // Add ingredients from parsed ingredients
      parsedIngredients.forEach(ingredient => {
        allRequiredIngredients.set(ingredient.name, {
          expiryDays: ingredient.expiryDays,
          allergenNames: ingredient.allergenNames
        })
      })
      
      // Add ingredients from menu items (with default values if not in parsed ingredients)
      parsedMenuItems.forEach(menuItem => {
        menuItem.ingredientNames.forEach(ingredientName => {
          if (!allRequiredIngredients.has(ingredientName)) {
            allRequiredIngredients.set(ingredientName, {
              expiryDays: 7, // Default expiry days
              allergenNames: [] // No allergens by default
            })
          }
        })
      })
      
      // Collect allergens from all ingredients
      allRequiredIngredients.forEach(ingredient => {
        ingredient.allergenNames.forEach(allergen => allRequiredAllergens.add(allergen))
      })

      // ========== STEP 3: PROCESS ALLERGENS ==========
      console.log("Processing allergens...")

      for (const allergenName of allRequiredAllergens) {
        if (!allergenName?.trim()) continue

        // Check if allergen exists in DB (using fuzzy matching)
        const existingAllergen = findExistingByName(allergenName, localAllergens, (a) => a.name)

        if (existingAllergen) {
          // EXISTS: Use existing ID, don't create
          const key1 = allergenName.toLowerCase()
          const key2 = normalizeName(allergenName)
          allergenIdMap.set(key1, existingAllergen.id)
          allergenIdMap.set(key2, existingAllergen.id)
          results.stats.allergens.existing++
          console.log(
            `✓ Found existing allergen: "${allergenName}" matches "${existingAllergen.name}" (ID: ${existingAllergen.id})`
          )
          results.existingItems.allergens.push({ name: existingAllergen.name, id: existingAllergen.id })
        } else {
          // NEW: Create custom allergen
          console.log(`+ Creating new allergen: "${allergenName}"`)
          const newAllergen = await addAllergen(allergenName)

          // --- Add to localAllergens for immediate lookup ---
          localAllergens.push(newAllergen)

          const key1 = allergenName.toLowerCase()
          const key2 = normalizeName(allergenName)
          allergenIdMap.set(key1, newAllergen.id)
          allergenIdMap.set(key2, newAllergen.id)
          results.stats.allergens.created++
          console.log(`✓ Created allergen: "${allergenName}" (ID: ${newAllergen.id})`)
          results.newItems.allergens.push({ name: allergenName, id: newAllergen.id })
        }
      }

      // ========== STEP 4: PROCESS INGREDIENTS ==========
      console.log("Processing ingredients...")

      for (const [ingredientName, ingredientData] of allRequiredIngredients) {
        if (!ingredientName?.trim()) continue

        // Check if ingredient exists in DB (using fuzzy matching)
        const existingIngredient = findExistingByName(
          ingredientName,
          localIngredients,
          (i) => i.ingredientName
        )

        if (existingIngredient) {
          // EXISTS: Use existing ID, don't create
          const key1 = ingredientName.toLowerCase()
          const key2 = normalizeName(ingredientName)
          ingredientIdMap.set(key1, existingIngredient.uuid)
          ingredientIdMap.set(key2, existingIngredient.uuid)
          results.stats.ingredients.existing++
          console.log(
            `✓ Found existing ingredient: "${ingredientName}" matches "${existingIngredient.ingredientName}" (ID: ${existingIngredient.uuid})`
          )
          results.existingItems.ingredients.push({ name: existingIngredient.ingredientName, id: existingIngredient.uuid })
        } else {
          // NEW: Create ingredient with resolved allergen IDs
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
              const existingAllergen = findExistingByName(allergenName, localAllergens, (a) => a.name)
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
          const success = await addNewIngredient({
            ingredientName: ingredientName,
            expiryDays: ingredientData.expiryDays,
            allergenIDs: resolvedAllergenIds,
          })

          if (success) {
            // Fetch the real ingredient from the backend by name
            try {
              const token = localStorage.getItem("token")
              if (token) {
                const allIngredientsRes = await import("@/lib/api").then(m => m.getAllIngredients(token))
                const realIngredient = Array.isArray(allIngredientsRes.data)
                  ? allIngredientsRes.data.find((ing: any) => ing.ingredientName.trim().toLowerCase() === ingredientName.trim().toLowerCase())
                  : null
                if (realIngredient) {
              const key1 = ingredientName.toLowerCase()
              const key2 = normalizeName(ingredientName)
                  ingredientIdMap.set(key1, realIngredient.uuid)
                  ingredientIdMap.set(key2, realIngredient.uuid)
              results.stats.ingredients.created++
              console.log(
                    `✓ Created ingredient: "${ingredientName}" (ID: ${realIngredient.uuid})`
              )
                  results.newItems.ingredients.push({ name: ingredientName, id: realIngredient.uuid })
                  // Add to localIngredients for immediate lookup
                  localIngredients.push({
                    uuid: realIngredient.uuid,
                    ingredientName: realIngredient.ingredientName,
                    expiryDays: realIngredient.expiryDays,
                    allergens: realIngredient.allergens || [],
                  })
                } else {
                  console.warn(`Warning: Could not find real ingredient in DB after creation: ${ingredientName}`)
                }
              }
            } catch (err) {
              console.error('Error fetching real ingredient after creation:', err)
            }
          } else {
            results.warnings.push(`Failed to create ingredient: ${ingredientName}`)
          }
        }
      }

      // ========== STEP 5: PROCESS MENU ITEMS ==========
      console.log("Processing menu items...")

      for (const parsedMenuItem of parsedMenuItems) {
        if (!parsedMenuItem.name?.trim()) continue

        // Check if menu item exists in DB (using fuzzy matching)
        const existingMenuItem = findExistingByName(parsedMenuItem.name, menuItems, (m) => m.menuItemName)

        if (existingMenuItem) {
          // EXISTS: Skip completely, don't create
          results.stats.menuItems.existing++
          console.log(
            `✓ Found existing menu item: "${parsedMenuItem.name}" matches "${existingMenuItem.menuItemName}" - skipping`
          )
          results.existingItems.menuItems.push({ name: existingMenuItem.menuItemName, id: existingMenuItem.menuItemID })
          continue
        }

        // NEW: Create menu item with resolved ingredient IDs
        console.log(`+ Creating new menu item: "${parsedMenuItem.name}"`)

        const resolvedIngredientIds: string[] = []
        const foundIngredients: string[] = []

        for (const ingredientName of parsedMenuItem.ingredientNames) {
          if (!ingredientName?.trim()) continue

          // Try direct lookup first
          let ingredientId =
            ingredientIdMap.get(ingredientName.toLowerCase()) ||
            ingredientIdMap.get(normalizeName(ingredientName))

          if (!ingredientId) {
            // Try fuzzy matching against existing ingredients
            const existingIngredient = findExistingByName(
              ingredientName,
              localIngredients,
              (i) => i.ingredientName
            )
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
            console.error(`Error: Could not find ingredient "${ingredientName}" for menu item "${parsedMenuItem.name}"`)
            results.warnings.push(`Could not resolve ingredient "${ingredientName}" for menu item "${parsedMenuItem.name}"`)
          }
        }

        console.log(`  Found ingredients: ${foundIngredients.join(", ")}`)
        
        if (resolvedIngredientIds.length === 0) {
          console.error(`Error: No ingredients resolved for menu item "${parsedMenuItem.name}"`)
          results.warnings.push(`No ingredients could be resolved for menu item "${parsedMenuItem.name}"`)
          results.stats.menuItems.skipped++
          continue
        }

        // Create the menu item
        const success = await addNewMenuItem({
          menuItemName: parsedMenuItem.name,
          ingredientIDs: resolvedIngredientIds,
        })

        if (success) {
          results.createdMenuItems.push({
            name: parsedMenuItem.name,
            ingredientIds: resolvedIngredientIds,
          })
          results.stats.menuItems.created++
          console.log(
            `✓ Created menu item: "${parsedMenuItem.name}" with ${resolvedIngredientIds.length} ingredients`
          )
          results.newItems.menuItems.push({ name: parsedMenuItem.name, id: resolvedIngredientIds[0], ingredientIds: resolvedIngredientIds })
        } else {
          results.warnings.push(`Failed to create menu item: ${parsedMenuItem.name}`)
          results.stats.menuItems.skipped++
        }
      }

      console.log("Import processing completed:", results.stats)
      return results
    } catch (error) {
      console.error("Error during import processing:", error)
      throw error
    } finally {
      setProcessing(false)
    }
  }

  return {
    processImport,
    processing,
    normalizeName, // For debugging
  }
}

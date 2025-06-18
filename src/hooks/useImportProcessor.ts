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

  // Enhanced fuzzy matching for all entity types
  const findExistingByName = <T extends { name?: string; ingredientName?: string }>(
    searchName: string,
    items: T[],
    getNameFn: (item: T) => string
  ): T | undefined => {
    if (!searchName?.trim()) return undefined

    const normalizedSearch = normalizeName(searchName)

    // 1. Exact normalized match first
    const exactMatch = items.find((item) => normalizeName(getNameFn(item)) === normalizedSearch)
    if (exactMatch) return exactMatch

    // 2. Partial match for variations like "egg" vs "eggs"
    const partialMatch = items.find((item) => {
      const itemName = normalizeName(getNameFn(item))
      return (
        (itemName.includes(normalizedSearch) || normalizedSearch.includes(itemName)) &&
        Math.abs(itemName.length - normalizedSearch.length) <= 2
      )
    })
    if (partialMatch) return partialMatch

    // 3. Word-based matching for compound names like "chicken patty" vs "patty"
    const searchWords = normalizedSearch.split(" ")
    const wordMatch = items.find((item) => {
      const itemName = normalizeName(getNameFn(item))
      const itemWords = itemName.split(" ")

      // Check if any significant word matches
      return searchWords.some(
        (searchWord) =>
          searchWord.length > 2 && // Ignore very short words
          itemWords.some((itemWord) => itemWord === searchWord)
      )
    })
    if (wordMatch) return wordMatch

    // 4. Substring matching for cases like "marinara sauce" vs "sauce"
    return items.find((item) => {
      const itemName = normalizeName(getNameFn(item))
      return itemName.includes(normalizedSearch) || normalizedSearch.includes(itemName)
    })
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
    }

    // Master ID mapping for all entities
    const allergenIdMap = new Map<string, string>()
    const ingredientIdMap = new Map<string, string>()

    try {
      // ========== STEP 1: PRE-LOAD ALL EXISTING DATA ==========
      console.log("Pre-loading all existing data from database...")

      // Pre-load ALL existing allergens
      for (const existingAllergen of allergens) {
        const key1 = existingAllergen.name.toLowerCase()
        const key2 = normalizeName(existingAllergen.name)
        allergenIdMap.set(key1, existingAllergen.id)
        allergenIdMap.set(key2, existingAllergen.id)
      }
      console.log(`Pre-loaded ${allergens.length} existing allergens`)

      // Pre-load ALL existing ingredients
      for (const existingIngredient of ingredients) {
        const key1 = existingIngredient.ingredientName.toLowerCase()
        const key2 = normalizeName(existingIngredient.ingredientName)
        ingredientIdMap.set(key1, existingIngredient.uuid)
        ingredientIdMap.set(key2, existingIngredient.uuid)
      }
      console.log(`Pre-loaded ${ingredients.length} existing ingredients`)

      // ========== STEP 2: PROCESS ALLERGENS ==========
      console.log("Processing allergens...")

      for (const parsedAllergen of parsedAllergens) {
        if (!parsedAllergen.name?.trim()) continue

        // Check if allergen exists in DB (using fuzzy matching)
        const existingAllergen = findExistingByName(parsedAllergen.name, allergens, (a) => a.name)

        if (existingAllergen) {
          // EXISTS: Use existing ID, don't create
          const key1 = parsedAllergen.name.toLowerCase()
          const key2 = normalizeName(parsedAllergen.name)
          allergenIdMap.set(key1, existingAllergen.id)
          allergenIdMap.set(key2, existingAllergen.id)
          results.stats.allergens.existing++
          console.log(
            `✓ Found existing allergen: "${parsedAllergen.name}" matches "${existingAllergen.name}" (ID: ${existingAllergen.id})`
          )
        } else {
          // NEW: Create custom allergen
          console.log(`+ Creating new allergen: "${parsedAllergen.name}"`)
          const newAllergen = await addAllergen(parsedAllergen.name)

          const key1 = parsedAllergen.name.toLowerCase()
          const key2 = normalizeName(parsedAllergen.name)
          allergenIdMap.set(key1, newAllergen.id)
          allergenIdMap.set(key2, newAllergen.id)
          results.stats.allergens.created++
          console.log(`✓ Created allergen: "${parsedAllergen.name}" (ID: ${newAllergen.id})`)
        }
      }

      // ========== STEP 3: PROCESS INGREDIENTS ==========
      console.log("Processing ingredients...")

      for (const parsedIngredient of parsedIngredients) {
        if (!parsedIngredient.name?.trim()) continue

        // Check if ingredient exists in DB (using fuzzy matching)
        const existingIngredient = findExistingByName(
          parsedIngredient.name,
          ingredients,
          (i) => i.ingredientName
        )

        if (existingIngredient) {
          // EXISTS: Use existing ID, don't create
          const key1 = parsedIngredient.name.toLowerCase()
          const key2 = normalizeName(parsedIngredient.name)
          ingredientIdMap.set(key1, existingIngredient.uuid)
          ingredientIdMap.set(key2, existingIngredient.uuid)
          results.stats.ingredients.existing++
          console.log(
            `✓ Found existing ingredient: "${parsedIngredient.name}" matches "${existingIngredient.ingredientName}" (ID: ${existingIngredient.uuid})`
          )
        } else {
          // NEW: Create ingredient with resolved allergen IDs
          console.log(`+ Creating new ingredient: "${parsedIngredient.name}"`)

          // Resolve allergen IDs for this ingredient
          const resolvedAllergenIds: string[] = []
          const missingAllergens: string[] = []

          for (const allergenName of parsedIngredient.allergenNames) {
            if (!allergenName?.trim()) continue

            // Try direct lookup first
            let allergenId =
              allergenIdMap.get(allergenName.toLowerCase()) ||
              allergenIdMap.get(normalizeName(allergenName))

            if (!allergenId) {
              // Try fuzzy matching against existing allergens
              const existingAllergen = findExistingByName(allergenName, allergens, (a) => a.name)
              if (existingAllergen) {
                allergenId = existingAllergen.id
                allergenIdMap.set(allergenName.toLowerCase(), existingAllergen.id)
                allergenIdMap.set(normalizeName(allergenName), existingAllergen.id)
              }
            }

            if (allergenId) {
              resolvedAllergenIds.push(allergenId)
            } else {
              missingAllergens.push(allergenName)
            }
          }

          if (missingAllergens.length > 0) {
            results.warnings.push(
              `Ingredient "${parsedIngredient.name}" references unknown allergens: ${missingAllergens.join(", ")}`
            )
          }

          // Create new ingredient
          const success = await addNewIngredient({
            ingredientName: parsedIngredient.name,
            expiryDays: parsedIngredient.expiryDays,
            allergenIDs: resolvedAllergenIds,
          })

          if (success) {
            // Get the newly created ingredient ID
            const newIngredient = findExistingByName(
              parsedIngredient.name,
              ingredients,
              (i) => i.ingredientName
            )
            if (newIngredient) {
              const key1 = parsedIngredient.name.toLowerCase()
              const key2 = normalizeName(parsedIngredient.name)
              ingredientIdMap.set(key1, newIngredient.uuid)
              ingredientIdMap.set(key2, newIngredient.uuid)
              results.stats.ingredients.created++
              console.log(
                `✓ Created ingredient: "${parsedIngredient.name}" (ID: ${newIngredient.uuid})`
              )
            }
          } else {
            results.warnings.push(`Failed to create ingredient: ${parsedIngredient.name}`)
          }
        }
      }

      // ========== STEP 4: PROCESS MENU ITEMS ==========
      console.log("Processing menu items...")

      for (const parsedMenuItem of parsedMenuItems) {
        if (!parsedMenuItem.name?.trim()) continue

        // Check if menu item exists in DB (using fuzzy matching)
        const existingMenuItem = findExistingByName(parsedMenuItem.name, menuItems, (m) => m.name)

        if (existingMenuItem) {
          // EXISTS: Skip completely, don't create
          results.stats.menuItems.existing++
          console.log(
            `✓ Found existing menu item: "${parsedMenuItem.name}" matches "${existingMenuItem.name}" - skipping`
          )
          continue
        }

        // NEW: Create menu item with resolved ingredient IDs
        console.log(`+ Creating new menu item: "${parsedMenuItem.name}"`)

        const resolvedIngredientIds: string[] = []
        const missingIngredients: string[] = []
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
              ingredients,
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
            missingIngredients.push(ingredientName)
          }
        }

        console.log(`  Found ingredients: ${foundIngredients.join(", ")}`)
        if (missingIngredients.length > 0) {
          console.log(`  Missing ingredients: ${missingIngredients.join(", ")}`)
          results.warnings.push(
            `Skipping menu item "${parsedMenuItem.name}" - missing ingredients: ${missingIngredients.join(", ")}`
          )
          results.stats.menuItems.skipped++
          continue
        }

        // All ingredients resolved - create the menu item
        const success = await addNewMenuItem({
          name: parsedMenuItem.name,
          ingredientIds: resolvedIngredientIds,
          status: "active",
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

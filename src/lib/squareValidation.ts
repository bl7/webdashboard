// Square Validation Utilities for Bidirectional Sync

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  duplicates: string[]
  suggestions: string[]
}

export interface SyncValidationOptions {
  checkDuplicates: boolean
  validateAllergens: boolean
  validateIngredients: boolean
  validateMenuItems: boolean
  strictMode: boolean
}

// Normalize name for consistent comparison
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/ies$/, "y") // berries -> berry
    .replace(/ves$/, "f") // leaves -> leaf
    .replace(/es$/, "") // tomatoes -> tomato
    .replace(/s$/, "") // eggs -> egg
}

// Check for duplicate names in arrays
export function findDuplicates<T extends { name?: string; allergenName?: string; ingredientName?: string; menuItemName?: string }>(
  items: T[],
  nameField: 'name' | 'allergenName' | 'ingredientName' | 'menuItemName' = 'name'
): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  
  for (const item of items) {
    const name = item[nameField]
    if (!name) continue
    
    const normalized = normalizeName(name)
    if (seen.has(normalized)) {
      duplicates.add(name)
    } else {
      seen.add(normalized)
    }
  }
  
  return Array.from(duplicates)
}

// Validate allergen data
export function validateAllergen(allergen: any): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    duplicates: [],
    suggestions: []
  }

  if (!allergen.allergenName?.trim()) {
    result.isValid = false
    result.errors.push('Allergen name is required')
  }

  if (allergen.allergenName && allergen.allergenName.length < 2) {
    result.isValid = false
    result.errors.push('Allergen name must be at least 2 characters')
  }

  if (allergen.allergenName && allergen.allergenName.length > 50) {
    result.warnings.push('Allergen name is quite long, consider shortening')
  }

  // Check for common allergen naming patterns
  const name = allergen.allergenName?.toLowerCase() || ''
  if (name.includes('allergen') || name.includes('contains')) {
    result.suggestions.push('Consider removing "allergen" or "contains" from the name')
  }

  return result
}

// Validate ingredient data
export function validateIngredient(ingredient: any): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    duplicates: [],
    suggestions: []
  }

  if (!ingredient.ingredientName?.trim()) {
    result.isValid = false
    result.errors.push('Ingredient name is required')
  }

  if (ingredient.ingredientName && ingredient.ingredientName.length < 2) {
    result.isValid = false
    result.errors.push('Ingredient name must be at least 2 characters')
  }

  if (ingredient.ingredientName && ingredient.ingredientName.length > 100) {
    result.warnings.push('Ingredient name is quite long, consider shortening')
  }

  // Validate expiry days
  if (ingredient.expiryDays !== undefined) {
    if (typeof ingredient.expiryDays !== 'number' || ingredient.expiryDays < 0) {
      result.isValid = false
      result.errors.push('Expiry days must be a positive number')
    }
    if (ingredient.expiryDays > 365) {
      result.warnings.push('Expiry days seems high, verify this is correct')
    }
  }

  // Check for common ingredient naming issues
  const name = ingredient.ingredientName?.toLowerCase() || ''
  if (name.includes('ingredient') || name.includes('contains')) {
    result.suggestions.push('Consider removing "ingredient" or "contains" from the name')
  }

  return result
}

// Validate menu item data
export function validateMenuItem(menuItem: any): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    duplicates: [],
    suggestions: []
  }

  if (!menuItem.menuItemName?.trim()) {
    result.isValid = false
    result.errors.push('Menu item name is required')
  }

  if (menuItem.menuItemName && menuItem.menuItemName.length < 2) {
    result.isValid = false
    result.errors.push('Menu item name must be at least 2 characters')
  }

  if (menuItem.menuItemName && menuItem.menuItemName.length > 100) {
    result.warnings.push('Menu item name is quite long, consider shortening')
  }

  // Validate ingredients array
  if (!Array.isArray(menuItem.ingredients)) {
    result.warnings.push('Menu item should have ingredients array')
  } else if (menuItem.ingredients.length === 0) {
    result.warnings.push('Menu item has no ingredients')
  }

  // Validate allergens array
  if (!Array.isArray(menuItem.allergens)) {
    result.warnings.push('Menu item should have allergens array')
  }

  return result
}

// Validate Square catalog item
export function validateSquareItem(item: any): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    duplicates: [],
    suggestions: []
  }

  if (!item.item_data?.name?.trim() && !item.category_data?.name?.trim()) {
    result.isValid = false
    result.errors.push('Square item must have a name')
  }

  const name = item.item_data?.name || item.category_data?.name || ''
  if (name.length < 2) {
    result.isValid = false
    result.errors.push('Square item name must be at least 2 characters')
  }

  if (name.length > 100) {
    result.warnings.push('Square item name is quite long')
  }

  // Check for Square-specific validation
  if (item.type === 'ITEM' && !item.item_data?.variations?.length) {
    result.warnings.push('Square item should have at least one variation')
  }

  return result
}

// Comprehensive validation for sync operations
export function validateSyncData(
  allergens: any[],
  ingredients: any[],
  menuItems: any[],
  options: SyncValidationOptions = {
    checkDuplicates: true,
    validateAllergens: true,
    validateIngredients: true,
    validateMenuItems: true,
    strictMode: false
  }
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    duplicates: [],
    suggestions: []
  }

  // Validate individual items
  if (options.validateAllergens) {
    for (const allergen of allergens) {
      const allergenResult = validateAllergen(allergen)
      result.errors.push(...allergenResult.errors)
      result.warnings.push(...allergenResult.warnings)
      result.suggestions.push(...allergenResult.suggestions)
    }
  }

  if (options.validateIngredients) {
    for (const ingredient of ingredients) {
      const ingredientResult = validateIngredient(ingredient)
      result.errors.push(...ingredientResult.errors)
      result.warnings.push(...ingredientResult.warnings)
      result.suggestions.push(...ingredientResult.suggestions)
    }
  }

  if (options.validateMenuItems) {
    for (const menuItem of menuItems) {
      const menuItemResult = validateMenuItem(menuItem)
      result.errors.push(...menuItemResult.errors)
      result.warnings.push(...menuItemResult.warnings)
      result.suggestions.push(...menuItemResult.suggestions)
    }
  }

  // Check for duplicates
  if (options.checkDuplicates) {
    const allergenDuplicates = findDuplicates(allergens, 'allergenName')
    const ingredientDuplicates = findDuplicates(ingredients, 'ingredientName')
    const menuItemDuplicates = findDuplicates(menuItems, 'menuItemName')

    result.duplicates.push(...allergenDuplicates, ...ingredientDuplicates, ...menuItemDuplicates)

    if (result.duplicates.length > 0) {
      result.warnings.push(`Found ${result.duplicates.length} potential duplicates`)
    }
  }

  // Cross-reference validation
  if (options.strictMode) {
    // Check if menu item ingredients exist in ingredients list
    const ingredientNames = new Set(ingredients.map(i => normalizeName(i.ingredientName)))
    const allergenNames = new Set(allergens.map(a => normalizeName(a.allergenName)))

    for (const menuItem of menuItems) {
      if (menuItem.ingredients) {
        for (const ingredient of menuItem.ingredients) {
          const normalizedName = normalizeName(ingredient.ingredientName || ingredient.name)
          if (!ingredientNames.has(normalizedName)) {
            result.warnings.push(`Menu item "${menuItem.menuItemName}" references ingredient "${ingredient.ingredientName || ingredient.name}" that may not exist`)
          }
        }
      }

      if (menuItem.allergens) {
        for (const allergen of menuItem.allergens) {
          const normalizedName = normalizeName(allergen.allergenName || allergen.name)
          if (!allergenNames.has(normalizedName)) {
            result.warnings.push(`Menu item "${menuItem.menuItemName}" references allergen "${allergen.allergenName || allergen.name}" that may not exist`)
          }
        }
      }
    }
  }

  result.isValid = result.errors.length === 0
  return result
}

// Generate sync recommendations
export function generateSyncRecommendations(
  localData: { allergens: any[]; ingredients: any[]; menuItems: any[] },
  squareData: any[]
): string[] {
  const recommendations: string[] = []

  const localAllergenCount = localData.allergens.length
  const localIngredientCount = localData.ingredients.length
  const localMenuItemCount = localData.menuItems.length
  const squareItemCount = squareData.length

  if (localAllergenCount === 0 && localIngredientCount === 0 && localMenuItemCount === 0) {
    recommendations.push('Your local system has no data. Consider importing from Square first.')
  }

  if (squareItemCount === 0) {
    recommendations.push('Square catalog appears empty. Consider exporting your data to Square.')
  }

  if (localMenuItemCount > squareItemCount * 2) {
    recommendations.push('You have significantly more menu items locally than in Square. Consider syncing to Square.')
  }

  if (squareItemCount > localMenuItemCount * 2) {
    recommendations.push('Square has significantly more items than your local system. Consider syncing from Square.')
  }

  return recommendations
}

// Check for potential conflicts between local and Square data
export function detectConflicts(
  localData: { allergens: any[]; ingredients: any[]; menuItems: any[] },
  squareData: any[]
): string[] {
  const conflicts: string[] = []

  // Create normalized name sets
  const localAllergenNames = new Set(localData.allergens.map(a => normalizeName(a.allergenName)))
  const localIngredientNames = new Set(localData.ingredients.map(i => normalizeName(i.ingredientName)))
  const localMenuItemNames = new Set(localData.menuItems.map(m => normalizeName(m.menuItemName)))

  const squareItemNames = new Set(squareData.map(item => {
    const name = item.item_data?.name || item.category_data?.name
    return name ? normalizeName(name) : ''
  }))

  // Check for naming conflicts
  for (const squareName of squareItemNames) {
    if (localAllergenNames.has(squareName) || localIngredientNames.has(squareName) || localMenuItemNames.has(squareName)) {
      conflicts.push(`Potential naming conflict: "${squareName}" exists in both systems`)
    }
  }

  return conflicts
} 
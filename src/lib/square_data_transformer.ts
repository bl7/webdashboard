// Types based on existing InstaLabel patterns
interface MenuItem {
  menuItemID: string
  menuItemName: string
  expiryDays?: number
  categoryID?: string
  ingredients: {
    uuid: string
    ingredientName: string
    category?: {
      uuid: string
      categoryName: string
    }
  }[]
  allergens: {
    uuid: string
    allergenName: string
  }[]
}

interface Ingredient {
  uuid: string
  ingredientName: string
  expiryDays: number
  allergens: { uuid: string; allergenName: string }[]
}

interface Allergen {
  id: string
  name: string
  category: string
  severity: "Low" | "Medium" | "High"
  status: "Active" | "Inactive"
  addedAt: string
  isCustom: boolean
}

interface SquareItem {
  id: string
  type: 'ITEM' | 'ITEM_VARIATION' | 'CATEGORY'
  item_data?: {
    name: string
    description?: string
    category_id?: string
    variations?: SquareVariation[]
    custom_attribute_values?: Record<string, any>
  }
  item_variation_data?: {
    name: string
    price_money?: {
      amount: number
      currency: string
    }
    sku?: string
  }
}

interface SquareVariation {
  id: string
  item_variation_data: {
    name: string
    price_money?: {
      amount: number
      currency: string
    }
    sku?: string
  }
}

interface SquareCategory {
  id: string
  category_data: {
    name: string
  }
}

export class SquareDataTransformer {
  private readonly allergenKeywords = {
    // UK 14 major allergens
    'gluten': ['wheat', 'barley', 'rye', 'oats', 'flour', 'bread', 'pasta', 'cereal'],
    'crustaceans': ['shrimp', 'prawn', 'crab', 'lobster', 'crayfish'],
    'eggs': ['egg', 'egg white', 'egg yolk', 'mayonnaise', 'custard'],
    'fish': ['fish', 'salmon', 'tuna', 'cod', 'haddock', 'anchovy'],
    'peanuts': ['peanut', 'groundnut', 'arachis'],
    'soy': ['soy', 'soya', 'soybean', 'tofu', 'edamame'],
    'milk': ['milk', 'dairy', 'cheese', 'cream', 'butter', 'yogurt', 'lactose'],
    'nuts': ['almond', 'walnut', 'cashew', 'pistachio', 'hazelnut', 'pecan', 'macadamia'],
    'celery': ['celery', 'celeriac'],
    'mustard': ['mustard', 'mustard seed'],
    'sesame': ['sesame', 'sesame seed', 'tahini'],
    'sulphites': ['sulphite', 'sulfite', 'sulphur dioxide'],
    'lupin': ['lupin', 'lupini'],
    'molluscs': ['mollusc', 'mussel', 'oyster', 'clam', 'scallop', 'squid', 'octopus']
  }

  private readonly ingredientExtractionPatterns = [
    /ingredients?:\s*([^\.]+)/i,
    /contains?:\s*([^\.]+)/i,
    /made with:\s*([^\.]+)/i,
    /includes?:\s*([^\.]+)/i,
    /prepared with:\s*([^\.]+)/i,
    /ingredient list:\s*([^\.]+)/i
  ]

  /**
   * Transform Square catalog items to InstaLabel format
   */
  transformSquareItems(squareItems: SquareItem[], userUuid: string): {
    menuItems: Partial<MenuItem>[]
    ingredients: Partial<Ingredient>[]
    allergens: Partial<Allergen>[]
    mappings: any[]
  } {
    const menuItems: Partial<MenuItem>[] = []
    const ingredients: Partial<Ingredient>[] = []
    const allergens: Partial<Allergen>[] = []
    const mappings: any[] = []

    // First pass: collect all unique ingredients and allergens
    const ingredientMap = new Map<string, Partial<Ingredient>>()
    const allergenMap = new Map<string, Partial<Allergen>>()

    for (const squareItem of squareItems) {
      if (squareItem.type !== 'ITEM') continue

      const extractedData = this.extractIngredientsAndAllergens(squareItem)
      
      // Collect ingredients
      for (const ingredient of extractedData.ingredients) {
        if (!ingredientMap.has(ingredient.name)) {
          ingredientMap.set(ingredient.name, {
            ingredientName: ingredient.name,
            expiryDays: ingredient.expiryDays || 7,
            allergens: []
          })
        }
      }

      // Collect allergens
      for (const allergen of extractedData.allergens) {
        if (!allergenMap.has(allergen.name)) {
                     allergenMap.set(allergen.name, {
             name: allergen.name,
             category: allergen.category || 'Other',
             severity: (allergen.severity as "Low" | "Medium" | "High") || 'Medium',
             status: 'Active' as const,
             isCustom: true
           })
        }
      }
    }

    // Second pass: create menu items with proper relationships
    for (const squareItem of squareItems) {
      if (squareItem.type !== 'ITEM') continue

      const extractedData = this.extractIngredientsAndAllergens(squareItem)
      
      // Create menu item
      const menuItem: Partial<MenuItem> = {
        menuItemName: squareItem.item_data?.name || 'Unknown Item',
        ingredients: extractedData.ingredients.map(ing => ({
          uuid: `temp_${ing.name.toLowerCase().replace(/\s+/g, '_')}`,
          ingredientName: ing.name
        })),
        allergens: extractedData.allergens.map(all => ({
          uuid: `temp_${all.name.toLowerCase().replace(/\s+/g, '_')}`,
          allergenName: all.name
        }))
      }

      menuItems.push(menuItem)

      // Create mapping
      mappings.push({
        user_id: userUuid,
        square_item_id: squareItem.id,
        square_item_name: squareItem.item_data?.name,
        square_item_description: squareItem.item_data?.description,
        square_category_id: squareItem.item_data?.category_id,
        sync_status: 'pending'
      })
    }

    return {
      menuItems,
      ingredients: Array.from(ingredientMap.values()),
      allergens: Array.from(allergenMap.values()),
      mappings
    }
  }

  /**
   * Extract ingredients and allergens from Square item description
   */
  private extractIngredientsAndAllergens(squareItem: SquareItem): {
    ingredients: Array<{ name: string; expiryDays?: number }>
    allergens: Array<{ name: string; category?: string; severity?: string }>
  } {
    const description = squareItem.item_data?.description || ''
    const customAttributes = squareItem.item_data?.custom_attribute_values || {}
    
    // Use our smart extraction system
    const { extractIngredientsAndAllergensWithExpiry } = require('./src/lib/smartIngredientExtractor')
    
    // Extract ingredients and allergens using smart system
    const extracted = extractIngredientsAndAllergensWithExpiry(description)
    
    const ingredients: Array<{ name: string; expiryDays?: number }> = []
    const allergens: Array<{ name: string; category?: string; severity?: string }> = []
    
    // Convert extracted ingredients to our format
    for (const ingredientName of extracted.ingredients) {
      ingredients.push({
        name: ingredientName,
        expiryDays: extracted.expiryDays // Use the smart calculated expiry
      })
    }
    
    // Convert extracted allergens to our format
    for (const allergenName of extracted.allergens) {
      allergens.push({
        name: allergenName.charAt(0).toUpperCase() + allergenName.slice(1),
        category: this.getAllergenCategory(allergenName),
        severity: this.getAllergenSeverity(allergenName)
      })
    }

    // Check custom attributes for additional info
    for (const [key, value] of Object.entries(customAttributes)) {
      if (typeof value === 'string') {
        const attrText = value.toLowerCase()
        
        // Use smart extraction for custom attributes too
        const attrExtracted = extractIngredientsAndAllergensWithExpiry(value)
        
        // Add additional ingredients from custom attributes
        for (const ingredientName of attrExtracted.ingredients) {
          if (!ingredients.some(ing => ing.name.toLowerCase() === ingredientName.toLowerCase())) {
            ingredients.push({
              name: ingredientName,
              expiryDays: attrExtracted.expiryDays
            })
          }
        }
        
        // Add additional allergens from custom attributes
        for (const allergenName of attrExtracted.allergens) {
          if (!allergens.some(all => all.name.toLowerCase() === allergenName.toLowerCase())) {
            allergens.push({
              name: allergenName.charAt(0).toUpperCase() + allergenName.slice(1),
              category: this.getAllergenCategory(allergenName),
              severity: this.getAllergenSeverity(allergenName)
            })
          }
        }
      }
    }

    return { ingredients, allergens }
  }

  /**
   * Extract ingredients from text using various patterns
   */
  private extractIngredientsFromText(text: string): Array<{ name: string; expiryDays?: number }> {
    const ingredients: Array<{ name: string; expiryDays?: number }> = []
    
    // Try pattern matching first
    for (const pattern of this.ingredientExtractionPatterns) {
      const match = text.match(pattern)
      if (match) {
        const ingredientList = match[1].split(',').map(item => item.trim())
        for (const ingredient of ingredientList) {
          if (ingredient && ingredient.length > 2) {
            ingredients.push({
              name: ingredient,
              expiryDays: this.estimateExpiryDays(ingredient)
            })
          }
        }
        break // Use first successful pattern
      }
    }

    // If no pattern found, try to extract common ingredients
    if (ingredients.length === 0) {
      const commonIngredients = [
        'tomato', 'lettuce', 'onion', 'cheese', 'bread', 'chicken', 'beef', 'pork',
        'fish', 'rice', 'pasta', 'potato', 'carrot', 'cucumber', 'mushroom',
        'garlic', 'ginger', 'basil', 'oregano', 'thyme', 'rosemary'
      ]

      const lowerText = text.toLowerCase()
      for (const ingredient of commonIngredients) {
        if (lowerText.includes(ingredient)) {
          ingredients.push({
            name: ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
            expiryDays: this.estimateExpiryDays(ingredient)
          })
        }
      }
    }

    return ingredients
  }

  /**
   * Detect allergens in text
   */
  private detectAllergens(text: string): Array<{ name: string; category?: string; severity?: string }> {
    const detectedAllergens: Array<{ name: string; category?: string; severity?: string }> = []
    
    for (const [allergenName, keywords] of Object.entries(this.allergenKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          detectedAllergens.push({
            name: allergenName.charAt(0).toUpperCase() + allergenName.slice(1),
            category: this.getAllergenCategory(allergenName),
            severity: this.getAllergenSeverity(allergenName)
          })
          break // Found this allergen, move to next
        }
      }
    }

    return detectedAllergens
  }

  /**
   * Estimate expiry days based on ingredient type
   */
  private estimateExpiryDays(ingredient: string): number {
    // Import and use the smart expiry calculation from our enhanced system
    const { calculateSmartExpiryDays } = require('./src/lib/smartIngredientExtractor')
    return calculateSmartExpiryDays(ingredient)
  }

  /**
   * Get allergen category
   */
  private getAllergenCategory(allergenName: string): string {
    const categories: Record<string, string> = {
      'gluten': 'Grains',
      'crustaceans': 'Seafood',
      'eggs': 'Animal Products',
      'fish': 'Seafood',
      'peanuts': 'Nuts',
      'soy': 'Legumes',
      'milk': 'Dairy',
      'nuts': 'Nuts',
      'celery': 'Vegetables',
      'mustard': 'Spices',
      'sesame': 'Seeds',
      'sulphites': 'Additives',
      'lupin': 'Legumes',
      'molluscs': 'Seafood'
    }
    
    return categories[allergenName] || 'Other'
  }

  /**
   * Get allergen severity
   */
  private getAllergenSeverity(allergenName: string): string {
    const highSeverity = ['peanuts', 'nuts', 'crustaceans', 'fish', 'molluscs']
    const mediumSeverity = ['gluten', 'milk', 'soy', 'eggs']
    
    if (highSeverity.includes(allergenName)) return 'High'
    if (mediumSeverity.includes(allergenName)) return 'Medium'
    return 'Low'
  }

  /**
   * Validate Square item data
   */
  validateSquareItem(squareItem: SquareItem): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (!squareItem.item_data?.name) {
      errors.push('Item name is required')
    }
    
    if (squareItem.item_data?.name && squareItem.item_data.name.length > 100) {
      errors.push('Item name too long (max 100 characters)')
    }
    
    if (squareItem.item_data?.description && squareItem.item_data.description.length > 500) {
      errors.push('Item description too long (max 500 characters)')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Sanitize text data from Square
   */
  sanitizeText(text: string): string {
    if (!text) return ''
    
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 500) // Limit length
  }
} 
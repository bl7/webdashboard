// Square Allergen Mapping and Dietary Restrictions
// Based on Square's official dietary restrictions system

// ============================================================================
// SQUARE'S DIETARY RESTRICTION TYPES
// ============================================================================

export type SquareDietaryRestriction = 
  | 'GLUTEN_FREE'
  | 'DAIRY_FREE' 
  | 'NUT_FREE'
  | 'EGG_FREE'
  | 'SOY_FREE'
  | 'FISH_FREE'
  | 'SHELLFISH_FREE'
  | 'WHEAT_FREE'
  | 'PEANUT_FREE'
  | 'SESAME_FREE'
  | 'SULFITE_FREE'
  | 'CELERY_FREE'
  | 'MUSTARD_FREE'
  | 'LUPIN_FREE'
  | 'MOLLUSC_FREE'
  | 'VEGETARIAN'
  | 'VEGAN'
  | 'HALAL'
  | 'KOSHER'
  | 'LOW_SODIUM'
  | 'LOW_FAT'
  | 'LOW_CARB'
  | 'KETO_FRIENDLY'
  | 'PALEO_FRIENDLY'

// ============================================================================
// MAPPING FROM LOCAL ALLERGEN NAMES TO SQUARE DIETARY RESTRICTIONS
// ============================================================================

export const allergenToSquareMapping: Record<string, SquareDietaryRestriction[]> = {
  // UK 14 Major Allergens
  'gluten': ['GLUTEN_FREE'],
  'wheat': ['WHEAT_FREE', 'GLUTEN_FREE'],
  'barley': ['GLUTEN_FREE'],
  'rye': ['GLUTEN_FREE'],
  'oats': ['GLUTEN_FREE'],
  'spelt': ['GLUTEN_FREE'],
  'kamut': ['GLUTEN_FREE'],
  
  'milk': ['DAIRY_FREE'],
  'dairy': ['DAIRY_FREE'],
  'lactose': ['DAIRY_FREE'],
  'cheese': ['DAIRY_FREE'],
  'butter': ['DAIRY_FREE'],
  'cream': ['DAIRY_FREE'],
  'yogurt': ['DAIRY_FREE'],
  'yoghurt': ['DAIRY_FREE'],
  
  'eggs': ['EGG_FREE'],
  'egg': ['EGG_FREE'],
  
  'fish': ['FISH_FREE'],
  'salmon': ['FISH_FREE'],
  'tuna': ['FISH_FREE'],
  'cod': ['FISH_FREE'],
  'sardines': ['FISH_FREE'],
  'anchovies': ['FISH_FREE'],
  
  'crustaceans': ['SHELLFISH_FREE'],
  'shrimp': ['SHELLFISH_FREE'],
  'prawns': ['SHELLFISH_FREE'],
  'crab': ['SHELLFISH_FREE'],
  'lobster': ['SHELLFISH_FREE'],
  'crayfish': ['SHELLFISH_FREE'],
  
  'peanuts': ['PEANUT_FREE'],
  'peanut': ['PEANUT_FREE'],
  'groundnuts': ['PEANUT_FREE'],
  
  'soy': ['SOY_FREE'],
  'soya': ['SOY_FREE'],
  'soybeans': ['SOY_FREE'],
  
  'nuts': ['NUT_FREE'],
  'almonds': ['NUT_FREE'],
  'hazelnuts': ['NUT_FREE'],
  'walnuts': ['NUT_FREE'],
  'cashews': ['NUT_FREE'],
  'pecans': ['NUT_FREE'],
  'brazil': ['NUT_FREE'],
  'pistachios': ['NUT_FREE'],
  'macadamia': ['NUT_FREE'],
  'chestnuts': ['NUT_FREE'],
  
  'celery': ['CELERY_FREE'],
  'celeriac': ['CELERY_FREE'],
  
  'mustard': ['MUSTARD_FREE'],
  
  'sesame': ['SESAME_FREE'],
  'sesame_seeds': ['SESAME_FREE'],
  
  'sulphites': ['SULFITE_FREE'],
  'sulfites': ['SULFITE_FREE'],
  'sulphur': ['SULFITE_FREE'],
  
  'lupin': ['LUPIN_FREE'],
  'lupine': ['LUPIN_FREE'],
  
  'molluscs': ['MOLLUSC_FREE'],
  'mollusks': ['MOLLUSC_FREE'],
  'mussels': ['MOLLUSC_FREE'],
  'clams': ['MOLLUSC_FREE'],
  'oysters': ['MOLLUSC_FREE'],
  'scallops': ['MOLLUSC_FREE'],
  'squid': ['MOLLUSC_FREE'],
  'octopus': ['MOLLUSC_FREE'],
  'snails': ['MOLLUSC_FREE'],
}

// ============================================================================
// REVERSE MAPPING - FROM SQUARE DIETARY RESTRICTIONS TO LOCAL ALLERGEN NAMES
// ============================================================================

export const squareToAllergenMapping: Record<SquareDietaryRestriction, string[]> = {
  'GLUTEN_FREE': ['gluten', 'wheat', 'barley', 'rye', 'oats', 'spelt', 'kamut'],
  'DAIRY_FREE': ['milk', 'dairy', 'lactose', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt'],
  'EGG_FREE': ['eggs', 'egg'],
  'FISH_FREE': ['fish', 'salmon', 'tuna', 'cod', 'sardines', 'anchovies'],
  'SHELLFISH_FREE': ['crustaceans', 'shrimp', 'prawns', 'crab', 'lobster', 'crayfish'],
  'PEANUT_FREE': ['peanuts', 'peanut', 'groundnuts'],
  'SOY_FREE': ['soy', 'soya', 'soybeans'],
  'NUT_FREE': ['nuts', 'almonds', 'hazelnuts', 'walnuts', 'cashews', 'pecans', 'brazil', 'pistachios', 'macadamia', 'chestnuts'],
  'CELERY_FREE': ['celery', 'celeriac'],
  'MUSTARD_FREE': ['mustard'],
  'SESAME_FREE': ['sesame', 'sesame_seeds'],
  'SULFITE_FREE': ['sulphites', 'sulfites', 'sulphur'],
  'LUPIN_FREE': ['lupin', 'lupine'],
  'MOLLUSC_FREE': ['molluscs', 'mollusks', 'mussels', 'clams', 'oysters', 'scallops', 'squid', 'octopus', 'snails'],
  'WHEAT_FREE': ['wheat'],
  'VEGETARIAN': [],
  'VEGAN': [],
  'HALAL': [],
  'KOSHER': [],
  'LOW_SODIUM': [],
  'LOW_FAT': [],
  'LOW_CARB': [],
  'KETO_FRIENDLY': [],
  'PALEO_FRIENDLY': []
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Maps local allergen names to Square dietary restrictions
 */
export function mapAllergenToSquareRestrictions(allergenName: string): SquareDietaryRestriction[] {
  const normalizedName = allergenName.toLowerCase().trim()
  
  // Direct mapping
  if (allergenToSquareMapping[normalizedName]) {
    return allergenToSquareMapping[normalizedName]
  }
  
  // Fuzzy matching
  for (const [key, restrictions] of Object.entries(allergenToSquareMapping)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return restrictions
    }
  }
  
  return []
}

/**
 * Creates Square custom attributes for dietary restrictions
 */
export function createDietaryRestrictionsAttributes(dietaryRestrictions: SquareDietaryRestriction[]) {
  return dietaryRestrictions.map(restriction => ({
    type: 'STRING' as const,
    name: 'dietary_restriction',
    string_value: restriction
  }))
}

/**
 * Creates Square custom attributes for allergen information
 */
export function createAllergenInfoAttributes(allergenNames: string[]) {
  return allergenNames.map(allergen => ({
    type: 'STRING' as const,
    name: 'allergen_info',
    string_value: allergen
  }))
}

/**
 * Maps multiple allergens to Square dietary restrictions
 */
export function mapAllergensToSquareRestrictions(allergenNames: string[]): SquareDietaryRestriction[] {
  const allRestrictions = new Set<SquareDietaryRestriction>()
  
  for (const allergenName of allergenNames) {
    const restrictions = mapAllergenToSquareRestrictions(allergenName)
    restrictions.forEach(restriction => allRestrictions.add(restriction))
  }
  
  return Array.from(allRestrictions)
}

/**
 * Creates comprehensive allergen attributes for Square items
 */
export function createComprehensiveAllergenAttributes(allergenNames: string[]) {
  const dietaryRestrictions = mapAllergensToSquareRestrictions(allergenNames)
  
  return [
    // Dietary restrictions (Square's preferred method)
    ...createDietaryRestrictionsAttributes(dietaryRestrictions),
    // Raw allergen info (for reference)
    ...createAllergenInfoAttributes(allergenNames)
  ]
}

// ============================================================================
// SQUARE API INTEGRATION FUNCTIONS
// ============================================================================

/**
 * Creates a Square item with dietary restrictions
 */
export function createSquareItemWithDietaryRestrictions(
  name: string,
  description: string,
  allergenNames: string[],
  categoryId?: string
) {
  const allergenAttributes = createComprehensiveAllergenAttributes(allergenNames)
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  
  return {
    type: 'ITEM',
    id: `#item_${uniqueId}`,
    item_data: {
      name,
      description: `${description}\nAllergens: ${allergenNames.join(', ')}`,
      category_id: categoryId,
      variations: [{
        type: 'ITEM_VARIATION',
        id: `#variation_${uniqueId}`,
        item_variation_data: {
          name: 'Regular',
          pricing_type: 'VARIABLE_PRICING'
        }
      }],
      custom_attribute_values: allergenAttributes,
      modifier_list_info: [] as Array<{modifier_list_id: string, enabled: boolean}> // Initialize empty array, will be populated later
    }
  }
}

/**
 * Creates a Square modifier (ingredient) with dietary restrictions
 */
export function createSquareModifierWithDietaryRestrictions(
  name: string,
  description: string,
  allergenNames: string[]
) {
  const allergenAttributes = createComprehensiveAllergenAttributes(allergenNames)
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  
  return {
    type: 'MODIFIER',
    id: `#modifier_${uniqueId}`,
    modifier_data: {
      name,
      description: `${description}\nAllergens: ${allergenNames.join(', ')}`,
      custom_attribute_values: allergenAttributes
    }
  }
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates if an allergen name is recognized by Square
 */
export function isValidSquareAllergen(allergenName: string): boolean {
  const restrictions = mapAllergenToSquareRestrictions(allergenName)
  return restrictions.length > 0
}

/**
 * Gets all recognized Square dietary restrictions
 */
export function getAllSquareDietaryRestrictions(): SquareDietaryRestriction[] {
  return Object.keys(squareToAllergenMapping) as SquareDietaryRestriction[]
}

// ============================================================================
// SQUARE API DOCUMENTATION NOTES
// ============================================================================

/*
SQUARE DIETARY RESTRICTIONS SYSTEM:

1. Square uses custom attributes to store dietary restriction information
2. The attribute name should be 'dietary_restriction'
3. The value should be one of Square's recognized dietary restriction types
4. Multiple restrictions can be applied to the same item
5. This is the preferred method over creating separate allergen categories

BEST PRACTICES:
- Use Square's built-in dietary restriction system
- Don't create separate allergen categories in Square
- Apply dietary restrictions to both items and modifiers
- Include raw allergen info for reference
- Use consistent naming conventions

EXAMPLE USAGE:
const item = createSquareItemWithDietaryRestrictions(
  'Chicken Burger',
  'Delicious chicken burger with fresh ingredients',
  ['milk', 'gluten', 'soy'],
  'category_id_here'
)
*/ 
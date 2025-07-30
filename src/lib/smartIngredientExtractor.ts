// Smart Ingredient and Allergen Extraction System

interface ExtractedData {
  ingredients: string[]
  allergens: string[]
  confidence: number
}

interface IngredientContext {
  name: string
  category: 'protein' | 'vegetable' | 'grain' | 'dairy' | 'spice' | 'liquid' | 'other'
  commonAllergens: string[]
  falsePositives: string[]
  expiryDays?: number // Add expiry days to ingredient context
}

// Smart ingredient database with context and expiry days
const INGREDIENT_DATABASE: Record<string, IngredientContext> = {
  // Proteins - shorter expiry for safety
  'chicken': { name: 'chicken', category: 'protein', commonAllergens: [], falsePositives: [], expiryDays: 3 },
  'beef': { name: 'beef', category: 'protein', commonAllergens: [], falsePositives: [], expiryDays: 3 },
  'lamb': { name: 'lamb', category: 'protein', commonAllergens: [], falsePositives: [], expiryDays: 3 },
  'pork': { name: 'pork', category: 'protein', commonAllergens: [], falsePositives: [], expiryDays: 3 },
  'fish': { name: 'fish', category: 'protein', commonAllergens: ['fish'], falsePositives: [], expiryDays: 2 },
  'salmon': { name: 'salmon', category: 'protein', commonAllergens: ['fish'], falsePositives: [], expiryDays: 2 },
  'tuna': { name: 'tuna', category: 'protein', commonAllergens: ['fish'], falsePositives: [], expiryDays: 2 },
  'shrimp': { name: 'shrimp', category: 'protein', commonAllergens: ['crustaceans'], falsePositives: [], expiryDays: 2 },
  'prawn': { name: 'prawn', category: 'protein', commonAllergens: ['crustaceans'], falsePositives: [], expiryDays: 2 },
  'crab': { name: 'crab', category: 'protein', commonAllergens: ['crustaceans'], falsePositives: [], expiryDays: 2 },
  'lobster': { name: 'lobster', category: 'protein', commonAllergens: ['crustaceans'], falsePositives: [], expiryDays: 2 },
  'egg': { name: 'egg', category: 'protein', commonAllergens: ['eggs'], falsePositives: [], expiryDays: 5 },
  'eggs': { name: 'eggs', category: 'protein', commonAllergens: ['eggs'], falsePositives: [], expiryDays: 5 },

  // Dairy - medium expiry
  'milk': { name: 'milk', category: 'dairy', commonAllergens: ['milk'], falsePositives: ['coconut milk', 'almond milk', 'soy milk'], expiryDays: 5 },
  'cheese': { name: 'cheese', category: 'dairy', commonAllergens: ['milk'], falsePositives: [], expiryDays: 7 },
  'butter': { name: 'butter', category: 'dairy', commonAllergens: ['milk'], falsePositives: [], expiryDays: 7 },
  'cream': { name: 'cream', category: 'dairy', commonAllergens: ['milk'], falsePositives: [], expiryDays: 5 },
  'yogurt': { name: 'yogurt', category: 'dairy', commonAllergens: ['milk'], falsePositives: [], expiryDays: 7 },
  'parmesan': { name: 'parmesan', category: 'dairy', commonAllergens: ['milk'], falsePositives: [], expiryDays: 7 },

  // Grains - longer expiry
  'wheat': { name: 'wheat', category: 'grain', commonAllergens: ['gluten'], falsePositives: [], expiryDays: 14 },
  'flour': { name: 'flour', category: 'grain', commonAllergens: ['gluten'], falsePositives: ['almond flour', 'coconut flour'], expiryDays: 14 },
  'bread': { name: 'bread', category: 'grain', commonAllergens: ['gluten'], falsePositives: [], expiryDays: 7 },
  'pasta': { name: 'pasta', category: 'grain', commonAllergens: ['gluten'], falsePositives: [], expiryDays: 7 },
  'rice': { name: 'rice', category: 'grain', commonAllergens: [], falsePositives: [], expiryDays: 7 },
  'noodles': { name: 'noodles', category: 'grain', commonAllergens: ['gluten'], falsePositives: [], expiryDays: 7 },

  // Nuts - longer expiry
  'almond': { name: 'almond', category: 'other', commonAllergens: ['nuts'], falsePositives: [], expiryDays: 30 },
  'walnut': { name: 'walnut', category: 'other', commonAllergens: ['nuts'], falsePositives: [], expiryDays: 30 },
  'cashew': { name: 'cashew', category: 'other', commonAllergens: ['nuts'], falsePositives: [], expiryDays: 30 },
  'peanut': { name: 'peanut', category: 'other', commonAllergens: ['peanuts'], falsePositives: [], expiryDays: 30 },
  'peanuts': { name: 'peanuts', category: 'other', commonAllergens: ['peanuts'], falsePositives: [], expiryDays: 30 },

  // Vegetables - medium expiry
  'onion': { name: 'onion', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 7 },
  'garlic': { name: 'garlic', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 7 },
  'tomato': { name: 'tomato', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 5 },
  'carrot': { name: 'carrot', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 7 },
  'potato': { name: 'potato', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 7 },
  'celery': { name: 'celery', category: 'vegetable', commonAllergens: ['celery'], falsePositives: [], expiryDays: 5 },
  'lettuce': { name: 'lettuce', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 5 },
  'spinach': { name: 'spinach', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 5 },
  'cucumber': { name: 'cucumber', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 5 },
  'bell pepper': { name: 'bell pepper', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 7 },
  'mushroom': { name: 'mushroom', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 5 },

  // Liquids - medium expiry
  'coconut milk': { name: 'coconut milk', category: 'liquid', commonAllergens: [], falsePositives: ['milk'], expiryDays: 7 },
  'almond milk': { name: 'almond milk', category: 'liquid', commonAllergens: ['nuts'], falsePositives: ['milk'], expiryDays: 7 },
  'soy milk': { name: 'soy milk', category: 'liquid', commonAllergens: ['soy'], falsePositives: ['milk'], expiryDays: 7 },
  'oil': { name: 'oil', category: 'liquid', commonAllergens: [], falsePositives: [], expiryDays: 30 },
  'olive oil': { name: 'olive oil', category: 'liquid', commonAllergens: [], falsePositives: [], expiryDays: 30 },
  'vegetable oil': { name: 'vegetable oil', category: 'liquid', commonAllergens: [], falsePositives: [], expiryDays: 30 },

  // Spices and seasonings - long expiry
  'salt': { name: 'salt', category: 'spice', commonAllergens: [], falsePositives: [], expiryDays: 365 },
  'pepper': { name: 'pepper', category: 'spice', commonAllergens: [], falsePositives: [], expiryDays: 365 },
  'curry powder': { name: 'curry powder', category: 'spice', commonAllergens: ['mustard'], falsePositives: [], expiryDays: 180 },
  'cumin': { name: 'cumin', category: 'spice', commonAllergens: [], falsePositives: [], expiryDays: 180 },
  'paprika': { name: 'paprika', category: 'spice', commonAllergens: [], falsePositives: [], expiryDays: 180 },
  'oregano': { name: 'oregano', category: 'spice', commonAllergens: [], falsePositives: [], expiryDays: 180 },
  'basil': { name: 'basil', category: 'spice', commonAllergens: [], falsePositives: [], expiryDays: 180 },
  'thyme': { name: 'thyme', category: 'spice', commonAllergens: [], falsePositives: [], expiryDays: 180 },
  'rosemary': { name: 'rosemary', category: 'spice', commonAllergens: [], falsePositives: [], expiryDays: 180 },
  'mustard': { name: 'mustard', category: 'spice', commonAllergens: ['mustard'], falsePositives: [], expiryDays: 180 },
  'sesame': { name: 'sesame', category: 'spice', commonAllergens: ['sesame'], falsePositives: [], expiryDays: 180 },
  'tahini': { name: 'tahini', category: 'spice', commonAllergens: ['sesame'], falsePositives: [], expiryDays: 180 },

  // Other common ingredients
  'sugar': { name: 'sugar', category: 'other', commonAllergens: [], falsePositives: [], expiryDays: 365 },
  'honey': { name: 'honey', category: 'other', commonAllergens: [], falsePositives: [], expiryDays: 365 },
  'vinegar': { name: 'vinegar', category: 'other', commonAllergens: [], falsePositives: [], expiryDays: 365 },
  'lemon': { name: 'lemon', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 7 },
  'lime': { name: 'lime', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 7 },
  'ginger': { name: 'ginger', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 7 },
  'chili': { name: 'chili', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 7 },
  'coconut': { name: 'coconut', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 7 },
  'lentil': { name: 'lentil', category: 'vegetable', commonAllergens: [], falsePositives: [], expiryDays: 7 },
}

// Cooking methods that are NOT ingredients
const COOKING_METHODS = new Set([
  'boiled', 'fried', 'grilled', 'roasted', 'baked', 'steamed', 'sauteed', 
  'braised', 'smoked', 'marinated', 'cooked', 'prepared', 'made'
])

// Common words that are NOT ingredients
const NON_INGREDIENTS = new Set([
  'and', 'or', 'the', 'a', 'an', 'with', 'made', 'contains', 'ingredients',
  'fresh', 'organic', 'natural', 'homemade', 'traditional', 'authentic',
  'spicy', 'mild', 'hot', 'sweet', 'sour', 'bitter', 'savory',
  'small', 'large', 'medium', 'extra', 'premium', 'quality'
])

export function extractIngredientsAndAllergensSmart(description: string): ExtractedData {
  const ingredients: string[] = []
  const allergens: string[] = []
  let confidence = 0.5

  if (!description) {
    return { ingredients, allergens, confidence }
  }

  const lowerDescription = description.toLowerCase()
  
  // Extract ingredients using smart patterns
  const ingredientPatterns = [
    /ingredients?:\s*([^\.]+)/i,
    /contains?:\s*([^\.]+)/i,
    /made with:\s*([^\.]+)/i,
    /with\s+([^\.]+)/i,
    /includes?:\s*([^\.]+)/i,
    /prepared with:\s*([^\.]+)/i
  ]

  let foundIngredients = false
  for (const pattern of ingredientPatterns) {
    const match = description.match(pattern)
    if (match) {
      const ingredientList = match[1]
        .split(/[,\s]+/)
        .map(item => item.trim())
        .filter(item => item.length > 2)
      
      for (const item of ingredientList) {
        const normalizedItem = normalizeName(item)
        if (isValidIngredient(normalizedItem)) {
          ingredients.push(normalizedItem)
        }
      }
      foundIngredients = true
      confidence += 0.3
      break
    }
  }

  // If no ingredients found with patterns, extract from description
  if (!foundIngredients) {
    const words = lowerDescription.split(/\s+/)
    for (const word of words) {
      const normalizedWord = normalizeName(word)
      if (isValidIngredient(normalizedWord)) {
        ingredients.push(normalizedWord)
      }
    }
  }

  // Extract allergens using smart detection
  const allergenKeywords = {
    'gluten': ['wheat', 'barley', 'rye', 'oats', 'flour', 'bread', 'pasta', 'gluten'],
    'milk': ['milk', 'dairy', 'cheese', 'cream', 'butter', 'yogurt'],
    'eggs': ['egg', 'eggs', 'mayonnaise', 'custard'],
    'fish': ['fish', 'salmon', 'tuna', 'cod', 'fish sauce', 'seafood'],
    'peanuts': ['peanut', 'groundnut', 'peanuts'],
    'soy': ['soy', 'soya', 'tofu', 'soybean'],
    'nuts': ['almond', 'walnut', 'cashew', 'pistachio', 'nuts', 'nut', 'hazelnut', 'pecan'],
    'celery': ['celery'],
    'mustard': ['mustard'],
    'sesame': ['sesame', 'tahini'],
    'sulphites': ['sulphite', 'sulfite', 'sulphites', 'sulfites'],
    'lupin': ['lupin'],
    'molluscs': ['mollusc', 'mussel', 'oyster', 'clams', 'scallops'],
    'crustaceans': ['shrimp', 'prawn', 'crab', 'lobster', 'crayfish']
  }

  // Smart allergen detection with context awareness
  for (const [allergen, keywords] of Object.entries(allergenKeywords)) {
    for (const keyword of keywords) {
      if (lowerDescription.includes(keyword)) {
        // Check for false positives
        if (!isFalsePositive(keyword, lowerDescription)) {
          allergens.push(allergen)
          break
        }
      }
    }
  }

  // Add allergens from ingredients
  for (const ingredient of ingredients) {
    const ingredientInfo = INGREDIENT_DATABASE[ingredient]
    if (ingredientInfo) {
      for (const allergen of ingredientInfo.commonAllergens) {
        if (!allergens.includes(allergen)) {
          allergens.push(allergen)
        }
      }
    }
  }

  // Remove duplicates
  const uniqueIngredients = [...new Set(ingredients)]
  const uniqueAllergens = [...new Set(allergens)]

  // Adjust confidence based on results
  if (uniqueIngredients.length > 0) confidence += 0.2
  if (uniqueAllergens.length > 0) confidence += 0.1
  if (confidence > 1) confidence = 1

  return { 
    ingredients: uniqueIngredients, 
    allergens: uniqueAllergens, 
    confidence 
  }
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/ies$/, "y")
    .replace(/ves$/, "f")
    .replace(/es$/, "")
    .replace(/s$/, "")
}

function isValidIngredient(name: string): boolean {
  if (!name || name.length < 2) return false
  if (COOKING_METHODS.has(name)) return false
  if (NON_INGREDIENTS.has(name)) return false
  
  // Check if it's in our ingredient database
  if (INGREDIENT_DATABASE[name]) return true
  
  // Allow some common ingredients not in database
  const commonIngredients = [
    'chicken', 'beef', 'lamb', 'pork', 'turkey', 'duck',
    'rice', 'noodles', 'pasta', 'bread', 'potato', 'tomato', 'onion', 'garlic',
    'carrot', 'peas', 'beans', 'corn', 'bell pepper', 'mushroom', 'spinach',
    'cucumber', 'celery', 'broccoli', 'cauliflower', 'zucchini', 'eggplant',
    'coconut', 'lemongrass', 'chili', 'pepper', 'turmeric', 'coriander',
    'oregano', 'basil', 'thyme', 'rosemary', 'sage', 'parsley', 'dill',
    'cardamom', 'cinnamon', 'nutmeg', 'cloves', 'allspice', 'star anise',
    'curry', 'sauce', 'gravy', 'stock', 'broth', 'soup', 'stew'
  ]
  
  return commonIngredients.includes(name)
}

function isFalsePositive(keyword: string, description: string): boolean {
  const falsePositivePatterns = {
    'milk': ['coconut milk', 'almond milk', 'soy milk', 'oat milk', 'rice milk'],
    'flour': ['almond flour', 'coconut flour', 'rice flour', 'chickpea flour'],
    'nut': ['coconut', 'water chestnut'],
    'fish': ['fish sauce'],
    'egg': ['eggplant', 'egg plant']
  }

  const patterns = falsePositivePatterns[keyword as keyof typeof falsePositivePatterns]
  if (!patterns) return false

  return patterns.some(pattern => description.includes(pattern))
} 

// Smart expiry date calculation based on ingredient type
export function calculateSmartExpiryDays(ingredientName: string): number {
  const normalizedName = normalizeName(ingredientName)
  const ingredientInfo = INGREDIENT_DATABASE[normalizedName]
  
  if (ingredientInfo?.expiryDays) {
    return ingredientInfo.expiryDays
  }
  
  // Fallback logic based on ingredient category or name patterns
  const lowerName = ingredientName.toLowerCase()
  
  // Protein patterns - shorter expiry for safety
  if (lowerName.includes('chicken') || lowerName.includes('beef') || lowerName.includes('lamb') || 
      lowerName.includes('pork') || lowerName.includes('meat') || lowerName.includes('steak')) {
    return 3
  }
  
  // Fish/seafood patterns - shortest expiry
  if (lowerName.includes('fish') || lowerName.includes('salmon') || lowerName.includes('tuna') ||
      lowerName.includes('shrimp') || lowerName.includes('prawn') || lowerName.includes('crab') ||
      lowerName.includes('lobster') || lowerName.includes('seafood')) {
    return 2
  }
  
  // Dairy patterns - medium expiry
  if (lowerName.includes('milk') || lowerName.includes('cheese') || lowerName.includes('cream') ||
      lowerName.includes('yogurt') || lowerName.includes('butter') || lowerName.includes('dairy')) {
    return 7
  }
  
  // Grain patterns - longer expiry
  if (lowerName.includes('bread') || lowerName.includes('pasta') || lowerName.includes('rice') ||
      lowerName.includes('noodles') || lowerName.includes('flour') || lowerName.includes('wheat')) {
    return 7
  }
  
  // Vegetable patterns - medium expiry
  if (lowerName.includes('lettuce') || lowerName.includes('spinach') || lowerName.includes('cucumber') ||
      lowerName.includes('tomato') || lowerName.includes('celery') || lowerName.includes('mushroom')) {
    return 5
  }
  
  // Spice/seasoning patterns - long expiry
  if (lowerName.includes('salt') || lowerName.includes('pepper') || lowerName.includes('spice') ||
      lowerName.includes('herb') || lowerName.includes('powder') || lowerName.includes('seasoning')) {
    return 180
  }
  
  // Oil patterns - long expiry
  if (lowerName.includes('oil')) {
    return 30
  }
  
  // Default expiry for unknown ingredients
  return 7
}

// Enhanced extraction function that includes smart expiry calculation
export function extractIngredientsAndAllergensWithExpiry(description: string): ExtractedData & { expiryDays: number } {
  const extracted = extractIngredientsAndAllergensSmart(description)
  
  // Calculate smart expiry based on the most perishable ingredient
  let maxExpiryDays = 7 // Default
  
  if (extracted.ingredients.length > 0) {
    const expiryDays = extracted.ingredients.map(ingredient => calculateSmartExpiryDays(ingredient))
    maxExpiryDays = Math.min(...expiryDays) // Use shortest expiry for safety
  }
  
  return {
    ...extracted,
    expiryDays: maxExpiryDays
  }
} 
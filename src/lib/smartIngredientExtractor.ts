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
}

// Smart ingredient database with context
const INGREDIENT_DATABASE: Record<string, IngredientContext> = {
  // Proteins
  'chicken': { name: 'chicken', category: 'protein', commonAllergens: [], falsePositives: [] },
  'beef': { name: 'beef', category: 'protein', commonAllergens: [], falsePositives: [] },
  'lamb': { name: 'lamb', category: 'protein', commonAllergens: [], falsePositives: [] },
  'pork': { name: 'pork', category: 'protein', commonAllergens: [], falsePositives: [] },
  'fish': { name: 'fish', category: 'protein', commonAllergens: ['fish'], falsePositives: [] },
  'salmon': { name: 'salmon', category: 'protein', commonAllergens: ['fish'], falsePositives: [] },
  'tuna': { name: 'tuna', category: 'protein', commonAllergens: ['fish'], falsePositives: [] },
  'shrimp': { name: 'shrimp', category: 'protein', commonAllergens: ['crustaceans'], falsePositives: [] },
  'prawn': { name: 'prawn', category: 'protein', commonAllergens: ['crustaceans'], falsePositives: [] },
  'crab': { name: 'crab', category: 'protein', commonAllergens: ['crustaceans'], falsePositives: [] },
  'lobster': { name: 'lobster', category: 'protein', commonAllergens: ['crustaceans'], falsePositives: [] },
  'egg': { name: 'egg', category: 'protein', commonAllergens: ['eggs'], falsePositives: [] },
  'eggs': { name: 'eggs', category: 'protein', commonAllergens: ['eggs'], falsePositives: [] },

  // Dairy
  'milk': { name: 'milk', category: 'dairy', commonAllergens: ['milk'], falsePositives: ['coconut milk', 'almond milk', 'soy milk'] },
  'cheese': { name: 'cheese', category: 'dairy', commonAllergens: ['milk'], falsePositives: [] },
  'butter': { name: 'butter', category: 'dairy', commonAllergens: ['milk'], falsePositives: [] },
  'cream': { name: 'cream', category: 'dairy', commonAllergens: ['milk'], falsePositives: [] },
  'yogurt': { name: 'yogurt', category: 'dairy', commonAllergens: ['milk'], falsePositives: [] },
  'parmesan': { name: 'parmesan', category: 'dairy', commonAllergens: ['milk'], falsePositives: [] },

  // Grains
  'wheat': { name: 'wheat', category: 'grain', commonAllergens: ['gluten'], falsePositives: [] },
  'flour': { name: 'flour', category: 'grain', commonAllergens: ['gluten'], falsePositives: ['almond flour', 'coconut flour'] },
  'bread': { name: 'bread', category: 'grain', commonAllergens: ['gluten'], falsePositives: [] },
  'pasta': { name: 'pasta', category: 'grain', commonAllergens: ['gluten'], falsePositives: [] },
  'rice': { name: 'rice', category: 'grain', commonAllergens: [], falsePositives: [] },
  'noodles': { name: 'noodles', category: 'grain', commonAllergens: ['gluten'], falsePositives: [] },

  // Nuts
  'almond': { name: 'almond', category: 'other', commonAllergens: ['nuts'], falsePositives: [] },
  'walnut': { name: 'walnut', category: 'other', commonAllergens: ['nuts'], falsePositives: [] },
  'cashew': { name: 'cashew', category: 'other', commonAllergens: ['nuts'], falsePositives: [] },
  'peanut': { name: 'peanut', category: 'other', commonAllergens: ['peanuts'], falsePositives: [] },
  'peanuts': { name: 'peanuts', category: 'other', commonAllergens: ['peanuts'], falsePositives: [] },

  // Vegetables
  'onion': { name: 'onion', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'garlic': { name: 'garlic', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'tomato': { name: 'tomato', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'carrot': { name: 'carrot', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'potato': { name: 'potato', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'celery': { name: 'celery', category: 'vegetable', commonAllergens: ['celery'], falsePositives: [] },
  'lettuce': { name: 'lettuce', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'spinach': { name: 'spinach', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'cucumber': { name: 'cucumber', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'bell pepper': { name: 'bell pepper', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'mushroom': { name: 'mushroom', category: 'vegetable', commonAllergens: [], falsePositives: [] },

  // Liquids
  'coconut milk': { name: 'coconut milk', category: 'liquid', commonAllergens: [], falsePositives: ['milk'] },
  'almond milk': { name: 'almond milk', category: 'liquid', commonAllergens: ['nuts'], falsePositives: ['milk'] },
  'soy milk': { name: 'soy milk', category: 'liquid', commonAllergens: ['soy'], falsePositives: ['milk'] },
  'oil': { name: 'oil', category: 'liquid', commonAllergens: [], falsePositives: [] },
  'olive oil': { name: 'olive oil', category: 'liquid', commonAllergens: [], falsePositives: [] },
  'vegetable oil': { name: 'vegetable oil', category: 'liquid', commonAllergens: [], falsePositives: [] },

  // Spices and seasonings
  'salt': { name: 'salt', category: 'spice', commonAllergens: [], falsePositives: [] },
  'pepper': { name: 'pepper', category: 'spice', commonAllergens: [], falsePositives: [] },
  'curry powder': { name: 'curry powder', category: 'spice', commonAllergens: ['mustard'], falsePositives: [] },
  'cumin': { name: 'cumin', category: 'spice', commonAllergens: [], falsePositives: [] },
  'paprika': { name: 'paprika', category: 'spice', commonAllergens: [], falsePositives: [] },
  'oregano': { name: 'oregano', category: 'spice', commonAllergens: [], falsePositives: [] },
  'basil': { name: 'basil', category: 'spice', commonAllergens: [], falsePositives: [] },
  'thyme': { name: 'thyme', category: 'spice', commonAllergens: [], falsePositives: [] },
  'rosemary': { name: 'rosemary', category: 'spice', commonAllergens: [], falsePositives: [] },
  'mustard': { name: 'mustard', category: 'spice', commonAllergens: ['mustard'], falsePositives: [] },
  'sesame': { name: 'sesame', category: 'spice', commonAllergens: ['sesame'], falsePositives: [] },
  'tahini': { name: 'tahini', category: 'spice', commonAllergens: ['sesame'], falsePositives: [] },

  // Other common ingredients
  'sugar': { name: 'sugar', category: 'other', commonAllergens: [], falsePositives: [] },
  'honey': { name: 'honey', category: 'other', commonAllergens: [], falsePositives: [] },
  'vinegar': { name: 'vinegar', category: 'other', commonAllergens: [], falsePositives: [] },
  'lemon': { name: 'lemon', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'lime': { name: 'lime', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'ginger': { name: 'ginger', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'chili': { name: 'chili', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'coconut': { name: 'coconut', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'lentil': { name: 'lentil', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'bean': { name: 'bean', category: 'vegetable', commonAllergens: [], falsePositives: [] },
  'chickpea': { name: 'chickpea', category: 'vegetable', commonAllergens: [], falsePositives: [] },
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
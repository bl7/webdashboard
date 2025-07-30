import { extractIngredientsAndAllergensSmart } from './smartIngredientExtractor'

// Test cases for smart ingredient extraction
const testCases = [
  {
    name: "Coconut milk should not trigger milk allergen",
    description: "Made with coconut milk, curry powder, and vegetables",
    expectedIngredients: ["coconut milk", "curry powder", "vegetables"],
    expectedAllergens: [],
    shouldNotContain: ["milk"]
  },
  {
    name: "Curry powder should not be extracted as ingredient",
    description: "Traditional curry with curry powder and spices",
    expectedIngredients: ["curry powder", "spices"],
    expectedAllergens: ["mustard"], // curry powder often contains mustard
    shouldNotContain: ["curry"] // curry alone should not be extracted
  },
  {
    name: "Fish should trigger fish allergen",
    description: "Grilled salmon with herbs and lemon",
    expectedIngredients: ["salmon", "herbs", "lemon"],
    expectedAllergens: ["fish"]
  },
  {
    name: "Almond milk should trigger nuts but not milk",
    description: "Smoothie with almond milk and berries",
    expectedIngredients: ["almond milk", "berries"],
    expectedAllergens: ["nuts"],
    shouldNotContain: ["milk"]
  },
  {
    name: "Complex dish with multiple allergens",
    description: "Chicken curry with coconut milk, cashews, and gluten-free rice",
    expectedIngredients: ["chicken", "coconut milk", "cashews", "rice"],
    expectedAllergens: ["nuts"],
    shouldNotContain: ["milk", "gluten"]
  },
  {
    name: "Cooking methods should not be extracted",
    description: "Boiled chicken with grilled vegetables and steamed rice",
    expectedIngredients: ["chicken", "vegetables", "rice"],
    expectedAllergens: [],
    shouldNotContain: ["boiled", "grilled", "steamed"]
  }
]

export function runSmartExtractionTests() {
  console.log("🧪 Running Smart Ingredient Extraction Tests...")
  
  let passedTests = 0
  let totalTests = testCases.length

  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`)
    
    const result = extractIngredientsAndAllergensSmart(testCase.description)
    
    // Check expected ingredients
    const missingIngredients = testCase.expectedIngredients.filter(
      ing => !result.ingredients.includes(ing)
    )
    
    // Check expected allergens
    const missingAllergens = testCase.expectedAllergens.filter(
      alg => !result.allergens.includes(alg)
    )
    
    // Check should not contain
    const falsePositives = testCase.shouldNotContain?.filter(
      item => result.ingredients.includes(item) || result.allergens.includes(item)
    ) || []
    
    if (missingIngredients.length === 0 && 
        missingAllergens.length === 0 && 
        falsePositives.length === 0) {
      console.log(`✅ PASS: ${testCase.name}`)
      console.log(`   Ingredients: ${result.ingredients.join(", ")}`)
      console.log(`   Allergens: ${result.allergens.join(", ")}`)
      console.log(`   Confidence: ${result.confidence}`)
      passedTests++
    } else {
      console.log(`❌ FAIL: ${testCase.name}`)
      if (missingIngredients.length > 0) {
        console.log(`   Missing ingredients: ${missingIngredients.join(", ")}`)
      }
      if (missingAllergens.length > 0) {
        console.log(`   Missing allergens: ${missingAllergens.join(", ")}`)
      }
      if (falsePositives.length > 0) {
        console.log(`   False positives: ${falsePositives.join(", ")}`)
      }
      console.log(`   Actual ingredients: ${result.ingredients.join(", ")}`)
      console.log(`   Actual allergens: ${result.allergens.join(", ")}`)
    }
  }
  
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`)
  return passedTests === totalTests
}

// Run tests if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  runSmartExtractionTests()
} 
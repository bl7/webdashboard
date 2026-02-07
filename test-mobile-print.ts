/**
 * Test script for mobile print API
 * Run with: npx tsx test-mobile-print.ts
 */

const API_URL = process.env.API_URL || "http://localhost:3000/api/mobile/print-label"

// Test data for a prep label
const testPrepLabel = {
  type: "menu" as const,
  labelType: "prep" as const,
  name: "Thai Red Curry",
  ingredients: ["Chicken Thigh", "Red Curry Paste", "Coconut Milk", "Thai Basil"],
  allIngredients: [
    {
      uuid: "1",
      ingredientName: "Chicken Thigh",
      allergens: [],
    },
    {
      uuid: "2",
      ingredientName: "Red Curry Paste",
      allergens: [],
    },
    {
      uuid: "3",
      ingredientName: "Coconut Milk",
      allergens: [],
    },
    {
      uuid: "4",
      ingredientName: "Thai Basil",
      allergens: [],
    },
  ],
  printedOn: new Date().toISOString().split("T")[0],
  expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  useInitials: true,
  selectedInitial: "BL",
  labelHeight: "40mm" as const,
  printer: {
    dpi: 203 as const,
    labelSizeMm: {
      width: 60,
      height: 40,
    },
  },
  copies: 1,
}

// Test data for an ingredient label
const testIngredientLabel = {
  type: "ingredients" as const,
  name: "Fresh Basil",
  allergens: [
    {
      allergenName: "None",
    },
  ],
  printedOn: new Date().toISOString().split("T")[0],
  expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  useInitials: true,
  selectedInitial: "BL",
  labelHeight: "40mm" as const,
  printer: {
    dpi: 203 as const,
    labelSizeMm: {
      width: 60,
      height: 40,
    },
  },
  copies: 1,
}

// Test data for PPDS label
const testPPDSLabel = {
  type: "menu" as const,
  labelType: "ppds" as const,
  name: "Chicken Caesar Wrap",
  ingredients: [
    "Chicken Breast",
    "Romaine Lettuce",
    "Caesar Dressing",
    "Parmesan Cheese",
    "Flour Tortilla",
  ],
  allIngredients: [
    {
      uuid: "1",
      ingredientName: "Chicken Breast",
      allergens: [],
    },
    {
      uuid: "2",
      ingredientName: "Romaine Lettuce",
      allergens: [],
    },
    {
      uuid: "3",
      ingredientName: "Caesar Dressing",
      allergens: [{ allergenName: "Egg" }, { allergenName: "Milk" }],
    },
    {
      uuid: "4",
      ingredientName: "Parmesan Cheese",
      allergens: [{ allergenName: "Milk" }],
    },
    {
      uuid: "5",
      ingredientName: "Flour Tortilla",
      allergens: [{ allergenName: "Wheat" }],
    },
  ],
  printedOn: new Date().toISOString().split("T")[0],
  expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  storageInfo: "Keep refrigerated below 5°C. Consume within 1 day.",
  businessName: "InstaLabel Test Kitchen",
  labelHeight: "80mm" as const,
  printer: {
    dpi: 203 as const,
    labelSizeMm: {
      width: 60,
      height: 80,
    },
  },
  copies: 1,
}

async function testAPI(labelData: any, labelName: string) {
  console.log(`\n🧪 Testing ${labelName}...`)
  console.log("Request data:", JSON.stringify(labelData, null, 2))

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(labelData),
    })

    const responseText = await response.text()
    console.log(`\n📊 Response Status: ${response.status}`)
    console.log(`📊 Response Headers:`, Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      console.error(`❌ Error Response:`, responseText)
      try {
        const errorJson = JSON.parse(responseText)
        console.error("Error details:", JSON.stringify(errorJson, null, 2))
      } catch {
        console.error("Raw error:", responseText)
      }
      return
    }

    try {
      const result = JSON.parse(responseText)
      console.log(`✅ Success!`)
      console.log(`📦 Label Type: ${result.labelType}`)
      console.log(`📏 Dimensions: ${result.dimensions.width}mm x ${result.dimensions.height}mm`)
      console.log(`📊 TSPL Base64 Length: ${result.tsplBase64.length} characters`)

      // Decode and show first 200 chars of TSPL
      const tsplBytes = Buffer.from(result.tsplBase64, "base64")
      const tsplText = tsplBytes.toString("utf-8", 0, Math.min(200, tsplBytes.length))
      console.log(`\n📄 TSPL Preview (first 200 chars):`)
      console.log(tsplText)
      console.log(`\n... (${tsplBytes.length - 200} more bytes, including binary bitmap data)`)

      // Show binary data info
      const binaryStart = tsplText.length
      console.log(`\n🔢 Binary Data: ${tsplBytes.length - binaryStart} bytes of bitmap data`)
    } catch (parseError) {
      console.error("❌ Failed to parse response as JSON:", parseError)
      console.log("Raw response:", responseText.substring(0, 500))
    }
  } catch (error) {
    console.error(`❌ Request failed:`, error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
  }
}

async function main() {
  console.log("🚀 Starting Mobile Print API Tests")
  console.log(`📍 API URL: ${API_URL}`)
  console.log("\n" + "=".repeat(60))

  // Test prep label
  await testAPI(testPrepLabel, "Prep Label")

  // Test ingredient label
  await testAPI(testIngredientLabel, "Ingredient Label")

  // Test PPDS label
  await testAPI(testPPDSLabel, "PPDS Label")

  console.log("\n" + "=".repeat(60))
  console.log("✅ All tests completed!")
}

// Run tests
main().catch(console.error)


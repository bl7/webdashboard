// Test script for sync-to-square functionality
const fetch = require('node-fetch')

async function testSyncToSquare() {
  console.log('🧪 Testing Sync to Square functionality...')
  
  try {
    // Test the sync-to-square endpoint
    const response = await fetch('http://localhost:3000/api/square/sync-to-square', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // Replace with actual token
      },
      body: JSON.stringify({
        location_id: 'test-location',
        syncOptions: {
          syncAllergens: true,
          syncIngredients: true,
          syncMenuItems: true
        }
      })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Sync to Square test successful!')
      console.log('📊 Results:', {
        success: result.success,
        itemsProcessed: result.itemsProcessed,
        itemsCreated: result.itemsCreated,
        itemsFailed: result.itemsFailed,
        duration: result.duration
      })
      
      if (result.syncedItems.length > 0) {
        console.log('📝 Synced Items:')
        result.syncedItems.forEach(item => {
          console.log(`   - ${item.name} (${item.type}): ${item.status}`)
        })
      }
      
      if (result.failedItems.length > 0) {
        console.log('❌ Failed Items:')
        result.failedItems.forEach(item => {
          console.log(`   - ${item.name} (${item.type}): ${item.error}`)
        })
      }
    } else {
      const error = await response.json()
      console.log('❌ Sync to Square test failed:', error)
    }
  } catch (error) {
    console.log('❌ Test failed with error:', error.message)
  }
}

// Test the smart ingredient extraction
async function testSmartExtraction() {
  console.log('\n🧪 Testing Smart Ingredient Extraction...')
  
  const testDescriptions = [
    "Made with coconut milk, curry powder, and vegetables",
    "Traditional curry with curry powder and spices",
    "Grilled salmon with herbs and lemon",
    "Smoothie with almond milk and berries",
    "Chicken curry with coconut milk, cashews, and gluten-free rice"
  ]
  
  for (const description of testDescriptions) {
    console.log(`\n📝 Testing: "${description}"`)
    
    try {
      const response = await fetch('http://localhost:3000/api/square/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          description: description
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log(`   Ingredients: ${result.ingredients.join(', ')}`)
        console.log(`   Allergens: ${result.allergens.join(', ')}`)
      } else {
        console.log('   ❌ Failed to test extraction')
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Square Sync Tests...\n')
  
  await testSmartExtraction()
  await testSyncToSquare()
  
  console.log('\n✅ Tests completed!')
}

// Run if this file is executed directly
if (require.main === module) {
  runTests()
}

module.exports = { testSyncToSquare, testSmartExtraction } 
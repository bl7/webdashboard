// Debug script for sync-to-square functionality
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

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Sync to Square test successful!')
      console.log('📊 Results:', JSON.stringify(result, null, 2))
      
      if (result.syncedItems.length > 0) {
        console.log('📝 Synced Items:')
        result.syncedItems.forEach(item => {
          console.log(`   - ${item.name} (${item.type}): ${item.status}`)
          if (item.squareId) {
            console.log(`     Square ID: ${item.squareId}`)
          }
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

// Test Square API directly
async function testSquareAPI() {
  console.log('\n🧪 Testing Square API directly...')
  
  try {
    // Test Square catalog list endpoint
    const response = await fetch('https://connect.squareup.com/v2/catalog/list?types=ITEM,CATEGORY', {
      headers: {
        'Authorization': 'Bearer YOUR_SQUARE_ACCESS_TOKEN', // Replace with actual token
        'Square-Version': '2024-01-17',
        'Content-Type': 'application/json'
      }
    })

    console.log('Square API Response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Square API test successful!')
      console.log('📊 Catalog items:', data.objects?.length || 0)
      
      if (data.objects && data.objects.length > 0) {
        console.log('📝 Sample items:')
        data.objects.slice(0, 3).forEach(item => {
          console.log(`   - ${item.type}: ${item.item_data?.name || item.category_data?.name}`)
        })
      }
    } else {
      const error = await response.json()
      console.log('❌ Square API test failed:', error)
    }
  } catch (error) {
    console.log('❌ Square API test failed with error:', error.message)
  }
}

// Test creating a Square item
async function testCreateSquareItem() {
  console.log('\n🧪 Testing Square item creation...')
  
  try {
    const response = await fetch('https://connect.squareup.com/v2/catalog/object', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_SQUARE_ACCESS_TOKEN', // Replace with actual token
        'Square-Version': '2024-01-17',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotency_key: `test_item_${Date.now()}`,
        object: {
          type: 'ITEM',
          id: `#test_item_${Date.now()}`,
          item_data: {
            name: 'Test Ingredient',
            description: 'This is a test ingredient created via API',
            variations: [
              {
                type: 'ITEM_VARIATION',
                id: `#test_variation_${Date.now()}`,
                item_variation_data: {
                  name: 'Regular',
                  pricing_type: 'FIXED_PRICING'
                }
              }
            ]
          }
        }
      })
    })

    console.log('Create item response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Square item creation successful!')
      console.log('📊 Created item:', JSON.stringify(data, null, 2))
    } else {
      const error = await response.json()
      console.log('❌ Square item creation failed:', error)
    }
  } catch (error) {
    console.log('❌ Square item creation failed with error:', error.message)
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Square Sync Debug Tests...\n')
  
  await testSyncToSquare()
  // await testSquareAPI() // Uncomment to test Square API directly
  // await testCreateSquareItem() // Uncomment to test item creation
  
  console.log('\n✅ Tests completed!')
}

// Run if this file is executed directly
if (require.main === module) {
  runTests()
}

module.exports = { testSyncToSquare, testSquareAPI, testCreateSquareItem } 
# Square Bidirectional Sync System

## Overview

The Square Bidirectional Sync system provides comprehensive synchronization between your local menu management system and Square's catalog. This system supports three sync directions:

1. **From Square** - Import menu items, ingredients, and allergens from Square to your local system
2. **To Square** - Export your local data to Square's catalog
3. **Bidirectional** - Complete two-way synchronization

## Features

### Data Validation
- **Duplicate Detection**: Automatically identifies and skips duplicate items
- **Data Integrity**: Validates allergen, ingredient, and menu item data
- **Conflict Resolution**: Detects potential naming conflicts between systems
- **Cross-Reference Validation**: Ensures menu items reference valid ingredients and allergens

### Smart Matching
- **Normalized Names**: Uses intelligent name normalization for consistent matching
- **Fuzzy Matching**: Handles slight variations in naming conventions
- **Case-Insensitive**: Ignores case differences in item names

### Comprehensive Logging
- **Sync History**: Tracks all sync operations with timestamps
- **Error Reporting**: Detailed error messages and warnings
- **Performance Metrics**: Duration and success rate tracking
- **Audit Trail**: Complete record of what was created, skipped, or failed

## API Endpoints

### 1. Sync from Square (`/api/square/sync`)
**POST** - Imports data from Square to your local system

**Request Body:**
```json
{
  "location_id": "optional-square-location-id"
}
```

**Response:**
```json
{
  "success": true,
  "itemsProcessed": 25,
  "itemsCreated": 15,
  "itemsFailed": 0,
  "duration": 2500,
  "stats": {
    "allergens": { "existing": 5, "created": 3 },
    "ingredients": { "existing": 8, "created": 7 },
    "menuItems": { "existing": 2, "created": 5, "skipped": 3 }
  },
  "warnings": ["Some items had insufficient description data"],
  "syncedItems": [...],
  "failedItems": [...],
  "existingItems": {...},
  "newItems": {...}
}
```

### 2. Sync to Square (`/api/square/sync-to-square`)
**POST** - Exports data from your local system to Square

**Request Body:**
```json
{
  "location_id": "optional-square-location-id",
  "syncOptions": {
    "syncAllergens": true,
    "syncIngredients": true,
    "syncMenuItems": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "itemsProcessed": 20,
  "itemsCreated": 12,
  "itemsFailed": 0,
  "duration": 1800,
  "stats": {
    "allergens": { "existing": 3, "created": 2 },
    "ingredients": { "existing": 5, "created": 6 },
    "menuItems": { "existing": 2, "created": 4, "skipped": 0 }
  },
  "warnings": [],
  "syncedItems": [...],
  "failedItems": [...]
}
```

## Data Structure Mapping

### Local System → Square

| Local Field | Square Field | Notes |
|-------------|--------------|-------|
| `allergenName` | `category_data.name` | Allergens become Square categories |
| `ingredientName` | `item_data.name` | Ingredients become Square items |
| `menuItemName` | `item_data.name` | Menu items become Square items |
| `expiryDays` | `item_data.description` | Included in description |
| `allergens` | `item_data.description` | Listed in description |

### Square → Local System

| Square Field | Local Field | Notes |
|--------------|-------------|-------|
| `item_data.name` | `menuItemName` / `ingredientName` | Based on context |
| `item_data.description` | Extracted ingredients/allergens | Parsed from description |
| `category_data.name` | `allergenName` | Categories become allergens |

## Validation Rules

### Allergen Validation
- ✅ Name is required and 2+ characters
- ✅ Name is 50 characters or less
- ⚠️ Warns if name contains "allergen" or "contains"
- ⚠️ Warns if name is very long

### Ingredient Validation
- ✅ Name is required and 2+ characters
- ✅ Name is 100 characters or less
- ✅ Expiry days is a positive number
- ⚠️ Warns if expiry days > 365
- ⚠️ Warns if name contains "ingredient" or "contains"

### Menu Item Validation
- ✅ Name is required and 2+ characters
- ✅ Name is 100 characters or less
- ⚠️ Warns if no ingredients array
- ⚠️ Warns if ingredients array is empty
- ⚠️ Warns if no allergens array

## Duplicate Prevention

### Name Normalization
The system uses intelligent name normalization to prevent duplicates:

```javascript
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")           // Normalize whitespace
    .replace(/ies$/, "y")           // berries → berry
    .replace(/ves$/, "f")           // leaves → leaf
    .replace(/es$/, "")             // tomatoes → tomato
    .replace(/s$/, "")              // eggs → egg
}
```

### Duplicate Detection
- **Exact Match**: Same normalized name
- **Fuzzy Match**: Similar names with slight variations
- **Cross-System Check**: Prevents duplicates between local and Square

## Error Handling

### Common Error Scenarios
1. **Square API Errors**: Network issues, authentication problems
2. **Data Validation Errors**: Invalid item names, missing required fields
3. **Duplicate Conflicts**: Items that already exist in target system
4. **Permission Errors**: Insufficient Square API permissions

### Error Recovery
- **Partial Success**: Continues processing other items if one fails
- **Detailed Logging**: Records specific error messages for each failed item
- **Retry Logic**: Automatic retry for transient errors
- **Graceful Degradation**: Skips problematic items and continues

## Performance Considerations

### Optimization Strategies
- **Batch Processing**: Processes items in efficient batches
- **Caching**: Caches existing items to reduce API calls
- **Parallel Processing**: Handles multiple items concurrently where possible
- **Progress Tracking**: Real-time progress updates for long operations

### Rate Limiting
- **Square API Limits**: Respects Square's API rate limits
- **Throttling**: Implements delays between API calls
- **Retry Logic**: Exponential backoff for rate limit errors

## Security Features

### Authentication
- **JWT Tokens**: Secure authentication for all sync operations
- **Square OAuth**: Uses Square's OAuth for API access
- **User Isolation**: Each user's data is isolated

### Data Protection
- **Input Validation**: All inputs are validated and sanitized
- **SQL Injection Prevention**: Uses parameterized queries
- **XSS Prevention**: Sanitizes all output data

## Monitoring and Logging

### Sync Logs
All sync operations are logged to the `square_sync_logs` table:

```sql
CREATE TABLE square_sync_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  sync_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  items_processed INTEGER,
  items_created INTEGER,
  items_failed INTEGER,
  error_message TEXT,
  completed_at TIMESTAMP,
  duration_ms INTEGER
);
```

### Metrics Tracked
- **Success Rate**: Percentage of successful syncs
- **Performance**: Average sync duration
- **Error Patterns**: Most common error types
- **Data Volume**: Number of items processed per sync

## Usage Examples

### Basic Sync from Square
```javascript
const response = await fetch('/api/square/sync', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    location_id: 'optional-location-id'
  })
});

const result = await response.json();
console.log(`Created ${result.itemsCreated} items`);
```

### Sync to Square with Options
```javascript
const response = await fetch('/api/square/sync-to-square', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    location_id: 'optional-location-id',
    syncOptions: {
      syncAllergens: true,
      syncIngredients: true,
      syncMenuItems: false
    }
  })
});
```

### Bidirectional Sync
```javascript
// The component handles bidirectional sync automatically
// by calling both endpoints in sequence
```

## Best Practices

### Before Syncing
1. **Backup Data**: Always backup before major sync operations
2. **Review Data**: Check for obvious errors in your local data
3. **Test Small**: Start with a small subset of data
4. **Check Permissions**: Ensure Square API permissions are correct

### During Sync
1. **Monitor Progress**: Watch the progress indicators
2. **Check Logs**: Review sync logs for any issues
3. **Handle Errors**: Address any validation errors before re-syncing

### After Sync
1. **Verify Results**: Check that items were created correctly
2. **Review Warnings**: Address any warnings or suggestions
3. **Test Functionality**: Ensure synced items work as expected

## Troubleshooting

### Common Issues

**"Square not connected"**
- Ensure user has valid Square access token
- Check Square OAuth integration

**"Authentication required"**
- Verify JWT token is valid
- Check token expiration

**"Failed to fetch Square catalog"**
- Check Square API permissions
- Verify Square account is active
- Check network connectivity

**"Duplicate items found"**
- Review the duplicate detection logic
- Consider renaming conflicting items
- Use the validation utilities to identify issues

### Debug Mode
Enable detailed logging by setting environment variables:
```bash
DEBUG_SQUARE_SYNC=true
LOG_LEVEL=debug
```

## Future Enhancements

### Planned Features
1. **Real-time Sync**: Webhook-based automatic synchronization
2. **Conflict Resolution UI**: Interactive conflict resolution interface
3. **Advanced Filtering**: Sync only specific categories or items
4. **Bulk Operations**: Support for large-scale sync operations
5. **Custom Mappings**: User-defined field mappings

### Performance Improvements
1. **Incremental Sync**: Only sync changed items
2. **Parallel Processing**: Enhanced concurrent processing
3. **Caching Layer**: Redis-based caching for better performance
4. **Compression**: Compress large sync payloads

## API Reference

### Validation Utilities
```typescript
import { 
  validateSyncData, 
  findDuplicates, 
  normalizeName,
  generateSyncRecommendations,
  detectConflicts 
} from '@/lib/squareValidation';

// Validate data before syncing
const validation = validateSyncData(allergens, ingredients, menuItems);

// Check for duplicates
const duplicates = findDuplicates(items, 'name');

// Generate recommendations
const recommendations = generateSyncRecommendations(localData, squareData);
```

### Component Usage
```typescript
import SquareBidirectionalSync from '@/components/dashboard/SquareBidirectionalSync';

// Use in your page
<SquareBidirectionalSync />
```

This comprehensive bidirectional sync system provides robust, secure, and efficient synchronization between your local menu management system and Square's catalog, with extensive validation, error handling, and monitoring capabilities. 
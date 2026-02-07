# Mobile App Integration Guide - Print Label API

## Overview

This API generates TSPL (Thermal Printer Script Language) bytes for direct printing to thermal printers. The mobile app sends label data and receives ready-to-print TSPL bytes.

**Endpoint**: `POST /api/mobile/print-label`

**Base URL**: `https://your-domain.com/api/mobile/print-label` (or `http://localhost:3000/api/mobile/print-label` for development)

---

## Request Format

### HTTP Method
`POST`

### Headers
```
Content-Type: application/json
```

### Request Body Structure

```typescript
{
  // ============================================
  // REQUIRED: Core Identification
  // ============================================
  "type": "ingredients" | "menu",           // REQUIRED - Item type
  "name": string,                            // REQUIRED - Item name (e.g., "Thai Red Curry")
  "labelType"?: "prep" | "cooked" | "default" | "ppds" | "defrost",  // Optional - for menu items
  
  // ============================================
  // REQUIRED: Item Data (varies by type)
  // ============================================
  
  // For menu items (type: "menu") - REQUIRED
  "ingredients"?: string[],                  // REQUIRED for menu - Array of ingredient names
  "allIngredients"?: Array<{                 // REQUIRED for menu - For allergen mapping
    "uuid": string,
    "ingredientName": string,
    "allergens": Array<{
      "allergenName": string
    }>
  }>,
  
  // For ingredient items (type: "ingredients") - REQUIRED
  "allergens"?: Array<{                      // REQUIRED for ingredients - Allergen objects
    "uuid"?: number,
    "allergenName": string,                  // REQUIRED
    "category"?: string,
    "status"?: "Active" | "Inactive",
    "addedAt"?: string,
    "isCustom"?: boolean
  }>,
  
  // Fallback allergen list (optional)
  "allergensList"?: string[],                // Optional - Array of allergen name strings
  
  // ============================================
  // REQUIRED: Date Information
  // ============================================
  "printedOn"?: string,                     // Optional - ISO date (YYYY-MM-DD), defaults to current date
  "expiryDate"?: string,                     // REQUIRED - ISO date (YYYY-MM-DD) for expiry display
  "expiry"?: string,                         // Optional - Alternative field (takes precedence over expiryDate)
  
  // ============================================
  // Optional: Display/Formatting Options
  // ============================================
  "labelHeight"?: "40mm" | "80mm",          // Optional - Default: "40mm", PPDS always "80mm"
  "useInitials"?: boolean,                   // Optional - Default: false
  "selectedInitial"?: string,                 // Optional - 2-character string (e.g., "BL")
  "maxIngredients"?: number,                  // Optional - Default: 5
  
  // ============================================
  // REQUIRED: PPDS-Specific (only if labelType === "ppds")
  // ============================================
  "storageInfo"?: string,                    // REQUIRED for PPDS - Storage instructions
  "businessName"?: string,                    // REQUIRED for PPDS - Company/business name
  
  // ============================================
  // REQUIRED: Printer Configuration
  // ============================================
  "printer": {                               // REQUIRED
    "dpi": 203 | 300,                        // REQUIRED - Printer DPI (203 or 300)
    "labelSizeMm": {                         // REQUIRED
      "width": number,                       // REQUIRED - Label width in mm (e.g., 60)
      "height": number                       // REQUIRED - Label height in mm (e.g., 40 or 80)
    }
  },
  
  // ============================================
  // Optional: Print Options
  // ============================================
  "copies"?: number,                         // Optional - Number of copies (default: 1)
  
  // ============================================
  // Optional: Metadata
  // ============================================
  "uid"?: string,                            // Optional - Unique identifier
  "id"?: string | number,                    // Optional - Item ID
  "quantity"?: number                         // Optional - Quantity (defaults to copies if not provided)
}
```

---

## Response Format

### Success Response (200 OK)

```json
{
  "tsplBase64": "U0laRSA2MC4wMCBtbSwgNDAuMDAgbW0K...",
  "labelType": "prep",
  "dimensions": {
    "width": 60,
    "height": 40
  }
}
```

**Fields:**
- `tsplBase64` (string): **REQUIRED** - Base64-encoded TSPL script bytes. This includes:
  - TSPL setup commands (SIZE, GAP, DIRECTION, REFERENCE, CLS)
  - BITMAP command
  - Binary bitmap data (1-bit monochrome)
  - PRINT command
- `labelType` (string): Label type that was rendered
- `dimensions` (object): Label dimensions in mm
  - `width` (number): Label width in mm
  - `height` (number): Label height in mm

### Error Response (400 Bad Request)

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Missing required fields: type and name are required",
  "labelId": "optional-label-id"
}
```

### Error Response (500 Internal Server Error)

```json
{
  "error": "RENDER_FAILED" | "CONVERSION_FAILED" | "INTERNAL_ERROR",
  "message": "Failed to render label",
  "labelId": "optional-label-id"
}
```

**Error Codes:**
- `VALIDATION_ERROR` (400): Missing or invalid required fields
- `RENDER_FAILED` (500): Failed to render label component
- `CONVERSION_FAILED` (500): Failed to convert PNG to bitmap
- `INTERNAL_ERROR` (500): Unexpected server error

---

## Complete Request Examples

### Example 1: Prep Label (Menu Item)

```json
{
  "type": "menu",
  "labelType": "prep",
  "name": "Thai Red Curry",
  "ingredients": [
    "Chicken Thigh",
    "Red Curry Paste",
    "Coconut Milk",
    "Thai Basil"
  ],
  "allIngredients": [
    {
      "uuid": "1",
      "ingredientName": "Chicken Thigh",
      "allergens": []
    },
    {
      "uuid": "2",
      "ingredientName": "Red Curry Paste",
      "allergens": []
    },
    {
      "uuid": "3",
      "ingredientName": "Coconut Milk",
      "allergens": []
    },
    {
      "uuid": "4",
      "ingredientName": "Thai Basil",
      "allergens": []
    }
  ],
  "printedOn": "2024-01-15",
  "expiryDate": "2024-01-17",
  "useInitials": true,
  "selectedInitial": "BL",
  "labelHeight": "40mm",
  "printer": {
    "dpi": 203,
    "labelSizeMm": {
      "width": 60,
      "height": 40
    }
  },
  "copies": 1
}
```

### Example 2: Ingredient Label

```json
{
  "type": "ingredients",
  "name": "Fresh Basil",
  "allergens": [
    {
      "allergenName": "None"
    }
  ],
  "printedOn": "2024-01-15",
  "expiryDate": "2024-01-17",
  "useInitials": true,
  "selectedInitial": "BL",
  "labelHeight": "40mm",
  "printer": {
    "dpi": 203,
    "labelSizeMm": {
      "width": 60,
      "height": 40
    }
  },
  "copies": 1
}
```

### Example 3: PPDS Label (Natasha's Law)

```json
{
  "type": "menu",
  "labelType": "ppds",
  "name": "Chicken Caesar Wrap",
  "ingredients": [
    "Chicken Breast",
    "Romaine Lettuce",
    "Caesar Dressing",
    "Parmesan Cheese",
    "Flour Tortilla"
  ],
  "allIngredients": [
    {
      "uuid": "1",
      "ingredientName": "Chicken Breast",
      "allergens": []
    },
    {
      "uuid": "2",
      "ingredientName": "Romaine Lettuce",
      "allergens": []
    },
    {
      "uuid": "3",
      "ingredientName": "Caesar Dressing",
      "allergens": [
        {
          "allergenName": "Egg"
        },
        {
          "allergenName": "Milk"
        }
      ]
    },
    {
      "uuid": "4",
      "ingredientName": "Parmesan Cheese",
      "allergens": [
        {
          "allergenName": "Milk"
        }
      ]
    },
    {
      "uuid": "5",
      "ingredientName": "Flour Tortilla",
      "allergens": [
        {
          "allergenName": "Wheat"
        }
      ]
    }
  ],
  "printedOn": "2024-01-15",
  "expiryDate": "2024-01-16",
  "storageInfo": "Keep refrigerated below 5°C. Consume within 1 day.",
  "businessName": "InstaLabel Test Kitchen",
  "labelHeight": "80mm",
  "printer": {
    "dpi": 203,
    "labelSizeMm": {
      "width": 60,
      "height": 80
    }
  },
  "copies": 1
}
```

### Example 4: Cook Label

```json
{
  "type": "menu",
  "labelType": "cooked",
  "name": "Grilled Salmon",
  "ingredients": ["Salmon Fillet", "Lemon", "Herbs"],
  "allIngredients": [
    {
      "uuid": "1",
      "ingredientName": "Salmon Fillet",
      "allergens": [{"allergenName": "Fish"}]
    },
    {
      "uuid": "2",
      "ingredientName": "Lemon",
      "allergens": []
    },
    {
      "uuid": "3",
      "ingredientName": "Herbs",
      "allergens": []
    }
  ],
  "printedOn": "2024-01-15",
  "expiryDate": "2024-01-17",
  "useInitials": true,
  "selectedInitial": "BL",
  "labelHeight": "40mm",
  "printer": {
    "dpi": 203,
    "labelSizeMm": {
      "width": 60,
      "height": 40
    }
  },
  "copies": 1
}
```

### Example 5: Defrost Label

```json
{
  "type": "ingredients",
  "labelType": "prep",
  "name": "Frozen Cod Fillet (defrosted)",
  "allergens": [
    {
      "allergenName": "Fish"
    }
  ],
  "printedOn": "2024-01-15",
  "expiryDate": "2024-01-16",
  "useInitials": true,
  "selectedInitial": "BL",
  "labelHeight": "40mm",
  "printer": {
    "dpi": 203,
    "labelSizeMm": {
      "width": 60,
      "height": 40
    }
  },
  "copies": 1
}
```

**Note**: Defrost labels are ingredient labels with `labelType: "prep"` and the name should include "(defrosted)" suffix.

### Example 6: Use First Label

```json
{
  "type": "menu",
  "name": "USE FIRST",
  "ingredients": [],
  "allIngredients": [],
  "printedOn": "2024-01-15",
  "expiryDate": "2024-01-17",
  "labelHeight": "40mm",
  "printer": {
    "dpi": 203,
    "labelSizeMm": {
      "width": 60,
      "height": 40
    }
  },
  "copies": 1
}
```

**Note**: Use First labels are special - when `name` is exactly `"USE FIRST"`, it renders a circular black label with white text. Other fields are optional for this label type.

---

## Mobile App Implementation Steps

### Step 1: Make HTTP Request

```typescript
// Example in TypeScript/JavaScript
async function generateLabelTSPL(labelData: LabelRequest): Promise<LabelResponse> {
  const response = await fetch('https://your-domain.com/api/mobile/print-label', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(labelData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API Error: ${error.message}`);
  }

  return await response.json();
}
```

### Step 2: Decode Base64 TSPL

```typescript
// Decode the Base64 string to get raw TSPL bytes
const tsplBase64 = response.tsplBase64;
const tsplBytes = base64Decode(tsplBase64); // Use your platform's base64 decoder
```

### Step 3: Send to Printer

```typescript
// Send raw bytes directly to printer
// The bytes include TSPL commands + binary bitmap data
await printer.sendRaw(tsplBytes);
```

---

## Important Notes

### 1. TSPL Bytes Format

The `tsplBase64` field contains:
- **TSPL command string** (UTF-8): Setup commands like `SIZE`, `GAP`, `DIRECTION`, etc.
- **Binary bitmap data**: 1-bit monochrome bitmap (8 pixels per byte, MSB first)

**CRITICAL**: Do NOT treat this as a UTF-8 string. It contains binary data that will corrupt if decoded as text.

### 2. Base64 Decoding

The mobile app must:
1. Decode the Base64 string to get raw bytes
2. Send those bytes directly to the printer
3. Do NOT attempt to parse or modify the TSPL commands

### 3. Printer Compatibility

The TSPL format is compatible with:
- TSPL-compatible thermal printers (Munbyn, generic TSPL clones)
- 203 DPI and 300 DPI printers
- Label sizes: 60mm x 40mm (standard) and 60mm x 80mm (PPDS)

### 4. Response Time

- **First request**: 3-5 seconds (Playwright launches Chromium)
- **Subsequent requests**: 1-2 seconds (Chromium stays in memory)
- **Timeout**: Set HTTP timeout to at least 30 seconds

### 5. Error Handling

Always handle these cases:
- **Network errors**: Retry with exponential backoff
- **400 errors**: Fix request data and retry
- **500 errors**: Log error details, may need server-side investigation
- **Timeout**: Increase timeout or retry

### 6. Label Types Summary

| Label Type | `type` | `labelType` | Special Requirements |
|------------|--------|-------------|---------------------|
| Ingredient Label | `"ingredients"` | (none) | `allergens` array required |
| Prep Label | `"menu"` | `"prep"` | `ingredients` + `allIngredients` required |
| Cook Label | `"menu"` | `"cooked"` | `ingredients` + `allIngredients` required |
| Default Label | `"menu"` | `"default"` | `ingredients` + `allIngredients` required |
| PPDS Label | `"menu"` | `"ppds"` | `ingredients` + `allIngredients` + `storageInfo` + `businessName` required |
| Defrost Label | `"ingredients"` | `"prep"` | `allergens` array required, name should include "(defrosted)" |
| Use First Label | `"menu"` or `"ingredients"` | (any) | `name` must be exactly `"USE FIRST"` (case-sensitive) |

**Special Label Types:**

- **Use First Label**: When `name === "USE FIRST"` (exact match, case-sensitive), renders a special circular black label with white "USE FIRST" text. Other fields are optional.
- **Defrost Label**: Ingredient label with `labelType: "prep"` and name containing "(defrosted)". Renders like an ingredient label but is logged as defrost type.

---

## Field Requirements by Label Type

### Menu Items (type: "menu")

**Required:**
- `type`: `"menu"`
- `name`: string
- `ingredients`: string[] (array of ingredient names)
- `allIngredients`: Array (for allergen mapping)
- `expiryDate`: string (ISO date)
- `printer`: object (DPI and label size)

**Optional:**
- `labelType`: `"prep"` | `"cooked"` | `"default"` | `"ppds"`
- `printedOn`: string
- `useInitials`: boolean
- `selectedInitial`: string
- `labelHeight`: `"40mm"` | `"80mm"` (PPDS always uses 80mm)

**PPDS-Specific (if labelType === "ppds"):**
- `storageInfo`: string (REQUIRED)
- `businessName`: string (REQUIRED)
- `labelHeight`: Must be `"80mm"`

### Ingredient Items (type: "ingredients")

**Required:**
- `type`: `"ingredients"`
- `name`: string
- `allergens`: Array (allergen objects)
- `expiryDate`: string (ISO date)
- `printer`: object (DPI and label size)

**Optional:**
- `printedOn`: string
- `useInitials`: boolean
- `selectedInitial`: string
- `labelHeight`: `"40mm"` | `"80mm"`

---

## Testing Checklist

Before integrating, test:

- [ ] Prep label with ingredients
- [ ] Cook label with allergens
- [ ] Ingredient label with allergens
- [ ] PPDS label with storage info
- [ ] Different label names (verify TSPL changes)
- [ ] Different initials (verify rendered output)
- [ ] Error handling (missing fields, invalid data)
- [ ] Network timeout handling
- [ ] Base64 decoding works correctly
- [ ] Printer receives and prints correctly

---

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Verify all required fields are present
3. Ensure printer DPI matches request (203 or 300)
4. Verify label size matches printer label size

---

## Quick Reference

**Endpoint**: `POST /api/mobile/print-label`

**Request**: JSON with label data + printer config

**Response**: JSON with `tsplBase64` (Base64-encoded TSPL bytes)

**Usage**: Decode Base64 → Send raw bytes to printer

**Timeout**: 30+ seconds recommended


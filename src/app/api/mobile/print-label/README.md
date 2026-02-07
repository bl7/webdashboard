# Mobile Print Label API

## Overview

This API route generates TSPL (Thermal Printer Script Language) bytes for mobile printing. It renders labels using the exact same React components as the web interface, ensuring pixel-identical output.

## Endpoint

```
POST /api/mobile/print-label
```

## Request Body

```typescript
{
  // Core identification (REQUIRED)
  type: "ingredients" | "menu",
  name: string,
  labelType?: "prep" | "cooked" | "default" | "ppds" | "defrost",
  
  // Item data
  ingredients?: string[],  // REQUIRED for menu items
  allergens?: Array<{ allergenName: string }>,  // REQUIRED for ingredient items
  allIngredients?: Array<{  // REQUIRED for menu items
    uuid: string,
    ingredientName: string,
    allergens: Array<{ allergenName: string }>
  }>,
  allergensList?: string[],  // Fallback allergen list
  
  // Dates
  printedOn?: string,  // ISO date string
  expiryDate?: string,  // ISO date string (REQUIRED)
  expiry?: string,  // Alternative (takes precedence)
  
  // Display options
  labelHeight?: "40mm" | "80mm",  // Default: "40mm", PPDS always "80mm"
  useInitials?: boolean,
  selectedInitial?: string,
  maxIngredients?: number,
  
  // PPDS specific (REQUIRED if labelType === "ppds")
  storageInfo?: string,
  businessName?: string,
  
  // Print options
  copies?: number,  // Default: 1
  
  // Printer configuration (REQUIRED)
  printer: {
    dpi: 203 | 300,
    labelSizeMm: {
      width: number,  // Label width in mm
      height: number  // Label height in mm
    }
  },
  
  // Metadata
  uid?: string,
  id?: string | number,
  quantity?: number
}
```

## Response

### Success (200)

```typescript
{
  tsplBase64: string,  // Base64-encoded TSPL bytes (includes binary bitmap data)
  labelType: string,
  dimensions: {
    width: number,  // in mm
    height: number  // in mm
  }
}
```

### Error (400/500)

```typescript
{
  error: string,  // Error code (e.g., "VALIDATION_ERROR", "RENDER_FAILED")
  message: string,  // Human-readable error message
  labelId?: string  // Optional label identifier
}
```

## Example Request

```json
{
  "type": "menu",
  "labelType": "prep",
  "name": "Thai Red Curry",
  "ingredients": ["Chicken Thigh", "Red Curry Paste", "Coconut Milk"],
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

## TSPL Output Format

The API generates complete TSPL scripts with:

1. **SIZE** - Label dimensions in mm
2. **GAP** - Gap between labels (default: 0mm)
3. **DIRECTION** - Print direction (0 = normal)
4. **REFERENCE** - Reference point (0, 0)
5. **CLS** - Clear buffer
6. **BITMAP** - Binary bitmap data (1-bit monochrome)
7. **PRINT** - Print command with copy count

The bitmap is converted from PNG to 1-bit monochrome (black/white) using a configurable threshold (default: 128).

## Pixel Dimensions

The API calculates pixel dimensions from printer DPI and label size:

```
widthPx = round(widthMm * dpi / 25.4)
heightPx = round(heightMm * dpi / 25.4)
```

This ensures proper scaling for different printer resolutions.

## Supported Label Types

1. **Ingredient Labels** - `type: "ingredients"`
2. **Prep Labels** - `type: "menu", labelType: "prep"`
3. **Cook Labels** - `type: "menu", labelType: "cooked"`
4. **Default Labels** - `type: "menu", labelType: "default"`
5. **PPDS Labels** - `type: "menu", labelType: "ppds"` (requires storageInfo and businessName)
6. **Defrost Labels** - `type: "ingredients", labelType: "prep"`
7. **Use First Labels** - Special case when `name === "USE FIRST"`

## Error Codes

- `VALIDATION_ERROR` (400) - Missing or invalid required fields
- `RENDER_FAILED` (500) - Failed to render label component
- `CONVERSION_FAILED` (500) - Failed to convert PNG to bitmap
- `INTERNAL_ERROR` (500) - Unexpected server error

## Dependencies

- **Playwright** - Server-side rendering of React components
- **Sharp** - Image processing and bitmap conversion
- **React/ReactDOM** - Component rendering

## Installation

```bash
npm install playwright
npx playwright install chromium
```

The Playwright browser is installed automatically on first use, but you may need to run the install command in production environments.


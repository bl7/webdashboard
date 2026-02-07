# Mobile App Quick Reference

## API Endpoint
```
POST /api/mobile/print-label
Content-Type: application/json
```

## Minimum Request (Prep Label)

```json
{
  "type": "menu",
  "labelType": "prep",
  "name": "Item Name",
  "ingredients": ["Ingredient 1", "Ingredient 2"],
  "allIngredients": [
    {"uuid": "1", "ingredientName": "Ingredient 1", "allergens": []},
    {"uuid": "2", "ingredientName": "Ingredient 2", "allergens": []}
  ],
  "expiryDate": "2024-01-17",
  "printer": {
    "dpi": 203,
    "labelSizeMm": {"width": 60, "height": 40}
  }
}
```

## Response

```json
{
  "tsplBase64": "U0laRSA2MC4wMCBtbSwgNDAuMDAgbW0K...",
  "labelType": "prep",
  "dimensions": {"width": 60, "height": 40}
}
```

## Implementation

```typescript
// 1. Send request
const response = await fetch('/api/mobile/print-label', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(requestData)
});

// 2. Get response
const { tsplBase64 } = await response.json();

// 3. Decode Base64 to bytes
const tsplBytes = base64Decode(tsplBase64);

// 4. Send to printer
await printer.sendRaw(tsplBytes);
```

## Required Fields by Type

### Menu Items
- `type`: "menu"
- `name`: string
- `ingredients`: string[]
- `allIngredients`: Array
- `expiryDate`: string
- `printer`: { dpi, labelSizeMm }

### Ingredient Items
- `type`: "ingredients"
- `name`: string
- `allergens`: Array
- `expiryDate`: string
- `printer`: { dpi, labelSizeMm }

### PPDS Labels (add to menu)
- `labelType`: "ppds"
- `storageInfo`: string
- `businessName`: string
- `labelHeight`: "80mm"

## Error Codes

- `400 VALIDATION_ERROR`: Missing/invalid fields
- `500 RENDER_FAILED`: Rendering error
- `500 CONVERSION_FAILED`: Image conversion error

## Important

⚠️ **CRITICAL**: `tsplBase64` contains binary data. Decode Base64 → send raw bytes. Do NOT treat as UTF-8 string.

⏱️ **Timeout**: Set to 30+ seconds (first request takes 3-5s)

📏 **Label Sizes**: 60x40mm (standard), 60x80mm (PPDS)

🖨️ **DPI**: 203 or 300 (must match printer)


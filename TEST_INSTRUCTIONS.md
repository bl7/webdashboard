# Testing Mobile Print API

## Quick Test

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Test with curl** (in another terminal):
   ```bash
   curl -X POST http://localhost:3000/api/mobile/print-label \
     -H "Content-Type: application/json" \
     -d @test-mobile-print-simple.json \
     | jq .
   ```

   Or using the test script:
   ```bash
   npx tsx test-mobile-print.ts
   ```

## Expected Response

On success, you should get:
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

The `tsplBase64` field contains the complete TSPL script as Base64-encoded bytes, including:
- TSPL setup commands (SIZE, GAP, DIRECTION, REFERENCE, CLS)
- BITMAP command
- Binary bitmap data (1-bit monochrome)
- PRINT command

## Verify Same Renderers

Yes! We're using the **exact same renderers** as the web app:

- ✅ `LabelRender` from `@/app/dashboard/print/LabelRender`
- ✅ `PPDSLabelRenderer` from `@/app/dashboard/ppds/PPDSLabelRenderer`

The server-side rendering uses Playwright to render these React components to PNG, ensuring pixel-identical output to what you see in the web dashboard.

## Test Different Label Types

### Prep Label (test-mobile-print-simple.json)
Already provided above.

### Ingredient Label
```json
{
  "type": "ingredients",
  "name": "Fresh Basil",
  "allergens": [{"allergenName": "None"}],
  "printedOn": "2024-01-15",
  "expiryDate": "2024-01-17",
  "useInitials": true,
  "selectedInitial": "BL",
  "labelHeight": "40mm",
  "printer": {
    "dpi": 203,
    "labelSizeMm": {"width": 60, "height": 40}
  }
}
```

### PPDS Label
```json
{
  "type": "menu",
  "labelType": "ppds",
  "name": "Chicken Caesar Wrap",
  "ingredients": ["Chicken Breast", "Romaine Lettuce", "Caesar Dressing"],
  "allIngredients": [
    {
      "uuid": "1",
      "ingredientName": "Caesar Dressing",
      "allergens": [{"allergenName": "Egg"}, {"allergenName": "Milk"}]
    }
  ],
  "printedOn": "2024-01-15",
  "expiryDate": "2024-01-16",
  "storageInfo": "Keep refrigerated below 5°C. Consume within 1 day.",
  "businessName": "InstaLabel Test Kitchen",
  "labelHeight": "80mm",
  "printer": {
    "dpi": 203,
    "labelSizeMm": {"width": 60, "height": 80}
  }
}
```

## Troubleshooting

### Playwright not installed
If you get an error about Playwright:
```bash
npm install playwright
npx playwright install chromium
```

### Server not responding
Make sure the dev server is running on port 3000:
```bash
npm run dev
```

### Rendering errors
Check the server logs for detailed error messages. Common issues:
- Missing required fields (check validation errors)
- Playwright browser launch issues (may need `--no-sandbox` flags)
- Memory issues with large labels


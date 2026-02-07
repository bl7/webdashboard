# Testing Mobile Print API in Postman

## Setup

1. **Method**: `POST`
2. **URL**: `http://localhost:3000/api/mobile/print-label`
3. **Headers**:
   - `Content-Type`: `application/json`

## Test Request Body

### Prep Label Example

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

### Ingredient Label Example

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

### PPDS Label Example

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

## Expected Response

### Success (200 OK)

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

### Error (400/500)

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Missing required fields: type and name are required",
  "labelId": "optional"
}
```

## Step-by-Step Postman Instructions

1. **Open Postman** and create a new request

2. **Set Method**: Select `POST` from the dropdown

3. **Enter URL**: 
   ```
   http://localhost:3000/api/mobile/print-label
   ```

4. **Add Headers**:
   - Click on "Headers" tab
   - Add:
     - Key: `Content-Type`
     - Value: `application/json`

5. **Add Body**:
   - Click on "Body" tab
   - Select "raw"
   - Select "JSON" from the dropdown
   - Paste one of the example JSON bodies above

6. **Send Request**:
   - Click "Send"
   - Wait 3-5 seconds (first request takes longer as Playwright launches Chromium)

7. **View Response**:
   - Check the response body for the `tsplBase64` field
   - The response should be ~25KB+ (contains binary bitmap data)

## Verifying It's Real Data

To verify it's rendering actual labels (not dummy data):

1. **Change the name** in the request - the TSPL Base64 should change
2. **Change the ingredients** - the bitmap data should be different
3. **Change the initials** - the rendered label should show different initials
4. **Try different label types** - PPDS vs Prep should have different structures

The `tsplBase64` field should be different for each unique label, proving it's actually rendering.

## Troubleshooting

- **Connection refused**: Make sure `npm run dev` is running
- **Timeout**: First request takes longer (3-5 seconds) as Chromium launches
- **500 Error**: Check server logs for Playwright/rendering errors
- **400 Error**: Check that all required fields are present (especially `allIngredients` for menu items)


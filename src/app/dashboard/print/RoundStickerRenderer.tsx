import React from "react"
import { PrintQueueItem } from "@/types/print"

interface RoundStickerRendererProps {
  item: PrintQueueItem
  expiry: string
  allergens: string[]
  allIngredients: Array<{
    uuid: string
    ingredientName: string
    allergens: { allergenName: string }[]
  }>
}

export function RoundStickerRenderer({
  item,
  expiry,
  allergens,
  allIngredients = [],
}: RoundStickerRendererProps) {
  // Helper to get ingredient object by name or uuid
  const getIngredientObj = (ing: string) => {
    return allIngredients.find(
      (i) => i.ingredientName.trim().toLowerCase() === ing.trim().toLowerCase() || i.uuid === ing
    )
  }

  // Build allergen map for menu items
  const allergenMap: Record<string, string[]> = {}
  let allergenicIngredients: string[] = []

  if (item.type === "menu" && Array.isArray(item.ingredients)) {
    item.ingredients.forEach((ing) => {
      const obj = getIngredientObj(ing)
      if (obj && obj.allergens && obj.allergens.length > 0) {
        allergenMap[ing] = obj.allergens.map((a) => a.allergenName.toUpperCase())
        allergenicIngredients.push(ing)
      } else {
        allergenMap[ing] = []
      }
    })
  }

  // Get unique allergens for this menu item
  const uniqueAllergens = Array.from(
    new Set(allergenicIngredients.flatMap((ing) => allergenMap[ing] || []))
  )

  // Format expiry date
  const shortDate = (date: string) => {
    try {
      const d = new Date(date)
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    } catch {
      return date || "N/A"
    }
  }

  const shortExpiry = shortDate(expiry || item.expiryDate || "")

  // Round label dimensions: 50mm x 50mm
  const DIAMETER_CM = 5.0 // 50mm = 5cm
  const DIAMETER_PX = 189 // Approximate pixels at 96 DPI

  return (
    <div
      style={{
        width: `${DIAMETER_CM}cm`,
        height: `${DIAMETER_CM}cm`,
        borderRadius: "50%",
        backgroundColor: "white",
        border: "2px solid black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4mm",
        boxSizing: "border-box",
        fontFamily: "Menlo, Consolas, 'Liberation Mono', monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Item Name - Centered at top */}
      <div
        style={{
          fontSize: "11pt",
          fontWeight: 900,
          textAlign: "center",
          marginBottom: "2mm",
          lineHeight: 1.2,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          maxWidth: "100%",
          wordBreak: "break-word",
        }}
      >
        {item.name}
      </div>

      {/* Expiry Date - Centered in middle */}
      <div
        style={{
          fontSize: "9pt",
          fontWeight: 700,
          textAlign: "center",
          marginBottom: "2mm",
          color: "#000",
        }}
      >
        Expires: {shortExpiry}
      </div>

      {/* Allergens - Centered at bottom */}
      {uniqueAllergens.length > 0 ? (
        <div
          style={{
            fontSize: "8pt",
            fontWeight: 700,
            textAlign: "center",
            color: "#000",
            lineHeight: 1.3,
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: "1mm" }}>Contains:</div>
          <div>{uniqueAllergens.join(", ")}</div>
        </div>
      ) : (
        <div
          style={{
            fontSize: "8pt",
            fontWeight: 500,
            textAlign: "center",
            color: "#666",
            fontStyle: "italic",
          }}
        >
          No allergens
        </div>
      )}
    </div>
  )
}


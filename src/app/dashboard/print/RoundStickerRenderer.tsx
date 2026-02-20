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
  isPreview?: boolean
  showNetWt?: boolean
  netWt?: string
}

export function RoundStickerRenderer({
  item,
  expiry,
  allergens,
  allIngredients = [],
  isPreview = false,
  showNetWt = false,
  netWt = "",
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
        month: "2-digit",
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

  // Determine dynamic font size based on character count for more accurate scaling
  const nameLength = (item.name || "").trim().length
  const nameFontSize = nameLength > 25 ? "8pt" : nameLength > 15 ? "9.5pt" : "11.5pt"

  const ingredientsCount = (item.ingredients || []).length
  const ingFontSize = ingredientsCount > 8 ? "5pt" : ingredientsCount > 4 ? "5.5pt" : "6pt"

  return (
    <div
      style={{
        width: `${DIAMETER_CM}cm`,
        height: `${DIAMETER_CM}cm`,
        borderRadius: "50%",
        backgroundColor: "white",
        border: isPreview ? "2px dashed #999" : "none",
        boxShadow: isPreview ? "0 4px 6px -1px rgb(0 0 0 / 0.1)" : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2mm 4mm", // Reduced padding to allow content to utilize the full width of the circle
        boxSizing: "border-box",
        fontFamily: "Menlo, Consolas, 'Liberation Mono', monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Inner container to restrict width slightly more to account for circle curvature */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "92%",
        }}
      >
        {/* Item Name - Centered at top */}
        <div
          style={{
            fontSize: nameFontSize,
            fontWeight: 900,
            textAlign: "center",
            marginBottom: "3mm",
            lineHeight: 1.1,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            width: "100%",
            maxWidth: "85%", // Force the title to wrap earlier to avoid bleeding on the top curve
            wordBreak: "break-word",
          }}
        >
          {item.name}
        </div>

        {/* Ingredients List - Centered in middle */}
        {item.ingredients && item.ingredients.length > 0 ? (
          <div
            style={{
              fontSize: ingFontSize,
              textAlign: "center",
              color: "#000",
              lineHeight: 1.25,
              width: "100%",
              wordBreak: "break-word",
              marginBottom: "3mm",
            }}
          >
            <span style={{ fontWeight: 900 }}>Ingredients: </span>
            {item.ingredients.map((ing, idx) => {
              const ingObj = allIngredients.find(
                (i) => i.ingredientName && ing && i.ingredientName.trim().toLowerCase() === ing.trim().toLowerCase()
              )
              const allergenList = (ingObj?.allergens || [])
                .map((a: any) => a.allergenName?.toUpperCase?.() || "")
                .filter(Boolean)
              
              const isLast = idx === item.ingredients!.length - 1
              
              return (
                <span key={`${ing}-${idx}`}>
                  {ing}
                  {allergenList.length > 0 && (
                    <strong style={{ fontWeight: 900 }}> ({allergenList.join(", ")})</strong>
                  )}
                  {!isLast && ", "}
                </span>
              )
            })}
          </div>
        ) : (
          <div
            style={{
              fontSize: "6pt",
              fontWeight: 500,
              textAlign: "center",
              color: "#666",
              fontStyle: "italic",
              marginBottom: "3mm",
            }}
          >
            No ingredients listed
          </div>
        )}

        {/* Net Weight and Best Before - Centered at bottom sequentially */}
        <div
          style={{
            fontSize: "6pt",
            fontWeight: 700,
            textAlign: "center",
            color: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5mm",
            width: "100%",
          }}
        >
          <span>Best Before:</span>
          <span>{shortExpiry}</span>
          {showNetWt && netWt && <span>{netWt}</span>}
        </div>
      </div>
    </div>
  )
}


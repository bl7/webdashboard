// src/components/LabelRender.tsx
import React from "react"
import { PrintQueueItem } from "@/types/print"
import { LabelHeight } from "./LabelHeightChooser"

interface LabelRenderProps {
  item: PrintQueueItem
  expiry: string
  useInitials: boolean
  selectedInitial: string
  allergens: string[]
  maxIngredients?: number
  labelHeight?: LabelHeight // Add this line
}

function fitText(text: string, maxLen: number) {
  return text.length > maxLen ? text.slice(0, maxLen - 3) + "..." : text
}

export default function LabelRender({
  item,
  expiry,
  useInitials,
  selectedInitial,
  allergens,
  maxIngredients = 5,
  labelHeight = "31mm", // Default
}: LabelRenderProps) {
  // --- Sizing and layout logic ---
  let heightCm = 3.05
  let fontSize = 12
  let nameFontSize = 15
  let sectionSpacing = 2
  let maxIngredientsToShow = 2
  let showLogo = false
  let showInitials = false
  let showAllergens = true
  let showIngredients = false
  let showPrintedExpiry = true
  let maxNameLen = 18
  let maxIngLen = 12
  let maxAllergenLen = 10

  if (labelHeight === "40mm") {
    heightCm = 3.95
    fontSize = 13
    nameFontSize = 18
    sectionSpacing = 4
    maxIngredientsToShow = 5
    showLogo = false
    showInitials = true
    showAllergens = true
    showIngredients = true
    showPrintedExpiry = true
    maxNameLen = 22
    maxIngLen = 16
    maxAllergenLen = 12
  } else if (labelHeight === "80mm") {
    heightCm = 7.95
    fontSize = 15
    nameFontSize = 22
    sectionSpacing = 8
    maxIngredientsToShow = 12
    showLogo = true
    showInitials = true
    showAllergens = true
    showIngredients = true
    showPrintedExpiry = true
    maxNameLen = 32
    maxIngLen = 22
    maxAllergenLen = 18
  }

  const shortDate = (date: string) => {
    try {
      const d = new Date(date)
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })
    } catch {
      return date || "N/A"
    }
  }

  const shortPrinted = shortDate(item.printedOn || "")
  const shortExpiry = shortDate(expiry || item.expiryDate || "")
  const allergenNames = allergens.map((a) => a.toLowerCase())
  const isAllergen = (ing: string) => allergenNames.some((a) => ing.toLowerCase().includes(a))
  const ingredientList = (item.ingredients ?? []).filter(
    (ing): ing is string => typeof ing === "string" && ing.trim() !== ""
  )
  const allergensOnly = ingredientList.filter(isAllergen)
  const tooLong = ingredientList.length > maxIngredientsToShow
  const isPPDS = item.labelType === "ppds"

  // Truncate ingredients/allergens for small labels
  const shownIngredients = ingredientList.slice(0, maxIngredientsToShow)
  const hiddenIngredients = ingredientList.length - shownIngredients.length
  const shownAllergens = allergensOnly.slice(0, maxIngredientsToShow)
  const hiddenAllergens = allergensOnly.length - shownAllergens.length

  return (
    <div
      style={{
        width: "5.6cm",
        height: `${heightCm}cm`,
        padding: labelHeight === "31mm" ? 2 : 6,
        backgroundColor: "white",
        fontFamily: "monospace",
        fontWeight: "bold",
        fontSize,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        border: "2px solid black",
        borderRadius: 6,
        position: "relative",
        overflow: "visible",
        margin: 0,
      }}
    >
      {/* Watermark text for PPDS, all sizes */}
      {isPPDS && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: labelHeight === "31mm" ? 0.5 : 2,
            transform: "translateX(-50%)",
            opacity: 0.3,
            pointerEvents: "none",
            zIndex: 100,
            fontSize: Math.max(fontSize - 3, 6),
            fontWeight: 600,
            color: "#888",
            textAlign: "center",
            fontFamily: "monospace",
            letterSpacing: 0.5,
            textShadow: "0 0 2px rgba(255,255,255,1)",
            backgroundColor: "rgba(255,255,255,0.8)",
            padding: "1px 4px",
            borderRadius: 2,
          }}
        >
          instalabel.co
        </div>
      )}

      {/* Item Name */}
      <div
        style={{
          textAlign: "center",
          backgroundColor: "black",
          color: "white",
          padding: "2px 0",
          marginBottom: sectionSpacing,
          zIndex: 1,
          position: "relative",
          fontSize: nameFontSize,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: "uppercase",
          borderRadius: 2,
        }}
      >
        {fitText(item.name, maxNameLen)}
      </div>

      {/* Dates */}
      {showPrintedExpiry && !isPPDS && (
        <div
          style={{
            fontSize: fontSize - 1,
            marginBottom: sectionSpacing,
            fontWeight: 700,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <span>Printed: {shortPrinted}</span>
          <span>Expiry: {shortExpiry}</span>
        </div>
      )}
      {showPrintedExpiry && isPPDS && (
        <div
          style={{
            fontSize: fontSize - 1,
            marginBottom: sectionSpacing,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Best Before: {shortExpiry}
        </div>
      )}

      {/* Ingredients */}
      {showIngredients && shownIngredients.length > 0 && (
        <div
          style={{
            fontSize: fontSize - 1,
            marginBottom: sectionSpacing,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
          }}
        >
          <span style={{ fontWeight: 700 }}>Ingredients:</span>
          {shownIngredients.map((ing, idx) =>
            isAllergen(ing) ? (
              <span
                key={ing + idx}
                style={{
                  fontWeight: 900,
                  border: "1px solid black",
                  padding: "0 2px",
                  marginLeft: 2,
                  marginRight: 2,
                  fontSize: fontSize - 1,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                *{fitText(ing, maxIngLen)}*
              </span>
            ) : (
              <span key={ing + idx} style={{ marginLeft: 2, fontWeight: 500 }}>
                {fitText(ing, maxIngLen)}
              </span>
            )
          )}
          {hiddenIngredients > 0 && (
            <span style={{ fontWeight: 700, marginLeft: 4 }}>+{hiddenIngredients} more</span>
          )}
        </div>
      )}

      {/* Allergens (if not shown inline) */}
      {showAllergens && !showIngredients && shownAllergens.length > 0 && (
        <div
          style={{
            fontSize: fontSize - 1,
            marginBottom: sectionSpacing,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          Contains:
          {shownAllergens.map((a, idx) => (
            <span
              key={a + idx}
              style={{
                fontWeight: 900,
                border: "1px solid black",
                padding: "0 2px",
                marginLeft: 2,
                marginRight: 2,
                fontSize: fontSize - 1,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              *{fitText(a, maxAllergenLen)}*
            </span>
          ))}
          {hiddenAllergens > 0 && (
            <span style={{ fontWeight: 700, marginLeft: 4 }}>+{hiddenAllergens} more</span>
          )}
        </div>
      )}

      {/* Initials */}
      {showInitials && useInitials && selectedInitial && (
        <div
          style={{
            position: "absolute",
            bottom: 6,
            right: 8,
            fontSize: fontSize + 2,
            fontWeight: 900,
            border: "1.5px solid black",
            borderRadius: 4,
            padding: "0 6px",
            background: "white",
            zIndex: 2,
          }}
        >
          {selectedInitial}
        </div>
      )}
    </div>
  )
}

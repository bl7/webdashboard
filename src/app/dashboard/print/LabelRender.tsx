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

export default function LabelRender({
  item,
  expiry,
  useInitials,
  selectedInitial,
  allergens,
  maxIngredients = 5,
  labelHeight = "31mm", // Default
}: LabelRenderProps) {
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
  const tooLong = ingredientList.length > maxIngredients
  const isPPDS = item.labelType === "ppds"

  // Set height based on labelHeight
  const heightCm = labelHeight === "31mm" ? 3.1 : labelHeight === "40mm" ? 4.0 : 8.0

  return (
    <div
      style={{
        width: "5.6cm",
        height: `${heightCm}cm`,
        padding: 8,
        backgroundColor: "white",
        fontFamily: "monospace",
        fontWeight: "bold",
        fontSize: 12,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        border: "1px solid black",
        position: "relative", // <-- Add this
        overflow: "hidden", // <-- Add this to prevent overflow
      }}
    >
      {/* Watermark logo for PPDS */}
      {isPPDS && (
        <img
          src="/logo_long.png"
          alt="Logo"
          style={{
            position: "absolute",
            left: "50%",
            top: "70%", // Move further down
            transform: "translate(-50%, -50%)",
            opacity: 0.13,
            maxWidth: "98%", // Make it a bit wider
            maxHeight: "75%", // Make it a bit taller
            objectFit: "contain",
            pointerEvents: "none",
            zIndex: 0,
            filter: "grayscale(100%)",
          }}
          draggable={false}
        />
      )}

      <div
        style={{
          textAlign: "center",
          backgroundColor: "black",
          color: "white",
          padding: "2px 0",
          marginBottom: 6,
          zIndex: 1,
          position: "relative",
        }}
      >
        {item.name}
      </div>

      <div
        style={{
          fontSize: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          zIndex: 1,
          position: "relative",
        }}
      >
        {/* Only show Printed/Expiry for non-PPDS */}
        {!isPPDS && (
          <div>
            Printed: {shortPrinted} &nbsp;&nbsp; Expiry: {shortExpiry}
          </div>
        )}

        {item.type === "ingredients" ? (
          <div>
            Allergens:{" "}
            {item.allergens?.length
              ? item.allergens.map((a) => <span key={a.allergenName}>*{a.allergenName}* </span>)
              : "No allergens declared"}
          </div>
        ) : isPPDS ? (
          <>
            <div style={{ textAlign: "center" }}>Best Before: {shortExpiry}</div>
            <div>
              Ingredients:{" "}
              {ingredientList.map((ing) =>
                isAllergen(ing) ? <b key={ing}>*{ing}* </b> : <span key={ing}>{ing} </span>
              )}
            </div>
          </>
        ) : (
          <div>
            {tooLong ? (
              <>
                Allergens:{" "}
                {allergensOnly.map((a) => (
                  <b key={a}>*{a}* </b>
                ))}
              </>
            ) : (
              <>
                Ingredients:{" "}
                {ingredientList.map((ing) =>
                  isAllergen(ing) ? <b key={ing}>*{ing}* </b> : <span key={ing}>{ing} </span>
                )}
              </>
            )}
          </div>
        )}

        {useInitials && selectedInitial && (
          <div style={{ textAlign: "right" }}>{selectedInitial}</div>
        )}
      </div>
    </div>
  )
}

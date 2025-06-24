// src/components/LabelRender.tsx
import React from "react"
import { PrintQueueItem } from "@/types/print"

interface LabelRenderProps {
  item: PrintQueueItem
  expiry: string
  useInitials: boolean
  selectedInitial: string
  allergens: string[]
  maxIngredients?: number
}

export default function LabelRender({
  item,
  expiry,
  useInitials,
  selectedInitial,
  allergens,
  maxIngredients = 5,
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

  return (
    <div
      style={{
        width: "5.6cm",
        height: "3.1cm",
        padding: 8,
        backgroundColor: "white",
        fontFamily: "monospace",
        fontWeight: "bold",
        fontSize: 12,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        border: "1px solid black",
      }}
    >
      <div
        style={{
          textAlign: "center",
          backgroundColor: "black",
          color: "white",
          padding: "2px 0",
        }}
      >
        {item.name}
      </div>

      <div style={{ fontSize: 10 }}>
        <div>
          Printed: {shortPrinted} &nbsp;&nbsp; Expiry: {shortExpiry}
        </div>

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

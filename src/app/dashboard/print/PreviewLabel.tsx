"use client"
import React from "react"
import { PrintQueueItem } from "@/types/print"

export type LabelHeight = "31mm" | "40mm" | "80mm"

interface LabelPreviewProps {
  printQueue: PrintQueueItem[]
  ALLERGENS: string[]
  MAX_INGREDIENTS_TO_FIT?: number
  customExpiry: Record<string, string>
  onExpiryChange: (uid: string, value: string) => void
  useInitials?: boolean
  selectedInitial?: string
  labelHeight?: LabelHeight
}

// Helper function to format date as "MMM DD"
function formatShortDate(dateString: string): string {
  if (!dateString || dateString === "N/A") return "N/A"

  try {
    const date = new Date(dateString)
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
    const month = months[date.getMonth()]
    const day = date.getDate().toString().padStart(2, "0")
    return `${month} ${day}`
  } catch {
    return dateString
  }
}

const LabelPreview: React.FC<LabelPreviewProps> = ({
  printQueue,
  ALLERGENS,
  MAX_INGREDIENTS_TO_FIT = 5,
  customExpiry,
  onExpiryChange,
  useInitials = false,
  selectedInitial = "",
  labelHeight = "40mm",
}) => {
  const allergenNames = ALLERGENS.map((a) => a.toLowerCase())
  const isAllergen = (ing: string) => allergenNames.some((a) => ing.toLowerCase().includes(a))

  // Fixed dimensions for all labels: 5.6cm x 3.1cm
  const labelWidthCm = "5.6cm"
  const labelHeightCm = "3.1cm"
  const titleFontSize = "12px"
  const titlePadding = "4px"
  const contentFontSize = "10px"
  const contentPadding = "6px"
  const labelGap = "6px"

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Label Preview (5.6cm x 3.1cm)</h2>
      {printQueue.length === 0 ? (
        <p className="text-gray-500">Select items to preview labels.</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-600">
            Preview shows actual 5.6cm x 3.1cm label dimensions. You can change expiry dates below
            for some labels if you want.
          </p>
          <div
            className="flex flex-wrap gap-[2mm]"
            style={{ backgroundColor: "#f9fafb", padding: "8px" }}
          >
            {printQueue.map((item) => {
              const ingredientList = (item.ingredients ?? []).filter(
                (ing): ing is string => typeof ing === "string" && ing.trim() !== ""
              )
              const isPPDS = item.labelType === "ppds"
              const tooLong = ingredientList.length > MAX_INGREDIENTS_TO_FIT
              const allergensOnly = ingredientList.filter(isAllergen)
              const expiry = customExpiry[item.uid] || item.expiryDate || "N/A"

              // Format dates to short format for display
              const shortPrintedDate = formatShortDate(item.printedOn ?? "")
              const shortExpiryDate = formatShortDate(expiry)

              return (
                <div
                  key={item.uid}
                  style={{
                    width: labelWidthCm,
                    display: "flex",
                    flexDirection: "column",
                    gap: labelGap,
                  }}
                >
                  {/* Expiry date input */}
                  <label
                    htmlFor={`expiry-${item.uid}`}
                    className="text-xs font-medium"
                    style={{ marginBottom: 2 }}
                  >
                    Expiry Date (optional):
                  </label>
                  <input
                    id={`expiry-${item.uid}`}
                    type="date"
                    value={customExpiry[item.uid] || ""}
                    onChange={(e) => onExpiryChange(item.uid, e.target.value)}
                    className="rounded border border-gray-300 px-2 py-1 text-xs"
                    placeholder="Set expiry date"
                    style={{ width: "100%" }}
                  />

                  {/* Label box - Fixed 5.6cm x 3.1cm dimensions */}
                  <div
                    style={{
                      width: labelWidthCm,
                      height: labelHeightCm,
                      border: "2px solid #333",
                      padding: contentPadding,
                      fontSize: contentFontSize,
                      overflow: "hidden",
                      whiteSpace: "normal",
                      boxSizing: "border-box",
                      backgroundColor: "white",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      position: "relative",
                      lineHeight: "1.3",
                    }}
                  >
                    {useInitials && selectedInitial && !isPPDS && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: contentPadding,
                          right: contentPadding,
                          fontSize: "9px",
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        {selectedInitial}
                      </div>
                    )}

                    {item.type === "ingredients" ? (
                      <>
                        {/* Ingredient Label */}
                        <div
                          className="text-center font-bold text-white"
                          style={{
                            backgroundColor: "black",
                            padding: titlePadding,
                            margin: `-${contentPadding} -${contentPadding} ${labelGap} -${contentPadding}`,
                            fontSize: titleFontSize,
                            lineHeight: "1.2",
                            marginBottom: "6px",
                          }}
                        >
                          {item.name}
                        </div>

                        {/* Dates section - compact single line */}
                        <div className="mb-2 text-xs font-medium" style={{ fontSize: "9px" }}>
                          <div>
                            <b>Printed:</b> {shortPrintedDate} <b>Expiry:</b> {shortExpiryDate}
                          </div>
                        </div>

                        {/* Allergens List */}
                        {item.allergens && item.allergens.length > 0 ? (
                          <div
                            className="text-xs leading-relaxed"
                            style={{
                              fontSize: "9px",
                              lineHeight: "1.3",
                            }}
                          >
                            <b>Allergens:</b>{" "}
                            {item.allergens.map((a, i) => (
                              <span key={a.allergenName} className="font-bold text-red-600">
                                *{a.allergenName}*
                                {i < (item.allergens?.length ?? 0) - 1 ? ", " : ""}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs font-bold" style={{ fontSize: "9px" }}>
                            No allergens declared
                          </div>
                        )}
                      </>
                    ) : isPPDS ? (
                      <>
                        {/* PPDS Label */}
                        <div
                          className="text-center font-bold text-white"
                          style={{
                            backgroundColor: "black",
                            padding: titlePadding,
                            margin: `-${contentPadding} -${contentPadding} ${labelGap} -${contentPadding}`,
                            fontSize: titleFontSize,
                            lineHeight: "1.2",
                            marginBottom: "6px",
                          }}
                        >
                          {item.name}
                        </div>

                        {/* Best Before */}
                        <div className="mb-2 text-center font-bold" style={{ fontSize: "10px" }}>
                          <b>Best Before:</b> {shortExpiryDate}
                        </div>

                        {/* Ingredients */}
                        <div
                          className="text-xs leading-relaxed"
                          style={{
                            fontSize: "9px",
                            lineHeight: "1.3",
                          }}
                        >
                          <b>Ingredients:</b>{" "}
                          {ingredientList.map((ing, i) => (
                            <span
                              key={ing}
                              className={isAllergen(ing) ? "font-bold text-red-600" : ""}
                            >
                              {isAllergen(ing) ? `*${ing}*` : ing}
                              {i < ingredientList.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Regular Menu Item Label */}
                        <div
                          className="text-center font-bold text-white"
                          style={{
                            backgroundColor: "black",
                            padding: titlePadding,
                            margin: `-${contentPadding} -${contentPadding} ${labelGap} -${contentPadding}`,
                            fontSize: titleFontSize,
                            lineHeight: "1.2",
                            marginBottom: "6px",
                          }}
                        >
                          {item.name}
                        </div>

                        {/* Dates section - compact single line */}
                        <div className="mb-2 text-xs font-medium" style={{ fontSize: "9px" }}>
                          <div>
                            <b>Printed:</b> {shortPrintedDate} <b>Expiry:</b> {shortExpiryDate}
                          </div>
                        </div>

                        {/* Ingredients/Allergens */}
                        <div
                          className="text-xs leading-relaxed"
                          style={{
                            fontSize: "9px",
                            lineHeight: "1.3",
                          }}
                        >
                          {tooLong ? (
                            <>
                              <b>Allergens:</b>{" "}
                              {allergensOnly.map((a, i) => (
                                <span key={a} className="font-bold text-red-600">
                                  *{a}*{i < allergensOnly.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </>
                          ) : (
                            <>
                              <b>Ingredients:</b>{" "}
                              {ingredientList.map((ing, i) => (
                                <span
                                  key={ing}
                                  className={isAllergen(ing) ? "font-bold text-red-600" : ""}
                                >
                                  {isAllergen(ing) ? `*${ing}*` : ing}
                                  {i < ingredientList.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default LabelPreview

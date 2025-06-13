"use client"
import React from "react"
import { PrintQueueItem } from "@/types/print"

interface LabelPreviewProps {
  printQueue: PrintQueueItem[]
  ALLERGENS: string[]
  MAX_INGREDIENTS_TO_FIT?: number
  customExpiry: Record<string, string>
  onExpiryChange: (uid: string, value: string) => void
}

const LabelPreview: React.FC<LabelPreviewProps> = ({
  printQueue,
  ALLERGENS,
  MAX_INGREDIENTS_TO_FIT = 5,
  customExpiry,
  onExpiryChange,
}) => {
  const allergenNames = ALLERGENS.map((a) => a.toLowerCase())
  const isAllergen = (ing: string) => allergenNames.some((a) => ing.toLowerCase().includes(a))

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Label Preview</h2>
      {printQueue.length === 0 ? (
        <p className="text-gray-500">Select items to preview labels.</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-600">
            You can change expiry dates below for some labels if you want.
          </p>
          <div
            className="flex flex-wrap gap-[1mm]"
            style={{ backgroundColor: "#f9fafb", padding: "4px" }}
          >
            {printQueue.map((item) => {
              const ingredientList = (item.ingredients ?? []).filter(
                (ing): ing is string => typeof ing === "string" && ing.trim() !== ""
              )
              const isPPDS = item.labelType === "ppds"
              const tooLong = ingredientList.length > MAX_INGREDIENTS_TO_FIT
              const allergensOnly = ingredientList.filter(isAllergen)
              const fontSize = ingredientList.length > 12 ? "8px" : "10px"
              const expiry = customExpiry[item.uid] || item.expiryDate || "N/A"

              return (
                <div
                  key={item.uid}
                  style={{
                    width: "5.5cm",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
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

                  {/* Label box */}
                  <div
                    style={{
                      height: "3.1cm",
                      border: "1px solid #ccc",
                      padding: "4px",
                      fontSize,
                      overflow: "hidden",
                      whiteSpace: "normal",
                      boxSizing: "border-box",
                      backgroundColor: "white",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                    }}
                  >
                    {item.type === "ingredients" ? (
                      <>
                        {/* Ingredient Label */}
                        <div className="mb-1 text-sm font-bold">{item.name}</div>
                        <div className="mb-1 text-xs">
                          <b>Printed On:</b> {item.printedOn ?? "N/A"}
                        </div>
                        <div className="mb-2 text-xs">
                          <b>Expiry Date:</b> {expiry}
                        </div>

                        {/* Contains Allergens Warning */}
                        {item.allergens && item.allergens.length > 0 && (
                          <div className="mb-1 text-xs font-bold text-red-600">
                            Contains Allergens
                          </div>
                        )}

                        {/* Allergens List */}
                        {item.allergens && item.allergens.length > 0 ? (
                          <div className="overflow-hidden text-ellipsis text-xs leading-snug">
                            <b>Allergens:</b>{" "}
                            {item.allergens.map((a, i) => (
                              <span key={a.allergenName} className="font-semibold text-red-600">
                                {a.allergenName}
                                {i < (item.allergens?.length ?? 0) - 1 ? ", " : ""}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs italic text-gray-400">No allergens declared</div>
                        )}
                      </>
                    ) : isPPDS ? (
                      <>
                        {/* Menu Item Label - PPDS */}
                        <div className="mb-1 text-center text-sm font-bold">{item.name}</div>
                        <div
                          className="mb-1 text-center text-xs font-medium"
                          style={{
                            backgroundColor: "black",
                            color: "white",
                            padding: "2px 4px",
                          }}
                        >
                          Best Before: {expiry}
                        </div>
                        <div
                          className="overflow-hidden text-ellipsis text-xs leading-snug"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          <b>Ingredients:</b>{" "}
                          {ingredientList.map((ing, i) => (
                            <span
                              key={ing}
                              className={isAllergen(ing) ? "font-semibold text-red-600" : ""}
                            >
                              {ing}
                              {i < ingredientList.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Menu Item Label - non-PPDS */}
                        <div className="mb-1 text-sm font-bold">{item.name}</div>
                        <div className="mb-1 text-xs">
                          <b>Printed On:</b> {item.printedOn ?? "N/A"}
                        </div>
                        <div className="mb-2 text-xs">
                          <b>Expiry Date:</b> {expiry}
                        </div>
                        <div
                          className="overflow-hidden text-ellipsis text-xs leading-snug"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {tooLong ? (
                            <>
                              <b>Allergens:</b>{" "}
                              {allergensOnly.map((a, i) => (
                                <span key={a} className="font-semibold text-red-600">
                                  {a}
                                  {i < allergensOnly.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </>
                          ) : (
                            <>
                              <b>Ingredients:</b>{" "}
                              {ingredientList.map((ing, i) => (
                                <span
                                  key={ing}
                                  className={isAllergen(ing) ? "font-semibold text-red-600" : ""}
                                >
                                  {ing}
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

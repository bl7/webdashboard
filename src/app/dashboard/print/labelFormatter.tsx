import { toPng } from "html-to-image"
import React from "react"
import ReactDOM from "react-dom/client"
import { PrintQueueItem } from "@/types/print"

export type LabelHeight = "31mm" | "40mm" | "80mm"

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

// React component for visual label rendering
function LabelVisual({
  item,
  allergens,
  customExpiry,
  useInitials,
  selectedInitial,
}: {
  item: PrintQueueItem
  allergens: string[]
  customExpiry: Record<string, string>
  useInitials: boolean
  selectedInitial: string
}) {
  const expiry = customExpiry[item.uid] || item.expiryDate || "N/A"
  const shortPrintedDate = formatShortDate(item.printedOn ?? "")
  const shortExpiryDate = formatShortDate(expiry)
  const allergenNames = allergens.map((a) => a.toLowerCase())
  const isAllergen = (ing: string) => allergenNames.some((a) => ing.toLowerCase().includes(a))
  const ingredientList = (item.ingredients ?? []).filter(
    (ing): ing is string => typeof ing === "string" && ing.trim() !== ""
  )
  const tooLong = ingredientList.length > 5
  const allergensOnly = ingredientList.filter(isAllergen)
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
          userSelect: "none",
        }}
      >
        {item.name}
      </div>

      <div style={{ fontSize: 10 }}>
        <div>
          Printed: {shortPrintedDate} &nbsp;&nbsp; Expiry: {shortExpiryDate}
        </div>

        {item.type === "ingredients" ? (
          <div>
            Allergens:{" "}
            {item.allergens && item.allergens.length > 0
              ? item.allergens.map((a) => (
                  <span key={a.allergenName} style={{ fontWeight: "bold" }}>
                    *{a.allergenName}*{" "}
                  </span>
                ))
              : "No allergens declared"}
          </div>
        ) : isPPDS ? (
          <>
            <div style={{ textAlign: "center", fontWeight: "bold" }}>
              Best Before: {shortExpiryDate}
            </div>
            <div>
              Ingredients:{" "}
              {ingredientList.map((ing) =>
                isAllergen(ing) ? (
                  <span key={ing} style={{ fontWeight: "bold" }}>
                    *{ing}*{" "}
                  </span>
                ) : (
                  <span key={ing}>{ing} </span>
                )
              )}
            </div>
          </>
        ) : (
          <div>
            {tooLong ? (
              <>
                Allergens:{" "}
                {allergensOnly.map((a) => (
                  <span key={a} style={{ fontWeight: "bold" }}>
                    *{a}*{" "}
                  </span>
                ))}
              </>
            ) : (
              <>
                Ingredients:{" "}
                {ingredientList.map((ing) =>
                  isAllergen(ing) ? (
                    <span key={ing} style={{ fontWeight: "bold" }}>
                      *{ing}*{" "}
                    </span>
                  ) : (
                    <span key={ing}>{ing} </span>
                  )
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

// New async formatter: returns base64 PNG image string of the label
export async function formatLabelForPrintImage(
  item: PrintQueueItem,
  ALLERGENS: string[],
  customExpiry: Record<string, string>,
  MAX_INGREDIENTS_TO_FIT: number = 5,
  useInitials: boolean = false,
  selectedInitial: string = "",
  labelHeight: LabelHeight
): Promise<string> {
  // Create offscreen container
  const container = document.createElement("div")
  container.style.position = "fixed"
  container.style.top = "-9999px"
  container.style.left = "-9999px"
  container.style.width = "5.6cm"
  container.style.height = "3.1cm"
  container.style.backgroundColor = "white"
  document.body.appendChild(container)

  // Render React label component inside container
  const root = ReactDOM.createRoot(container)
  root.render(
    <LabelVisual
      item={item}
      allergens={ALLERGENS}
      customExpiry={customExpiry}
      useInitials={useInitials}
      selectedInitial={selectedInitial}
    />
  )

  // Wait for render
  await new Promise((r) => setTimeout(r, 100))

  // Convert container to PNG base64 string
  const imageData = await toPng(container, { cacheBust: true })

  // Cleanup
  root.unmount()
  container.remove()

  return imageData
}

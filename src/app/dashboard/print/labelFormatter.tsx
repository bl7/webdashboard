import { toPng } from "html-to-image"
import React from "react"
import ReactDOM from "react-dom/client"
import { PrintQueueItem } from "@/types/print"
import LabelRender from "./LabelRender"
import { LabelHeight } from "./LabelHeightChooser"

export async function formatLabelForPrintImage(
  item: PrintQueueItem,
  ALLERGENS: string[],
  customExpiry: Record<string, string>,
  MAX_INGREDIENTS_TO_FIT: number = 5,
  useInitials: boolean = false,
  selectedInitial: string = "",
  labelHeight: LabelHeight
): Promise<string> {
  const container = document.createElement("div")
  container.style.position = "fixed"
  container.style.top = "-9999px"
  container.style.left = "-9999px"
  container.style.width = "5.6cm"
  // Set height based on labelHeight
  container.style.height =
    labelHeight === "31mm" ? "3.1cm" : labelHeight === "40mm" ? "4.0cm" : "8.0cm"
  container.style.backgroundColor = "white"
  document.body.appendChild(container)

  const root = ReactDOM.createRoot(container)
  root.render(
    <LabelRender
      item={item}
      expiry={customExpiry[item.uid] || item.expiryDate || ""}
      useInitials={useInitials}
      selectedInitial={selectedInitial}
      allergens={ALLERGENS}
      maxIngredients={MAX_INGREDIENTS_TO_FIT}
      labelHeight={labelHeight} // Pass down
    />
  )

  await new Promise((resolve) => setTimeout(resolve, 100))
  const imageData = await toPng(container, { cacheBust: true })
  root.unmount()
  container.remove()
  return imageData
}

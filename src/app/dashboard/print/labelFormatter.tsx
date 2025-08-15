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
  labelHeight: LabelHeight,
  allIngredients: Array<{
    uuid: string
    ingredientName: string
    allergens: { allergenName: string }[]
  }> = []
): Promise<string> {
  console.log("🖼️ Starting image generation for:", item.name)

  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.top = "0"
  container.style.left = "0"
  container.style.width = "6.0cm" // Updated to 60mm
  container.style.height = "4.0cm" // Fixed to 40mm
  container.style.backgroundColor = "white"
  container.style.zIndex = "-1"
  container.style.visibility = "hidden"
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
      labelHeight={labelHeight}
      allIngredients={allIngredients}
    />
  )

  // Wait for React to render
  await new Promise((resolve) => setTimeout(resolve, 300))

  console.log("🖼️ Container created, generating PNG...")
  console.log("🖼️ Container dimensions:", container.offsetWidth, "x", container.offsetHeight)
  console.log("🖼️ Container content:", container.innerHTML.substring(0, 200) + "...")

  // Make sure container is visible for rendering
  container.style.visibility = "visible"

  const imageData = await toPng(container, {
    cacheBust: true,
    width: container.offsetWidth,
    height: container.offsetHeight,
    style: {
      transform: "scale(1)",
      transformOrigin: "top left",
    },
  })

  console.log("🖼️ PNG generated, length:", imageData.length)
  console.log("🖼️ PNG starts with:", imageData.substring(0, 50))

  if (!imageData || imageData.length < 100) {
    console.error("❌ Generated image data is empty or too small!")
    throw new Error("Failed to generate valid image data")
  }

  root.unmount()
  container.remove()

  console.log("✅ Image generation completed successfully")
  return imageData
}

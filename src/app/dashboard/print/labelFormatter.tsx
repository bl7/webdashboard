import { toPng } from "html-to-image"
import React from "react"
import ReactDOM from "react-dom/client"
import { PrintQueueItem } from "@/types/print"
import LabelRender from "./LabelRender"
import { LabelHeight } from "./LabelHeightChooser"
import { PPDSLabelRenderer } from "../ppds/PPDSLabelRenderer"

function findPreview(uid: string): HTMLElement | null {
  for (const node of document.querySelectorAll("[data-print-label]")) {
    if (node instanceof HTMLElement && node.getAttribute("data-print-label") === uid) return node
  }
  return null
}

function dropNameIfClipped(root: HTMLElement) {
  const label = root.matches("[data-label-root]")
    ? root
    : root.querySelector("[data-label-root]")
  if (!(label instanceof HTMLElement)) return
  const header = label.querySelector("[data-label-name]")
  if (!(header instanceof HTMLElement)) return
  const clipped =
    label.scrollHeight > label.clientHeight + 2 ||
    Array.from(label.querySelectorAll<HTMLElement>("*")).some(
      (el) => el !== header && !header.contains(el) && el.scrollHeight > el.clientHeight + 2
    )
  if (clipped) header.remove()
}

async function paint(node: HTMLElement): Promise<string> {
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  dropNameIfClipped(node)
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  return toPng(node, {
    cacheBust: true,
    pixelRatio: 3,
  })
}

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
  }> = [],
  ppdsOptions?: {
    storageInfo?: string
    businessName?: string
    showNetWt?: boolean
    showPrice?: boolean
    netWt?: string
    price?: string
  }
): Promise<string> {
  console.log("🖼️ Starting image generation for:", item.name, "at", labelHeight)

  const live = findPreview(item.uid)
  if (live) {
    const clone = live.cloneNode(true) as HTMLElement
    clone.style.position = "absolute"
    clone.style.left = "0"
    clone.style.top = "0"
    clone.style.margin = "0"
    clone.style.zIndex = "-1"
    clone.style.background = "white"
    clone.style.width = `${live.offsetWidth}px`
    clone.style.height = `${live.offsetHeight}px`
    document.body.appendChild(clone)
    try {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      const imageData = await toPng(clone, {
        cacheBust: true,
        pixelRatio: 3,
      })
      if (!imageData || imageData.length < 100) throw new Error("Failed to generate valid image data")
      return imageData
    } finally {
      clone.remove()
    }
  }

  const isPpds80 = item.labelType === "ppds" && item.type === "menu" && labelHeight === "80mm"

  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.top = "0"
  container.style.left = "0"
  if (isPpds80) {
    // Match hidden PPDS tab render engine dimensions.
    container.style.width = "56mm"
    container.style.height = "80mm"
  } else {
    const heightCm = labelHeight === "80mm" ? 8.0 : 4.0
    const widthCm = 6.0 // 60mm for standard labels
    container.style.width = `${widthCm}cm`
    container.style.height = `${heightCm}cm`
  }
  container.style.backgroundColor = "white"
  container.style.display = "flex"
  container.style.alignItems = "flex-start"
  container.style.justifyContent = "center"
  container.style.overflow = "hidden"
  container.style.zIndex = "-1"
  container.style.position = "fixed"
  container.style.left = "-10000px"
  document.body.appendChild(container)

  const root = ReactDOM.createRoot(container)
  if (isPpds80) {
    root.render(
      <PPDSLabelRenderer
        item={{ ...item }}
        storageInfo={ppdsOptions?.storageInfo || ""}
        businessName={ppdsOptions?.businessName || "InstaLabel"}
        allIngredients={allIngredients}
        showNetWt={ppdsOptions?.showNetWt || false}
        showPrice={ppdsOptions?.showPrice || false}
        netWt={ppdsOptions?.netWt || ""}
        price={ppdsOptions?.price || ""}
      />
    )
  } else {
    root.render(
      <LabelRender
        item={item}
        expiry={customExpiry[item.uid] || item.expiryDate || ""}
        useInitials={useInitials}
        selectedInitial={selectedInitial}
        allergens={ALLERGENS}
        maxIngredients={MAX_INGREDIENTS_TO_FIT}
        labelHeight={labelHeight}
        insetMm={2}
        allIngredients={allIngredients}
        ppdsMeta={{
          storageInfo: ppdsOptions?.storageInfo || "",
          showNetWt: ppdsOptions?.showNetWt || false,
          showPrice: ppdsOptions?.showPrice || false,
          netWt: ppdsOptions?.netWt || "",
          price: ppdsOptions?.price || "",
        }}
      />
    )
  }

  await new Promise((resolve) => setTimeout(resolve, 300))

  console.log("🖼️ Container created, generating PNG...")
  console.log("🖼️ Container dimensions:", container.offsetWidth, "x", container.offsetHeight)

  const imageData = await paint(container)

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

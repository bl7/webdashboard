/**
 * Server-side rendering utility for label components
 * Uses Playwright to render React components to PNG with pixel-identical output
 */

import React from "react"
import { PrintQueueItem } from "@/types/print"
import LabelRender from "@/app/dashboard/print/LabelRender"
import { PPDSLabelRenderer } from "@/app/dashboard/ppds/PPDSLabelRenderer"
import type { MobilePrintRequest } from "@/types/mobile-print"

interface RenderOptions {
  widthPx: number
  heightPx: number
  dpi: number
}

/**
 * Renders a label component to PNG using Playwright
 * This ensures pixel-identical output to web labels
 */
export async function renderLabelToPng(
  request: MobilePrintRequest,
  options: RenderOptions
): Promise<Buffer> {
  // Dynamically import Playwright (only when needed)
  const { chromium } = await import("playwright")

  // Launch browser
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for some environments
  })

  try {
    const page = await browser.newPage()

    // Set viewport to exact pixel dimensions
    await page.setViewportSize({
      width: options.widthPx,
      height: options.heightPx,
    })

    // Build the item object for the renderer
    // Map allergens to match Allergen type (all fields required)
    const allergens = request.allergens
      ? request.allergens.map((a) => ({
          uuid: a.uuid || 0,
          allergenName: a.allergenName,
          category: a.category || "Other",
          status: (a.status || "Active") as "Active" | "Inactive",
          addedAt: a.addedAt || "",
          isCustom: a.isCustom || false,
        }))
      : undefined

    // Map labelType: "defrost" is treated as "prep" for PrintQueueItem
    // PrintQueueItem doesn't support "defrost", so we map it to "prep"
    const labelType: "cooked" | "prep" | "ppds" | "ppd" | "default" | undefined =
      request.labelType === "defrost"
        ? "prep"
        : request.labelType === "ppds"
          ? "ppds"
          : request.labelType === "cooked"
            ? "cooked"
            : request.labelType === "prep"
              ? "prep"
              : request.labelType === "default"
                ? "default"
                : undefined

    const item: PrintQueueItem = {
      uid: request.uid || `mobile-${Date.now()}`,
      id: request.id || request.uid || `mobile-${Date.now()}`,
      type: request.type,
      name: request.name,
      quantity: request.quantity || request.copies || 1,
      ingredients: request.ingredients,
      allergens: allergens,
      printedOn: request.printedOn,
      expiryDate: request.expiryDate,
      labelType: labelType,
    }

    // Determine expiry date (expiry takes precedence)
    const expiry = request.expiry || request.expiryDate || ""

    // Build allergens array (string array for LabelRender)
    const allergensList =
      request.allergensList ||
      (request.allergens
        ? request.allergens.map((a) => a.allergenName.toLowerCase())
        : [])

    // Build allIngredients array
    const allIngredients = request.allIngredients || []

    // Determine which renderer to use
    const isPPDS = request.labelType === "ppds" && request.type === "menu"
    const labelHeight = request.labelHeight || (isPPDS ? "80mm" : "40mm")

    // Use React Server Components renderToString to get HTML
    const { renderToString } = await import("react-dom/server")

    let html: string

    if (isPPDS) {
      // PPDS labels require storageInfo and businessName
      if (!request.storageInfo || !request.businessName) {
        throw new Error("PPDS labels require storageInfo and businessName")
      }

      html = renderToString(
        React.createElement(PPDSLabelRenderer, {
          item,
          storageInfo: request.storageInfo,
          businessName: request.businessName,
          allIngredients,
        })
      )
    } else {
      // Regular labels using LabelRender
      html = renderToString(
        React.createElement(LabelRender, {
          item,
          expiry,
          useInitials: request.useInitials || false,
          selectedInitial: request.selectedInitial || "",
          allergens: allergensList,
          maxIngredients: request.maxIngredients || 5,
          labelHeight: labelHeight as "40mm" | "80mm",
          allIngredients,
        })
      )
    }

    // Create HTML page with the rendered component
    // The components use inline styles, so we don't need external CSS
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
              width: ${options.widthPx}px;
              height: ${options.heightPx}px;
              overflow: hidden;
              background: white;
              display: flex;
              align-items: flex-start;
              justify-content: flex-start;
            }
            #root {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
          <div id="root">${html}</div>
        </body>
      </html>
    `

    await page.setContent(fullHtml)

    // Wait for content to render (components use inline styles, so no async loading needed)
    await page.waitForTimeout(300)

    // Take screenshot as PNG
    const screenshot = await page.screenshot({
      type: "png",
      clip: {
        x: 0,
        y: 0,
        width: options.widthPx,
        height: options.heightPx,
      },
    })

    return screenshot as Buffer
  } finally {
    await browser.close()
  }
}


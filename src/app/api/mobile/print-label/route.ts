import { NextRequest, NextResponse } from "next/server"
import type {
  MobilePrintRequest,
  MobilePrintResponse,
  MobilePrintError,
} from "@/types/mobile-print"
import { renderLabelToPng } from "@/lib/mobile-print/server-render"
import { convertPngToBitmap, calculateBitmapDimensions } from "@/lib/mobile-print/bitmap-converter"
import {
  generateTSPLScript,
  combineTSPLWithBitmap,
} from "@/lib/mobile-print/tspl-generator"

/**
 * POST /api/mobile/print-label
 * 
 * Generates TSPL (Thermal Printer Script Language) bytes for mobile printing
 * Returns Base64-encoded TSPL script with binary bitmap data
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const request = body as MobilePrintRequest

    // Validate required fields
    if (!request.type || !request.name) {
      return NextResponse.json<MobilePrintError>(
        {
          error: "VALIDATION_ERROR",
          message: "Missing required fields: type and name are required",
        },
        { status: 400 }
      )
    }

    if (!request.printer || !request.printer.dpi || !request.printer.labelSizeMm) {
      return NextResponse.json<MobilePrintError>(
        {
          error: "VALIDATION_ERROR",
          message: "Missing required printer configuration: printer.dpi and printer.labelSizeMm are required",
        },
        { status: 400 }
      )
    }

    // Validate PPDS requirements
    if (request.labelType === "ppds" && request.type === "menu") {
      if (!request.storageInfo || !request.businessName) {
        return NextResponse.json<MobilePrintError>(
          {
            error: "VALIDATION_ERROR",
            message: "PPDS labels require storageInfo and businessName",
          },
          { status: 400 }
        )
      }
    }

    // Validate menu items have ingredients
    if (request.type === "menu" && !request.ingredients) {
      return NextResponse.json<MobilePrintError>(
        {
          error: "VALIDATION_ERROR",
          message: "Menu items require ingredients array",
        },
        { status: 400 }
      )
    }

    // Validate menu items have allIngredients for allergen mapping
    if (request.type === "menu" && !request.allIngredients) {
      return NextResponse.json<MobilePrintError>(
        {
          error: "VALIDATION_ERROR",
          message: "Menu items require allIngredients array for allergen mapping",
        },
        { status: 400 }
      )
    }

    // Calculate pixel dimensions from printer DPI and label size
    const { dpi } = request.printer
    const { width: widthMm, height: heightMm } = request.printer.labelSizeMm

    const widthPx = Math.round((widthMm * dpi) / 25.4)
    const heightPx = Math.round((heightMm * dpi) / 25.4)

    // Determine label height (PPDS always uses 80mm, others use request or default 40mm)
    const isPPDS = request.labelType === "ppds" && request.type === "menu"
    const labelHeight = request.labelHeight || (isPPDS ? "80mm" : "40mm")

    // Render label to PNG using server-side rendering
    let pngBuffer: Buffer
    try {
      pngBuffer = await renderLabelToPng(request, {
        widthPx,
        heightPx,
        dpi,
      })
    } catch (error) {
      console.error("Label rendering error:", error)
      return NextResponse.json<MobilePrintError>(
        {
          error: "RENDER_FAILED",
          message: error instanceof Error ? error.message : "Failed to render label",
          labelId: request.uid || request.id?.toString(),
        },
        { status: 500 }
      )
    }

    // Convert PNG to 1-bit monochrome bitmap
    let bitmapData: Buffer
    try {
      bitmapData = await convertPngToBitmap(pngBuffer, widthPx, heightPx, {
        threshold: 128, // Default threshold (configurable in future)
      })
    } catch (error) {
      console.error("Bitmap conversion error:", error)
      return NextResponse.json<MobilePrintError>(
        {
          error: "CONVERSION_FAILED",
          message: error instanceof Error ? error.message : "Failed to convert PNG to bitmap",
          labelId: request.uid || request.id?.toString(),
        },
        { status: 500 }
      )
    }

    // Calculate bitmap dimensions
    const { widthBytes, heightPx: bitmapHeight } = calculateBitmapDimensions(
      widthPx,
      heightPx
    )

    // Generate TSPL script
    const { commandString, bitmapData: tsplBitmapData } = generateTSPLScript(
      {
        widthMm,
        heightMm,
        gapMm: 0, // Default no gap
        direction: 0, // Normal direction
        referenceX: 0,
        referenceY: 0,
      },
      {
        widthBytes,
        heightPx: bitmapHeight,
        bitmapData,
        x: 0,
        y: 0,
      },
      request.copies || 1
    )

    // Combine TSPL command string with binary bitmap data
    const tsplBuffer = combineTSPLWithBitmap(commandString, tsplBitmapData)

    // Encode to Base64
    const tsplBase64 = tsplBuffer.toString("base64")

    // Return response
    const response: MobilePrintResponse = {
      tsplBase64,
      labelType: request.labelType || request.type,
      dimensions: {
        width: widthMm,
        height: heightMm,
      },
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error("Mobile print API error:", error)
    return NextResponse.json<MobilePrintError>(
      {
        error: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}


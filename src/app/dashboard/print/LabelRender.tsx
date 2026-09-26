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
  labelHeight?: LabelHeight
  allIngredients: Array<{
    uuid: string
    ingredientName: string
    allergens: { allergenName: string }[]
  }>
  ppdsMeta?: {
    storageInfo?: string
    showNetWt?: boolean
    showPrice?: boolean
    netWt?: string
    price?: string
  }
  /** White margin inside the print image, in mm, so the border is not on the cut edge. */
  insetMm?: number
  onOverflow?: (overflows: boolean) => void
}

function fitText(text: string, maxLen: number) {
  return text.length > maxLen ? text.slice(0, maxLen - 3) + "..." : text
}

export default function LabelRender({
  item,
  expiry,
  useInitials,
  selectedInitial,
  allergens,
  maxIngredients = 5,
  labelHeight = "40mm",
  allIngredients = [],
  ppdsMeta,
  insetMm = 0,
  onOverflow,
}: LabelRenderProps) {
  // --- Sizing and layout configuration ---
  const labelConfig = {
    "40mm": {
      heightCm: 4.0,
      fontSize: 15,
      nameFontSize: 21,
      sectionSpacing: 4,
      padding: 0, // Remove padding
      maxNameLen: 22,
      maxIngLen: 16,
      maxAllergenLen: 12,
      maxIngredientsToShow: 5,
      expiresFontSize: 12,
      metaFontSize: 9.5,
      containsFontSize: 10.5,
      ppdsFontSize: 9.5,
    },
    "80mm": {
      heightCm: 8.0,
      fontSize: 17,
      nameFontSize: 25,
      sectionSpacing: 8,
      padding: 0, // Remove padding
      maxNameLen: 32,
      maxIngLen: 22,
      maxAllergenLen: 18,
      maxIngredientsToShow: 12,
      expiresFontSize: 16,
      metaFontSize: 13,
      containsFontSize: 15,
      ppdsFontSize: 14,
    },
  }

  const config = labelConfig[labelHeight]
  const { heightCm, fontSize, nameFontSize, sectionSpacing, padding } = config

  // --- No padding for edge-to-edge ---
  const LABEL_WIDTH_CM = 6.0
  const printBox = insetMm > 0
  const insetCm = printBox ? insetMm / 10 : 0
  const labelWidthCm = LABEL_WIDTH_CM - insetCm * 2
  const labelHeightCm = heightCm - insetCm * 2
  const fullWidthPx = Math.round((labelWidthCm / 2.54) * 96) - (printBox ? 4 : 0)

  // --- Common styling ---
  const baseStyle = {
    width: printBox ? `${Math.round((labelWidthCm / 2.54) * 96)}px` : `${labelWidthCm}cm`,
    height: printBox ? `${Math.round((labelHeightCm / 2.54) * 96)}px` : `${labelHeightCm}cm`,
    padding: printBox ? "0 8px 4px 10px" : 0,
    backgroundColor: "white",
    fontFamily: 'Arial, Helvetica, "Liberation Sans", sans-serif',
    fontWeight: 700,
    WebkitFontSmoothing: "antialiased" as const,
    MozOsxFontSmoothing: "grayscale" as const,
    fontSize,
    display: "flex",
    flexDirection: "column" as const,
    boxSizing: "border-box" as const,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: printBox ? 0 : "2px",
    boxShadow: undefined,
    minWidth: printBox ? 0 : undefined,
    maxWidth: printBox ? `${fullWidthPx}px` : undefined,
    borderRadius: printBox ? 0 : 6,
    position: "relative" as const,
    overflow: printBox ? ("hidden" as const) : ("visible" as const),
    minHeight: printBox ? 0 : undefined,
    flexShrink: printBox ? 0 : undefined,
    alignSelf: printBox ? ("flex-start" as const) : undefined,
    margin: 0, // Remove all margin
    letterSpacing: 0,
  }

  // --- Utility functions ---
  const shortDate = (date: string) => {
    try {
      const d = new Date(date)
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    } catch {
      return date || "N/A"
    }
  }

  const getDayShort = (date: string) => {
    try {
      const d = new Date(date)
      return d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase()
    } catch {
      return ""
    }
  }

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

  const getNameFontSize = (name: string, baseFontSize: number, labelHeight: string) => {
    if (!name) return baseFontSize

    const wordCount = name.trim().split(/\s+/).length

    // Apply font size reduction for 40mm and 80mm labels
    if (labelHeight === "40mm") {
      if (wordCount === 2) return Math.max(baseFontSize - 2, 12)
      if (wordCount >= 3) return Math.max(baseFontSize - 4, 11)
    } else if (labelHeight === "80mm") {
      if (wordCount === 2) return Math.max(baseFontSize - 4, 12)
      if (wordCount >= 3) return Math.max(baseFontSize - 6, 11)
    }

    return baseFontSize
  }

  const measureName = (text: string, fontSize: number) => {
    if (typeof document === "undefined") return text.length * fontSize * 0.62
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return text.length * fontSize * 0.62
    ctx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`
    return ctx.measureText(text).width
  }

  const fitName = (name: string, baseFontSize: number) => {
    const text = name?.trim() ?? ""
    const start = getNameFontSize(text, baseFontSize, labelHeight)
    const maxWidth = (printBox ? fullWidthPx - 20 : fullWidthPx - 8) - 1
    const minPx = 12
    if (!text) return { fontSize: start, lines: 1 as const, visible: false }
    let fontSize = start
    while (fontSize > minPx && measureName(text, fontSize) > maxWidth) fontSize -= 1
    if (measureName(text, fontSize) <= maxWidth) return { fontSize, lines: 1 as const, visible: true }
    let twoLineSize = start
    while (twoLineSize > minPx && measureName(text, twoLineSize) > maxWidth * 2) twoLineSize -= 1
    if (measureName(text, twoLineSize) <= maxWidth * 2) {
      return { fontSize: twoLineSize, lines: 2 as const, visible: true }
    }
    return { fontSize: minPx, lines: 1 as const, visible: false }
  }

  const fittedName = fitName(item.name, nameFontSize)

  // --- Data preparation ---
  const shortPrinted = shortDate(item.printedOn || "")
  const shortExpiry = shortDate(expiry || item.expiryDate || "")
  const expiresDay = getDayShort(expiry || item.expiryDate || "")
  const labelTypeShort = item.labelType ? item.labelType.toUpperCase() : ""

  // Global allergen names (normalized)
  const globalAllergenNames = allergens.map((a) => a.toLowerCase())

  // Get ingredient allergens based on item type
  let itemAllergenNames: string[] = []
  if (item.type === "ingredients" && Array.isArray(item.allergens)) {
    itemAllergenNames = item.allergens
      .map(
        (a: any) =>
          a.allergenName?.toLowerCase() || a.name?.toLowerCase() || a.toLowerCase?.() || ""
      )
      .filter(Boolean)
  } else {
    itemAllergenNames = globalAllergenNames
  }

  // Helper to get ingredient object by name or uuid
  const getIngredientObj = (ing: string) => {
    return allIngredients.find(
      (i) => i.ingredientName.trim().toLowerCase() === ing.trim().toLowerCase() || i.uuid === ing
    )
  }

  // Build allergen map for menu items
  const allergenMap: Record<string, string[]> = {}
  let allergenicIngredients: string[] = []

  if (item.type === "menu" && Array.isArray(item.ingredients)) {
    item.ingredients.forEach((ing) => {
      const obj = getIngredientObj(ing)
      if (obj && obj.allergens && obj.allergens.length > 0) {
        allergenMap[ing] = obj.allergens.map((a) => a.allergenName.toUpperCase())
        allergenicIngredients.push(ing)
      } else {
        allergenMap[ing] = []
      }
    })
  }

  // --- Common styling ---
  const headerStyle = {
    textAlign: "center" as const,
    backgroundColor: "black",
    color: "white",
    padding: printBox ? "4px 8px" : "2px 0",
    marginTop: 1,
    marginLeft: printBox ? -9 : 0,
    marginRight: printBox ? -6 : 0,
    marginBottom: sectionSpacing - 1,
    width: printBox ? "calc(100% + 15px)" : undefined,
    flexShrink: 0,
    position: "relative" as const,
    fontSize: fittedName.fontSize,
    fontWeight: 900,
    borderRadius: printBox ? 0 : 2,
    fontFamily: "inherit",
    letterSpacing: 0,
    boxSizing: "border-box" as const,
    whiteSpace: fittedName.lines === 1 ? ("nowrap" as const) : ("normal" as const),
    overflow: "hidden",
    textOverflow: "clip" as const,
    lineHeight: 1.15,
    ...(fittedName.lines === 2
      ? {
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as const,
        }
      : {}),
  }

  const labelRef = React.useRef<HTMLDivElement>(null)
  const headerRef = React.useRef<HTMLDivElement>(null)
  const [omitName, setOmitName] = React.useState(false)
  const showName = fittedName.visible && !omitName
  const borderFrame = printBox ? (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 1,
        bottom: 0,
        left: 0,
        borderTop: "1px solid #000",
        borderRight: "1px solid #000",
        borderBottom: "1px solid #000",
        borderLeft: "1px solid #000",
        pointerEvents: "none",
        zIndex: 5,
        boxSizing: "border-box",
      }}
    />
  ) : null
  React.useLayoutEffect(() => {
    const label = labelRef.current
    if (!label) return
    const overflows = label.scrollHeight > label.clientHeight + 2
    onOverflow?.(overflows)
    if (headerRef.current && (overflows || headerRef.current.scrollHeight > headerRef.current.clientHeight + 1)) {
      setOmitName(true)
    }
  })

  // --- Special USE FIRST label ---
  const isUseFirst = item.name === "USE FIRST"
  if (isUseFirst) {
    // Scale circle and font based on label height
    const circleSize = labelHeight === "80mm" ? "4.5cm" : "2.8cm"
    const circleFont = labelHeight === "80mm" ? 28 : 18

    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: "black",
          fontWeight: "bold",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
        }}
      >
        <div
          style={{
            width: circleSize,
            height: circleSize,
            borderRadius: "50%",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: labelHeight === "80mm" ? "4px solid white" : "3px solid white",
            boxShadow: labelHeight === "80mm" ? "0 0 0 3px black" : "0 0 0 2px black",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "black",
              fontSize: circleFont,
              fontWeight: 900,
              letterSpacing: 1,
              textTransform: "uppercase",
              lineHeight: 1.2,
              padding: labelHeight === "80mm" ? "6px" : "4px",
            }}
          >
            USE
            <br />
            FIRST
          </div>
        </div>
      </div>
    )
  }

  // --- COOK/PREP Menu Labels ---
  if (
    (item.labelType === "cooked" || item.labelType === "prep" || item.labelType === "default") &&
    item.type === "menu"
  ) {
    // Get unique allergens for this menu item
    const uniqueAllergens = Array.from(
      new Set(allergenicIngredients.flatMap((ing) => allergenMap[ing] || []))
    )

    return (
      <div ref={labelRef} data-label-root="" style={baseStyle}>
        {showName && (
          <div ref={headerRef} data-label-name="" style={headerStyle}>
            {item.name}
          </div>
        )}

        <div
          style={{
            fontWeight: 900,
            fontSize: config.expiresFontSize,
            marginBottom: 2,
            fontFamily: "inherit",
            letterSpacing: 0,
            width: "100%",
          }}
        >
          <span>
            Expires: {expiresDay} {shortExpiry}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: config.metaFontSize,
            fontWeight: 700,
            marginBottom: 2,
            fontFamily: "inherit",
            letterSpacing: 0,
          }}
        >
          <span>Printed: {shortPrinted}</span>
          {useInitials && selectedInitial && (
            <span style={{ fontWeight: 900, margin: "0 8px" }}>{selectedInitial}</span>
          )}
          {item.labelType !== "default" && (
            <span style={{ fontWeight: 700 }}>{labelTypeShort}</span>
          )}
        </div>

        <div
          style={{
            fontWeight: 700,
            fontSize: config.containsFontSize,
            textAlign: "left",
            marginTop: 0,
            letterSpacing: 0,
            fontFamily: "inherit",
            display: "block",
            lineHeight: 1.2,
          }}
        >
          <span style={{ fontWeight: 700, fontFamily: "inherit" }}>Contains: </span>
          {uniqueAllergens.length === 0 ? (
            <span style={{ fontWeight: 700, fontFamily: "inherit" }}>
              Does not contain any allergens
            </span>
          ) : (
            <span style={{ fontWeight: 700, fontFamily: "inherit" }}>
              {uniqueAllergens.join(", ")}
            </span>
          )}
        </div>
        {borderFrame}
      </div>
    )
  }

  // --- PPDS Menu Labels ---
  if (item.labelType === "ppds" && item.type === "menu") {
    const safeIngredients = Array.isArray(item.ingredients) ? item.ingredients : []

    const ingredientsLine = safeIngredients.map((ing, idx) => (
      <span
        key={ing + idx}
        style={{
          fontWeight: 700,
          fontFamily: "inherit",
        }}
      >
        {capitalize(ing)}
        {allergenMap[ing] && allergenMap[ing].length > 0 && (
          <>
            {" "}
            (
            <span style={{ fontWeight: 900, fontFamily: "inherit" }}>
              {allergenMap[ing].map((a, i) => (
                <span key={a + i} style={{ fontWeight: 900, fontFamily: "inherit" }}>
                  *{a}*{i < allergenMap[ing].length - 1 ? ", " : ""}
                </span>
              ))}
            </span>
            )
          </>
        )}
        {idx < safeIngredients.length - 1 && ", "}
      </span>
    ))

    return (
      <div ref={labelRef} data-label-root="" style={baseStyle}>
        {showName && (
          <div ref={headerRef} data-label-name="" style={headerStyle}>
            {item.name}
          </div>
        )}

        <div
          style={{
            fontSize: fontSize - 1,
            marginBottom: sectionSpacing - 2,
            fontWeight: 700,
            textAlign: "center",
            fontFamily: "inherit",
            letterSpacing: 0,
          }}
        >
          Best Before: {shortExpiry}
        </div>

        <div
          style={{
            fontWeight: 700,
            fontSize: config.ppdsFontSize,
            marginBottom: sectionSpacing - 1,
            textAlign: "left",
            display: "block",
            wordBreak: "break-word",
            fontFamily: "inherit",
            letterSpacing: 0,
            lineHeight: 1.2,
          }}
        >
          <span style={{ fontWeight: 700, marginRight: 2, fontFamily: "inherit" }}>
            Ingredients:{" "}
          </span>
          {ingredientsLine}
        </div>
        {(ppdsMeta?.storageInfo || ppdsMeta?.showNetWt || ppdsMeta?.showPrice) && (
          <div style={{ flex: "1 1 0", minHeight: 0 }} />
        )}
        {ppdsMeta?.storageInfo && (
          <div
            style={{
              marginTop: "auto",
              marginBottom: 2,
              flexShrink: 0,
              fontSize: Math.max(7.5, config.metaFontSize - 1),
              fontWeight: 700,
              lineHeight: 1.15,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {ppdsMeta.storageInfo}
          </div>
        )}
        {(ppdsMeta?.showNetWt || ppdsMeta?.showPrice) && (
          <div
            style={{
              borderTop: "1px solid #000",
              paddingTop: 2,
              flexShrink: 0,
              fontSize: Math.max(8, config.metaFontSize - 0.5),
              fontWeight: 700,
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span style={{ maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ppdsMeta?.showNetWt && ppdsMeta?.netWt ? `Net Wt: ${ppdsMeta.netWt}` : ""}
            </span>
            <span
              style={{
                marginLeft: "auto",
                maxWidth: "40%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textAlign: "right",
              }}
            >
              {ppdsMeta?.showPrice && ppdsMeta?.price ? `Price: ${ppdsMeta.price}` : ""}
            </span>
          </div>
        )}
        {borderFrame}
      </div>
    )
  }

  // --- Ingredient Labels ---
  if (
    item.type === "ingredients" &&
    (!item.labelType ||
      item.labelType === "cooked" ||
      item.labelType === "prep" ||
      item.labelType === "default")
  ) {
    return (
      <div ref={labelRef} data-label-root="" style={baseStyle}>
        {showName && (
          <div ref={headerRef} data-label-name="" style={headerStyle}>
            {item.name}
          </div>
        )}

        <div
          style={{
            fontWeight: 900,
            fontSize: config.expiresFontSize,
            marginBottom: 2,
            fontFamily: "inherit",
            letterSpacing: 0,
            width: "100%",
          }}
        >
          <span>
            Expires: {expiresDay} {shortExpiry}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: config.metaFontSize,
            fontWeight: 700,
            marginBottom: 2,
            fontFamily: "inherit",
            letterSpacing: 0,
          }}
        >
          <span>Printed: {shortPrinted}</span>
          {useInitials && selectedInitial && (
            <span style={{ fontWeight: 900, marginLeft: 12 }}>{selectedInitial}</span>
          )}
        </div>

        {/* Allergen warnings for ingredient labels */}
        {itemAllergenNames.length > 0 ? (
          <>
            <div
              style={{
                fontWeight: 900,
                color: "black",
                fontSize: fontSize,
                textAlign: "center",
                marginTop: 2,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontFamily: "inherit",
              }}
            >
              CONTAINS ALLERGENS
            </div>
            <div
              style={{
                fontWeight: 700,
                color: "black",
                fontSize: fontSize - 2,
                textAlign: "center",
                marginTop: 1,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                fontFamily: "inherit",
              }}
            >
              {itemAllergenNames.join(", ")}
            </div>
          </>
        ) : null}
        {borderFrame}
      </div>
    )
  }

  // --- Fallback/Legacy Label Layout ---
  const ingredientList = (item.ingredients ?? []).filter(
    (ing): ing is string => typeof ing === "string" && ing.trim() !== ""
  )
  const isAllergen = (ing: string) => itemAllergenNames.some((a) => ing.toLowerCase().includes(a))
  const allergensOnly = ingredientList.filter(isAllergen)
  const shownIngredients = ingredientList.slice(0, config.maxIngredientsToShow)
  const hiddenIngredients = ingredientList.length - shownIngredients.length
  const shownAllergens = allergensOnly.slice(0, config.maxIngredientsToShow)
  const hiddenAllergens = allergensOnly.length - shownAllergens.length
  const isPPDS = item.labelType === "ppds"

  return (
    <div ref={labelRef} data-label-root="" style={baseStyle}>
      {showName && (
      <div
        ref={headerRef}
        data-label-name=""
        style={{
          ...headerStyle,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: "uppercase",
          fontFamily: "inherit",
        }}
      >
        {item.name}
      </div>
      )}

      {/* Dates */}
      {!isPPDS && (
        <div
          style={{
            fontSize: fontSize - 1,
            marginBottom: sectionSpacing,
            fontWeight: 700,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            fontFamily: "inherit",
          }}
        >
          <span>
            Printed: {shortPrinted}
            {item.labelType === "prep" && " (PREP)"}
            {item.labelType === "cooked" && " (COOK)"}
            {item.labelType === "default" && ""}
          </span>
          <span>Expires: {shortExpiry}</span>
        </div>
      )}

      {isPPDS && (
        <div
          style={{
            fontSize: fontSize - 1,
            marginBottom: sectionSpacing,
            fontWeight: 700,
            textAlign: "center",
            fontFamily: "inherit",
          }}
        >
          Best Before: {shortExpiry}
        </div>
      )}

      {/* Ingredients */}
      {shownIngredients.length > 0 && (
        <div
          style={{
            fontSize: fontSize - 1,
            marginBottom: sectionSpacing,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            fontFamily: "inherit",
          }}
        >
          <span style={{ fontWeight: 700 }}>Ingredients:</span>
          {shownIngredients.map((ing, idx) => (
            <span
              key={ing + idx}
              style={{
                marginLeft: 2,
                fontWeight: isAllergen(ing) ? 900 : 700,
              }}
            >
              {isAllergen(ing) ? `*${ing}*` : ing}
              {idx < shownIngredients.length - 1 && ", "}
            </span>
          ))}
          {hiddenIngredients > 0 && (
            <span style={{ fontWeight: 700, marginLeft: 4 }}>+{hiddenIngredients} more</span>
          )}
        </div>
      )}

      {/* Allergens */}
      {shownAllergens.length > 0 && (
        <div
          style={{
            fontSize: fontSize - 1,
            marginBottom: sectionSpacing,
            fontWeight: 700,
            textTransform: "uppercase",
            fontFamily: "inherit",
          }}
        >
          Contains:
          {shownAllergens.map((a, idx) => (
            <span key={a + idx} style={{ fontWeight: 900 }}>
              *{a}*{idx < shownAllergens.length - 1 && ", "}
            </span>
          ))}
          {hiddenAllergens > 0 && (
            <span style={{ fontWeight: 700, marginLeft: 4 }}>+{hiddenAllergens} more</span>
          )}
        </div>
      )}

      {/* Allergen warnings */}
      {item.type === "ingredients" &&
        (itemAllergenNames.length > 0 ? (
          <>
            <div
              style={{
                fontWeight: 900,
                color: "black",
                fontSize: fontSize,
                textAlign: "center",
                marginTop: 2,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontFamily: "inherit",
              }}
            >
              CONTAINS ALLERGENS
            </div>
            <div
              style={{
                fontWeight: 700,
                color: "black",
                fontSize: fontSize - 2,
                textAlign: "center",
                marginTop: 1,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                fontFamily: "inherit",
              }}
            >
              {itemAllergenNames.join(", ")}
            </div>
          </>
        ) : null)}
      {borderFrame}
    </div>
  )
}

import React from "react"

// Custom PPDS label renderer (moved from page.tsx)
export function PPDSLabelRenderer({
  item,
  storageInfo,
  businessName,
  allIngredients,
  showNetWt = false,
  showPrice = false,
  netWt = "",
  price = "",
}: {
  item: any
  storageInfo: string
  businessName: string
  allIngredients: any[]
  showNetWt?: boolean
  showPrice?: boolean
  netWt?: string
  price?: string
}) {
  // For each ingredient name, look up the full ingredient object
  const ingredientObjs = (item.ingredients || []).map(function (ing: string) {
    return allIngredients.find(
      (i: any) =>
        i.ingredientName &&
        ing &&
        i.ingredientName.trim().toLowerCase() === ing.trim().toLowerCase()
    )
  })
  // Build allergen summary from all found ingredient objects
  const allAllergens = ingredientObjs
    .flatMap((ing: any) =>
      (ing?.allergens || []).map((a: any) => a.allergenName?.toUpperCase?.() || "")
    )
    .filter(Boolean)
  const uniqueAllergens = Array.from(new Set(allAllergens))
  // --- Layout ---
  return (
    <div
      style={{
        width: "calc(56mm - 8px)",
        height: "calc(80mm - 4px)",
        boxSizing: "border-box",
        padding: "2mm",
        margin: 0,
        background: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: 'Arial, Helvetica, "Liberation Sans", sans-serif',
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        color: "#000",
        border: "none",
        borderRadius: 0,
        justifyContent: "flex-start",
        overflow: "hidden",
        minWidth: 0,
        position: "relative",
      }}
    >
      {/* Product Title */}
      <div
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "10pt",
          letterSpacing: 0,
          marginBottom: "1mm",
          textTransform: "uppercase",
          lineHeight: 1.1,
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        {item.name}
      </div>
      {/* Ingredients List with allergens inline */}
      <div
        style={{
          fontSize: "7pt",
          marginBottom: "1mm",
          lineHeight: 1.25,
          fontWeight: 400,
          width: "100%",
          minWidth: 0,
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        <span style={{ fontWeight: 700 }}>Ingredients: </span>
        {ingredientObjs.map((ing: any, idx: number) => {
          const allergenList = (ing?.allergens || [])
            .map((a: any) => a.allergenName?.toUpperCase?.() || "")
            .filter(Boolean)
          return (
            <span key={(ing?.ingredientName || item.ingredients[idx] || "") + idx}>
              {ing?.ingredientName || item.ingredients[idx] || "Unknown"}
              {allergenList.length > 0 && (
                <span style={{ fontWeight: 700 }}> ({allergenList.join(", ")})</span>
              )}
              {idx < ingredientObjs.length - 1 ? ", " : ""}
            </span>
          )
        })}
      </div>
      {/* Allergen Summary Box */}
      {uniqueAllergens.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            border: "1.5px solid #000",
            borderRadius: "6px",
            padding: "1mm 1.5mm",
            fontSize: "7pt",
            fontWeight: 400,
            marginBottom: "2mm",
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", marginRight: 4, flexShrink: 0 }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="9,2 17,16 1,16" stroke="#000" strokeWidth="1.5" fill="#fff" />
              <text x="9" y="13" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#000">
                !
              </text>
            </svg>
          </span>
          <span style={{ flex: 1, minWidth: 0, overflowWrap: "break-word", wordBreak: "break-word" }}>
            Contains: <span style={{ fontWeight: 700 }}>{uniqueAllergens.join(", ")}</span>
          </span>
        </div>
      )}
      {/* Date Section */}
      <div style={{ fontSize: "7pt", marginBottom: "1mm", fontWeight: 400, flexShrink: 0 }}>
        <div>Packed: {item.printedOn || ""}</div>
        <div>Use By: {item.expiryDate || ""}</div>
      </div>
      {/* Spacer to push storage info and company info to bottom */}
      <div style={{ flex: 1 }} />
      {/* Optional bottom meta row for Net Wt and Price */}
      {(showNetWt || showPrice) && (
        <div
          style={{
            fontSize: "7pt",
            marginBottom: "1mm",
            fontWeight: 400,
            borderTop: "1px solid #000",
            paddingTop: "1mm",
            display: "flex",
            justifyContent: "space-between",
            gap: "2mm",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              whiteSpace: "nowrap",
              maxWidth: "58%",
            }}
          >
            {showNetWt && netWt ? `Net Wt: ${netWt}` : ""}
          </span>
          <span
            style={{
              marginLeft: "auto",
              whiteSpace: "nowrap",
              textAlign: "right",
            }}
          >
            {showPrice && price ? `Price: ${price}` : ""}
          </span>
        </div>
      )}
      {/* Storage Instruction always just above company name */}
      <div style={{ fontSize: "7pt", marginBottom: "1mm", fontWeight: 400, flexShrink: 0, overflowWrap: "break-word" }}>
        {storageInfo}
      </div>
      {/* Preparation Info */}
      <div style={{ fontSize: "6.5pt", fontWeight: 400, flexShrink: 0 }}>
        Prepared by: <span style={{ fontWeight: 700 }}>{businessName}</span>
        <br />
        <span style={{ fontWeight: 700 }}>www.instalabel.co</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 6,
          bottom: 1,
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
    </div>
  )
}

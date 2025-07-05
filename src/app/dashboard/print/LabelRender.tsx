// // src/components/LabelRender.tsx
// import React from "react"
// import { PrintQueueItem } from "@/types/print"
// import { LabelHeight } from "./LabelHeightChooser"

// interface LabelRenderProps {
//   item: PrintQueueItem
//   expiry: string
//   useInitials: boolean
//   selectedInitial: string
//   allergens: string[]
//   maxIngredients?: number
//   labelHeight?: LabelHeight // Add this line
//   allIngredients: Array<{ uuid: string; ingredientName: string; allergens: { allergenName: string }[] }>
// }

// function fitText(text: string, maxLen: number) {
//   return text.length > maxLen ? text.slice(0, maxLen - 3) + "..." : text
// }

// export default function LabelRender({
//   item,
//   expiry,
//   useInitials,
//   selectedInitial,
//   allergens,
//   maxIngredients = 5,
//   labelHeight = "31mm", // Default
//   allIngredients = [],
// }: LabelRenderProps) {
//   // --- Sizing and layout logic ---
//   let heightCm = 3.05 // 31mm - 0.5mm = 30.5mm = 3.05cm
//   let fontSize = 12
//   let nameFontSize = 15
//   let sectionSpacing = 2
//   let maxIngredientsToShow = 2
//   let showInitials = false
//   let showAllergens = true
//   let showIngredients = false
//   let showPrintedExpiry = true
//   let maxNameLen = 18
//   let maxIngLen = 12
//   let maxAllergenLen = 10

//   if (labelHeight === "40mm") {
//     heightCm = 3.95 // 40mm - 0.5mm = 39.5mm = 3.95cm
//     fontSize = 13
//     nameFontSize = 18
//     sectionSpacing = 4
//     maxIngredientsToShow = 5
//     showInitials = true
//     showAllergens = true
//     showIngredients = false // Only show allergens by default
//     showPrintedExpiry = true
//     maxNameLen = 22
//     maxIngLen = 16
//     maxAllergenLen = 12
//     // If PPDS, show all ingredients and allergens, use very small font
//     if (item.labelType === "ppds") {
//       showIngredients = true
//       showAllergens = true
//       fontSize = 8; // Very small font for PPDS 40mm
//     }
//   } else if (labelHeight === "80mm") {
//     heightCm = 7.95 // 80mm - 0.5mm = 79.5mm = 7.95cm
//     fontSize = 15
//     nameFontSize = 22
//     sectionSpacing = 8
//     maxIngredientsToShow = 12
//     showInitials = true
//     showAllergens = true
//     showIngredients = true
//     showPrintedExpiry = true
//     maxNameLen = 32
//     maxIngLen = 22
//     maxAllergenLen = 18
//   }

//   const shortDate = (date: string) => {
//     try {
//       const d = new Date(date)
//       return d.toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "short",
//       })
//     } catch {
//       return date || "N/A"
//     }
//   }

//   const shortPrinted = shortDate(item.printedOn || "")
//   const shortExpiry = shortDate(expiry || item.expiryDate || "")
//   const allergenNames = allergens.map((a) => a.toLowerCase())

//   // Allergen detection logic
//   let ingredientAllergenNames: string[] = []
//   if (item.type === "ingredients" && Array.isArray(item.allergens)) {
//     // Use the ingredient's own allergens
//     ingredientAllergenNames = item.allergens.map((a: any) => a.allergenName?.toLowerCase() || a.name?.toLowerCase() || a.toLowerCase?.() || "").filter(Boolean)
//   } else {
//     // Use global allergen list for menu items
//     ingredientAllergenNames = allergenNames
//   }

//   const isAllergen = (ing: string) => ingredientAllergenNames.some((a) => ing.toLowerCase().includes(a))
//   const ingredientList = (item.ingredients ?? []).filter(
//     (ing): ing is string => typeof ing === "string" && ing.trim() !== ""
//   )
//   const allergensOnly = ingredientList.filter(isAllergen)
//   const tooLong = ingredientList.length > maxIngredientsToShow
//   const isPPDS = item.labelType === "ppds"
//   const isUseFirst = item.name === "USE FIRST"

//   // Truncate ingredients/allergens for small labels
//   const shownIngredients = ingredientList.slice(0, maxIngredientsToShow)
//   const hiddenIngredients = ingredientList.length - shownIngredients.length
//   const shownAllergens = allergensOnly.slice(0, maxIngredientsToShow)
//   const hiddenAllergens = allergensOnly.length - shownAllergens.length

//   // Helper to get ingredient object by name or uuid
//   const getIngredientObj = (ing: string) => {
//     return allIngredients.find(
//       (i) => i.ingredientName.trim().toLowerCase() === ing.trim().toLowerCase() || i.uuid === ing
//     )
//   }
//   // For menu items, build allergenic ingredient list
//   let allergenicIngredients: string[] = []
//   let allergenMap: Record<string, string[]> = {}
//   if (item.type === "menu" && Array.isArray(item.ingredients)) {
//     allergenicIngredients = item.ingredients.filter((ing) => {
//       const obj = getIngredientObj(ing)
//       return obj && obj.allergens && obj.allergens.length > 0
//     })
//     // Map ingredient to its allergens
//     allergenMap = Object.fromEntries(
//       item.ingredients.map((ing) => {
//         const obj = getIngredientObj(ing)
//         return [ing, obj && obj.allergens ? obj.allergens.map(a => a.allergenName.toUpperCase()) : []]
//       })
//     )
//   }

//   // Special USE FIRST label layout
//   if (isUseFirst) {
//     return (
//       <div
//         style={{
//           width: "5.6cm",
//           height: `${heightCm}cm`,
//           padding: 0,
//           backgroundColor: "black",
//           fontFamily: "monospace",
//           fontWeight: "bold",
//           fontSize,
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           boxSizing: "border-box",
//           border: "2px solid black",
//           borderRadius: 6,
//           position: "relative",
//           overflow: "visible",
//           margin: 0,
//         }}
//       >
//         {/* Circle with USE FIRST text */}
//         <div
//           style={{
//             width: labelHeight === "31mm" ? "2.2cm" : labelHeight === "40mm" ? "2.8cm" : "4.5cm",
//             height: labelHeight === "31mm" ? "2.2cm" : labelHeight === "40mm" ? "2.8cm" : "4.5cm",
//             borderRadius: "50%",
//             backgroundColor: "white",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             border: "3px solid white",
//             boxShadow: "0 0 0 2px black",
//           }}
//         >
//           <div
//             style={{
//               textAlign: "center",
//               color: "black",
//               fontSize: labelHeight === "31mm" ? 14 : labelHeight === "40mm" ? 18 : 24,
//               fontWeight: 900,
//               letterSpacing: 1,
//               textTransform: "uppercase",
//               lineHeight: 1.2,
//               padding: "4px",
//             }}
//           >
//             USE<br />FIRST
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Helper to capitalize first letter
//   const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

//   // Helper to determine if name is long (3+ words or > maxNameLen)
//   const isLongName = (name: string) => {
//     if (!name) return false;
//     const wordCount = name.trim().split(/\s+/).length;
//     return wordCount >= 3 || name.length > maxNameLen;
//   };

//   // Improved getNameFontSize for 80mm: reduce for 2 or 3 words, but allow wrapping for >3 words
//   const getNameFontSize = (name: string, baseFontSize: number, labelHeight: string) => {
//     if (!name) return baseFontSize;
//     if (labelHeight !== "80mm") return baseFontSize;
//     const wordCount = name.trim().split(/\s+/).length;
//     if (wordCount === 2) return Math.max(baseFontSize - 4, 12);
//     if (wordCount === 3) return Math.max(baseFontSize - 6, 11);
//     return baseFontSize;
//   };

//   if ((item.labelType === "cook" || item.labelType === "prep") && item.type === "menu") {
//     const safeIngredients = Array.isArray(item.ingredients) ? item.ingredients : [];
//     // Font size logic for different label heights
//     let containsFontSize = 9;
//     let expiresFontSize = 13;
//     let metaFontSize = 8;
//     if (labelHeight === "80mm") { containsFontSize = 13; expiresFontSize = 18; metaFontSize = 11; }
//     else if (labelHeight === "40mm") { containsFontSize = 8.5; expiresFontSize = 12; metaFontSize = 7.5; }
//     else if (labelHeight === "31mm") { containsFontSize = 7.5; expiresFontSize = 10; metaFontSize = 6.5; }

//     // Helper for day of week
//     const getDayShort = (date: string) => {
//       try {
//         const d = new Date(date);
//         return d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
//       } catch { return ""; }
//     };
//     const expiresDay = getDayShort(expiry || item.expiryDate || "");
//     const expiresDate = shortDate(expiry || item.expiryDate || "");
//     const printedDate = shortDate(item.printedOn || "");
//     const labelTypeShort = item.labelType ? item.labelType.toUpperCase() : "";

//     // Build the contains line as a single span, modern style
//     const containsLine = allergenicIngredients.map((ing, idx) => (
//       <span key={ing + idx} style={{ fontWeight: 600, fontFamily: 'inherit' }}>
//         {capitalize(ing)}
//         {allergenMap[ing] && allergenMap[ing].length > 0 && (
//           <> (<span style={{ fontWeight: 900, fontFamily: 'inherit' }}>{allergenMap[ing].map((a, i) => <span key={a + i} style={{ fontWeight: 900, fontFamily: 'inherit' }}>*{a.toUpperCase()}*{i < allergenMap[ing].length - 1 ? ', ' : ''}</span>)}</span>)</>
//         )}
//         {idx < allergenicIngredients.length - 1 && ', '}
//       </span>
//     ));
//     return (
//       <div style={{ width: "5.6cm", height: `${heightCm}cm`, padding: labelHeight === "31mm" ? 1 : 4, backgroundColor: "white", fontFamily: "Menlo, Consolas, 'Liberation Mono', monospace", fontWeight: 500, fontSize, display: "flex", flexDirection: "column", boxSizing: "border-box", border: "2px solid black", borderRadius: 6, position: "relative", overflow: "visible", margin: 0, letterSpacing: 0 }}>
//         <div
//           style={{
//             textAlign: "center",
//             backgroundColor: "black",
//             color: "white",
//             padding: "2px 0",
//             marginBottom: sectionSpacing - 1,
//             zIndex: 1,
//             position: "relative",
//             fontSize: getNameFontSize(item.name, nameFontSize, labelHeight),
//             fontWeight: 900,
//             borderRadius: 2,
//             fontFamily: 'inherit',
//             letterSpacing: 0,
//           }}
//         >
//           {item.name}
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', fontWeight: 900, fontSize: labelHeight === '80mm' ? 13 : expiresFontSize, marginBottom: 2, fontFamily: 'inherit', letterSpacing: 0, width: '100%' }}>
//           <span style={{ flex: 1, textAlign: 'left' }}>Expires:</span>
//           <span style={{ flex: 1, textAlign: 'center' }}>{expiresDay && <span>{expiresDay}.</span>}</span>
//           <span style={{ flex: 1, textAlign: 'right' }}>{expiresDate}</span>
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: metaFontSize, fontWeight: 600, marginBottom: 2, fontFamily: 'inherit', letterSpacing: 0 }}>
//           <span>Printed: {printedDate}</span>
//           {useInitials && selectedInitial && (
//             <span style={{ fontWeight: 900, margin: '0 8px' }}>{selectedInitial}</span>
//           )}
//           <span style={{ fontWeight: 700 }}>{labelTypeShort}</span>
//         </div>
//         <div style={{ fontWeight: 700, fontSize: containsFontSize, textAlign: "left", marginTop: 0, letterSpacing: 0, fontFamily: 'inherit', display: 'block', lineHeight: 1.2 }}>
//           <span style={{ fontWeight: 700, fontFamily: 'inherit' }}>Contains: </span>
//           {allergenicIngredients.length === 0 ? (
//             <span style={{ fontWeight: 500, fontFamily: 'inherit' }}>None</span>
//           ) : (
//             containsLine
//           )}
//         </div>
//       </div>
//     )
//   }
//   // For PPDS: show full ingredient list, allergens in () after each ingredient, all label sizes
//   if (item.labelType === "ppds" && item.type === "menu") {
//     const safeIngredients = Array.isArray(item.ingredients) ? item.ingredients : [];
//     // Font size logic for different label heights
//     let ppdsFontSize = 8;
//     if (labelHeight === "80mm") ppdsFontSize = 12;
//     else if (labelHeight === "40mm") ppdsFontSize = 7.5;
//     else if (labelHeight === "31mm") ppdsFontSize = 7;
//     // Build the ingredients line as a single span, modern style
//     const ingredientsLine = safeIngredients.map((ing, idx) => (
//       <span key={ing + idx} style={{ fontWeight: allergenMap[ing] && allergenMap[ing].length > 0 ? 600 : 500, fontFamily: 'inherit' }}>
//         {capitalize(ing)}
//         {allergenMap[ing] && allergenMap[ing].length > 0 && (
//           <> (<span style={{ fontWeight: 900, fontFamily: 'inherit' }}>{allergenMap[ing].map((a, i) => <span key={a + i} style={{ fontWeight: 900, fontFamily: 'inherit' }}>*{a.toUpperCase()}*{i < allergenMap[ing].length - 1 ? ', ' : ''}</span>)}</span>)</>
//         )}
//         {idx < safeIngredients.length - 1 && ', '}
//       </span>
//     ));
//     return (
//       <div style={{ width: "5.6cm", height: `${heightCm}cm`, padding: labelHeight === "31mm" ? 1 : 4, backgroundColor: "white", fontFamily: "Menlo, Consolas, 'Liberation Mono', monospace", fontWeight: 500, fontSize, display: "flex", flexDirection: "column", boxSizing: "border-box", border: "2px solid black", borderRadius: 6, position: "relative", overflow: "visible", margin: 0, letterSpacing: 0 }}>
//         <div
//           style={{
//             textAlign: "center",
//             backgroundColor: "black",
//             color: "white",
//             padding: "2px 0",
//             marginBottom: sectionSpacing - 1,
//             zIndex: 1,
//             position: "relative",
//             fontSize: getNameFontSize(item.name, nameFontSize, labelHeight),
//             fontWeight: 900,
//             borderRadius: 2,
//             fontFamily: 'inherit',
//             letterSpacing: 0,
//           }}
//         >
//           {item.name}
//         </div>
//         <div style={{ fontSize: fontSize - 1, marginBottom: sectionSpacing - 2, fontWeight: 700, textAlign: "center", fontFamily: 'inherit', letterSpacing: 0 }}>Best Before: {shortExpiry}</div>
//         <div style={{ fontWeight: 700, fontSize: ppdsFontSize, marginBottom: sectionSpacing - 1, textAlign: "left", display: "block", wordBreak: "break-word", fontFamily: 'inherit', letterSpacing: 0, lineHeight: 1.2 }}>
//           <span style={{ fontWeight: 700, marginRight: 2, fontFamily: 'inherit' }}>Ingredients: </span>
//           {ingredientsLine}
//         </div>
//       </div>
//     )
//   }

//   // Ingredient label layout (not PPDS, not menu)
//   if (item.type === "ingredients" && (!item.labelType || item.labelType === "cook" || item.labelType === "prep")) {
//     // Font size logic for different label heights
//     let expiresFontSize = 13;
//     let metaFontSize = 8;
//     if (labelHeight === "80mm") { expiresFontSize = 18; metaFontSize = 11; }
//     else if (labelHeight === "40mm") { expiresFontSize = 12; metaFontSize = 7.5; }
//     else if (labelHeight === "31mm") { expiresFontSize = 10; metaFontSize = 6.5; }

//     // Helper for day of week
//     const getDayShort = (date: string) => {
//       try {
//         const d = new Date(date);
//         return d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
//       } catch { return ""; }
//     };
//     const expiresDay = getDayShort(expiry || item.expiryDate || "");
//     const expiresDate = shortDate(expiry || item.expiryDate || "");
//     const printedDate = shortDate(item.printedOn || "");
//     const labelTypeShort = item.labelType ? item.labelType.toUpperCase() : "";

//     return (
//       <div style={{ width: "5.6cm", height: `${heightCm}cm`, padding: labelHeight === "31mm" ? 1 : 4, backgroundColor: "white", fontFamily: "Menlo, Consolas, 'Liberation Mono', monospace", fontWeight: 500, fontSize, display: "flex", flexDirection: "column", boxSizing: "border-box", border: "2px solid black", borderRadius: 6, position: "relative", overflow: "visible", margin: 0, letterSpacing: 0 }}>
//         <div
//           style={{
//             textAlign: "center",
//             backgroundColor: "black",
//             color: "white",
//             padding: "2px 0",
//             marginBottom: sectionSpacing - 1,
//             zIndex: 1,
//             position: "relative",
//             fontSize: getNameFontSize(item.name, nameFontSize, labelHeight),
//             fontWeight: 900,
//             borderRadius: 2,
//             fontFamily: 'inherit',
//             letterSpacing: 0,
//           }}
//         >
//           {item.name}
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', fontWeight: 900, fontSize: labelHeight === '80mm' ? 13 : expiresFontSize, marginBottom: 2, fontFamily: 'inherit', letterSpacing: 0, width: '100%' }}>
//           <span style={{ flex: 1, textAlign: 'left' }}>Expires:</span>
//           <span style={{ flex: 1, textAlign: 'center' }}>{expiresDay && <span>{expiresDay}.</span>}</span>
//           <span style={{ flex: 1, textAlign: 'right' }}>{expiresDate}</span>
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: metaFontSize, fontWeight: 600, marginBottom: 2, fontFamily: 'inherit', letterSpacing: 0 }}>
//           <span>Printed: {printedDate}</span>
//           {useInitials && selectedInitial && (
//             <span style={{ fontWeight: 900, marginLeft: 12 }}>{selectedInitial}</span>
//           )}
//         </div>
//         {/* Allergen warning and list logic for ingredients is left untouched below */}
//         {(labelHeight === "31mm" || labelHeight === "40mm") && item.type === "ingredients" && ingredientAllergenNames.length > 0 && (
//           <div
//             style={{
//               fontWeight: 900,
//               color: "#b91c1c", // red-700
//               fontSize: fontSize,
//               textAlign: "center",
//               marginTop: 2,
//               letterSpacing: 1,
//               textTransform: "uppercase",
//             }}
//           >
//             CONTAINS ALLERGENS
//           </div>
//         )}
//         {labelHeight === "80mm" && item.type === "ingredients" && ingredientAllergenNames.length > 0 && (
//           <div
//             style={{
//               fontWeight: 900,
//               color: "#b91c1c", // red-700
//               fontSize: fontSize,
//               textAlign: "center",
//               marginTop: 2,
//               letterSpacing: 1,
//               textTransform: "uppercase",
//             }}
//           >
//             CONTAINS ALLERGENS: {ingredientAllergenNames.join(", ")}
//           </div>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div
//       style={{
//         width: "5.6cm",
//         height: `${heightCm}cm`,
//         padding: labelHeight === "31mm" ? 2 : 6,
//         backgroundColor: "white",
//         fontFamily: "monospace",
//         fontWeight: "bold",
//         fontSize,
//         display: "flex",
//         flexDirection: "column",
//         boxSizing: "border-box",
//         border: "2px solid black",
//         borderRadius: 6,
//         position: "relative",
//         overflow: "visible",
//         margin: 0,
//       }}
//     >
//       {/* Item Name */}
//       <div
//         style={{
//           textAlign: "center",
//           backgroundColor: "black",
//           color: "white",
//           padding: "2px 0",
//           marginBottom: sectionSpacing,
//           zIndex: 1,
//           position: "relative",
//           fontSize: nameFontSize,
//           fontWeight: 900,
//           letterSpacing: 1,
//           textTransform: "uppercase",
//           borderRadius: 2,
//         }}
//       >
//         {item.name}
//       </div>

//       {/* Dates */}
//       {showPrintedExpiry && !isPPDS && (
//         <div
//           style={{
//             fontSize: fontSize - 1,
//             marginBottom: sectionSpacing,
//             fontWeight: 700,
//             display: "flex",
//             flexDirection: "column",
//             gap: 1,
//           }}
//         >
//           <span>
//             Printed: {shortPrinted}
//             {item.labelType === 'prep' && ' (PREP)'}
//             {item.labelType === 'cook' && ' (COOK)'}
//           </span>
//           <span>Expiry: {shortExpiry}</span>
//         </div>
//       )}
//       {showPrintedExpiry && isPPDS && (
//         <div
//           style={{
//             fontSize: fontSize - 1,
//             marginBottom: sectionSpacing,
//             fontWeight: 700,
//             textAlign: "center",
//           }}
//         >
//           Best Before: {shortExpiry}
//         </div>
//       )}

//       {/* Ingredients */}
//       {showIngredients && shownIngredients.length > 0 && (
//         <div
//           style={{
//             fontSize: fontSize - 1,
//             marginBottom: sectionSpacing,
//             display: "flex",
//             flexWrap: "wrap",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >
//           <span style={{ fontWeight: 700 }}>Ingredients:</span>
//           {shownIngredients.map((ing, idx) => (
//             <span key={ing + idx} style={{ marginLeft: 2, fontWeight: isAllergen(ing) ? 900 : 500 }}>
//               {isAllergen(ing) ? `*${ing}*` : ing}
//               {idx < shownIngredients.length - 1 && ', '}
//             </span>
//           ))}
//           {hiddenIngredients > 0 && (
//             <span style={{ fontWeight: 700, marginLeft: 4 }}>+{hiddenIngredients} more</span>
//           )}
//         </div>
//       )}

//       {/* Allergens (if not shown inline) */}
//       {showAllergens && !showIngredients && shownAllergens.length > 0 && (
//         <div
//           style={{
//             fontSize: fontSize - 1,
//             marginBottom: sectionSpacing,
//             fontWeight: 700,
//             textTransform: "uppercase",
//           }}
//         >
//           Contains:
//           {shownAllergens.map((a, idx) => (
//             <span key={a + idx} style={{ fontWeight: 900 }}>
//               *{a}*
//               {idx < shownAllergens.length - 1 && ', '}
//             </span>
//           ))}
//           {hiddenAllergens > 0 && (
//             <span style={{ fontWeight: 700, marginLeft: 4 }}>+{hiddenAllergens} more</span>
//           )}
//         </div>
//       )}

//       {/* Allergens warning for 31mm and 40mm ingredient labels */}
//       {(labelHeight === "31mm" || labelHeight === "40mm") && item.type === "ingredients" && ingredientAllergenNames.length > 0 && (
//         <div
//           style={{
//             fontWeight: 900,
//             color: "#b91c1c", // red-700
//             fontSize: fontSize,
//             textAlign: "center",
//             marginTop: 2,
//             letterSpacing: 1,
//             textTransform: "uppercase",
//           }}
//         >
//           CONTAINS ALLERGENS
//         </div>
//       )}
//       {/* Allergens warning and list for 80mm ingredient labels */}
//       {labelHeight === "80mm" && item.type === "ingredients" && ingredientAllergenNames.length > 0 && (
//         <div
//           style={{
//             fontWeight: 900,
//             color: "#b91c1c", // red-700
//             fontSize: fontSize,
//             textAlign: "center",
//             marginTop: 2,
//             letterSpacing: 1,
//             textTransform: "uppercase",
//           }}
//         >
//           CONTAINS ALLERGENS: {ingredientAllergenNames.join(", ")}
//         </div>
//       )}
//     </div>
//   )
// }

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
  allIngredients: Array<{ uuid: string; ingredientName: string; allergens: { allergenName: string }[] }>
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
  labelHeight = "31mm",
  allIngredients = [],
}: LabelRenderProps) {
  // --- Sizing and layout configuration ---
  const labelConfig = {
    "31mm": {
      heightCm: 3.05,
      fontSize: 12,
      nameFontSize: 15,
      sectionSpacing: 2,
      padding: 2,
      maxNameLen: 18,
      maxIngLen: 12,
      maxAllergenLen: 10,
      maxIngredientsToShow: 2,
      expiresFontSize: 10,
      metaFontSize: 6.5,
      containsFontSize: 7.5,
      ppdsFontSize: 7,
    },
    "40mm": {
      heightCm: 3.95,
      fontSize: 13,
      nameFontSize: 18,
      sectionSpacing: 4,
      padding: 4,
      maxNameLen: 22,
      maxIngLen: 16,
      maxAllergenLen: 12,
      maxIngredientsToShow: 5,
      expiresFontSize: 12,
      metaFontSize: 7.5,
      containsFontSize: 8.5,
      ppdsFontSize: 7.5,
    },
    "80mm": {
      heightCm: 7.95,
      fontSize: 15,
      nameFontSize: 22,
      sectionSpacing: 8,
      padding: 6,
      maxNameLen: 32,
      maxIngLen: 22,
      maxAllergenLen: 18,
      maxIngredientsToShow: 12,
      expiresFontSize: 16, // Reduced from 18 to fit on one line
      metaFontSize: 11,
      containsFontSize: 13,
      ppdsFontSize: 12,
    },
  }

  const config = labelConfig[labelHeight]
  const { heightCm, fontSize, nameFontSize, sectionSpacing, padding } = config

  // --- 1mm (0.1cm) padding for all labels ---
  const PADDING_CM = 0.1
  const LABEL_WIDTH_CM = 5.6
  const labelWidthCm = LABEL_WIDTH_CM - 2 * PADDING_CM
  const labelHeightCm = heightCm - 2 * PADDING_CM

  // --- Common styling ---
  const baseStyle = {
    width: `${labelWidthCm}cm`,
    height: `${labelHeightCm}cm`,
    padding: `${PADDING_CM}cm`,
    backgroundColor: "white",
    fontFamily: "Menlo, Consolas, 'Liberation Mono', monospace",
    fontWeight: 500,
    fontSize,
    display: "flex",
    flexDirection: "column" as const,
    boxSizing: "border-box" as const,
    border: "2px solid black",
    borderRadius: 6,
    position: "relative" as const,
    overflow: "visible" as const,
    margin: 0,
    letterSpacing: 0,
  }

  // --- Utility functions ---
  const shortDate = (date: string) => {
    try {
      const d = new Date(date)
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
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
    
    // Apply font size reduction for both 40mm and 80mm labels
    if (labelHeight === "40mm") {
      if (wordCount === 2) return Math.max(baseFontSize - 2, 12)
      if (wordCount >= 3) return Math.max(baseFontSize - 4, 11)
    } else if (labelHeight === "80mm") {
      if (wordCount === 2) return Math.max(baseFontSize - 4, 12)
      if (wordCount >= 3) return Math.max(baseFontSize - 6, 11)
    }
    
    return baseFontSize
  }

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
    itemAllergenNames = item.allergens.map((a: any) => 
      a.allergenName?.toLowerCase() || a.name?.toLowerCase() || a.toLowerCase?.() || ""
    ).filter(Boolean)
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
        allergenMap[ing] = obj.allergens.map(a => a.allergenName.toUpperCase())
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
    padding: "2px 0",
    marginBottom: sectionSpacing - 1,
    position: "relative" as const,
    fontSize: getNameFontSize(item.name, nameFontSize, labelHeight),
    fontWeight: 900,
    borderRadius: 2,
    fontFamily: 'inherit',
    letterSpacing: 0,
  }

  // --- Special USE FIRST label ---
  const isUseFirst = item.name === "USE FIRST"
  if (isUseFirst) {
    const circleSize = labelHeight === "31mm" ? "2.2cm" : labelHeight === "40mm" ? "2.8cm" : "4.5cm"
    const circleFont = labelHeight === "31mm" ? 14 : labelHeight === "40mm" ? 18 : 24
    
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
            border: "3px solid white",
            boxShadow: "0 0 0 2px black",
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
              padding: "4px",
            }}
          >
            USE<br />FIRST
          </div>
        </div>
      </div>
    )
  }

  // --- COOK/PREP Menu Labels ---
  if ((item.labelType === "cooked" || item.labelType === "prep") && item.type === "menu") {
    const containsLine = allergenicIngredients.map((ing, idx) => (
      <span key={ing + idx} style={{ fontWeight: 600, fontFamily: 'inherit' }}>
        {capitalize(ing)}
        {allergenMap[ing] && allergenMap[ing].length > 0 && (
          <> (<span style={{ fontWeight: 900, fontFamily: 'inherit' }}>
            {allergenMap[ing].map((a, i) => (
              <span key={a + i} style={{ fontWeight: 900, fontFamily: 'inherit' }}>
                *{a}*{i < allergenMap[ing].length - 1 ? ', ' : ''}
              </span>
            ))}
          </span>)</>
        )}
        {idx < allergenicIngredients.length - 1 && ', '}
      </span>
    ))

    return (
      <div style={baseStyle}>
        <div style={headerStyle}>
          {item.name}
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          fontWeight: 900, 
          fontSize: config.expiresFontSize, 
          marginBottom: 2, 
          fontFamily: 'inherit', 
          letterSpacing: 0, 
          width: '100%',
          flexWrap: 'nowrap' // Prevent wrapping to new line
        }}>
          <span style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>Expires:</span>
          <span style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
            {expiresDay && <span>{expiresDay}.</span>}
          </span>
          <span style={{ flex: 1, textAlign: 'right', minWidth: 0 }}>{shortExpiry}</span>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          fontSize: config.metaFontSize, 
          fontWeight: 600, 
          marginBottom: 2, 
          fontFamily: 'inherit', 
          letterSpacing: 0 
        }}>
          <span>Printed: {shortPrinted}</span>
          {useInitials && selectedInitial && (
            <span style={{ fontWeight: 900, margin: '0 8px' }}>{selectedInitial}</span>
          )}
          <span style={{ fontWeight: 700 }}>{labelTypeShort}</span>
        </div>

        <div style={{ 
          fontWeight: 700, 
          fontSize: config.containsFontSize, 
          textAlign: "left", 
          marginTop: 0, 
          letterSpacing: 0, 
          fontFamily: 'inherit', 
          display: 'block', 
          lineHeight: 1.2 
        }}>
          <span style={{ fontWeight: 700, fontFamily: 'inherit' }}>Contains: </span>
          {allergenicIngredients.length === 0 ? (
            <span style={{ fontWeight: 500, fontFamily: 'inherit' }}>None</span>
          ) : (
            containsLine
          )}
        </div>
      </div>
    )
  }

  // --- PPDS Menu Labels ---
  if (item.labelType === "ppds" && item.type === "menu") {
    const safeIngredients = Array.isArray(item.ingredients) ? item.ingredients : []
    
    const ingredientsLine = safeIngredients.map((ing, idx) => (
      <span key={ing + idx} style={{ 
        fontWeight: allergenMap[ing] && allergenMap[ing].length > 0 ? 600 : 500, 
        fontFamily: 'inherit' 
      }}>
        {capitalize(ing)}
        {allergenMap[ing] && allergenMap[ing].length > 0 && (
          <> (<span style={{ fontWeight: 900, fontFamily: 'inherit' }}>
            {allergenMap[ing].map((a, i) => (
              <span key={a + i} style={{ fontWeight: 900, fontFamily: 'inherit' }}>
                *{a}*{i < allergenMap[ing].length - 1 ? ', ' : ''}
              </span>
            ))}
          </span>)</>
        )}
        {idx < safeIngredients.length - 1 && ', '}
      </span>
    ))

    return (
      <div style={baseStyle}>
        <div style={headerStyle}>
          {item.name}
        </div>
        
        <div style={{ 
          fontSize: fontSize - 1, 
          marginBottom: sectionSpacing - 2, 
          fontWeight: 700, 
          textAlign: "center", 
          fontFamily: 'inherit', 
          letterSpacing: 0 
        }}>
          Best Before: {shortExpiry}
        </div>
        
        <div style={{ 
          fontWeight: 700, 
          fontSize: config.ppdsFontSize, 
          marginBottom: sectionSpacing - 1, 
          textAlign: "left", 
          display: "block", 
          wordBreak: "break-word", 
          fontFamily: 'inherit', 
          letterSpacing: 0, 
          lineHeight: 1.2 
        }}>
          <span style={{ fontWeight: 700, marginRight: 2, fontFamily: 'inherit' }}>Ingredients: </span>
          {ingredientsLine}
        </div>
      </div>
    )
  }

  // --- Ingredient Labels ---
  if (item.type === "ingredients" && (!item.labelType || item.labelType === "cooked" || item.labelType === "prep")) {
    return (
      <div style={baseStyle}>
        <div style={headerStyle}>
          {item.name}
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          fontWeight: 900, 
          fontSize: config.expiresFontSize, 
          marginBottom: 2, 
          fontFamily: 'inherit', 
          letterSpacing: 0, 
          width: '100%',
          flexWrap: 'nowrap' // Prevent wrapping to new line
        }}>
          <span style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>Expires:</span>
          <span style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
            {expiresDay && <span>{expiresDay}.</span>}
          </span>
          <span style={{ flex: 1, textAlign: 'right', minWidth: 0 }}>{shortExpiry}</span>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          fontSize: config.metaFontSize, 
          fontWeight: 600, 
          marginBottom: 2, 
          fontFamily: 'inherit', 
          letterSpacing: 0 
        }}>
          <span>Printed: {shortPrinted}</span>
          {useInitials && selectedInitial && (
            <span style={{ fontWeight: 900, marginLeft: 12 }}>{selectedInitial}</span>
          )}
        </div>

        {/* Allergen warnings for ingredient labels */}
        {(labelHeight === "31mm" || labelHeight === "40mm") && itemAllergenNames.length > 0 && (
          <div style={{
            fontWeight: 900,
            color: "black",
            fontSize: fontSize,
            textAlign: "center",
            marginTop: 2,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontFamily: 'inherit',
          }}>
            CONTAINS ALLERGENS
          </div>
        )}
        
        {labelHeight === "80mm" && itemAllergenNames.length > 0 && (
          <div style={{
            fontWeight: 900,
            color: "black",
            fontSize: fontSize,
            textAlign: "center",
            marginTop: 2,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontFamily: 'inherit',
          }}>
            CONTAINS ALLERGENS: {itemAllergenNames.map(a => a.toUpperCase()).join(", ")}
          </div>
        )}
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
    <div style={baseStyle}>
      <div style={{
        ...headerStyle,
        fontSize: nameFontSize,
        fontWeight: 900,
        letterSpacing: 1,
        textTransform: "uppercase",
        fontFamily: "monospace",
      }}>
        {item.name}
      </div>

      {/* Dates */}
      {!isPPDS && (
        <div style={{
          fontSize: fontSize - 1,
          marginBottom: sectionSpacing,
          fontWeight: 700,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          fontFamily: "monospace",
        }}>
          <span>
            Printed: {shortPrinted}
            {item.labelType === 'prep' && ' (PREP)'}
            {item.labelType === 'cooked' && ' (COOK)'}
          </span>
          <span>Expires: {shortExpiry}</span>
        </div>
      )}
      
      {isPPDS && (
        <div style={{
          fontSize: fontSize - 1,
          marginBottom: sectionSpacing,
          fontWeight: 700,
          textAlign: "center",
          fontFamily: "monospace",
        }}>
          Best Before: {shortExpiry}
        </div>
      )}

      {/* Ingredients */}
      {shownIngredients.length > 0 && (
        <div style={{
          fontSize: fontSize - 1,
          marginBottom: sectionSpacing,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          fontFamily: "monospace",
        }}>
          <span style={{ fontWeight: 700 }}>Ingredients:</span>
          {shownIngredients.map((ing, idx) => (
            <span key={ing + idx} style={{ 
              marginLeft: 2, 
              fontWeight: isAllergen(ing) ? 900 : 500 
            }}>
              {isAllergen(ing) ? `*${ing}*` : ing}
              {idx < shownIngredients.length - 1 && ', '}
            </span>
          ))}
          {hiddenIngredients > 0 && (
            <span style={{ fontWeight: 700, marginLeft: 4 }}>+{hiddenIngredients} more</span>
          )}
        </div>
      )}

      {/* Allergens */}
      {shownAllergens.length > 0 && (
        <div style={{
          fontSize: fontSize - 1,
          marginBottom: sectionSpacing,
          fontWeight: 700,
          textTransform: "uppercase",
          fontFamily: "monospace",
        }}>
          Contains:
          {shownAllergens.map((a, idx) => (
            <span key={a + idx} style={{ fontWeight: 900 }}>
              *{a}*
              {idx < shownAllergens.length - 1 && ', '}
            </span>
          ))}
          {hiddenAllergens > 0 && (
            <span style={{ fontWeight: 700, marginLeft: 4 }}>+{hiddenAllergens} more</span>
          )}
        </div>
      )}

      {/* Allergen warnings */}
      {(labelHeight === "31mm" || labelHeight === "40mm") && item.type === "ingredients" && itemAllergenNames.length > 0 && (
        <div style={{
          fontWeight: 900,
          color: "black",
          fontSize: fontSize,
          textAlign: "center",
          marginTop: 2,
          letterSpacing: 1,
          textTransform: "uppercase",
          fontFamily: "monospace",
        }}>
          CONTAINS ALLERGENS
        </div>
      )}
      
      {labelHeight === "80mm" && item.type === "ingredients" && itemAllergenNames.length > 0 && (
        <div style={{
          fontWeight: 900,
          color: "black",
          fontSize: fontSize,
          textAlign: "center",
          marginTop: 2,
          letterSpacing: 1,
          textTransform: "uppercase",
          fontFamily: "monospace",
        }}>
          CONTAINS ALLERGENS: {itemAllergenNames.map(a => a.toUpperCase()).join(", ")}
        </div>
      )}
    </div>
  )
}
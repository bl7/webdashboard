import { PrintQueueItem } from "@/types/print"

export type LabelHeight = "31mm" | "40mm" | "80mm"

// Helper function to format date as "MMM DD"
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

// Enhanced formatLabelForPrint function with fixed 5.6cm x 3.1cm dimensions:
export function formatLabelForPrint(
  item: PrintQueueItem,
  ALLERGENS: string[],
  customExpiry: Record<string, string>,
  MAX_INGREDIENTS_TO_FIT: number = 5,
  useInitials: boolean = false,
  selectedInitial: string = "",
  labelHeight: LabelHeight = "40mm"
): string {
  const allergenNames = ALLERGENS.map((a) => a.toLowerCase())
  const isAllergen = (ing: string) => allergenNames.some((a) => ing.toLowerCase().includes(a))
  const ingredientList = (item.ingredients ?? []).filter(
    (ing): ing is string => typeof ing === "string" && ing.trim() !== ""
  )
  const isPPDS = item.labelType === "ppds"
  const tooLong = ingredientList.length > MAX_INGREDIENTS_TO_FIT
  const allergensOnly = ingredientList.filter(isAllergen)
  const expiry = customExpiry[item.uid] || item.expiryDate || "N/A"

  // Format dates to short format
  const shortPrintedDate = formatShortDate(item.printedOn ?? "")
  const shortExpiryDate = formatShortDate(expiry)

  // ESC/POS commands
  const BOLD_ON = "\x1B\x45\x01"
  const BOLD_OFF = "\x1B\x45\x00"
  const CENTER_ON = "\x1B\x61\x01"
  const LEFT_ALIGN = "\x1B\x61\x00"
  const INVERSE_ON = "\x1D\x42\x01"
  const INVERSE_OFF = "\x1D\x42\x00"
  const LARGE_TEXT = "\x1D\x21\x11"
  const NORMAL_TEXT = "\x1D\x21\x00"

  // Fixed spacing for 5.6cm x 3.1cm labels - compact format
  const titleSpacing = "\n"
  const sectionSpacing = "\n"
  const endSpacing = ""

  let out = ""

  if (item.type === "ingredients") {
    // Centered name with black background
    out += `${CENTER_ON}${INVERSE_ON}${BOLD_ON}${item.name}${BOLD_OFF}${INVERSE_OFF}${LEFT_ALIGN}${titleSpacing}`

    // Printed and Expiry dates - single line format for compact labels
    out += `${BOLD_ON}Printed:${BOLD_OFF} ${shortPrintedDate} ${BOLD_ON}Expiry:${BOLD_OFF} ${shortExpiryDate}${sectionSpacing}`

    // Allergens section
    if (item.allergens && item.allergens.length > 0) {
      out += `${BOLD_ON}Allergens:${BOLD_OFF} `
      const allergenText = item.allergens
        .map((a) => `${BOLD_ON}*${a.allergenName}*${BOLD_OFF}`)
        .join(", ")
      out += `${allergenText}${sectionSpacing}`
    } else {
      out += `${BOLD_ON}No allergens declared${BOLD_OFF}${sectionSpacing}`
    }

    // Initials
    if (useInitials && selectedInitial) {
      out += `${endSpacing}${" ".repeat(Math.max(0, 25 - selectedInitial.length))}${BOLD_ON}${selectedInitial}${BOLD_OFF}\n`
    }
  } else if (isPPDS) {
    // PPDS Label
    out += `${CENTER_ON}${INVERSE_ON}${BOLD_ON}${item.name}${BOLD_OFF}${INVERSE_OFF}${LEFT_ALIGN}${titleSpacing}`

    // Best Before
    out += `${CENTER_ON}${BOLD_ON}Best Before: ${shortExpiryDate}${BOLD_OFF}${LEFT_ALIGN}${sectionSpacing}`

    // Ingredients
    out += `${BOLD_ON}Ingredients:${BOLD_OFF} `
    const ingredientsText = ingredientList
      .map((ing) => (isAllergen(ing) ? `${BOLD_ON}*${ing}*${BOLD_OFF}` : ing))
      .join(", ")
    out += `${ingredientsText}${sectionSpacing}`
  } else {
    // Regular Menu Item Label
    out += `${CENTER_ON}${INVERSE_ON}${BOLD_ON}${item.name}${BOLD_OFF}${INVERSE_OFF}${LEFT_ALIGN}${titleSpacing}`

    // Printed and Expiry dates - single line format
    out += `${BOLD_ON}Printed:${BOLD_OFF} ${shortPrintedDate} ${BOLD_ON}Expiry:${BOLD_OFF} ${shortExpiryDate}${sectionSpacing}`

    // Ingredients/Allergens
    if (tooLong) {
      out += `${BOLD_ON}Allergens:${BOLD_OFF} `
      const allergensText = allergensOnly.map((a) => `${BOLD_ON}*${a}*${BOLD_OFF}`).join(", ")
      out += allergensText
    } else {
      out += `${BOLD_ON}Ingredients:${BOLD_OFF} `
      const ingredientsText = ingredientList
        .map((ing) => (isAllergen(ing) ? `${BOLD_ON}*${ing}*${BOLD_OFF}` : ing))
        .join(", ")
      out += ingredientsText
    }
    out += sectionSpacing

    // Initials
    if (useInitials && selectedInitial) {
      out += `${endSpacing}${" ".repeat(Math.max(0, 25 - selectedInitial.length))}${BOLD_ON}${selectedInitial}${BOLD_OFF}\n`
    }
  }

  return out
}

// Helper function to get label dimensions - now fixed to 5.6cm x 3.1cm
export function getLabelDimensions(labelHeight: LabelHeight): { width: number; height: number } {
  // Fixed dimensions for 5.6cm x 3.1cm labels at 203 DPI
  const width = 448 // 5.6cm at 203 DPI (5.6 * 203 / 2.54)
  const height = 248 // 3.1cm at 203 DPI (3.1 * 203 / 2.54)

  // Return same dimensions regardless of labelHeight parameter since we're using fixed size labels
  return { width, height }
}

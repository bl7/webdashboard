import { PrintQueueItem } from "@/types/print"

export type LabelHeight = "40mm" | "80mm"

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

// Enhanced formatLabelForPrint function with adaptive height support:
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

  // Adjust spacing based on label height
  const isCompact = labelHeight === "40mm"
  const titleSpacing = isCompact ? "\n" : "\n\n"
  const sectionSpacing = isCompact ? "\n" : "\n\n"
  const endSpacing = isCompact ? "" : "\n\n"

  let out = ""

  if (item.type === "ingredients") {
    // Centered name with black background
    out += `${CENTER_ON}${INVERSE_ON}${BOLD_ON}${isCompact ? "" : LARGE_TEXT}${item.name}${NORMAL_TEXT}${BOLD_OFF}${INVERSE_OFF}${LEFT_ALIGN}${titleSpacing}`

    // Printed and Expiry dates
    if (isCompact) {
      // Compact: Single line format
      out += `${BOLD_ON}Printed:${BOLD_OFF} ${shortPrintedDate} ${BOLD_ON}Expiry:${BOLD_OFF} ${shortExpiryDate}${sectionSpacing}`
    } else {
      // Extended: Two separate lines or spaced single line
      const printedText = `${BOLD_ON}Printed:${BOLD_OFF} ${shortPrintedDate}`
      const expiryText = `${BOLD_ON}Expiry:${BOLD_OFF} ${shortExpiryDate}`
      const spacing = Math.max(
        0,
        32 -
          printedText.replace(/\x1B\[[0-9;]*[mGKH]/g, "").length -
          expiryText.replace(/\x1B\[[0-9;]*[mGKH]/g, "").length
      )
      out += `${printedText}${" ".repeat(spacing)}${expiryText}${sectionSpacing}`
    }

    // Allergens section
    if (item.allergens && item.allergens.length > 0) {
      if (!isCompact) {
        out += `${BOLD_ON}${LARGE_TEXT}Contains Allergens${NORMAL_TEXT}${BOLD_OFF}${sectionSpacing}`
      }
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
    out += `${CENTER_ON}${INVERSE_ON}${BOLD_ON}${isCompact ? "" : LARGE_TEXT}${item.name}${NORMAL_TEXT}${BOLD_OFF}${INVERSE_OFF}${LEFT_ALIGN}${titleSpacing}`

    // Best Before
    out += `${CENTER_ON}${BOLD_ON}${isCompact ? "" : LARGE_TEXT}Best Before: ${shortExpiryDate}${NORMAL_TEXT}${BOLD_OFF}${LEFT_ALIGN}${sectionSpacing}`

    // Ingredients
    out += `${BOLD_ON}Ingredients:${BOLD_OFF} `
    const ingredientsText = ingredientList
      .map((ing) => (isAllergen(ing) ? `${BOLD_ON}*${ing}*${BOLD_OFF}` : ing))
      .join(", ")
    out += `${ingredientsText}${sectionSpacing}`
  } else {
    // Regular Menu Item Label
    out += `${CENTER_ON}${INVERSE_ON}${BOLD_ON}${isCompact ? "" : LARGE_TEXT}${item.name}${NORMAL_TEXT}${BOLD_OFF}${INVERSE_OFF}${LEFT_ALIGN}${titleSpacing}`

    // Printed and Expiry dates
    if (isCompact) {
      out += `${BOLD_ON}Printed:${BOLD_OFF} ${shortPrintedDate} ${BOLD_ON}Expiry:${BOLD_OFF} ${shortExpiryDate}${sectionSpacing}`
    } else {
      const printedText = `${BOLD_ON}Printed:${BOLD_OFF} ${shortPrintedDate}`
      const expiryText = `${BOLD_ON}Expiry:${BOLD_OFF} ${shortExpiryDate}`
      const spacing = Math.max(
        0,
        32 -
          printedText.replace(/\x1B\[[0-9;]*[mGKH]/g, "").length -
          expiryText.replace(/\x1B\[[0-9;]*[mGKH]/g, "").length
      )
      out += `${printedText}${" ".repeat(spacing)}${expiryText}${sectionSpacing}`
    }

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

// Helper function to get label dimensions based on height
export function getLabelDimensions(height: LabelHeight): { width: number; height: number } {
  const width = 408 // 51mm at 203 DPI (standard thermal printer width)

  switch (height) {
    case "40mm":
      return { width, height: 320 } // 40mm at 203 DPI
    case "80mm":
      return { width, height: 640 } // 80mm at 203 DPI
    default:
      return { width, height: 320 }
  }
}

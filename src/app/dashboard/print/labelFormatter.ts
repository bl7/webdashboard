import { PrintQueueItem } from "@/types/print"

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

// Enhanced formatLabelForPrint function with centered names and improved layout:
export function formatLabelForPrint(
  item: PrintQueueItem,
  ALLERGENS: string[],
  customExpiry: Record<string, string>,
  MAX_INGREDIENTS_TO_FIT: number = 5,
  useInitials: boolean = false,
  selectedInitial: string = ""
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
  const BOLD_ON = "\x1B\x45\x01" // Bold on
  const BOLD_OFF = "\x1B\x45\x00" // Bold off
  const CENTER_ON = "\x1B\x61\x01" // Center alignment
  const LEFT_ALIGN = "\x1B\x61\x00" // Left alignment
  const INVERSE_ON = "\x1D\x42\x01" // White text on black background
  const INVERSE_OFF = "\x1D\x42\x00" // Normal text

  let out = ""

  if (item.type === "ingredients") {
    // Centered name with black background
    out += `${CENTER_ON}${INVERSE_ON}${BOLD_ON}${item.name}${BOLD_OFF}${INVERSE_OFF}${LEFT_ALIGN}\n`
    out += `\n` // Add some space

    // Printed and Expiry on same line with short dates
    const printedText = `Printed: ${shortPrintedDate}`
    const expiryText = `Expiry: ${shortExpiryDate}`
    const spacing = Math.max(0, 32 - printedText.length - expiryText.length) // Adjust 32 based on your label width
    out += `${printedText}${" ".repeat(spacing)}${expiryText}\n`

    if (item.allergens && item.allergens.length > 0) {
      out += `${BOLD_ON}Contains Allergens${BOLD_OFF}\n`
      out += `Allergens: `
      const allergenText = item.allergens
        .map((a) => `${BOLD_ON}*${a.allergenName}*${BOLD_OFF}`)
        .join(", ")
      out += `${allergenText}\n`
    } else {
      out += `No allergens declared\n`
    }

    if (useInitials && selectedInitial) {
      out += `                    ${selectedInitial}\n`
    }
  } else if (isPPDS) {
    // Centered name with black background
    out += `${CENTER_ON}${INVERSE_ON}${BOLD_ON}${item.name}${BOLD_OFF}${INVERSE_OFF}${LEFT_ALIGN}\n`
    out += `\n` // Add some space

    // Centered Best Before with short date
    out += `${CENTER_ON}${BOLD_ON}Best Before: ${shortExpiryDate}${BOLD_OFF}${LEFT_ALIGN}\n`

    out += `Ingredients: `
    const ingredientsText = ingredientList
      .map((ing) => (isAllergen(ing) ? `${BOLD_ON}*${ing}*${BOLD_OFF}` : ing))
      .join(", ")
    out += `${ingredientsText}\n`
    // No initials for PPDS labels
  } else {
    // Centered name with black background
    out += `${CENTER_ON}${INVERSE_ON}${BOLD_ON}${item.name}${BOLD_OFF}${INVERSE_OFF}${LEFT_ALIGN}\n`
    out += `\n` // Add some space

    // Printed and Expiry on same line with short dates
    const printedText = `Printed: ${shortPrintedDate}`
    const expiryText = `Expiry: ${shortExpiryDate}`
    const spacing = Math.max(0, 32 - printedText.length - expiryText.length) // Adjust 32 based on your label width
    out += `${printedText}${" ".repeat(spacing)}${expiryText}\n`

    if (tooLong) {
      out += `Allergens: `
      const allergensText = allergensOnly.map((a) => `${BOLD_ON}*${a}*${BOLD_OFF}`).join(", ")
      out += allergensText
    } else {
      out += `Ingredients: `
      const ingredientsText = ingredientList
        .map((ing) => (isAllergen(ing) ? `${BOLD_ON}*${ing}*${BOLD_OFF}` : ing))
        .join(", ")
      out += ingredientsText
    }
    out += `\n`

    if (useInitials && selectedInitial) {
      out += `                    ${selectedInitial}\n`
    }
  }

  return out
}

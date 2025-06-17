import { PrintQueueItem } from "@/types/print"

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

  let out = ""

  if (item.type === "ingredients") {
    out += `${item.name}\n`
    out += `Printed On: ${item.printedOn ?? "N/A"}\n`
    out += `Expiry Date: ${expiry}\n`
    if (item.allergens && item.allergens.length > 0) {
      out += `Contains Allergens\n`
      out += `Allergens: ${item.allergens.map((a) => a.allergenName).join(", ")}\n`
    } else {
      out += `No allergens declared\n`
    }
    // Add initials for ingredients (not PPDS)
    if (useInitials && selectedInitial) {
      out += `                    ${selectedInitial}\n`
    }
  } else if (isPPDS) {
    out += `${item.name}\n`
    out += `Best Before: ${expiry}\n`
    out += `Ingredients: `
    out += ingredientList.map((ing) => (isAllergen(ing) ? `*${ing}*` : ing)).join(", ")
    out += `\n`
    // No initials for PPDS labels
  } else {
    out += `${item.name}\n`
    out += `Printed On: ${item.printedOn ?? "N/A"}\n`
    out += `Expiry Date: ${expiry}\n`
    if (tooLong) {
      out += `Allergens: `
      out += allergensOnly.map((a) => `*${a}*`).join(", ")
    } else {
      out += `Ingredients: `
      out += ingredientList.map((ing) => (isAllergen(ing) ? `*${ing}*` : ing)).join(", ")
    }
    out += `\n`
    // Add initials for menu items (not PPDS)
    if (useInitials && selectedInitial) {
      out += `                    ${selectedInitial}\n`
    }
  }

  return out
}

import { OpenedFoodLabelsPage } from "@/components/blocks/opened-food-labels/opened-food-labels"
import { coverageMetadata } from "@/lib/marketing/coverageMetadata"

export const metadata = coverageMetadata("/opened-food-labels")

export default function Page() {
  return <OpenedFoodLabelsPage />
}

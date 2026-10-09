import { CoverageView } from "@/components/marketing/CoverageView"
import { coverageMetadata } from "@/lib/marketing/coverageMetadata"

export const metadata = coverageMetadata("/tools/restaurant-cleaning-checklist")

export default function Page() {
  return <CoverageView path="/tools/restaurant-cleaning-checklist" />
}

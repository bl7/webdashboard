import { CoverageView } from "@/components/marketing/CoverageView"
import { coverageMetadata } from "@/lib/marketing/coverageMetadata"

export const metadata = coverageMetadata("/cleaning-checklists")

export default function Page() {
  return <CoverageView path="/cleaning-checklists" />
}

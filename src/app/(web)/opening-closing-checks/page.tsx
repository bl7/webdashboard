import { CoverageView } from "@/components/marketing/CoverageView"
import { coverageMetadata } from "@/lib/marketing/coverageMetadata"

export const metadata = coverageMetadata("/opening-closing-checks")

export default function Page() {
  return <CoverageView path="/opening-closing-checks" />
}

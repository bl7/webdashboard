import { CoverageView } from "@/components/marketing/CoverageView"
import { coverageMetadata } from "@/lib/marketing/coverageMetadata"

export const metadata = coverageMetadata("/label-sizes")

export default function Page() {
  return <CoverageView path="/label-sizes" />
}

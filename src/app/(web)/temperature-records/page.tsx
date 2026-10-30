import { CoverageView } from "@/components/marketing/CoverageView"
import { coverageMetadata } from "@/lib/marketing/coverageMetadata"

export const metadata = coverageMetadata("/temperature-records")

export default function Page() {
  return <CoverageView path="/temperature-records" />
}

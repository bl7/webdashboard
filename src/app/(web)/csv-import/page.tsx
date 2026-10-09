import { CoverageView } from "@/components/marketing/CoverageView"
import { coverageMetadata } from "@/lib/marketing/coverageMetadata"

export const metadata = coverageMetadata("/csv-import")

export default function Page() {
  return <CoverageView path="/csv-import" />
}

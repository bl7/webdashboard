import { AllergenMatrixTool } from "@/components/marketing/AllergenMatrixTool"
import { CoverageView } from "@/components/marketing/CoverageView"
import { coverageMetadata } from "@/lib/marketing/coverageMetadata"

export const metadata = coverageMetadata("/tools/allergen-matrix")

export default function Page() {
  return (
    <CoverageView path="/tools/allergen-matrix">
      <AllergenMatrixTool />
    </CoverageView>
  )
}

import { AllergenMatrixTool } from "@/components/marketing/AllergenMatrixTool"
import { coverageMetadata } from "@/lib/marketing/coverageMetadata"

export const metadata = coverageMetadata("/tools")

export default function Page() {
  return (
    <>
      <section className="bg-white px-4 pb-2 pt-32 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-6xl">
          <p className="text-sm text-mkt-steel">Free tool</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-mkt-ink sm:text-5xl">
            Build an allergen matrix and download the PDF.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mkt-ink8">
            No account is required. Add dishes and the allergens recorded on them. A blank cell
            means nothing is recorded, not that the dish is free from that allergen.
          </p>
        </div>
      </section>
      <AllergenMatrixTool />
    </>
  )
}

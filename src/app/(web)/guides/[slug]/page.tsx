import { notFound } from "next/navigation"
import { CoverageView } from "@/components/marketing/CoverageView"
import { coverageMetadata } from "@/lib/marketing/coverageMetadata"
import { getCoveragePage } from "@/lib/marketing/coveragePages"

const slugs = [
  "ppds-labelling-requirements",
  "use-by-vs-best-before",
  "fifo-food-storage",
  "food-labelling-checklist",
  "allergen-information-for-restaurants",
  "handwritten-vs-printed-food-labels",
  "choosing-kitchen-labelling-software",
]

export const dynamicParams = false

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return coverageMetadata(`/guides/${slug}`)
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getCoveragePage(`/guides/${slug}`)) notFound()
  return <CoverageView path={`/guides/${slug}`} />
}

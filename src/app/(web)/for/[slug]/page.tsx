import { notFound } from "next/navigation"
import { CoverageView } from "@/components/marketing/CoverageView"
import { SectorPack } from "@/components/marketing/SectorPack"
import { coverageMetadata } from "@/lib/marketing/coverageMetadata"
import { getCoveragePage } from "@/lib/marketing/coveragePages"

const slugs = ["restaurants", "cafes", "takeaways", "caterers"]

export const dynamicParams = false

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return coverageMetadata(`/for/${slug}`)
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getCoveragePage(`/for/${slug}`)) notFound()
  return <CoverageView path={`/for/${slug}`} examples={<SectorPack slug={slug} />} />
}

import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { TopicPage } from "@/components/marketing/TopicPage"
import { getCoveragePage } from "@/lib/marketing/coveragePages"

export function CoverageView({
  path,
  children,
  examples,
}: {
  path: string
  children?: ReactNode
  examples?: ReactNode
}) {
  const page = getCoveragePage(path)
  if (!page) notFound()
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: `https://www.instalabel.co${path}`,
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      <TopicPage page={page} examples={examples}>
        {children}
      </TopicPage>
    </>
  )
}

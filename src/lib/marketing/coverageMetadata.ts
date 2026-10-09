import type { Metadata } from "next"
import { getCoveragePage } from "@/lib/marketing/coveragePages"
import { FOLDER_SEO, type FolderSeoPath } from "@/lib/marketing/folderSeo"

const ORIGIN = "https://www.instalabel.co"

export function coverageMetadata(path: string): Metadata {
  const page = getCoveragePage(path)
  const folder = FOLDER_SEO[path as FolderSeoPath]
  if (!page && !folder) return {}
  const title = folder?.title ?? `${page?.title} | InstaLabel`
  const description = folder?.description ?? page?.description ?? ""
  const url = `${ORIGIN}${path}`
  return {
    title: { absolute: title },
    description,
    keywords: folder ? [...folder.keywords] : undefined,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: `${ORIGIN}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: page?.h1 ?? title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${ORIGIN}/opengraph-image.png`],
    },
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

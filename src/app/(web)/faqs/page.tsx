import { FOLDER_SEO } from "@/lib/marketing/folderSeo"
import { FaqsPage } from "@/components/blocks/faqs/faqs"
import { Metadata } from "next"
import React from "react"

const title = FOLDER_SEO["/faqs"].title
const description = FOLDER_SEO["/faqs"].description

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [...FOLDER_SEO["/faqs"].keywords],
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/faqs",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Frequently asked questions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/faqs",
  },
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

const Page = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: "https://www.instalabel.co/faqs",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <FaqsPage />
    </>
  )
}

export default Page

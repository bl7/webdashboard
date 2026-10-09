import { FOLDER_SEO } from "@/lib/marketing/folderSeo"
import { Features } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: { absolute: FOLDER_SEO["/features"].title },
  description: FOLDER_SEO["/features"].description,
  keywords: [...FOLDER_SEO["/features"].keywords],
  openGraph: {
    title: FOLDER_SEO["/features"].title,
    description: FOLDER_SEO["/features"].description,
    url: "https://www.instalabel.co/features",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel kitchen labelling features",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: FOLDER_SEO["/features"].title,
    description: FOLDER_SEO["/features"].description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/features",
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
    name: FOLDER_SEO["/features"].title,
    description: FOLDER_SEO["/features"].description,
    url: "https://www.instalabel.co/features",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Features />
    </>
  )
}

export default Page

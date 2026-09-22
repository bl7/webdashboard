import { Features } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Kitchen labelling features",
  description:
    "Explore item management, allergen information, date rules, CSV import, label previews, desktop printing and Android printing with InstaLabel.",
  openGraph: {
    title: "Kitchen labelling features | InstaLabel",
    description:
      "Explore item management, allergen information, date rules, CSV import, label previews, desktop printing and Android printing with InstaLabel.",
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
    title: "Kitchen labelling features | InstaLabel",
    description:
      "Explore item management, allergen information, date rules, CSV import, label previews, desktop printing and Android printing with InstaLabel.",
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
    name: "Kitchen labelling features | InstaLabel",
    description:
      "Explore item management, allergen information, date rules, CSV import, label previews, desktop printing and Android printing with InstaLabel.",
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

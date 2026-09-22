import { Uses } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: { absolute: "Kitchen labelling workflows | InstaLabel" },
  description:
    "Find the right workflow for ingredient storage, prep, cooked batches, defrosting, stock rotation and PPDS labels with InstaLabel.",
  openGraph: {
    title: "Kitchen labelling workflows | InstaLabel",
    description:
      "Find the right workflow for ingredient storage, prep, cooked batches, defrosting, stock rotation and PPDS labels with InstaLabel.",
    url: "https://www.instalabel.co/uses",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel kitchen labelling workflows",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen labelling workflows | InstaLabel",
    description:
      "Find the right workflow for ingredient storage, prep, cooked batches, defrosting, stock rotation and PPDS labels with InstaLabel.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/uses",
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
    name: "Kitchen labelling workflows | InstaLabel",
    description:
      "Find the right workflow for ingredient storage, prep, cooked batches, defrosting, stock rotation and PPDS labels with InstaLabel.",
    url: "https://www.instalabel.co/uses",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Uses />
    </>
  )
}

export default Page

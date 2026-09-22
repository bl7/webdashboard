import { LabelPrinterUkComparisonPage } from "@/components/blocks/label-printer-uk-comparison"
import { Metadata } from "next"
import React from "react"

const description =
  "Compare handwritten labels, standalone printer workflows and connected labelling software. Use a practical checklist for your kitchen."

export const metadata: Metadata = {
  title: { absolute: "Compare kitchen labelling methods | InstaLabel" },
  description,
  openGraph: {
    title: "Compare kitchen labelling methods | InstaLabel",
    description,
    url: "https://www.instalabel.co/label-printer-uk-comparison",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Compare kitchen labelling methods",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare kitchen labelling methods | InstaLabel",
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/label-printer-uk-comparison",
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
    name: "Compare kitchen labelling methods | InstaLabel",
    description,
    url: "https://www.instalabel.co/label-printer-uk-comparison",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LabelPrinterUkComparisonPage />
    </>
  )
}

export default Page

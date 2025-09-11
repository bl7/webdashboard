import { Metadata } from "next"
import React from "react"
import { PrepLabelsPage } from "@/components/blocks/prep-labels"

export const metadata: Metadata = {
  title: "Prep Labels | Kitchen Prep Labelling Software | InstaLabel",
  description:
    "Automated prep labels with expiry, allergens, and batch details. Keep kitchens running smooth with HACCP prep labels.",
  keywords: [
    "food prep labels",
    "kitchen prep labelling",
    "HACCP prep labels",
    "prep labels",
    "food preparation labels",
    "kitchen prep software",
    "batch tracking labels",
    "prep station labels",
    "kitchen organization",
    "food safety labels",
    "prep workflow",
    "kitchen management software",
    "prep station management",
    "batch codes",
    "kitchen efficiency",
    "food prep workflow",
    "prep labeling system",
    "kitchen automation",
    "restaurant technology",
    "prep tracking",
    "kitchen labeling software",
    "best prep label software",
    "instalabel software",
  ],
  authors: [{ name: "InstaLabel Team" }],
  creator: "InstaLabel",
  publisher: "InstaLabel",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.instalabel.co/prep-labels",
  },
  openGraph: {
    title: "Prep Labels | Kitchen Prep Labelling Software",
    description:
      "Automated prep labels with expiry, allergens, and batch details. Keep kitchens running smooth with HACCP prep labels.",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Prep Labels - Kitchen Prep Labelling Software",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prep Labels | Kitchen Prep Labelling Software",
    description:
      "Automated prep labels with expiry, allergens, and batch details. Keep kitchens running smooth with HACCP prep labels.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  category: "Food Service Technology",
  metadataBase: new URL("https://www.instalabel.co"),
}

const Page = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Prep Labels",
    description:
      "Automated prep labels with expiry, allergens, and batch details. Keep kitchens running smooth with HACCP prep labels.",
    url: "https://www.instalabel.co/prep-labels",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "InstaLabel Prep Labels",
      description:
        "Software for creating automated prep labels with expiry, allergens, and batch details",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web-based",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "200",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.instalabel.co",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Prep Labels",
          item: "https://www.instalabel.co/prep-labels",
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PrepLabelsPage />
    </>
  )
}

export default Page

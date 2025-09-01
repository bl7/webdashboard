import { ExpiryDateLabelsPage } from "@/components/blocks/expiry-date-labels"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Expiry Date Labels | Food Expiry Labeling Software & Compliance",
  description:
    "Automate expiry date labeling for food safety compliance. Print expiry date labels, track food freshness, and ensure Natasha's Law compliance with InstaLabel software.",
  keywords: [
    "expiry date printer",
    "food expiry labels",
    "expiry date labels",
    "food expiry labeling software",
    "kitchen expiry date labels",
    "restaurant expiry labeling",
    "food safety expiry dates",
    "expiry date compliance",
    "kitchen label expiry software",
    "food prep expiry labels",
    "restaurant food expiry system",
    "expiry date tracking software",
    "kitchen management expiry labels",
    "food business expiry compliance",
    "expiry date automation",
    "kitchen labeling expiry dates",
    "food safety labeling software",
    "expiry date printer software",
  ],
  openGraph: {
    title: "Expiry Date Labels | Food Expiry Labeling Software & Compliance",
    description:
      "Automate expiry date labeling for food safety compliance. Print expiry date labels, track food freshness, and ensure Natasha's Law compliance with InstaLabel software.",
    url: "https://www.instalabel.co/expiry-date-labels",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Expiry Date Labels - Food Expiry Labeling Software & Compliance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Expiry Date Labels | Food Expiry Labeling Software & Compliance",
    description:
      "Automate expiry date labeling for food safety compliance. Print expiry date labels, track food freshness, and ensure Natasha's Law compliance with InstaLabel software.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/expiry-date-labels",
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
    name: "Expiry Date Labels",
    description:
      "Automate expiry date labeling for food safety compliance. Print expiry date labels, track food freshness, and ensure Natasha's Law compliance with InstaLabel software.",
    url: "https://www.instalabel.co/expiry-date-labels",
    mainEntity: {
      "@type": "Article",
      name: "Expiry Date Labeling Guide",
      description: "Complete guide to expiry date labeling for food safety compliance",
      author: {
        "@type": "Organization",
        name: "InstaLabel",
      },
      publisher: {
        "@type": "Organization",
        name: "InstaLabel",
      },
      datePublished: "2025-01-01",
      dateModified: "2025-01-01",
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
          name: "Expiry Date Labels",
          item: "https://www.instalabel.co/expiry-date-labels",
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
      <ExpiryDateLabelsPage />
    </>
  )
}

export default Page

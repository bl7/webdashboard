import { IngredientLabelsPage } from "@/components/blocks/ingredient-labels"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Ingredient Labels | Kitchen Organization Software | InstaLabel",
  description:
    "Label storage containers and prep stations with clear expiry dates and staff initials. Keep your kitchen organized with ingredient expiry labels.",
  keywords: [
    "ingredient expiry labels",
    "ingredient storage labels",
    "kitchen ingredient labelling software",
    "ingredient labels",
    "expiry date labels",
    "storage container labels",
    "kitchen organization",
    "food safety labels",
    "ingredient tracking",
    "kitchen management software",
    "prep station labels",
    "container labels",
    "kitchen efficiency",
    "food waste reduction",
    "kitchen labeling system",
    "ingredient management",
    "kitchen automation",
    "restaurant technology",
    "food prep workflow",
    "kitchen labeling software",
    "best kitchen label software",
    "instalabel software",
  ],
  openGraph: {
    title: "Ingredient Labels | Kitchen Organization Software",
    description:
      "Label storage containers and prep stations with clear expiry dates and staff initials. Keep your kitchen organized with ingredient expiry labels.",
    url: "https://www.instalabel.co/ingredient-labels",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Ingredient Labels - Kitchen Organization Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ingredient Labels | Kitchen Organization Software",
    description:
      "Label storage containers and prep stations with clear expiry dates and staff initials. Keep your kitchen organized with ingredient expiry labels.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/ingredient-labels",
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
    name: "Ingredient Labels",
    description:
      "Label storage containers and prep stations with clear expiry dates and staff initials. Keep your kitchen organized with ingredient expiry labels.",
    url: "https://www.instalabel.co/ingredient-labels",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "InstaLabel Ingredient Labels",
      description:
        "Software for creating organized ingredient labels with expiry dates and staff initials",
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
          name: "Ingredient Labels",
          item: "https://www.instalabel.co/ingredient-labels",
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
      <IngredientLabelsPage />
    </>
  )
}

export default Page

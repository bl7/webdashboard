import { Uses } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Kitchen Labeling Uses | Food Prep, Cook & PPDS Labels | InstaLabel",
  description: "Discover all kitchen labeling uses: prep labels, cook labels, PPDS labels, allergen warnings, expiry tracking, and HACCP compliance. Perfect for restaurants, cafes, and food businesses.",
  keywords: [
    "kitchen labeling uses",
    "food prep labels",
    "cook labels",
    "PPDS labels",
    "allergen warning labels",
    "expiry date labels",
    "kitchen workflow",
    "restaurant labeling",
    "food safety compliance",
    "HACCP labels",
    "kitchen management",
    "food service labels",
    "thermal printer labels",
    "kitchen automation",
    "restaurant technology",
    "food prep workflow",
    "kitchen efficiency",
    "food labeling software"
  ],
  openGraph: {
    title: "Kitchen Labeling Uses | Food Prep, Cook & PPDS Labels | InstaLabel",
    description: "Discover all kitchen labeling uses: prep labels, cook labels, PPDS labels, allergen warnings, expiry tracking, and HACCP compliance.",
    url: "https://instalabel.co/uses",
    type: "website",
    images: [
      {
        url: "https://instalabel.co/og-uses.jpg",
        width: 1200,
        height: 630,
        alt: "Kitchen Labeling Uses - Food Prep, Cook & PPDS Labels"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen Labeling Uses | Food Prep, Cook & PPDS Labels",
    description: "Discover all kitchen labeling uses: prep labels, cook labels, PPDS labels, allergen warnings, expiry tracking, and HACCP compliance.",
    images: ["https://instalabel.co/og-uses.jpg"]
  },
  alternates: {
    canonical: "https://instalabel.co/uses",
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
  }
}

const Page = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Kitchen Labeling Uses",
    "description": "Discover all kitchen labeling uses: prep labels, cook labels, PPDS labels, allergen warnings, expiry tracking, and HACCP compliance.",
    "url": "https://instalabel.co/uses",
    "mainEntity": {
      "@type": "Article",
      "name": "Kitchen Labeling Uses Guide",
      "description": "Complete guide to kitchen labeling uses including prep labels, cook labels, and PPDS labels",
      "author": {
        "@type": "Organization",
        "name": "InstaLabel"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://instalabel.co"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Uses",
          "item": "https://instalabel.co/uses"
        }
      ]
    }
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

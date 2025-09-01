import { Features } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Kitchen Labeling Software Features | Food Safety & Technical Specifications",
  description:
    "Explore InstaLabel's complete kitchen labeling software features. Thermal printing, HACCP compliance, allergen tracking, multi-location management, and Square POS integration. Technical specs included.",
  keywords: [
    "kitchen labeling software features",
    "food safety label printer capabilities",
    "restaurant labeling system specifications",
    "HACCP compliant labeling features",
    "thermal printer restaurant software",
    "Natasha's Law labeling system",
    "kitchen compliance software features",
    "food prep labeling technology",
    "kitchen labeling applications",
    "restaurant food labeling uses",
    "commercial kitchen label types",
    "food prep labeling workflows",
    "kitchen labeling system features",
    "food safety compliance software",
    "thermal printing restaurant software",
    "kitchen management system features",
  ],
  openGraph: {
    title: "Kitchen Labeling Software Features | Food Safety & Technical Specifications",
    description:
      "Explore InstaLabel's complete kitchen labeling software features. Thermal printing, HACCP compliance, allergen tracking, multi-location management, and Square POS integration. Technical specs included.",
    url: "https://www.instalabel.co/features",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kitchen Labeling Software Features - Food Safety Labels & Technical Specifications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen Labeling Software Features | Food Safety & Technical Specifications",
    description:
      "Explore InstaLabel's complete kitchen labeling software features for food safety and compliance with detailed technical specifications.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/features",
  },
}

const Page = () => {
  return (
    <>
      <Features />
    </>
  )
}

export default Page

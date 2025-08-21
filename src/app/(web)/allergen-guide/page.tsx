import { AllergenGuidePage } from "@/components/blocks/allergen-guide"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "UK 14 Allergens Guide | Natasha's Law Compliance",
  description:
    "Complete UK 14 allergens guide with detailed information, hidden sources, and compliance requirements. Essential reference for Natasha's Law and EHO compliance.",
  keywords: [
    "UK 14 allergens",
    "allergen guide",
    "Natasha's Law allergens",
    "food allergens list",
    "allergen compliance guide",
    "hidden allergens",
    "cross contamination allergens",
    "kitchen allergen reference",
    "restaurant allergen guide",
    "cafe allergen compliance",
    "pub allergen requirements",
    "takeaway allergen guide",
    "catering allergen compliance",
    "EHO allergen requirements",
    "allergen labeling guide",
    "food safety allergens",
    "allergen ingredients list",
    "allergen sources guide",
    "kitchen allergen poster",
    "allergen reference card",
  ],
  openGraph: {
    title: "UK 14 Allergens Guide | Natasha's Law Compliance",
    description:
      "Complete UK 14 allergens guide with detailed information, hidden sources, and compliance requirements.",
    url: "https://www.instalabel.co/allergen-guide",
    type: "article",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "UK 14 Allergens Guide - Complete Reference",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK 14 Allergens Guide | Natasha's Law Compliance",
    description:
      "Complete UK 14 allergens guide with detailed information, hidden sources, and compliance requirements.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/allergen-guide",
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
  return (
    <>
      <AllergenGuidePage />
    </>
  )
}

export default Page

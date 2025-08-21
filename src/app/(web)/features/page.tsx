import { Features } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Kitchen Labeling Features | Food Safety",
  description:
    "Discover InstaLabel's powerful kitchen labeling features: HACCP-compliant food safety labels, allergen warnings, expiry tracking, thermal printer support, and restaurant management tools.",
  keywords: [
    "kitchen labeling features",
    "food safety labels",
    "thermal printer labels",
    "allergen labeling",
    "expiry date tracking",
    "restaurant labeling system",
    "HACCP compliance",
    "kitchen management software",
    "food prep labels",
    "restaurant technology",
  ],
  openGraph: {
    title: "Kitchen Labeling Features | Food Safety",
    description:
      "Discover InstaLabel's powerful kitchen labeling features: HACCP-compliant food safety labels, allergen warnings, expiry tracking, thermal printer support, and restaurant management tools.",
    url: "https://www.instalabel.co/features",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kitchen Labeling Features - Food Safety Labels & Thermal Printer Support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen Labeling Features | Food Safety",
    description:
      "Discover InstaLabel's powerful kitchen labeling features for food safety and compliance.",
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

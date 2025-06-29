import { Features } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Kitchen Labeling Features | Food Safety Labels & Thermal Printer Support",
  description: "Discover InstaLabel's powerful kitchen labeling features: HACCP-compliant food safety labels, allergen warnings, expiry tracking, thermal printer support, and restaurant management tools. Start free trial.",
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
    "restaurant technology"
  ],
  openGraph: {
    title: "Kitchen Labeling Features | Food Safety Labels & Thermal Printer Support",
    description: "Discover InstaLabel's powerful kitchen labeling features: HACCP-compliant food safety labels, allergen warnings, expiry tracking, thermal printer support, and restaurant management tools.",
    url: "https://instalabel.co/features",
  },
  alternates: {
    canonical: "https://instalabel.co/features",
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

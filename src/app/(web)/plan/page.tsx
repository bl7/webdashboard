import { Plan } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Kitchen Labeling Pricing | Restaurant Labeling System Plans & Pricing",
  description: "InstaLabel pricing plans for restaurants and food businesses. Choose from Starter, Professional, or Enterprise plans. Free 14-day trial, no credit card required. HACCP-compliant kitchen labeling system.",
  keywords: [
    "kitchen labeling pricing",
    "restaurant labeling cost",
    "food safety labeling plans",
    "kitchen management pricing",
    "restaurant technology cost",
    "thermal printer labeling pricing",
    "HACCP compliance cost",
    "kitchen automation pricing",
    "food service labeling plans",
    "restaurant management software pricing"
  ],
  openGraph: {
    title: "Kitchen Labeling Pricing | Restaurant Labeling System Plans & Pricing",
    description: "InstaLabel pricing plans for restaurants and food businesses. Choose from Starter, Professional, or Enterprise plans. Free 14-day trial, no credit card required.",
    url: "https://instalabel.co/plan",
  },
  alternates: {
    canonical: "https://instalabel.co/plan",
  },
}

const Page = () => {
  return (
    <>
      <Plan />
    </>
  )
}

export default Page

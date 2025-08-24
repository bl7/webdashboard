import { Plan } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Kitchen Labeling Pricing | Restaurant Plans",
  description:
    "Choose the perfect kitchen labeling plan for your restaurant. From starter plans to enterprise solutions, all include food safety labels, allergen warnings, and thermal printer support.",
  keywords: [
    "kitchen labeling pricing",
    "restaurant labeling plans",
    "food safety label pricing",
    "allergen labeling cost",
    "thermal printer label plans",
    "restaurant technology pricing",
    "kitchen management software cost",
    "HACCP compliance pricing",
    "food labeling software plans",
    "restaurant automation pricing",
    "kitchen efficiency software",
    "food service technology cost",
    "restaurant management pricing",
    "kitchen workflow automation cost",
  ],
  openGraph: {
    title: "Kitchen Labeling Pricing | Restaurant Plans",
    description:
      "Choose the perfect kitchen labeling plan for your restaurant. From starter plans to enterprise solutions, all include food safety labels, allergen warnings, and thermal printer support.",
    url: "https://www.instalabel.co/plan",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kitchen Labeling Pricing Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen Labeling Pricing | Restaurant Plans",
    description:
      "Choose the perfect kitchen labeling plan for your restaurant. From starter plans to enterprise solutions, all include food safety labels, allergen warnings, and thermal printer support.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/plan",
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
    name: "Kitchen Labeling Pricing",
    description:
      "Choose the perfect kitchen labeling plan for your restaurant. From starter plans to enterprise solutions, all include food safety labels, allergen warnings, and thermal printer support.",
    url: "https://www.instalabel.co/plan",
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
          name: "Pricing",
          item: "https://www.instalabel.co/plan",
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

      {/* Simple H2 heading for SEO */}
      <h2 className="sr-only">Kitchen Labeling Pricing Plans</h2>

      <Plan />
    </>
  )
}

export default Page

import { BookDemo } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Book Demo | Kitchen Labeling System",
  description:
    "Book a free demo of InstaLabel's kitchen labeling system. See how our food safety labels, allergen warnings, and thermal printer integration work for your restaurant. No obligation.",
  keywords: [
    "book demo",
    "kitchen labeling demo",
    "restaurant labeling consultation",
    "food safety labels demo",
    "allergen labeling demo",
    "thermal printer demo",
    "kitchen management demo",
    "restaurant technology demo",
    "HACCP compliance demo",
    "kitchen automation demo",
    "free consultation",
    "restaurant software demo",
    "kitchen labeling consultation",
    "food service technology demo",
  ],
  openGraph: {
    title: "Book Demo | Kitchen Labeling System",
    description:
      "Book a free demo of InstaLabel's kitchen labeling system. See how our food safety labels, allergen warnings, and thermal printer integration work for your restaurant.",
    url: "https://www.instalabel.co/bookdemo",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Book Demo - InstaLabel Kitchen Labeling System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Demo | Kitchen Labeling System",
    description:
      "Book a free demo of InstaLabel's kitchen labeling system. See how our food safety labels, allergen warnings, and thermal printer integration work for your restaurant.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/bookdemo",
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
    name: "Book Demo",
    description:
      "Book a free demo of InstaLabel's kitchen labeling system. See how our food safety labels, allergen warnings, and thermal printer integration work for your restaurant.",
    url: "https://www.instalabel.co/bookdemo",
    mainEntity: {
      "@type": "Event",
      name: "InstaLabel Kitchen Labeling Demo",
      description: "Free consultation and demo of InstaLabel's kitchen labeling system",
      startDate: "2024-01-01T00:00:00Z",
      endDate: "2024-12-31T23:59:59Z",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      organizer: {
        "@type": "Organization",
        name: "InstaLabel",
        url: "https://www.instalabel.co",
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
          name: "Book Demo",
          item: "https://www.instalabel.co/bookdemo",
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
      <BookDemo />
    </>
  )
}

export default Page

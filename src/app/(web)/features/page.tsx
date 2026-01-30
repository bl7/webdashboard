import { Features } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Kitchen Labeling Software Features | Food Safety & Technical Specifications",
  description:
    "Explore InstaLabel's complete kitchen labeling software features. Thermal printing, HACCP compliance, allergen tracking, and multi-location management. Technical specs included.",
  keywords: [
    "kitchen label printer software",
    "best kitchen label software",
    "restaurant label printer software",
    "ingredient label printer",
    "expiry date printer software",
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
    "allergen label software",
    "food safety labeling software",
    "kitchen automation software",
    "label printer software UK",
    "instalabel software",
  ],
  openGraph: {
    title: "Kitchen Labeling Software Features | Food Safety & Technical Specifications",
    description:
      "Explore InstaLabel's complete kitchen labeling software features. Thermal printing, HACCP compliance, allergen tracking, and multi-location management. Technical specs included.",
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
    name: "Kitchen Labeling Software Features",
    description:
      "Explore InstaLabel's complete kitchen labeling software features for food safety and compliance with detailed technical specifications.",
    url: "https://www.instalabel.co/features",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "InstaLabel",
      description: "AI-powered kitchen label software for food safety and compliance",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, Android",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "500",
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
          name: "Features",
          item: "https://www.instalabel.co/features",
        },
      ],
    },
    faq: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What are the main features of InstaLabel kitchen labeling software?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "InstaLabel features include AI-powered allergen detection, Natasha's Law compliance, thermal printer support, mobile compatibility, real-time analytics, and HACCP compliance.",
          },
        },
        {
          "@type": "Question",
          name: "Does InstaLabel work with all thermal printers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, InstaLabel works with any thermal label printer via USB, Bluetooth, or network connectivity. No special drivers or setup required.",
          },
        },
        {
          "@type": "Question",
          name: "How does InstaLabel ensure Natasha's Law compliance?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "InstaLabel automatically detects all 14 UK allergens from ingredient databases, generates compliant PPDS labels, and provides full ingredient lists with allergen warnings.",
          },
        },
        {
          "@type": "Question",
          name: "Can InstaLabel be used on mobile devices?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, InstaLabel is fully mobile compatible and can be accessed from any device - desktop, tablet, or smartphone for kitchen staff convenience.",
          },
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
      <Features />
    </>
  )
}

export default Page

import { NatashasLawPage } from "@/components/blocks/natashas-law"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Natasha's Law / PPDS Labels | Compliance Made Effortless | InstaLabel",
  description:
    "Print fully compliant PPDS labels in seconds. InstaLabel automatically formats ingredients, highlights allergens, and includes all legally required info for Natasha's Law compliance.",
  keywords: [
    "PPDS labels",
    "Natasha's Law compliance labels",
    "food allergen labels software UK",
    "prepacked for direct sale labels",
    "Natasha's Law requirements",
    "PPDS labeling software",
    "food allergen compliance",
    "restaurant labeling UK",
    "food safety labels",
    "allergen warning labels",
    "kitchen labeling software",
    "food prep labels",
    "compliance labeling",
    "FSA labeling requirements",
    "food business labeling",
    "allergen management software",
    "restaurant compliance",
    "food labeling automation",
    "kitchen management software",
    "food safety compliance",
    "thermal printer labels",
    "kitchen automation",
    "restaurant technology",
    "food prep workflow",
    "kitchen efficiency",
    "food labeling software",
    "best kitchen label software",
    "instalabel software",
  ],
  openGraph: {
    title: "Natasha's Law / PPDS Labels | Compliance Made Effortless",
    description:
      "Print fully compliant PPDS labels in seconds. InstaLabel automatically formats ingredients, highlights allergens, and includes all legally required info.",
    url: "https://www.instalabel.co/natashas-law",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Natasha's Law / PPDS Labels - Compliance Made Effortless",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Natasha's Law / PPDS Labels | Compliance Made Effortless",
    description:
      "Print fully compliant PPDS labels in seconds. InstaLabel automatically formats ingredients, highlights allergens, and includes all legally required info.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/natashas-law",
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
    name: "Natasha's Law / PPDS Labels",
    description:
      "Print fully compliant PPDS labels in seconds. InstaLabel automatically formats ingredients, highlights allergens, and includes all legally required info.",
    url: "https://www.instalabel.co/natashas-law",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "InstaLabel PPDS Labels",
      description: "Software for creating compliant PPDS labels under Natasha's Law",
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
          name: "Natasha's Law / PPDS Labels",
          item: "https://www.instalabel.co/natashas-law",
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
      <NatashasLawPage />
    </>
  )
}

export default Page

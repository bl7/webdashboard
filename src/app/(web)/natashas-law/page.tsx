import type { Metadata } from "next"
import { NatashasLawPage } from "@/components/blocks/natashas-law/natashas-law"

export const metadata: Metadata = {
  title: "InstaLabel: Natasha's Law Compliance Software | UK Food Labeling",
  description:
    "InstaLabel ensures 100% Natasha's Law compliance for UK food businesses. AI-powered software automatically generates compliant labels with allergen information, ingredients, and expiry dates. Start your free trial.",
  keywords: [
    "natasha's law",
    "natasha's law compliance",
    "PPDS labeling",
    "food allergen labeling",
    "UK food labeling regulations",
    "kitchen label software",
    "best kitchen label software",
    "allergen label software",
    "food safety labeling software",
    "kitchen automation software",
    "label printer software UK",
    "instalabel software",
  ],
  openGraph: {
    title: "InstaLabel: Natasha's Law Compliance Software | UK Food Labeling",
    description:
      "InstaLabel ensures 100% Natasha's Law compliance for UK food businesses. AI-powered software automatically generates compliant labels with allergen information, ingredients, and expiry dates. Start your free trial.",
    url: "https://www.instalabel.co/natashas-law",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel - Natasha's Law Compliance Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaLabel: Natasha's Law Compliance Software | UK Food Labeling",
    description:
      "InstaLabel ensures 100% Natasha's Law compliance for UK food businesses. AI-powered software automatically generates compliant labels with allergen information, ingredients, and expiry dates. Start your free trial.",
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
    name: "InstaLabel Natasha's Law Compliance Software",
    description:
      "InstaLabel ensures 100% Natasha's Law compliance for UK food businesses. AI-powered software automatically generates compliant labels with allergen information, ingredients, and expiry dates. Start your free trial.",
    url: "https://www.instalabel.co/natashas-law",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "InstaLabel",
      description: "AI-powered kitchen label software for Natasha's Law compliance",
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
          name: "Natasha's Law Compliance",
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

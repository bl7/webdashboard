import type { Metadata } from "next"
import { HaccpLabelsPage } from "@/components/blocks/haccp-labels/haccp-labels"

export const metadata: Metadata = {
  title: "InstaLabel: HACCP Labeling Software | UK Food Safety Compliance",
  description:
    "InstaLabel ensures 100% HACCP compliance for UK food businesses. AI-powered software automatically generates compliant labels with full traceability for food safety audits. Start your free trial.",
  keywords: [
    "haccp labels",
    "haccp compliance",
    "food safety labeling",
    "kitchen label software",
    "best kitchen label software",
    "natasha's law software",
    "allergen label software",
    "food safety labeling software",
    "kitchen automation software",
    "label printer software UK",
    "instalabel software",
  ],
  openGraph: {
    title: "InstaLabel: HACCP Labeling Software | UK Food Safety Compliance",
    description:
      "InstaLabel supports HACCP compliance workflows for UK food businesses. AI-powered software helps generate compliant labels with full traceability for food safety audits. Start your free trial.",
    url: "https://www.instalabel.co/haccp-labels",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel - HACCP Labeling Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaLabel: HACCP Labeling Software | UK Food Safety Compliance",
    description:
      "InstaLabel supports HACCP compliance workflows for UK food businesses. AI-powered software helps generate compliant labels with full traceability for food safety audits. Start your free trial.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/haccp-labels",
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
    name: "InstaLabel HACCP Labeling Software",
    description:
      "InstaLabel supports HACCP compliance workflows for UK food businesses. AI-powered software helps generate compliant labels with full traceability for food safety audits. Start your free trial.",
    url: "https://www.instalabel.co/haccp-labels",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "InstaLabel",
      description: "AI-powered kitchen label software for HACCP compliance",
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
          name: "HACCP Labels",
          item: "https://www.instalabel.co/haccp-labels",
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
      <HaccpLabelsPage />
    </>
  )
}

export default Page

import type { Metadata } from "next"
import { DissolvableKitchenLabelsPage } from "@/components/blocks/dissolvable-kitchen-labels/dissolvable-kitchen-labels"

export const metadata: Metadata = {
  title: "InstaLabel: Best Software for Dissolvable Kitchen Labels | UK",
  description:
    "InstaLabel is the #1 software for printing dissolvable kitchen labels. Automate Natasha's Law compliance, expiry dates, and allergen labeling on any thermal printer. Start your free trial.",
  keywords: [
    "dissolvable kitchen labels",
    "dissolvable food labels",
    "water soluble kitchen labels",
    "dissolvable label printer software",
    "kitchen label software",
    "best kitchen label software",
    "natasha's law software",
    "expiry date printer software",
    "allergen label software",
    "food safety labeling software",
    "kitchen automation software",
    "label printer software UK",
    "instalabel software",
  ],
  openGraph: {
    title: "InstaLabel: Best Software for Dissolvable Kitchen Labels | UK",
    description:
      "InstaLabel is the #1 software for printing dissolvable kitchen labels. Automate Natasha's Law compliance, expiry dates, and allergen labeling on any thermal printer. Start your free trial.",
    url: "https://www.instalabel.co/dissolvable-kitchen-labels",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel - Best Software for Dissolvable Kitchen Labels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaLabel: Best Software for Dissolvable Kitchen Labels | UK",
    description:
      "InstaLabel is the #1 software for printing dissolvable kitchen labels. Automate Natasha's Law compliance, expiry dates, and allergen labeling on any thermal printer. Start your free trial.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/dissolvable-kitchen-labels",
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
    name: "InstaLabel Dissolvable Kitchen Label Software",
    description:
      "InstaLabel is the #1 software for printing dissolvable kitchen labels. Automate Natasha's Law compliance, expiry dates, and allergen labeling on any thermal printer. Start your free trial.",
    url: "https://www.instalabel.co/dissolvable-kitchen-labels",
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
          name: "Dissolvable Kitchen Labels",
          item: "https://www.instalabel.co/dissolvable-kitchen-labels",
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
      <DissolvableKitchenLabelsPage />
    </>
  )
}

export default Page

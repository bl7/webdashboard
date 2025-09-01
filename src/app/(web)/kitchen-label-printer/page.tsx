import { KitchenLabelPrinterPage } from "@/components/blocks/kitchen-label-printer"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Kitchen Label Printer UK | Commercial Food Labeling Solutions",
  description:
    "Find the best kitchen label printer for your restaurant. Compare thermal vs inkjet, get expert advice on commercial food labeling, and discover InstaLabel's software solutions for UK food businesses.",
  keywords: [
    "kitchen label printer",
    "commercial kitchen label printer",
    "restaurant label printer UK",
    "thermal label printer for kitchens",
    "food label printer UK",
    "kitchen label printer comparison",
    "best kitchen label printer",
    "commercial food labeling",
    "restaurant labeling system",
    "kitchen printer setup",
    "thermal printer kitchen",
    "food safety labeling",
    "kitchen label software",
    "restaurant technology",
    "kitchen automation",
    "food prep labeling",
    "commercial kitchen equipment",
    "kitchen labeling solutions",
  ],
  openGraph: {
    title: "Kitchen Label Printer UK | Commercial Food Labeling Solutions",
    description:
      "Find the best kitchen label printer for your restaurant. Compare thermal vs inkjet, get expert advice on commercial food labeling, and discover InstaLabel's software solutions.",
    url: "https://www.instalabel.co/kitchen-label-printer",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kitchen Label Printer UK - Commercial Food Labeling Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen Label Printer UK | Commercial Food Labeling Solutions",
    description:
      "Find the best kitchen label printer for your restaurant. Compare thermal vs inkjet, get expert advice on commercial food labeling, and discover InstaLabel's software solutions.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/kitchen-label-printer",
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
    name: "Kitchen Label Printer UK",
    description:
      "Find the best kitchen label printer for your restaurant. Compare thermal vs inkjet, get expert advice on commercial food labeling, and discover InstaLabel's software solutions.",
    url: "https://www.instalabel.co/kitchen-label-printer",
    mainEntity: {
      "@type": "Article",
      name: "Kitchen Label Printer Guide",
      description:
        "Complete guide to choosing the right kitchen label printer for UK food businesses",
      author: {
        "@type": "Organization",
        name: "InstaLabel",
      },
      publisher: {
        "@type": "Organization",
        name: "InstaLabel",
      },
      datePublished: "2025-01-01",
      dateModified: "2025-01-01",
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
          name: "Kitchen Label Printer",
          item: "https://www.instalabel.co/kitchen-label-printer",
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
      <KitchenLabelPrinterPage />
    </>
  )
}

export default Page

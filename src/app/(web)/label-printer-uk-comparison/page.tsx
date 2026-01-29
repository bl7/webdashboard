import type { Metadata } from "next"
import { LabelPrinterUkComparisonPage } from "@/components/blocks/label-printer-uk-comparison/label-printer-uk-comparison"

export const metadata: Metadata = {
  title: "InstaLabel vs Manual Labeling: Best Kitchen Label Software UK 2025",
  description:
    "Compare InstaLabel software vs manual labeling. See why 500+ UK restaurants choose InstaLabel for 95% faster labeling with compliance-focused workflows. Start your free trial today.",
  keywords: [
    "label printer uk comparison",
    "kitchen label software comparison",
    "instalabel vs manual labeling",
    "best kitchen label software",
    "kitchen label printer software",
    "natasha's law software",
    "allergen label software",
    "food safety labeling software",
    "kitchen automation software",
    "label printer software UK",
    "instalabel software",
  ],
  openGraph: {
    title: "InstaLabel vs Manual Labeling: Best Kitchen Label Software UK 2025",
    description:
      "Compare InstaLabel software vs manual labeling. See why 500+ UK restaurants choose InstaLabel for 95% faster labeling with compliance-focused workflows. Start your free trial today.",
    url: "https://www.instalabel.co/label-printer-uk-comparison",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel vs Manual Labeling Comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaLabel vs Manual Labeling: Best Kitchen Label Software UK 2025",
    description:
      "Compare InstaLabel software vs manual labeling. See why 500+ UK restaurants choose InstaLabel for 95% faster labeling with compliance-focused workflows. Start your free trial today.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/label-printer-uk-comparison",
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
    name: "InstaLabel vs Manual Labeling Comparison",
    description:
      "Compare InstaLabel software vs manual labeling. See why 500+ UK restaurants choose InstaLabel for 95% faster labeling with compliance-focused workflows. Start your free trial today.",
    url: "https://www.instalabel.co/label-printer-uk-comparison",
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
          name: "Label Printer UK Comparison",
          item: "https://www.instalabel.co/label-printer-uk-comparison",
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
      <LabelPrinterUkComparisonPage />
    </>
  )
}

export default Page

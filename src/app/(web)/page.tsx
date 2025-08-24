import { Homepage } from "@/components/blocks"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kitchen Label Printer UK | Restaurant Allergen Labels",
  description:
    "UK's leading kitchen label printer and allergen label software. HACCP-compliant app for commercial kitchens. Print food safety labels instantly.",
  keywords: [
    "kitchen prep label printer UK",
    "restaurant allergen label software",
    "HACCP label app",
    "commercial kitchen label printer",
    "kitchen labeling system",
    "food safety labels",
    "restaurant labeling",
    "allergen labels",
    "expiry date labels",
    "thermal printer labels",
    "kitchen management",
    "food prep labels",
    "HACCP compliance",
    "restaurant technology",
    "kitchen automation",
    "food labeling software",
    "chef tools",
    "kitchen efficiency",
    "food safety compliance",
    "restaurant management",
    "kitchen organization",
    "food service labels",
    "kitchen printer",
    "restaurant labeling system",
    "Natasha's Law compliance",
    "PPDS labels",
    "kitchen workflow automation",
    "UK restaurant supplies",
    "Bournemouth restaurant supplies",
    "commercial kitchen equipment",
    "food service technology UK",
  ],
  openGraph: {
    title: "Kitchen Label Printer UK | Restaurant Allergen Labels",
    description:
      "UK's leading kitchen label printer and allergen label software. HACCP-compliant app for commercial kitchens. Print food safety labels instantly.",
    url: "https://www.instalabel.co",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kitchen Prep Label Printer UK - Restaurant Allergen Label Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen Label Printer UK | Restaurant Allergen Labels",
    description:
      "UK's leading kitchen label printer and allergen label software. HACCP-compliant app for commercial kitchens.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co",
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

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "InstaLabel - Smart Kitchen Labeling System | Food Safety & Expiry Tracking",
    description:
      "Professional kitchen labeling system for restaurants and food businesses. Print food safety labels, allergen warnings, and expiry dates instantly. Thermal printer compatible and HACCP compliant.",
    url: "https://www.instalabel.co",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.instalabel.co",
        },
      ],
    },
  }

  // Additional structured data for blog content
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kitchen Labeling Blog Articles",
    description: "Comprehensive guides on kitchen labeling, compliance, and food safety",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Article",
          name: "Kitchen Prep Label Printer UK Guide",
          url: "https://www.instalabel.co/blog/kitchen-prep-label-printer-uk-guide",
          description: "Complete guide to kitchen prep label printers for UK restaurants",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Article",
          name: "Restaurant Allergen Label Software Guide",
          url: "https://www.instalabel.co/blog/restaurant-allergen-label-software-comparison",
          description: "Complete buyer's guide for restaurant allergen label software",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Article",
          name: "HACCP Label App Complete Guide",
          url: "https://www.instalabel.co/blog/haccp-label-app-complete-guide",
          description: "Complete guide to HACCP label apps for food safety compliance",
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Article",
          name: "Commercial Kitchen Label Printer Guide",
          url: "https://www.instalabel.co/blog/commercial-kitchen-label-printer-guide",
          description: "Complete buyer's guide for commercial kitchen label printers",
        },
      },
      {
        "@type": "ListItem",
        position: 5,
        item: {
          "@type": "Article",
          name: "Top 5 Labeling Mistakes in Kitchens",
          url: "https://www.instalabel.co/blog/top-5-labeling-mistakes-kitchens-avoid",
          description: "Common kitchen labeling mistakes and how to avoid them",
        },
      },
      {
        "@type": "ListItem",
        position: 6,
        item: {
          "@type": "Article",
          name: "Natasha's Law Guide for Food Businesses",
          url: "https://www.instalabel.co/blog/natashas-law-guide-food-business-compliance",
          description: "Complete guide to Natasha's Law compliance for UK food businesses",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <Homepage />
    </>
  )
}

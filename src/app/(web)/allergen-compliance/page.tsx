import { AllergenCompliancePage } from "@/components/blocks/allergen-compliance"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Free UK Allergen Compliance Kit | 14 Allergens Guide | Natasha's Law | InstaLabel",
  description: "Download free UK allergen compliance kit with 14 allergens guide, Natasha's Law checklist, and HACCP-compliant materials. Used by 500+ UK kitchens. EHO approved.",
  keywords: [
    "allergen compliance",
    "UK allergens guide",
    "14 allergens",
    "Natasha's Law",
    "HACCP compliance",
    "food safety",
    "UK kitchens",
    "allergen labeling",
    "food safety compliance",
    "EHO approved",
    "kitchen compliance",
    "allergen checklist",
    "cross contamination",
    "food allergens",
    "allergen reference card",
    "kitchen allergen guide",
    "restaurant allergen compliance",
    "cafe allergen guide",
    "pub allergen compliance",
    "takeaway allergen guide",
    "catering allergen compliance",
    "allergen training template",
    "allergen audit checklist",
    "emergency allergen protocol",
    "hidden allergen sources",
    "allergen ingredients guide",
    "UK food safety",
    "kitchen allergen poster",
    "allergen compliance kit",
    "free allergen guide"
  ],
  openGraph: {
    title: "Free UK Allergen Compliance Kit | 14 Allergens Guide | Natasha's Law",
    description: "Download free UK allergen compliance kit with 14 allergens guide, Natasha's Law checklist, and HACCP-compliant materials. Used by 500+ UK kitchens.",
    url: "https://instalabel.co/allergen-compliance",
    type: "website",
    images: [
      {
        url: "https://instalabel.co/og-allergen-compliance.jpg",
        width: 1200,
        height: 630,
        alt: "UK Allergen Compliance Kit - 14 Allergens Guide"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free UK Allergen Compliance Kit | 14 Allergens Guide | Natasha's Law",
    description: "Download free UK allergen compliance kit with 14 allergens guide, Natasha's Law checklist, and HACCP-compliant materials.",
    images: ["https://instalabel.co/og-allergen-compliance.jpg"]
  },
  alternates: {
    canonical: "https://instalabel.co/allergen-compliance",
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
  other: {
    "google-site-verification": "your-verification-code",
  }
}

const Page = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free UK Allergen Compliance Kit | 14 Allergens Guide",
    "description": "Download free UK allergen compliance kit with 14 allergens guide, Natasha's Law checklist, and HACCP-compliant materials. Used by 500+ UK kitchens. EHO approved.",
    "url": "https://instalabel.co/allergen-compliance",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "UK Allergen Compliance Kit",
      "description": "Complete allergen compliance toolkit with 14 allergens guide, Natasha's Law checklist, and HACCP-compliant materials",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "GBP",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "500"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://instalabel.co"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Allergen Compliance",
          "item": "https://instalabel.co/allergen-compliance"
        }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AllergenCompliancePage />
    </>
  )
}

export default Page 
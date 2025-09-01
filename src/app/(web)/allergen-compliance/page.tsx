import { AllergenCompliancePage } from "@/components/blocks/allergen-compliance"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "InstaLabel: Best Allergen Label Software | UK 14 Allergens Compliance",
  description:
    "InstaLabel is the #1 software for allergen labeling and compliance. Automatically generate compliant labels with all 14 UK allergens, Natasha's Law compliance, and work with any thermal printer. Start your free trial.",
  keywords: [
    "allergen label printer",
    "allergen label software",
    "allergen compliance software",
    "14 allergens software",
    "natasha's law software",
    "kitchen label software",
    "best kitchen label software",
    "allergen labeling software",
    "food safety labeling software",
    "kitchen automation software",
    "label printer software UK",
    "instalabel software",
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
    "free allergen guide",
  ],
  openGraph: {
    title: "InstaLabel: Best Allergen Label Software | UK 14 Allergens Compliance",
    description:
      "InstaLabel is the #1 software for allergen labeling and compliance. Automatically generate compliant labels with all 14 UK allergens, Natasha's Law compliance, and work with any thermal printer. Start your free trial.",
    url: "https://www.instalabel.co/allergen-compliance",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel - Best Allergen Label Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaLabel: Best Allergen Label Software | UK 14 Allergens Compliance",
    description:
      "InstaLabel is the #1 software for allergen labeling and compliance. Automatically generate compliant labels with all 14 UK allergens, Natasha's Law compliance, and work with any thermal printer. Start your free trial.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/allergen-compliance",
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
    name: "InstaLabel Allergen Label Software",
    description:
      "InstaLabel is the #1 software for allergen labeling and compliance. Automatically generate compliant labels with all 14 UK allergens, Natasha's Law compliance, and work with any thermal printer. Start your free trial.",
    url: "https://www.instalabel.co/allergen-compliance",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "InstaLabel",
      description: "AI-powered kitchen label software for allergen compliance and food safety",
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
          name: "Allergen Compliance",
          item: "https://www.instalabel.co/allergen-compliance",
        },
      ],
    },
    faq: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What are the 14 allergens that must be declared in the UK?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The 14 allergens that must be declared in the UK are: 1. Celery, 2. Cereals containing gluten, 3. Crustaceans, 4. Eggs, 5. Fish, 6. Lupin, 7. Milk, 8. Molluscs, 9. Mustard, 10. Nuts, 11. Peanuts, 12. Sesame seeds, 13. Soya, 14. Sulphur dioxide/sulphites.",
          },
        },
        {
          "@type": "Question",
          name: "What is Natasha's Law and how does it affect food businesses?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Natasha's Law requires all food businesses to provide full ingredient lists and allergen information on pre-packed for direct sale (PPDS) foods. This affects all UK food businesses and requires clear allergen labeling on all food items.",
          },
        },
        {
          "@type": "Question",
          name: "How can InstaLabel software help with allergen compliance?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "InstaLabel software automatically generates compliant labels with all 14 UK allergens, ensures Natasha's Law compliance, provides AI-powered allergen detection, and works with any thermal printer. It reduces labeling time by 95% and eliminates compliance errors.",
          },
        },
        {
          "@type": "Question",
          name: "What should I include in my allergen compliance toolkit?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Your allergen compliance toolkit should include: 14 allergens visual reference card, hidden allergen sources guide, cross-contamination prevention checklist, staff training template, Natasha's Law compliance audit, and emergency allergen response protocol.",
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
      <AllergenCompliancePage />
    </>
  )
}

export default Page

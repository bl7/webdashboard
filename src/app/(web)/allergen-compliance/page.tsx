import { AllergenCompliancePage } from "@/components/blocks/allergen-compliance"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Free UK Allergen Compliance Kit | 14 Allergens Guide | Natasha's Law | InstaLabel",
  description:
    "Download free UK allergen compliance kit with 14 allergens guide, Natasha's Law checklist, and HACCP-compliant materials. Used by 500+ UK kitchens. EHO approved.",
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
    "free allergen guide",
  ],
  openGraph: {
    title: "Free UK Allergen Compliance Kit | 14 Allergens Guide | Natasha's Law",
    description:
      "Download free UK allergen compliance kit with 14 allergens guide, Natasha's Law checklist, and HACCP-compliant materials. Used by 500+ UK kitchens.",
    url: "https://www.instalabel.co/allergen-compliance",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "UK Allergen Compliance Kit - 14 Allergens Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free UK Allergen Compliance Kit | 14 Allergens Guide | Natasha's Law",
    description:
      "Download free UK allergen compliance kit with 14 allergens guide, Natasha's Law checklist, and HACCP-compliant materials.",
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
  other: {
    "google-site-verification": "your-verification-code",
  },
}

const Page = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Free UK Allergen Compliance Kit | 14 Allergens Guide | Natasha's Law | InstaLabel",
    description:
      "Download free UK allergen compliance kit with 14 allergens guide, Natasha's Law checklist, and HACCP-compliant materials. Used by 500+ UK kitchens. EHO approved.",
    url: "https://www.instalabel.co/allergen-compliance",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "UK Allergen Compliance Kit",
      description:
        "Complete allergen compliance toolkit with 14 allergens guide, Natasha's Law checklist, and HACCP-compliant materials",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
      },
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
          name: "How can I ensure my kitchen is compliant with allergen regulations?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "To ensure compliance: 1. Clearly declare all 14 allergens on your menu or food labels, 2. Train staff on allergen awareness, 3. Keep records of allergen information, 4. Have procedures to prevent cross-contamination, 5. Update allergen information when recipes change.",
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

import { FOLDER_SEO } from "@/lib/marketing/folderSeo"
import { AllergenGuidePage } from "@/components/blocks/allergen-guide"
import { Metadata } from "next"
import React from "react"

const description = FOLDER_SEO["/allergen-guide"].description

export const metadata: Metadata = {
  title: { absolute: FOLDER_SEO["/allergen-guide"].title },
  description,
  keywords: [...FOLDER_SEO["/allergen-guide"].keywords],
  openGraph: {
    title: FOLDER_SEO["/allergen-guide"].title,
    description,
    url: "https://www.instalabel.co/allergen-guide",
    type: "article",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel allergen labelling guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: FOLDER_SEO["/allergen-guide"].title,
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/allergen-guide",
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

const faqs = [
  {
    question: "Do all 14 categories go on every label?",
    answer:
      "No. Identify the relevant allergens present and follow the requirements for that food and sales context.",
  },
  {
    question: "Can a “contains” summary replace a PPDS ingredient list?",
    answer:
      "No. Use the PPDS guidance for the ingredient list and allergen emphasis required for that setting.",
  },
  {
    question: "Can we rely on the colour of a printed allergen?",
    answer:
      "Check that the emphasis remains clear on the printer and stock you use. A colour shown in the app may not appear on a monochrome thermal label.",
  },
  {
    question: "Where should we check the detailed rules?",
    answer:
      "Use the current FSA guidance for England, Wales and Northern Ireland and Food Standards Scotland guidance for Scotland.",
  },
]

const Page = () => {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: FOLDER_SEO["/allergen-guide"].title,
      description,
      url: "https://www.instalabel.co/allergen-guide",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AllergenGuidePage />
    </>
  )
}

export default Page

import { AllergenCompliancePage } from "@/components/blocks/allergen-compliance"
import { Metadata } from "next"
import React from "react"

const description =
  "Keep recorded ingredient and allergen information together, review recipe changes and prepare clear labels with InstaLabel."

export const metadata: Metadata = {
  title: { absolute: "Allergen labelling software | InstaLabel" },
  description,
  openGraph: {
    title: "Allergen labelling software | InstaLabel",
    description,
    url: "https://www.instalabel.co/allergen-compliance",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel allergen labelling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Allergen labelling software | InstaLabel",
    description,
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

const faqs = [
  {
    question: "Can InstaLabel find every allergen from a dish name?",
    answer:
      "No dish name provides a complete recipe. Check actual ingredients and supplier information before relying on a label.",
  },
  {
    question: "What happens when a supplier changes?",
    answer:
      "Review the new specification, update the affected records and check subsequent labels. Follow your procedure for items already prepared or labelled.",
  },
  {
    question: "Does a label prevent allergen cross-contact?",
    answer:
      "A label communicates information. Your kitchen still needs appropriate handling, cleaning and separation procedures.",
  },
]

const Page = () => {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Allergen labelling software | InstaLabel",
      description,
      url: "https://www.instalabel.co/allergen-compliance",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ]

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

import { FOLDER_SEO } from "@/lib/marketing/folderSeo"
import { IngredientLabelsPage } from "@/components/blocks/ingredient-labels"
import { Metadata } from "next"
import React from "react"

const title = FOLDER_SEO["/ingredient-labels"].title
const description = FOLDER_SEO["/ingredient-labels"].description

const faqs = [
  {
    question: "Does an ingredient label replace the supplier label?",
    answer:
      "Keep the source information your kitchen needs. A container label supports day-to-day identification.",
  },
  {
    question: "Is 40mm always the correct size?",
    answer:
      "Choose a supported label size that fits the information and remains readable on the container. Check your printer and stock dimensions.",
  },
  {
    question: "Does a printed date prove when the ingredient was opened?",
    answer: "No. Only describe an opening date where the actual workflow records it.",
  },
]

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [...FOLDER_SEO["/ingredient-labels"].keywords],
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/ingredient-labels",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Ingredient labels for kitchen containers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/ingredient-labels",
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
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: "https://www.instalabel.co/ingredient-labels",
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
      <IngredientLabelsPage />
    </>
  )
}

export default Page

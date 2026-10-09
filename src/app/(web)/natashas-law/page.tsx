import { FOLDER_SEO } from "@/lib/marketing/folderSeo"
import { NatashasLawPage } from "@/components/blocks/natashas-law"
import { Metadata } from "next"
import React from "react"

const description = FOLDER_SEO["/natashas-law"].description

const faqs = [
  {
    question: "Is a separate “contains” line enough?",
    answer:
      "It does not replace the full ingredient list with allergen emphasis required for PPDS food.",
  },
  {
    question: "Must I use an 80mm printer?",
    answer:
      "Label width is an equipment and layout choice, not a blanket requirement of Natasha's Law. The information must fit and remain legible.",
  },
  {
    question: "Can I use the sample recipe as a production label?",
    answer:
      "No. Use the actual ingredients, quantities and supplier information for your product and check any additional requirements.",
  },
  {
    question: "Will the software update labels already on products?",
    answer:
      "No. Review affected products and labels through your business's procedure when information changes.",
  },
]

export const metadata: Metadata = {
  title: { absolute: FOLDER_SEO["/natashas-law"].title },
  description,
  keywords: [...FOLDER_SEO["/natashas-law"].keywords],
  openGraph: {
    title: FOLDER_SEO["/natashas-law"].title,
    description,
    url: "https://www.instalabel.co/natashas-law",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "PPDS labels and Natasha's Law",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: FOLDER_SEO["/natashas-law"].title,
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/natashas-law",
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
      name: FOLDER_SEO["/natashas-law"].title,
      description,
      url: "https://www.instalabel.co/natashas-law",
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
      <NatashasLawPage />
    </>
  )
}

export default Page

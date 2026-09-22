import { HaccpLabelsPage } from "@/components/blocks/haccp-labels"
import { Metadata } from "next"
import React from "react"

const description =
  "See how clear item labels and print records can support your kitchen procedures, alongside temperature checks, training and other food-safety records."

const faqs = [
  {
    question: "Does InstaLabel certify my HACCP system?",
    answer: "No. It is a labelling tool, not a certification or inspection service.",
  },
  {
    question: "Does print history prove a food-safety check happened?",
    answer:
      "It records label activity. Use the relevant operational record to demonstrate a temperature check, cleaning task or other control.",
  },
  {
    question: "Can I use handwritten records as well?",
    answer:
      "Your procedures may use different record formats. What matters is that the information and checks meet the requirements of your system.",
  },
]

export const metadata: Metadata = {
  title: { absolute: "Kitchen labels and HACCP procedures | InstaLabel" },
  description,
  openGraph: {
    title: "Kitchen labels and HACCP procedures | InstaLabel",
    description,
    url: "https://www.instalabel.co/haccp-labels",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kitchen labels and HACCP procedures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen labels and HACCP procedures | InstaLabel",
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/haccp-labels",
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
      name: "Kitchen labels and HACCP procedures | InstaLabel",
      description,
      url: "https://www.instalabel.co/haccp-labels",
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
      <HaccpLabelsPage />
    </>
  )
}

export default Page

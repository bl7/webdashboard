import { Metadata } from "next"
import React from "react"
import { PrepLabelsPage } from "@/components/blocks/prep-labels"

const title = "Prep labels for kitchen teams | InstaLabel"
const description =
  "Prepare consistent labels for items made ahead of service, with recorded allergen information and dates from your kitchen's settings."

const faqs = [
  {
    question: "Is this the same as a PPDS label?",
    answer:
      "No. A prep label supports internal kitchen work. PPDS food needs the appropriate customer-facing ingredient information.",
  },
  {
    question: "Does the print timestamp show when preparation happened?",
    answer:
      "Only if those events genuinely coincide and the workflow records it that way. Do not substitute printing time for a required preparation record.",
  },
  {
    question: "Will the label show a batch code?",
    answer:
      "Use the fields supported by your current template. Check the actual output before relying on a batch identifier.",
  },
]

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/prep-labels",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Prep labels for kitchen teams",
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
    canonical: "https://www.instalabel.co/prep-labels",
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
      url: "https://www.instalabel.co/prep-labels",
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
      <PrepLabelsPage />
    </>
  )
}

export default Page

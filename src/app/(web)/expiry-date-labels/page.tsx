import { ExpiryDateLabelsPage } from "@/components/blocks/expiry-date-labels"
import { Metadata } from "next"
import React from "react"

const title = "Expiry date labels for kitchens | InstaLabel"
const description =
  "Print readable date labels using your kitchen's configured rules. Review item details and support everyday stock-rotation checks with InstaLabel."

const faqs = [
  {
    question: "Does InstaLabel choose a safe shelf life for me?",
    answer:
      "No. Your business decides its date rules from the appropriate product information and food-safety procedures.",
  },
  {
    question: "Does reprinting a label restart the item's shelf life?",
    answer:
      "No. A replacement label must reflect the correct original information and applicable dates.",
  },
  {
    question: "Is printing time always preparation time?",
    answer:
      "No. Those are different events. Check which event the selected workflow actually records.",
  },
]

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/expiry-date-labels",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Expiry date labels for kitchens",
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
    canonical: "https://www.instalabel.co/expiry-date-labels",
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
      url: "https://www.instalabel.co/expiry-date-labels",
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
      <ExpiryDateLabelsPage />
    </>
  )
}

export default Page

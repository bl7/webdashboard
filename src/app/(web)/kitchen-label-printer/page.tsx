import { KitchenLabelPrinterPage } from "@/components/blocks/kitchen-label-printer"
import { Metadata } from "next"
import React from "react"

const title = "Kitchen label printer compatibility | InstaLabel"
const description =
  "Check desktop and Android printer requirements for InstaLabel, including PrintBridge and the supported MUNBYN RW411B and Born4Ship DB403 models."

const faqs = [
  {
    question: "Will every Android Bluetooth printer work?",
    answer: "No. Use the supported list above or ask about the exact model.",
  },
  {
    question: "Is RW114B the recommended MUNBYN model?",
    answer:
      "The model confirmed for this release is RW411B. Check the model identifier carefully before purchase.",
  },
  {
    question: "Do I need a specific printer width for Natasha's Law?",
    answer:
      "There is no blanket requirement to use the site's previously advertised 80mm format. Choose a supported layout that presents the applicable information clearly.",
  },
  {
    question: "Can I use a receipt printer?",
    answer:
      "Do not assume receipt-paper capability makes a device suitable for your adhesive label stock. Check the printer's media support, sensing and intended workflow.",
  },
]

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/kitchen-label-printer",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kitchen label printer compatibility",
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
    canonical: "https://www.instalabel.co/kitchen-label-printer",
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
      url: "https://www.instalabel.co/kitchen-label-printer",
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
      <KitchenLabelPrinterPage />
    </>
  )
}

export default Page

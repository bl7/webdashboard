import { PrintBridgePage } from "@/components/blocks/printbridge"
import { Metadata } from "next"
import React from "react"

const description =
  "Connect InstaLabel to a label printer installed on Windows or macOS. Learn the PrintBridge setup steps and how to check your first print."

export const metadata: Metadata = {
  title: { absolute: "PrintBridge desktop label printing | InstaLabel" },
  description,
  openGraph: {
    title: "PrintBridge desktop label printing | InstaLabel",
    description,
    url: "https://www.instalabel.co/printbridge",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "PrintBridge desktop label printing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrintBridge desktop label printing | InstaLabel",
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/printbridge",
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
    question: "Is PrintBridge the Android app?",
    answer:
      "No. PrintBridge is the computer printing connection. Android uses the InstaLabel app and a supported Bluetooth printer.",
  },
  {
    question: "Does local printing mean the whole product works offline?",
    answer:
      "No. The connection to the printer is local, while access to the web app and its data can require internet connectivity. Do not plan an offline workflow without confirming its support.",
  },
  {
    question: "Where do I download it?",
    answer: "Log in to InstaLabel and use the current PrintBridge setup/download area.",
  },
]

const Page = () => {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "PrintBridge desktop label printing | InstaLabel",
      description,
      url: "https://www.instalabel.co/printbridge",
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
      <PrintBridgePage />
    </>
  )
}

export default Page

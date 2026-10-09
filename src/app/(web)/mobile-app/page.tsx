import { FOLDER_SEO } from "@/lib/marketing/folderSeo"
import { MobileAppPage } from "@/components/blocks/mobile-app"
import { Metadata } from "next"
import React from "react"

const description = FOLDER_SEO["/mobile-app"].description

export const metadata: Metadata = {
  title: { absolute: FOLDER_SEO["/mobile-app"].title },
  description,
  keywords: [...FOLDER_SEO["/mobile-app"].keywords],
  openGraph: {
    title: FOLDER_SEO["/mobile-app"].title,
    description,
    url: "https://www.instalabel.co/mobile-app",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel Android kitchen label app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: FOLDER_SEO["/mobile-app"].title,
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/mobile-app",
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
    question: "Is there an iPhone app?",
    answer: "This page covers the Android app. No iOS app is being offered here.",
  },
  {
    question: "Will any Bluetooth printer work?",
    answer: "No. Use a supported model or ask us about your exact printer before purchasing.",
  },
  {
    question: "Do I need PrintBridge on Android?",
    answer:
      "No. PrintBridge is for computer printing; the Android app uses its supported mobile printing connection.",
  },
  {
    question: "Can I rely on it without internet?",
    answer:
      "Confirm the current app's connectivity requirements for your workflow before planning offline use. Offline operation is not promised on this page.",
  },
]

const Page = () => {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: FOLDER_SEO["/mobile-app"].title,
      description,
      url: "https://www.instalabel.co/mobile-app",
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
      <MobileAppPage />
    </>
  )
}

export default Page

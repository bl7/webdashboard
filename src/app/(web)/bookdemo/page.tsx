import { BookDemo } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

const description =
  "See item setup, label previews and desktop or Android printing in an InstaLabel demo. Tell us about your kitchen and printer setup."

export const metadata: Metadata = {
  title: { absolute: "Book an InstaLabel demo" },
  description,
  openGraph: {
    title: "Book an InstaLabel demo",
    description,
    url: "https://www.instalabel.co/bookdemo",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Book an InstaLabel demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book an InstaLabel demo",
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/bookdemo",
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
    question: "Do I need to create an account first?",
    answer: "You can request a demo using the form on this page.",
  },
  {
    question: "Can you discuss our existing printer?",
    answer: "Yes. Include the exact model and whether you use Windows, macOS or Android.",
  },
  {
    question: "Is submitting the form a confirmed appointment?",
    answer: "No. We will contact you to arrange a suitable time.",
  },
]

const Page = () => {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Book an InstaLabel demo",
      description,
      url: "https://www.instalabel.co/bookdemo",
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
      <BookDemo />
    </>
  )
}

export default Page

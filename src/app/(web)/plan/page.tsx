import { Plan } from "@/components/blocks/plan"
import { Metadata } from "next"
import React from "react"

const description =
  "Review InstaLabel's subscription, monthly and annual billing options, trial terms and printing requirements before starting."

export const metadata: Metadata = {
  title: { absolute: "Pricing | InstaLabel kitchen labelling software" },
  description,
  openGraph: {
    title: "Pricing | InstaLabel kitchen labelling software",
    description,
    url: "https://www.instalabel.co/plan",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel kitchen labelling pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | InstaLabel kitchen labelling software",
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/plan",
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
    question: "Can I compare monthly and annual billing?",
    answer:
      "Yes. Switch the billing interval to see the amount charged and, for annual billing, the equivalent monthly cost.",
  },
  {
    question: "Can I check my printer first?",
    answer:
      "Yes. Use the printer compatibility guide or contact us with your exact model and operating system.",
  },
  {
    question: "Can I see the product before signing up?",
    answer: "Yes. Book a demo to see item setup, label previews and printing.",
  },
  {
    question: "Where are the subscription conditions?",
    answer:
      "Review the terms presented with your selected plan before subscribing. New subscriptions start with a 14-day trial. Payment details are collected at checkout, there is no charge during the trial, and billing continues at the selected interval after the trial until you cancel. You may cancel at any time.",
  },
]

const Page = () => {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Pricing | InstaLabel kitchen labelling software",
      description,
      url: "https://www.instalabel.co/plan",
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
      <Plan />
    </>
  )
}

export default Page

import { FOLDER_SEO } from "@/lib/marketing/folderSeo"
import { Plan } from "@/components/blocks/plan"
import type { PublicPlan } from "@/components/blocks/plan/sections/PlanBody"
import { Metadata } from "next"
import React from "react"

export const dynamic = "force-dynamic"

async function getInitialPlan(): Promise<PublicPlan | null> {
  try {
    const pool = (await import("@/lib/pg")).default
    const result = await pool.query(
      `SELECT id, name, price_monthly, price_yearly, description
       FROM plans
       WHERE is_active = true
       ORDER BY price_monthly ASC`
    )
    const rows = result.rows as PublicPlan[]
    return rows.find((item) => item.name === "One Stop") ?? rows[0] ?? null
  } catch {
    return null
  }
}

const description = FOLDER_SEO["/plan"].description

export const metadata: Metadata = {
  title: { absolute: FOLDER_SEO["/plan"].title },
  description,
  keywords: [...FOLDER_SEO["/plan"].keywords],
  openGraph: {
    title: FOLDER_SEO["/plan"].title,
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
    title: FOLDER_SEO["/plan"].title,
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
      "Review the terms presented with your selected plan before subscribing. New subscriptions start with a 14-day trial. Until 10 January 2027, a new customer can use the Christmas offer instead: 60 days free, and 30% off the first annual payment. Payment details are collected at checkout, there is no charge during the trial, and billing continues at the selected interval after the trial until you cancel. You may cancel at any time.",
  },
]

const Page = async () => {
  const initialPlan = await getInitialPlan()
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
      <Plan initialPlan={initialPlan} />
    </>
  )
}

export default Page

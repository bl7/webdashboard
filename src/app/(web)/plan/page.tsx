import { FOLDER_SEO } from "@/lib/marketing/folderSeo"
import { Plan } from "@/components/blocks/plan"
import type { PublicPlan } from "@/components/blocks/plan/sections/PlanBody"
import { CHRISTMAS_OFFER_COPY, isChristmasOfferActive, planConditionsAnswer } from "@/lib/marketing/trialOffer"
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

export async function generateMetadata(): Promise<Metadata> {
  const offerOn = isChristmasOfferActive()
  const title = offerOn ? "InstaLabel Pricing: £15.99/Month & 60 Days Free" : FOLDER_SEO["/plan"].title
  const description = offerOn ? CHRISTMAS_OFFER_COPY : FOLDER_SEO["/plan"].description
  return {
  title: { absolute: title },
  description,
  keywords: [...FOLDER_SEO["/plan"].keywords],
  openGraph: {
    title,
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
    title,
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

const Page = async () => {
  const initialPlan = await getInitialPlan()
  const offerOn = isChristmasOfferActive()
  const description = offerOn ? CHRISTMAS_OFFER_COPY : FOLDER_SEO["/plan"].description
  const liveFaqs = faqs.map((faq) =>
    faq.question === "Where are the subscription conditions?"
      ? { ...faq, answer: planConditionsAnswer() }
      : faq
  )
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
      mainEntity: liveFaqs.map((faq) => ({
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

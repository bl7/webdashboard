import React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQs | InstaLabel Kitchen Labeling",
  description:
    "Find answers to common questions about InstaLabel's kitchen labeling system, food safety compliance, thermal printer support, and restaurant labeling features.",
  keywords: [
    "InstaLabel FAQ",
    "kitchen labeling questions",
    "food safety compliance FAQ",
    "restaurant labeling help",
    "thermal printer support",
    "kitchen management FAQ",
    "allergen labeling questions",
    "HACCP compliance help",
    "restaurant technology FAQ",
    "kitchen automation questions",
  ],
  openGraph: {
    title: "FAQs | InstaLabel Kitchen Labeling",
    description:
      "Find answers to common questions about InstaLabel's kitchen labeling system, food safety compliance, thermal printer support, and restaurant labeling features.",
    url: "https://www.instalabel.co/faqs",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel FAQ - Kitchen Labeling Questions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQs | InstaLabel Kitchen Labeling",
    description: "Find answers to common questions about InstaLabel's kitchen labeling system.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/faqs",
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

const faqsList = [
  {
    q: "What is InstaLabel?",
    a: "InstaLabel is a professional kitchen labeling system designed for restaurants, cafés, food trucks, and catering businesses. It lets you print food safety labels—prep, cook, use‑first, PPDS—instantly from any device without handwriting, fully compliant with regulations like Natasha’s Law.",
  },
  {
    q: "Who benefits most from InstaLabel?",
    a: "Food operations of all sizes benefit—especially those with busy prep areas, high staff turnover, or needing airtight compliance. Ideal for multi‑location kitchens striving to reduce waste and errors.",
  },
  {
    q: "How does InstaLabel ensure compliance?",
    a: "All labels include auto-calculated prep dates and expiry, highlight allergens (Natasha’s Law), and use FDA/EHO-approved templates. The system generates complete print logs for easy audits.",
  },
  {
    q: "Which label types are supported?",
    a: (
      <ul className="ml-6 list-disc">
        <li>Prep, Cook, Use-First, Defrost, and PPDS labels</li>
        <li>
          Each includes ingredients, allergen alerts, prep/expiry dates, and storage instructions
        </li>
      </ul>
    ),
  },
  {
    q: "What equipment do I need?",
    a: "Just any USB thermal label printer for web printing—or Android devices for mobile printing. Any TSPL compliant hardware will work.",
  },
  {
    q: "How fast is setup and printing?",
    a: "You can get started in minutes: upload your menu or ingredient list, plug in your printer, select the label type, and print—no drivers or plugins needed.",
  },
  {
    q: "Can I override expiry dates?",
    a: "Yes—InstaLabel lets you adjust or override expiry logic when needed, while keeping full logging for traceability.",
  },
  {
    q: "What results can I expect?",
    a: "Restaurants save about 15+ hours per week, reduce waste by 30%, and avoid compliance fines—all typically paying back in the first month.",
  },
  {
    q: "Is there a trial available?",
    a: "Yes! Try InstaLabel free for 14 days—no credit card required—with full access to features and existing printer support.",
  },
]

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="my-8 text-3xl font-bold">Frequently Asked Questions</h1>
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">Common Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqsList.map((item, idx) => (
          <AccordionItem key={item.q} value={(idx + 1).toString()}>
            <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
            <AccordionContent className="text-lg text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  )
}

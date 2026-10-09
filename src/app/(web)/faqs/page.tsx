import { FOLDER_SEO } from "@/lib/marketing/folderSeo"
import { FaqsPage } from "@/components/blocks/faqs/faqs"
import { formatAndroidPrinters, TRIAL_PERIOD_DAYS } from "@/lib/marketing/site"
import { Metadata } from "next"
import React from "react"

const title = FOLDER_SEO["/faqs"].title
const description = FOLDER_SEO["/faqs"].description

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [...FOLDER_SEO["/faqs"].keywords],
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/faqs",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Frequently asked questions",
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

const faqs = [
  {
    question: "What is InstaLabel?",
    answer:
      "InstaLabel is kitchen labelling software for recording item information, preparing labels and printing through a desktop or supported Android setup.",
  },
  {
    question: "Which kitchens is it intended for?",
    answer:
      "Restaurants, cafés, takeaways and catering teams that need a consistent process for identifying ingredients, prepared items and food packed for direct sale.",
  },
  {
    question: "Which label workflows can I use?",
    answer:
      "Explore ingredient, prep, cooked, defrost, date/stock-rotation and PPDS workflows. The fields vary by label type; see the example for the workflow you need. Kitchen workflows.",
  },
  {
    question: "Can I import existing item information?",
    answer:
      "Yes. Use the current CSV import template and review the imported information before printing. CSV import.",
  },
  {
    question: "Does InstaLabel guarantee compliance?",
    answer:
      "No. It helps you create consistent labels from recorded information. Your food business remains responsible for the accuracy of that information and the procedures and requirements that apply to it.",
  },
  {
    question: "Does allergen information still need to be checked?",
    answer:
      "Yes. Check the actual recipe and supplier information, including substitutions and compound ingredients. A dish name is not a complete recipe.",
  },
  {
    question: "How are dates calculated?",
    answer:
      "InstaLabel uses the applicable configured date settings. Your kitchen decides those settings through its food-safety procedures; the software does not measure freshness.",
  },
  {
    question: "Can I change or reprint an expiry date?",
    answer:
      "Any correction must follow your kitchen's procedure and preserve the item's true history. Reprinting does not restart shelf life. Ask about the current workflow if you need a specific date-control function.",
  },
  {
    question: "Does print history replace our other kitchen records?",
    answer:
      "No. It shows recorded label activity. Keep the cooking, storage, supplier and other records your procedures require.",
  },
  {
    question: "What is the allergen matrix?",
    answer:
      "It is a printable view of the 14 regulated allergen categories recorded across the menu items you select. Review the included items and current source information before exporting it.",
  },
  {
    question: "Does the matrix replace a PPDS ingredient label?",
    answer:
      "No. A matrix and a PPDS label serve different contexts. PPDS food needs the applicable food name, full ingredient list and allergen emphasis. Check how the food is packed and sold before choosing the output.",
  },
  {
    question: "What do I need for computer printing?",
    answer:
      "A Windows or macOS computer, a label printer installed in the operating system, suitable label stock and PrintBridge. Check the setup and print a test label. Desktop printing.",
  },
  {
    question: "Which printers work with Android?",
    answer: `The models confirmed for this release are ${formatAndroidPrinters("and")}. Ask about any other exact model before buying it. Printer compatibility.`,
  },
  {
    question: "Does any Bluetooth printer work?",
    answer:
      "No. Bluetooth is a connection method, not a guarantee that the app supports the printer.",
  },
  {
    question: "Can I work without internet?",
    answer:
      "Do not assume the complete workflow works offline because the printer connection is local. Check the connectivity requirements for the current web or Android workflow before relying on it during an outage.",
  },
  {
    question: "Which label sizes does InstaLabel print?",
    answer:
      "60×40 mm and 56×80 mm. Both sizes can carry default, prep, cooked, defrost, use-first and PPDS labels. Choose the size that fits the printer and the amount of information on the label.",
  },
  {
    question: "Is a printer included?",
    answer:
      "No. Desktop printing uses a label printer already installed on Windows or macOS. Android printing uses a MUNBYN RW411B, Born4Ship DB403 or Rongta RP425.",
  },
  {
    question: "How long does setup take?",
    answer:
      "It depends on your printer setup and how much item information needs preparing. Start with a small group of items and check a test print before rolling the workflow out to your team.",
  },
  {
    question: "Is there a trial?",
    answer: `Yes. You can try InstaLabel for ${TRIAL_PERIOD_DAYS} days. Review the trial and billing terms before starting. Pricing.`,
  },
  {
    question: "How do I judge whether it suits my kitchen?",
    answer:
      "Trial a few representative items. Check information entry, label readability, printer setup and the steps your team needs to complete the task. Use those observations to assess the fit.",
  },
  {
    question: "Can I see it before signing up?",
    answer:
      "Yes. Request a demo and tell us which workflow or printer setup you want to discuss. Book a demo.",
  },
  {
    question: "Does InstaLabel make my kitchen legally compliant?",
    answer:
      "No. It prints labels from the information you save. Your business checks recipes, supplier information and dates, and remains responsible for the labelling that applies to the food.",
  },
  {
    question: "Does InstaLabel run a HACCP system?",
    answer:
      "No. It records temperature checks for equipment, food and deliveries, and the cleaning tasks you schedule. It does not certify the kitchen or replace the rest of your food-safety procedures.",
  },
  {
    question: "Does InstaLabel decide shelf life?",
    answer:
      "No. Your kitchen sets the date rules. InstaLabel applies those settings when it prepares the label.",
  },
]

const Page = () => {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: "https://www.instalabel.co/faqs",
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
      <FaqsPage />
    </>
  )
}

export default Page

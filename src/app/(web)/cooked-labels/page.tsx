import { Metadata } from "next"
import { CookedLabelsPage } from "@/components/blocks/cooked-labels"

const title = "Cooked food labels for kitchens | InstaLabel"
const description =
  "Keep cooked batches identifiable with consistent labels, recorded allergen information and clear dates, alongside your kitchen's cooking records."

const faqs = [
  {
    question: "Does this label measure cooking temperature?",
    answer:
      "No. Printing a label does not measure temperature. Use the monitoring process required by your kitchen.",
  },
  {
    question: "Is the printed date the cooked date?",
    answer:
      "Not automatically. Describe the actual event a field records; do not infer one from the other.",
  },
  {
    question: "Does it replace a HACCP record?",
    answer:
      "It may form part of your records, but does not replace the wider checks and evidence your procedure requires.",
  },
]

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/cooked-labels",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Cooked food labels for kitchens",
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
    canonical: "https://www.instalabel.co/cooked-labels",
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

export default function Page() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: "https://www.instalabel.co/cooked-labels",
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
      <CookedLabelsPage />
    </>
  )
}

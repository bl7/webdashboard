import type { Metadata } from "next"
import { DissolvableKitchenLabelsPage } from "@/components/blocks/dissolvable-kitchen-labels/dissolvable-kitchen-labels"

const title = "Dissolvable kitchen labels and printer compatibility | InstaLabel"
const description =
  "Learn what to check before using dissolvable label stock with kitchen labelling software, including printer fit, application conditions and removal."

const faqs = [
  {
    question: "Will any dissolvable label work in a thermal printer?",
    answer:
      "Do not assume so. Confirm that the specific stock supports your printing method and printer requirements.",
  },
  {
    question: "Does dissolvable stock make a label PPDS compliant?",
    answer: "No. The material and the food-information requirements are separate questions.",
  },
  {
    question: "Does InstaLabel guarantee washing performance?",
    answer:
      "No material-performance promise is made on this page. Use the stock supplier's specifications and your own application test.",
  },
]

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/dissolvable-kitchen-labels",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Dissolvable kitchen labels and printer compatibility",
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
    canonical: "https://www.instalabel.co/dissolvable-kitchen-labels",
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
      url: "https://www.instalabel.co/dissolvable-kitchen-labels",
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
      <DissolvableKitchenLabelsPage />
    </>
  )
}

export default Page

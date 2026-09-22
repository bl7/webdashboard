import type { Metadata } from "next"
import { DefrostLabelsPage } from "@/components/blocks/defrost-labels/defrost-labels"

const title = "Defrost labels for kitchen workflows | InstaLabel"
const description =
  "Identify food moving through your defrosting procedure, review the applicable dates and print clear item information with InstaLabel."

const faqs = [
  {
    question: "Does InstaLabel know when food has fully defrosted?",
    answer:
      "A printed label does not measure that condition. Follow your kitchen's checks and record the actual event.",
  },
  {
    question: "Can the printed date stand in for the defrost start time?",
    answer:
      "Only where the workflow and procedure accurately make those the same event. Otherwise keep them distinct.",
  },
  {
    question: "Does a new label extend the use period?",
    answer:
      "No. Check the original information and the applicable date rule before replacing a label.",
  },
]

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/defrost-labels",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Defrost labels for kitchen workflows",
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
    canonical: "https://www.instalabel.co/defrost-labels",
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

export default function DefrostLabels() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: "https://www.instalabel.co/defrost-labels",
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
      <DefrostLabelsPage />
    </>
  )
}

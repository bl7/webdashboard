import { FOLDER_SEO } from "@/lib/marketing/folderSeo"
import type { Metadata } from "next"
import { UseFirstLabelsPage } from "@/components/blocks/use-first-labels/use-first-labels"

const title = FOLDER_SEO["/use-first-labels"].title
const description = FOLDER_SEO["/use-first-labels"].description

const faqs = [
  {
    question: "Does a Use First label change the shelf life?",
    answer: "No. It does not calculate, extend or replace the date on the item.",
  },
  {
    question: "Does it record allergens?",
    answer: "No. Allergen information stays on the item's own label and records.",
  },
  {
    question: "Can it go on any container?",
    answer:
      "Only the container the team should use next. Moving the marker to a different product does not transfer that product's date.",
  },
]

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [...FOLDER_SEO["/use-first-labels"].keywords],
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/use-first-labels",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Use First labels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: { canonical: "https://www.instalabel.co/use-first-labels" },
  robots: { index: true, follow: true },
}

export default function UseFirstLabels() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: "https://www.instalabel.co/use-first-labels",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <UseFirstLabelsPage />
    </>
  )
}

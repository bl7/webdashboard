import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"

const title = "Restaurant allergen matrix | InstaLabel"
const description =
  "Build a 14-allergen matrix from the item records you already use for labels. A blank cell means nothing is recorded there, not that the food is allergen-free."

const categories = [
  "Celery",
  "Cereals containing gluten",
  "Crustaceans",
  "Eggs",
  "Fish",
  "Lupin",
  "Milk",
  "Molluscs",
  "Mustard",
  "Nuts",
  "Peanuts",
  "Sesame",
  "Soya",
  "Sulphur dioxide and sulphites",
]

const faqs = [
  {
    question: "Does a blank cell mean the dish is free from that allergen?",
    answer: "No. A blank cell means nothing is recorded there. Check the recipe and the supplier information.",
  },
  {
    question: "Does the matrix replace a PPDS label?",
    answer:
      "No. Prepacked-for-direct-sale food needs its own food name, ingredient list and allergen emphasis.",
  },
  {
    question: "Where do the entries come from?",
    answer:
      "From the ingredient and menu records saved for labels. Review them before you export the PDF or share it.",
  },
]

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/allergen-matrix",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Allergen matrix",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: { canonical: "https://www.instalabel.co/allergen-matrix" },
  robots: { index: true, follow: true },
}

export default function AllergenMatrixPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: "https://www.instalabel.co/allergen-matrix",
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
      <section className="bg-mkt-canvas px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-3xl">
          <p className="text-sm font-medium text-mkt-ink">Allergen matrix</p>
          <h1 className="mt-3 font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl">
            See the allergens recorded across your dishes.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-mkt-ink8">
            The matrix uses the same saved item records as your labels. It covers the 14 regulated
            allergen categories. You can export a PDF after you have checked the records.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
              <Link href="/register">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/allergen-guide">Allergen guide</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-mkt-ink">The 14 categories</h2>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {categories.map((name) => (
              <li key={name} className="rounded-lg border border-mkt-steel1 px-4 py-3 text-mkt-ink">
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-base leading-relaxed text-mkt-ink8">
            A blank cell means nothing is recorded for that dish and category. It does not mean the
            food is allergen-free. Check the recipe and the supplier information before anyone
            relies on the matrix.
          </p>
          <p className="mt-4 text-base leading-relaxed text-mkt-ink8">
            A matrix is not a PPDS label. Food packed for direct sale still needs its food name,
            ingredient list and allergen emphasis.{" "}
            <Link href="/natashas-law" className="font-semibold text-mkt-teal hover:underline">
              PPDS labels
            </Link>
            .
          </p>
          <p className="mt-4 text-base leading-relaxed text-mkt-ink8">
            The same records are explained on the{" "}
            <Link href="/allergen-compliance" className="font-semibold text-mkt-teal hover:underline">
              allergen labelling
            </Link>{" "}
            page.
          </p>
        </div>
      </section>
    </>
  )
}

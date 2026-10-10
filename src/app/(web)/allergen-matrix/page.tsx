import { AllergenMatrixHeroChart } from "@/components/marketing/AllergenMatrixTool"
import { FOLDER_SEO } from "@/lib/marketing/folderSeo"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"

const title = FOLDER_SEO["/allergen-matrix"].title
const description = FOLDER_SEO["/allergen-matrix"].description

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
  keywords: [...FOLDER_SEO["/allergen-matrix"].keywords],
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
      <section className="relative flex min-h-screen items-center overflow-hidden bg-mkt-canvas px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
        <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-mkt-steel1 opacity-60 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-mkt-ink opacity-10 blur-3xl" />
        <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-mkt-canvas opacity-80 blur-3xl" />
        <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
          <div className="w-full max-w-2xl space-y-6 text-center md:text-left">
            <div className="inline-flex items-center rounded-full bg-mkt-canvas px-4 py-2 text-sm font-medium text-mkt-ink ring-1 ring-mkt-steel1">
              Allergen matrix
            </div>
            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl lg:text-6xl">
              An allergen matrix from the item records you already use.
            </h1>
            <p className="max-w-xl text-base text-mkt-ink8 sm:text-lg md:text-xl">
              The matrix uses the same saved item records as your labels. It covers the 14 regulated
              allergen categories. A restaurant allergen matrix can be downloaded as an allergen
              matrix PDF after you have checked the records.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
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
          <div className="w-full max-w-[720px]">
            <AllergenMatrixHeroChart />
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)" }}         />
      </section>
      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-mkt-ink">Build one without an account.</h2>
          <p className="mt-4 text-base leading-relaxed text-mkt-ink8">
            The free chart is on the tools page. Add your dishes, then download the same PDF the
            dashboard generates.
          </p>
          <p className="mt-4">
            <Link href="/tools" className="font-semibold text-mkt-teal hover:underline">
              Open the free allergen matrix
            </Link>
          </p>
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

import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import { ANDROID_PRINTERS } from "@/lib/marketing/site"

const title = "Supported printers for InstaLabel"
const description =
  "Desktop printing uses a label printer installed on Windows or macOS through PrintBridge. Android printing supports the MUNBYN RW411B, Born4Ship DB403 and Rongta RP425."

const androidRows = [
  ["MUNBYN", "RW411B"],
  ["Born4Ship", "DB403"],
  ["Rongta", "RP425"],
] as const

const faqs = [
  {
    question: "Will every USB or Bluetooth printer work?",
    answer:
      "No. On a computer, the printer has to be installed and able to print from Windows or macOS. On Android, only the listed models are supported.",
  },
  {
    question: "Is RW114B the supported MUNBYN model?",
    answer: "No. The supported MUNBYN model is the RW411B.",
  },
  {
    question: "Does InstaLabel include a printer?",
    answer: "No. You use a printer you already have, within the desktop or Android route above.",
  },
]

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/printer-compatibility",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Printer compatibility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: { canonical: "https://www.instalabel.co/printer-compatibility" },
  robots: { index: true, follow: true },
}

export default function PrinterCompatibilityPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: "https://www.instalabel.co/printer-compatibility",
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
          <p className="text-sm font-medium text-mkt-ink">Printer compatibility</p>
          <h1 className="mt-3 font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl">
            Check the printer before you buy.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-mkt-ink8">
            InstaLabel does not include a printer. On Windows or macOS, PrintBridge uses a label
            printer installed on the computer. On Android, the app prints to the models listed
            below. Label sizes are 60 × 40 mm and 56 × 80 mm.
          </p>
          <div className="mt-8">
            <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
              <Link href="/register">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-4xl overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="mb-4 text-left text-3xl font-black tracking-tight text-mkt-ink">
              Supported setups
            </caption>
            <thead className="border-b border-mkt-steel1">
              <tr>
                <th className="py-3 pr-4 font-semibold text-mkt-ink">Platform</th>
                <th className="py-3 pr-4 font-semibold text-mkt-ink">Printer</th>
                <th className="py-3 pr-4 font-semibold text-mkt-ink">Connection</th>
                <th className="py-3 font-semibold text-mkt-ink">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-mkt-steel1 align-top">
                <td className="py-3 pr-4 text-mkt-ink">Windows or macOS</td>
                <td className="py-3 pr-4 text-mkt-ink8">Label printer installed on the computer</td>
                <td className="py-3 pr-4 text-mkt-ink8">PrintBridge</td>
                <td className="py-3 text-mkt-ink8">
                  Supported when that computer can print to it. The driver, label size and stock
                  still have to be set up.
                </td>
              </tr>
              {androidRows.map(([brand, model]) => (
                <tr key={model} className="border-b border-mkt-steel1 align-top">
                  <td className="py-3 pr-4 text-mkt-ink">Android</td>
                  <td className="py-3 pr-4 text-mkt-ink8">
                    {brand} {model}
                  </td>
                  <td className="py-3 pr-4 text-mkt-ink8">Bluetooth</td>
                  <td className="py-3 text-mkt-ink8">Supported</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-6 text-sm leading-relaxed text-mkt-ink8">
            Android models on this page: {ANDROID_PRINTERS.join(", ")}. Any other Bluetooth printer
            is not supported. Setup notes are on{" "}
            <Link href="/printbridge" className="font-semibold text-mkt-teal hover:underline">
              desktop printing
            </Link>{" "}
            and the{" "}
            <Link href="/mobile-app" className="font-semibold text-mkt-teal hover:underline">
              Android app
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}

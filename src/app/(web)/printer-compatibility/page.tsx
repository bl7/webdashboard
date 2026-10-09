import { FOLDER_SEO } from "@/lib/marketing/folderSeo"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import { ANDROID_PRINTERS } from "@/lib/marketing/site"

const title = FOLDER_SEO["/printer-compatibility"].title
const description = FOLDER_SEO["/printer-compatibility"].description

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
  keywords: [...FOLDER_SEO["/printer-compatibility"].keywords],
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
      <section className="relative flex min-h-screen items-center overflow-hidden bg-mkt-canvas px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
        <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-mkt-steel1 opacity-60 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-mkt-ink opacity-10 blur-3xl" />
        <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-mkt-canvas opacity-80 blur-3xl" />
        <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
          <div className="w-full max-w-2xl space-y-6 text-center md:text-left">
            <div className="inline-flex items-center rounded-full bg-mkt-canvas px-4 py-2 text-sm font-medium text-mkt-ink ring-1 ring-mkt-steel1">
              Printer compatibility
            </div>
            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl lg:text-6xl">
              Check your InstaLabel printer compatibility.
            </h1>
            <p className="max-w-xl text-base text-mkt-ink8 sm:text-lg md:text-xl">
              InstaLabel does not include a printer. On Windows or macOS, PrintBridge uses a label
              printer installed on the computer. On Android, the app prints to the models listed
              below. Label sizes are 60 × 40 mm and 56 × 80 mm.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
                <Link href="/register">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/bookdemo">Book a demo</Link>
              </Button>
            </div>
          </div>
          <div className="w-full max-w-[500px]">
            <div className="overflow-hidden rounded-lg border border-mkt-steel1 bg-white shadow-lg">
              <Image
                src="/marketing/installed-printer.png"
                alt="A label printer installed beside a kitchen computer"
                width={1000}
                height={750}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)" }} />
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

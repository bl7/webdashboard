import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import featureHeroImg from "@/assets/images/featurehero.png"
import { Metadata } from "next"

const title = "Kitchen labelling guides | InstaLabel"
const description =
  "Find practical guides to kitchen workflows, allergens, PPDS labels, printer setup and label materials from InstaLabel."

const featured = [
  {
    title: "Which label does this task need?",
    excerpt:
      "Follow the workflows for storing ingredients, preparing items, identifying cooked batches, defrosting and packing food for sale.",
    href: "/uses",
  },
  {
    title: "Understanding PPDS labels",
    excerpt:
      "Check the PPDS context and the ingredient information to review before printing a label for direct sale.",
    href: "/natashas-law",
  },
  {
    title: "Choosing a printer setup",
    excerpt:
      "Compare desktop and Android printing routes and check the equipment your kitchen needs.",
    href: "/kitchen-label-printer",
  },
]

const browse = [
  {
    title: "Allergen reference and practice quiz",
    excerpt:
      "Review the regulated allergen categories and practise common information-checking decisions.",
    href: "/allergen-guide",
  },
  {
    title: "Labels within your HACCP procedures",
    excerpt:
      "Understand what a label records and how it fits alongside the other checks in your food-safety system.",
    href: "/haccp-labels",
  },
  {
    title: "Choosing kitchen label materials",
    excerpt:
      "Check stock, printer fit, application conditions and removal before buying labels in quantity.",
    href: "/dissolvable-kitchen-labels",
  },
  {
    title: "Making date rules readable",
    excerpt:
      "Understand configured dates, label checks and stock rotation without confusing printing time with food preparation.",
    href: "/expiry-date-labels",
  },
  {
    title: "Compare labelling methods",
    excerpt:
      "Compare how handwritten labels, printer templates and connected software handle everyday labelling work.",
    href: "/label-printer-uk-comparison",
  },
  {
    title: "Questions about InstaLabel",
    excerpt: "Find answers about item information, printing, setup and getting started.",
    href: "/faqs",
  },
]

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: "https://www.instalabel.co/blog",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kitchen labelling guides",
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
    canonical: "https://www.instalabel.co/blog",
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

export default function BlogPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: "https://www.instalabel.co/blog",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-mkt-canvas px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
        <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-mkt-steel1 opacity-50 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-mkt-ink opacity-10 blur-3xl" />
        <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-10 md:flex-row md:gap-16">
          <div className="w-full max-w-2xl space-y-6 text-center md:text-left">
            <div className="inline-flex items-center rounded-full bg-mkt-canvas px-4 py-2 text-sm font-medium text-mkt-ink ring-1 ring-mkt-steel1">
              Guides
            </div>
            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl lg:text-6xl">
              Practical guides for clearer kitchen labelling.
            </h1>
            <p className="max-w-xl text-base text-mkt-ink8 sm:text-lg md:text-xl">
              Find help with label workflows, ingredient information, printer setup and choosing
              suitable label materials.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
                <Link href="/features">
                  Explore features
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/bookdemo">Book a demo</Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-xs sm:max-w-md md:max-w-lg">
            <Image
              src={featureHeroImg}
              alt="InstaLabel kitchen labelling product screen"
              width={1024}
              height={1024}
              className="w-full"
              priority
            />
          </div>
        </div>
        <div className="mkt-hero-fade pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full" />
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            Start with the question you need to answer.
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {featured.map((card) => (
              <article
                key={card.href}
                className="flex flex-col justify-between rounded-xl border border-mkt-steel1 bg-mkt-canvas p-6"
              >
                <div>
                  <h3 className="mb-3 text-xl font-bold text-mkt-ink">{card.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-mkt-ink8">{card.excerpt}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="self-start px-0 text-mkt-teal hover:bg-transparent hover:text-mkt-ink"
                  asChild
                >
                  <Link href={card.href}>
                    Read guide
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            Find a practical reference.
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {browse.map((card) => (
              <article
                key={card.href}
                className="flex flex-col justify-between rounded-xl border border-mkt-steel1 bg-white p-6"
              >
                <div>
                  <h3 className="mb-3 text-lg font-bold text-mkt-ink">{card.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-mkt-ink8">{card.excerpt}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="self-start px-0 text-mkt-teal hover:bg-transparent hover:text-mkt-ink"
                  asChild
                >
                  <Link href={card.href}>
                    Read guide
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            See the workflow in the product.
          </h2>
          <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
            Explore how InstaLabel turns recorded item information into a printable label.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
              <Link href="/features">
                Explore features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/bookdemo">Book a demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

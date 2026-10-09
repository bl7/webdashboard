import { CAMPAIGN_END_LABEL, CAMPAIGN_END_MS, getCampaignCode } from "@/lib/campaignOffer"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import "./christmas.css"
import { Decor } from "./Decor"
import { RememberOfferCode } from "./RememberOfferCode"

const included = [
  {
    title: "Kitchen labelling",
    body: "Item, ingredient and date information stays in one place. Staff pick the job, check what is saved, and print.",
  },
  {
    title: "Allergen information",
    body: "Saved allergen information can be carried onto the label. You still check the current recipe and supplier information.",
  },
  {
    title: "Cleaning checklists",
    body: "Schedule the cleaning tasks the kitchen already runs. Staff mark them done, and you can open or print that day’s checklist.",
  },
  {
    title: "Temperature checks",
    body: "Record equipment, food and delivery temperatures in the compliance diary, separate from the cleaning checklist.",
  },
]

const PAGE_URL = "https://www.instalabel.co/christmas"
const OFFER_END = "2027-01-10T23:59:59+00:00"

const faqs = [
  {
    question: "What does the Christmas offer include?",
    answer:
      "New customers get 60 days free. On an annual plan, the first payment is also 30% off. The following renewal is the full price.",
  },
  {
    question: "Does the 30% apply to a monthly plan?",
    answer: "A monthly plan gets 60 days free, then the normal monthly price. The 30% applies to the annual plan.",
  },
  {
    question: "Who can use the offer?",
    answer: "New customers only. Someone who has already had an InstaLabel subscription cannot use it.",
  },
  {
    question: "When does the offer end?",
    answer: `The offer ends on ${CAMPAIGN_END_LABEL}.`,
  },
  {
    question: "Is a payment card required?",
    answer:
      "Payment details are collected at checkout. There is no charge during the 60 days. You can cancel at any time.",
  },
]

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const ended = Date.now() > CAMPAIGN_END_MS
  const code = ended ? "" : await loadCode()
  const title = ended
    ? "Christmas offer ended | InstaLabel"
    : "60 days free and 30% off annual | InstaLabel"
  const description = ended
    ? `The InstaLabel Christmas offer ended on ${CAMPAIGN_END_LABEL}. New subscriptions start with a 14-day trial.`
    : code
      ? `New customers get 60 days free. Annual plans get 30% off the first payment with code ${code}. Offer ends ${CAMPAIGN_END_LABEL}.`
      : `New customers get 60 days free. Annual plans also get 30% off the first payment. Offer ends ${CAMPAIGN_END_LABEL}.`

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url: PAGE_URL,
      type: "website",
      locale: "en_GB",
      siteName: "InstaLabel",
      images: [
        {
          url: "https://www.instalabel.co/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "InstaLabel Christmas offer: 60 days free and 30% off the first annual payment",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.instalabel.co/opengraph-image.png"],
    },
    alternates: { canonical: PAGE_URL },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}

async function loadCode() {
  try {
    const saved = await getCampaignCode()
    return saved.code
  } catch (error) {
    console.error("[CHRISTMAS] Could not load offer code", error)
    return ""
  }
}

function offerJsonLd(ended: boolean, code: string) {
  const offerDescription = code
    ? `New customers get 60 days free. Annual plans get 30% off the first payment with code ${code}. A monthly plan returns to the normal monthly price after 60 days. The next annual renewal is the full price.`
    : "New customers get 60 days free. Annual plans get 30% off the first payment. A monthly plan returns to the normal monthly price after 60 days. The next annual renewal is the full price."

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.instalabel.co/" },
          { "@type": "ListItem", position: 2, name: "Christmas offer", item: PAGE_URL },
        ],
      },
      {
        "@type": "WebPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "InstaLabel Christmas offer",
        description: offerDescription,
        inLanguage: "en-GB",
        isPartOf: { "@type": "WebSite", name: "InstaLabel", url: "https://www.instalabel.co/" },
        about: { "@id": `${PAGE_URL}#offer` },
      },
      {
        "@type": "Offer",
        "@id": `${PAGE_URL}#offer`,
        name: "InstaLabel Christmas offer",
        url: PAGE_URL,
        description: offerDescription,
        category: "Subscription",
        availability: ended ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        validThrough: OFFER_END,
        priceCurrency: "GBP",
        areaServed: { "@type": "Country", name: "United Kingdom" },
        seller: {
          "@type": "Organization",
          name: "InstaLabel",
          url: "https://www.instalabel.co/",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  }
}

export default async function ChristmasOfferPage() {
  const ended = Date.now() > CAMPAIGN_END_MS
  const code = ended ? "" : await loadCode()
  const href = code ? `/register?code=${encodeURIComponent(code)}` : "/register"

  return (
    <div className="xmas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd(ended, code)) }}
      />
      <RememberOfferCode code={code} />
      <section className="xmas-hero">
        <Decor />
        <div className="xmas-sheet">
        <nav className="xmas-crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden> / </span>
          <span>Christmas offer</span>
        </nav>
        <p className="xmas-kicker">From InstaLabel</p>
        <h1 className="xmas-title">
          Merry
          <br />
          Christmas
        </h1>
        <p className="xmas-lead">Give your kitchen a little extra this Christmas.</p>

        {ended ? (
          <p className="xmas-lead">
            This offer ended on {CAMPAIGN_END_LABEL}. New subscriptions now start with the standard
            14-day trial.
          </p>
        ) : (
          <div className="xmas-offers">
            <article className="xmas-ticket xmas-ticket-red">
              <p className="xmas-ticket-title">2 months free</p>
              <p className="xmas-ticket-note">60 days for new customers</p>
            </article>
            <p className="xmas-plus" aria-hidden>
              +
            </p>
            <article className="xmas-ticket xmas-ticket-green">
              <p className="xmas-ticket-kicker">Annual plan</p>
              <p className="xmas-ticket-title">30% off</p>
              <p className="xmas-ticket-note">First payment only</p>
            </article>
          </div>
        )}

        {!ended && code ? (
          <div className="xmas-code">
            <p>Use code</p>
            <strong>{code}</strong>
          </div>
        ) : null}

        <Link href={href} className="xmas-cta">
          Start free trial
        </Link>

        {!ended ? (
          <p className="xmas-fine">
            New customers. One code covers both parts of the offer.{" "}
            <time className="xmas-date" dateTime="2027-01-10">
              Ends {CAMPAIGN_END_LABEL}.
            </time>
          </p>
        ) : null}
        </div>
      </section>

      {!ended ? (
        <section className="xmas-band">
          <div className="xmas-wide">
            <h2 className="xmas-h2">The same labelling system. Sixty days free.</h2>
            <p className="xmas-lead" style={{ marginLeft: 0 }}>
              InstaLabel is the labelling system the kitchen already runs. This offer only changes
              the trial and, on an annual plan, the first payment.
            </p>
            <div className="xmas-grid">
              {included.map((item) => (
                <article key={item.title} className="xmas-card">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
            <div className="xmas-shot">
              <Image
                src="/webdashboard/print.png"
                alt="InstaLabel printing screen, with an item selected and a label preview"
                width={1200}
                height={800}
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="xmas-close">
        <div className="xmas-wide">
          {!ended ? (
            <>
              <h2 className="xmas-h2">How the offer is applied</h2>
              <div className="xmas-steps">
                <div className="xmas-step">
                  <span>1</span>
                  <div>
                    <h3>Start the trial</h3>
                    <p>Create an account. Payment details are collected at checkout. Nothing is charged during the 60 days.</p>
                  </div>
                </div>
                <div className="xmas-step">
                  <span>2</span>
                  <div>
                    <h3>Choose the plan</h3>
                    <p>Annual gets the 60 days and 30% off the first payment. Monthly gets the 60 days, then the normal monthly price.</p>
                  </div>
                </div>
                <div className="xmas-step">
                  <span>3</span>
                  <div>
                    <h3>The code comes with you</h3>
                    <p>
                      {code
                        ? "You do not type it again. It is already on this page."
                        : "Enter it when you choose a plan, if it is not already filled in."}
                    </p>
                  </div>
                </div>
                <div className="xmas-step">
                  <span>4</span>
                  <div>
                    <h3>After the first year</h3>
                    <p>The 30% applies to the first annual payment only. The next renewal is the full price. You can cancel at any time.</p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          <h2 className="xmas-h2">Questions about the offer</h2>
          <div className="xmas-faq">
            {faqs.map((item) => (
              <article key={item.question} className="xmas-card">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
          <p className="xmas-fine">
            Current plan prices are on the <Link href="/plan">pricing page</Link>. This offer does
            not change those prices. It changes the trial, and the first annual payment.
          </p>
          <p className="xmas-wish" style={{ marginTop: ended ? 0 : "3rem" }}>
            Wishing you a Merry Christmas
            <br />
            and a Happy New Year.
          </p>
          <Link href={href} className="xmas-cta">
            Start free trial
          </Link>
          <p className="xmas-fine">
            {ended
              ? "Payment details are collected at checkout. There is no charge during the trial."
              : "There is no charge during the free period. You can cancel at any time."}
          </p>
        </div>
      </section>
    </div>
  )
}

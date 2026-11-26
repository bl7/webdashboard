"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import labelPrinterInKitchen from "@/assets/images/labelPrunterInKitchen.png"
import {
  CHRISTMAS_OFFER_COPY,
  isChristmasOfferActive,
  planConditionsAnswer,
  trialCtaLabel,
} from "@/lib/marketing/trialOffer"

export type PublicPlan = {
  id: number | string
  name: string
  price_monthly: number | string
  price_yearly: number | string
  description?: string
}

const included = [
  "Item and ingredient information",
  "Kitchen label creation and previews",
  "Allergen information and date settings",
  "CSV import",
  "Web access and PrintBridge",
  "Android app access",
  "Print history",
  "Cleaning checklists",
]

const faqs = [
  {
    question: "Can I compare monthly and annual billing?",
    answer:
      "Yes. Switch the billing interval to see the amount charged and, for annual billing, the equivalent monthly cost.",
  },
  {
    question: "Can I check my printer first?",
    answer:
      "Yes. Use the printer compatibility guide or contact us with your exact model and operating system.",
  },
  {
    question: "Can I see the product before signing up?",
    answer: "Yes. Book a demo to see item setup, label previews and printing.",
  },
  {
    question: "Where are the subscription conditions?",
    answer:
      "Review the terms presented with your selected plan before subscribing. New subscriptions start with a 14-day trial. Payment details are collected at checkout, there is no charge during the trial, and billing continues at the selected interval after the trial until you cancel. You may cancel at any time.",
  },
]

function toPence(value: number | string) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function formatGbp(pence: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100)
}

export const PlanBody = ({ initialPlan = null }: { initialPlan?: PublicPlan | null }) => {
  const [billing, setBilling] = useState<"monthly" | "annually">("monthly")
  const [plan, setPlan] = useState<PublicPlan | null>(initialPlan)
  const [status, setStatus] = useState<"loading" | "ready" | "error">(initialPlan ? "ready" : "loading")
  const abortRef = useRef<AbortController | null>(null)

  const loadPlans = useCallback((background = false) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    let timedOut = false
    const timer = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, 8000)

    if (!background) {
      setStatus("loading")
      setPlan(null)
    }
    fetch("/api/plans/public", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch plans")
        const data = await res.json()
        if (!Array.isArray(data) || data.length === 0) throw new Error("No plans")
        const selected =
          data.find((item: PublicPlan) => item.name === "One Stop") ?? data[0]
        setPlan(selected)
        setStatus("ready")
      })
      .catch(() => {
        if (abortRef.current !== controller) return
        if (controller.signal.aborted && !timedOut) return
        if (background) return
        setPlan(null)
        setStatus("error")
      })
      .finally(() => {
        window.clearTimeout(timer)
      })
  }, [])

  useEffect(() => {
    loadPlans(Boolean(initialPlan))
    return () => abortRef.current?.abort()
  }, [loadPlans, initialPlan])

  const monthly = plan ? toPence(plan.price_monthly) : 0
  const yearly = plan ? toPence(plan.price_yearly) : 0
  const equivalentMonthly = yearly > 0 ? yearly / 12 : 0
  const savePercent =
    monthly > 0 && yearly > 0
      ? Math.round((1 - yearly / (monthly * 12)) * 100)
      : 0
  const priceReady = status === "ready" && monthly > 0 && yearly > 0
  const offerOn = isChristmasOfferActive()
  const firstAnnual = yearly > 0 ? Math.round(yearly * 0.7) : 0
  const cta = trialCtaLabel()

  return (
    <>
      <section id="pricing" className="bg-[#e7eef2] pb-16">
        <div className="w-full bg-[#142124] px-6 pb-36 pt-40 text-center text-white">
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Kitchen labelling for the printer you already have.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            There is no printer in the box. Use a label printer already installed on Windows or
            macOS, or the Android app with a MUNBYN RW411B, Born4Ship DB403 or Rongta RP425.{" "}
            {offerOn
              ? CHRISTMAS_OFFER_COPY
              : "New subscriptions start with a 14-day trial. There is no charge during the trial."}
          </p>
          <div className="mt-8 inline-flex rounded-full bg-white/10 p-1">
            {(["monthly", "annually"] as const).map((interval) => (
              <button
                key={interval}
                type="button"
                onClick={() => setBilling(interval)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold",
                  billing === interval ? "bg-white text-[#142124]" : "text-white/80"
                )}
              >
                {interval === "monthly" ? "Monthly" : "Annually"}
                {interval === "annually" && savePercent > 0 ? ` · Save ${savePercent}%` : ""}
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto -mt-24 max-w-md px-2">
          {status === "loading" ? (
            <p className="rounded-[1.5rem] bg-[#efe6d6] px-8 py-10 text-center text-mkt-ink8">
              Loading current plans…
            </p>
          ) : null}

          {status === "error" ? (
            <div className="rounded-[1.5rem] bg-[#efe6d6] px-8 py-10 text-center">
              <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
                We couldn&apos;t load pricing. Try again.
              </p>
              <Button className="bg-mkt-ink text-white hover:bg-mkt-ink" onClick={() => loadPlans()}>
                Try again
              </Button>
            </div>
          ) : null}

          {status === "ready" && plan ? (
            <article className="rounded-[1.5rem] bg-[#efe6d6] px-8 py-8 text-center text-[#142124]">
              <h2 className="text-2xl font-semibold tracking-tight">{plan.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#142124]/70">
                Kitchen labelling with web and Android access.
              </p>
              {billing === "annually" && offerOn && firstAnnual > 0 ? (
                <p className="mt-8 flex flex-wrap items-baseline justify-center gap-x-3">
                  <span className="text-2xl font-medium text-[#142124]/40 line-through">
                    {formatGbp(yearly)}
                  </span>
                  <span className="text-5xl font-semibold tracking-tight">{formatGbp(firstAnnual)}</span>
                  <span className="text-base font-medium text-[#142124]/60">/year</span>
                </p>
              ) : (
                <p className="mt-8 text-5xl font-semibold tracking-tight">
                  {billing === "monthly" ? formatGbp(monthly) : formatGbp(yearly)}
                  <span className="ml-1 text-base font-medium text-[#142124]/60">
                    {billing === "monthly" ? "/month" : "/year"}
                  </span>
                </p>
              )}
              {billing === "annually" && offerOn && firstAnnual > 0 ? (
                <p className="mt-2 text-sm text-[#142124]/70">
                  First annual payment {formatGbp(firstAnnual)}. Then {formatGbp(yearly)} a year.
                </p>
              ) : billing === "annually" && equivalentMonthly > 0 ? (
                <p className="mt-2 text-sm text-[#142124]/70">
                  Equivalent to {formatGbp(equivalentMonthly)} per month, billed annually.
                </p>
              ) : (
                <p className="mt-2 text-sm text-[#142124]/70">Billed monthly in pounds sterling.</p>
              )}
              {priceReady ? (
                <Link
                  href="/register"
                  className="mt-8 block rounded-full bg-[#17675f] px-6 py-3 text-sm font-semibold text-white"
                >
                  {cta}
                </Link>
              ) : (
                <span className="mt-8 block rounded-full bg-[#17675f]/50 px-6 py-3 text-sm font-semibold text-white">
                  {cta}
                </span>
              )}
            </article>
          ) : null}
        </div>

        {status === "ready" && plan ? (
          <div className="mx-auto mt-10 max-w-md px-2">
            <h3 className="text-sm font-semibold text-[#142124]">Included</h3>
            <ul className="mt-4 space-y-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[#142124]/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#17675f]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-[#5f6d70]">
              {offerOn
                ? CHRISTMAS_OFFER_COPY
                : "New subscriptions start with a 14-day trial. There is no charge during the trial."}{" "}
              Payment details are collected at checkout. After the trial, billing continues at the
              selected interval until you cancel. You may cancel at any time. Review the{" "}
              <Link href="/terms" className="font-semibold text-[#17675f]">
                terms
              </Link>{" "}
              presented with your selected plan.
            </p>
          </div>
        ) : null}
      </section>

      <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-mkt-ink">
            Check your printing setup.
          </h2>
          <p className="mb-4 text-base leading-relaxed text-mkt-ink8">
            You will need suitable label stock and a compatible printer. Desktop printing uses a
            Windows or macOS computer with PrintBridge. Android printing uses the InstaLabel app
            with a supported Bluetooth model.
          </p>
          <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
            Printers, label stock and delivery are not included in the software subscription. Label
            supplies can be ordered from your account where that option is available, separately
            from the subscription.
          </p>
          <TextLink href="/kitchen-label-printer">View printer requirements</TextLink>
          </div>
          <Image
            src={labelPrinterInKitchen}
            alt="Label printer in a kitchen"
            className="h-auto w-full"
            sizes="288px"
          />
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            Know what happens next.
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="rounded-lg border border-mkt-steel1 bg-mkt-canvas px-4"
              >
                <AccordionTrigger className="text-left text-sm font-semibold text-mkt-ink hover:text-mkt-teal">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-mkt-ink8">
                  {faq.question === "Where are the subscription conditions?"
                    ? planConditionsAnswer()
                    : faq.answer}
                  {faq.question === "Can I check my printer first?" ? (
                    <>
                      {" "}
                      <Link href="/kitchen-label-printer" className="font-semibold text-mkt-teal hover:underline">
                        Printer compatibility
                      </Link>
                      {" · "}
                      <a href="/about#contact" className="font-semibold text-mkt-teal hover:underline">
                        Contact
                      </a>
                      .
                    </>
                  ) : null}
                  {faq.question === "Can I see the product before signing up?" ? (
                    <>
                      {" "}
                      <Link href="/bookdemo" className="font-semibold text-mkt-teal hover:underline">
                        Book a demo
                      </Link>
                      .
                    </>
                  ) : null}
                  {faq.question === "Where are the subscription conditions?" ? (
                    <>
                      {" "}
                      <Link href="/terms" className="font-semibold text-mkt-teal hover:underline">
                        Terms
                      </Link>
                      .
                    </>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            Questions about your setup or subscription?
          </h2>
          <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
            Talk us through your kitchen and the devices you plan to use.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="border-0 font-semibold text-white"
              style={{ backgroundColor: "#142124", backgroundImage: "none" }}
              asChild
            >
              <Link href="/bookdemo">
                Book a demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-mkt-steel1 font-semibold text-mkt-ink hover:border-mkt-ink hover:bg-mkt-ink hover:text-white"
              asChild
            >
              <a href="/about#contact">Contact us</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
    >
      {children}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  )
}

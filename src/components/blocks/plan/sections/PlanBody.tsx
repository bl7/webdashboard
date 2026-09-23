"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

type PublicPlan = {
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

export const PlanBody = () => {
  const [billing, setBilling] = useState<"monthly" | "annually">("monthly")
  const [plan, setPlan] = useState<PublicPlan | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const abortRef = useRef<AbortController | null>(null)

  const loadPlans = useCallback(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    let timedOut = false
    const timer = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, 8000)

    setStatus("loading")
    setPlan(null)
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
        setPlan(null)
        setStatus("error")
      })
      .finally(() => {
        window.clearTimeout(timer)
      })
  }, [])

  useEffect(() => {
    loadPlans()
    return () => abortRef.current?.abort()
  }, [loadPlans])

  const monthly = plan ? toPence(plan.price_monthly) : 0
  const yearly = plan ? toPence(plan.price_yearly) : 0
  const equivalentMonthly = yearly > 0 ? yearly / 12 : 0
  const savePercent =
    monthly > 0 && yearly > 0
      ? Math.round((1 - yearly / (monthly * 12)) * 100)
      : 0
  const priceReady = status === "ready" && monthly > 0 && yearly > 0

  return (
    <>
      <section id="pricing" className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-xl">
          {status === "loading" ? (
            <p className="text-center text-base text-mkt-ink8">Loading current plans…</p>
          ) : null}

          {status === "error" ? (
            <div className="text-center">
              <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
                We couldn&apos;t load pricing. Try again.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink"
                  onClick={loadPlans}
                >
                  Try again
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/about#contact">Contact us</a>
                </Button>
              </div>
            </div>
          ) : null}

          {status === "ready" && plan ? (
            <div className="rounded-2xl border border-mkt-steel1 bg-mkt-canvas p-6 sm:p-8">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-black tracking-tight text-mkt-ink">{plan.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-mkt-ink8">
                  Kitchen labelling with web and Android access.
                </p>
              </div>

              <div className="mb-8 flex justify-center">
                <div className="inline-flex items-center rounded-full border border-mkt-steel1 bg-white p-1">
                  {(["monthly", "annually"] as const).map((interval) => (
                    <button
                      key={interval}
                      type="button"
                      onClick={() => setBilling(interval)}
                      className={cn(
                        "relative rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                        billing === interval
                          ? "bg-mkt-ink text-white"
                          : "text-mkt-ink8 hover:text-mkt-ink"
                      )}
                    >
                      {interval === "monthly" ? "Monthly" : "Annually"}
                      {interval === "annually" && savePercent > 0 ? (
                        <span className="ml-2 text-xs font-semibold">Save {savePercent}%</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6 text-center">
                {billing === "monthly" ? (
                  <>
                    <div className="text-4xl font-black tracking-tight text-mkt-ink">
                      {formatGbp(monthly)} per month
                    </div>
                    <p className="mt-2 text-sm text-mkt-ink8">
                      Billed monthly in pounds sterling, as configured in billing.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl font-black tracking-tight text-mkt-ink">
                      {formatGbp(yearly)} per year
                    </div>
                    <p className="mt-2 text-sm text-mkt-ink8">
                      Equivalent to {formatGbp(equivalentMonthly)} per month, billed annually.
                    </p>
                    <p className="mt-1 text-sm text-mkt-ink8">
                      Billed annually in pounds sterling, as configured in billing.
                    </p>
                  </>
                )}
              </div>

              <ul className="mb-8 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-mkt-ink8">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mkt-ink" />
                    {item}
                  </li>
                ))}
              </ul>

              {priceReady ? (
                <Button
                  size="lg"
                  className="w-full bg-mkt-ink py-3 text-white hover:bg-mkt-ink"
                  asChild
                >
                  <Link href="/register">
                    Start free trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full bg-mkt-ink py-3 text-white hover:bg-mkt-ink"
                  disabled
                >
                  Start free trial
                </Button>
              )}

              <p className="mt-4 text-xs leading-relaxed text-mkt-steel">
                New subscriptions start with a 14-day trial. Payment details are collected at
                checkout. There is no charge during the trial. After the trial, billing continues at
                the selected interval until you cancel. You may cancel at any time. Review the{" "}
                <Link href="/terms" className="font-semibold text-mkt-teal hover:underline">
                  terms
                </Link>{" "}
                presented with your selected plan.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
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
                  {faq.answer}
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

"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import LabelRender from "@/app/dashboard/print/LabelRender"

export const ILLUSTRATIVE_PRINTED = "2026-09-21T09:00:00Z"
export const ILLUSTRATIVE_EXPIRY = "2026-09-22T09:00:00Z"

type Callout = { title: string; body: string }
type Faq = { question: string; answer: string }

export type OperationalLabelConfig = {
  badge: string
  h1: string
  heroBody: string
  whenTitle: string
  whenBody: string
  exampleTitle: string
  itemName: string
  labelType: "prep" | "cooked" | "default"
  itemType?: "menu" | "ingredients"
  allergens: string[]
  ingredients: { uuid: string; ingredientName: string; allergens: { allergenName: string }[] }[]
  callouts: Callout[]
  caption: string
  workflowTitle: string
  steps: string[]
  handoverTitle: string
  handoverBody: string
  faqs: Faq[]
  closingTitle: string
  closingBody: string
  hideEmptyContains?: boolean
  heroNote?: string
}

export const OperationalLabelPage = ({ config }: { config: OperationalLabelConfig }) => {
  const item = {
    uid: config.itemName,
    id: config.itemName,
    type: config.itemType ?? "menu",
    name: config.itemName,
    quantity: 1,
    ingredients: config.ingredients.map((i) => i.ingredientName),
    allergens: config.allergens.map((name, i) => ({
      uuid: i,
      allergenName: name,
      category: "",
      status: "Active" as const,
      addedAt: "",
      isCustom: false,
    })),
    printedOn: ILLUSTRATIVE_PRINTED,
    expiryDate: ILLUSTRATIVE_EXPIRY,
    labelType: config.labelType,
  }

  const label = (
    <div className={config.hideEmptyContains ? "mkt-hide-empty-contains" : undefined}>
      <LabelRender
        item={item}
        expiry={ILLUSTRATIVE_EXPIRY}
        useInitials={config.itemType !== "ingredients"}
        selectedInitial="BL"
        allergens={config.allergens}
        labelHeight="40mm"
        allIngredients={config.ingredients}
      />
    </div>
  )

  return (
    <>
      {config.hideEmptyContains ? (
        <style>{`.mkt-hide-empty-contains > div > div:last-child{display:none!important}`}</style>
      ) : null}
      <article className="bg-mkt-canvas px-4 pb-20 pt-28 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mkt-teal">{config.badge}</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-mkt-ink sm:text-5xl">
              {config.h1}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mkt-ink8">{config.heroBody}</p>
            <div className="mt-12 grid items-start gap-10 border-t border-mkt-steel1 pt-10 md:grid-cols-[auto_minmax(0,1fr)]">
              <div>
                {label}
                <p className="mt-3 max-w-[16rem] text-xs leading-relaxed text-mkt-steel">
                  {config.heroNote ?? config.caption}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-mkt-ink">{config.exampleTitle}</h2>
                <dl className="mt-5 border-t border-mkt-steel1">
                  {config.callouts.map((callout) => (
                    <div key={callout.title} className="grid gap-1 border-b border-mkt-steel1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
                      <dt className="text-sm font-semibold text-mkt-ink">{callout.title}</dt>
                      <dd className="text-sm leading-relaxed text-mkt-ink8">{callout.body}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
          <aside className="border-t border-mkt-steel1 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-16">
            <h2 className="text-base font-semibold leading-snug text-mkt-ink">{config.workflowTitle}</h2>
            <ol className="mt-4 space-y-4">
              {config.steps.map((step, index) => (
                <li key={step} className="grid grid-cols-[1.5rem_1fr] gap-2 text-sm leading-relaxed text-mkt-ink8">
                  <span className="font-semibold text-mkt-ink">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <h2 className="mt-10 text-base font-semibold leading-snug text-mkt-ink">{config.whenTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mkt-ink8">{config.whenBody}</p>
            <h2 className="mt-10 text-base font-semibold leading-snug text-mkt-ink">{config.handoverTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mkt-ink8">{config.handoverBody}</p>
            <div className="mt-8 flex flex-col items-start gap-3">
              <Button size="lg" className="bg-mkt-ink px-6 py-3 text-white hover:bg-mkt-ink" asChild>
                <Link href="/register">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Link href="/uses" className="text-sm font-semibold text-mkt-teal">
                All kitchen workflows
              </Link>
            </div>
          </aside>
        </div>
      </article>

      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <h2 className="text-lg font-semibold tracking-tight text-mkt-ink">Questions about this label</h2>
          <Accordion type="single" collapsible className="w-full">
            {config.faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`} className="border-b border-mkt-steel1">
                <AccordionTrigger className="text-left text-base font-semibold text-mkt-ink hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-mkt-ink8">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-mkt-ink">{config.closingTitle}</h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-mkt-ink8">{config.closingBody}</p>
          </div>
          <Button size="lg" className="bg-mkt-ink px-6 py-3 text-white hover:bg-mkt-ink" asChild>
            <Link href="/bookdemo">
              Book a demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}

"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import { motion } from "framer-motion"
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
}

export const OperationalLabelPage = ({ config }: { config: OperationalLabelConfig }) => {
  const item = {
    uid: config.itemName,
    id: config.itemName,
    type: "menu" as const,
    name: config.itemName,
    quantity: 1,
    ingredients: config.ingredients.map((i) => i.ingredientName),
    allergens: config.allergens.map((name, i) => ({
      uuid: i,
      allergenName: name,
      category: "",
      status: "Active",
      addedAt: "",
      isCustom: false,
    })),
    printedOn: ILLUSTRATIVE_PRINTED,
    expiryDate: ILLUSTRATIVE_EXPIRY,
    labelType: config.labelType,
  }

  return (
    <>
      {config.hideEmptyContains ? (
        <style>{`.mkt-hide-empty-contains > div > div:last-child{display:none!important}`}</style>
      ) : null}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-mkt-canvas px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
        <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-mkt-steel1 opacity-50 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-mkt-ink opacity-10 blur-3xl" />
        <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-10 md:flex-row md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl space-y-6 text-center md:text-left"
          >
            <div className="inline-flex items-center rounded-full bg-mkt-canvas px-4 py-2 text-sm font-medium text-mkt-ink ring-1 ring-mkt-steel1">
              {config.badge}
            </div>
            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl lg:text-6xl">
              {config.h1}
            </h1>
            <p className="max-w-xl text-base text-mkt-ink8 sm:text-lg md:text-xl">
              {config.heroBody}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
                <Link href="/register">
                  Try InstaLabel
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/uses">All kitchen workflows</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex w-full max-w-[500px] flex-col items-center md:items-end"
          >
            <div className={config.hideEmptyContains ? "mkt-hide-empty-contains" : undefined}>
              <LabelRender
                item={item}
                expiry={ILLUSTRATIVE_EXPIRY}
                useInitials={true}
                selectedInitial="BL"
                allergens={config.allergens}
                labelHeight="40mm"
                allIngredients={config.ingredients}
              />
            </div>
            <p className="mt-3 text-center text-xs text-mkt-steel md:text-right">
              Illustrative layout. Dates must follow your kitchen&apos;s procedures.
            </p>
          </motion.div>
        </div>
        <div className="mkt-hero-fade pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full" />
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            {config.whenTitle}
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-mkt-ink8">{config.whenBody}</p>
        </div>
      </section>

      <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            {config.exampleTitle}
          </h2>
          <div className="grid items-start gap-10 lg:grid-cols-[auto_1fr]">
            <div>
              <div className={config.hideEmptyContains ? "mkt-hide-empty-contains" : undefined}>
                <LabelRender
                  item={item}
                  expiry={ILLUSTRATIVE_EXPIRY}
                  useInitials={true}
                  selectedInitial="BL"
                  allergens={config.allergens}
                  labelHeight="40mm"
                  allIngredients={config.ingredients}
                />
              </div>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-mkt-steel">
                {config.caption}
              </p>
            </div>
            <ul className="space-y-5">
              {config.callouts.map((itemCallout) => (
                <li key={itemCallout.title} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mkt-teal" />
                  <div>
                    <h3 className="text-lg font-bold text-mkt-ink">{itemCallout.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-mkt-ink8">{itemCallout.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            {config.workflowTitle}
          </h2>
          <ol className="max-w-3xl space-y-4">
            {config.steps.map((step, i) => (
              <li key={step} className="flex items-start gap-4">
                <span className="mt-0.5 shrink-0 text-xs font-semibold text-mkt-teal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-relaxed text-mkt-ink8">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            {config.handoverTitle}
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-mkt-ink8">{config.handoverBody}</p>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            Questions about this label
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {config.faqs.map((faq, index) => (
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            {config.closingTitle}
          </h2>
          <p className="mb-8 text-base leading-relaxed text-mkt-ink8">{config.closingBody}</p>
          <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
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

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
import {
  ILLUSTRATIVE_EXPIRY,
  ILLUSTRATIVE_PRINTED,
} from "@/components/blocks/operational-label/OperationalLabelPage"

const steps = [
  "Select the correct item and label type.",
  "Check the date settings and the event they relate to.",
  "Review the resulting date in the preview.",
  "Print, inspect and apply the label to the correct item.",
]

const faqs = [
  {
    question: "Does InstaLabel choose a safe shelf life for me?",
    answer:
      "No. Your business decides its date rules from the appropriate product information and food-safety procedures.",
  },
  {
    question: "Does reprinting a label restart the item's shelf life?",
    answer:
      "No. A replacement label must reflect the correct original information and applicable dates.",
  },
  {
    question: "Is printing time always preparation time?",
    answer:
      "No. Those are different events. Check which event the selected workflow actually records.",
  },
]

export const ExpiryDateLabelsBody = () => (
  <>
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Your procedure sets the rule.
        </h2>
        <p className="max-w-3xl text-base leading-relaxed text-mkt-ink8">
          Decide the applicable shelf life and starting event through your food-safety process.
          Configure the supported settings in InstaLabel and check the date produced for the item.
          The calculation does not measure freshness or decide whether food is safe.
        </p>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Check the date before the label is applied.
        </h2>
        <ol className="max-w-3xl space-y-4">
          {steps.map((step, i) => (
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

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Use date terms consistently.
        </h2>
        <p className="max-w-3xl text-base leading-relaxed text-mkt-ink8">
          A use-by date relates to safety; a best-before date relates to quality. Keep those
          meanings distinct from internal preparation, opening or print dates. Follow applicable
          storage instructions and your kitchen&apos;s procedures.{" "}
          <a
            href="https://www.gov.uk/understanding-food-labelling/best-before-and-use-by-dates"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-mkt-teal hover:underline"
          >
            GOV.UK date guidance
          </a>
          .
        </p>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Make the applicable date visible at the point of use.
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-mkt-ink8">
          Use clearly printed dates alongside your regular storage and stock checks. A use-first
          marker can help organise a task, but it must not replace the original date or extend the
          item&apos;s shelf life.
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:justify-start">
          <figure>
            <LabelRender
              item={{
                uid: "expiry-basil",
                id: "expiry-basil",
                type: "menu",
                name: "Fresh basil",
                quantity: 1,
                ingredients: ["Fresh basil"],
                allergens: [],
                printedOn: ILLUSTRATIVE_PRINTED,
                expiryDate: ILLUSTRATIVE_EXPIRY,
                labelType: "default",
              }}
              expiry={ILLUSTRATIVE_EXPIRY}
              useInitials={true}
              selectedInitial="BL"
              allergens={[]}
              labelHeight="40mm"
              allIngredients={[{ uuid: "b1", ingredientName: "Fresh basil", allergens: [] }]}
            />
          </figure>
          <figure>
            <LabelRender
              item={{
                uid: "expiry-veg",
                id: "expiry-veg",
                type: "menu",
                name: "Mixed vegetables",
                quantity: 1,
                ingredients: ["Carrots", "Broccoli", "Celery"],
                allergens: [
                  {
                    uuid: 3,
                    allergenName: "Celery",
                    category: "",
                    status: "Active",
                    addedAt: "",
                    isCustom: false,
                  },
                ],
                printedOn: ILLUSTRATIVE_PRINTED,
                expiryDate: ILLUSTRATIVE_EXPIRY,
                labelType: "prep",
              }}
              expiry={ILLUSTRATIVE_EXPIRY}
              useInitials={true}
              selectedInitial="BL"
              allergens={["Celery"]}
              labelHeight="40mm"
              allIngredients={[
                { uuid: "6", ingredientName: "Carrots", allergens: [] },
                { uuid: "7", ingredientName: "Broccoli", allergens: [] },
                { uuid: "8", ingredientName: "Celery", allergens: [{ allergenName: "Celery" }] },
              ]}
            />
          </figure>
        </div>
        <p className="mt-4 text-xs text-mkt-steel">
          Illustrative layout. Dates must follow your kitchen&apos;s procedures.
        </p>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Questions about date labels
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
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          See how your date settings reach the label.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          Bring a typical item and walk through the date and preview checks in a demo.
        </p>
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

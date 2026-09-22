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

const rows = [
  {
    category: "Dissolvable",
    check:
      "Specified removal method, temperature and time; moisture exposure during use; suitable printer type",
  },
  {
    category: "Removable",
    check: "Residue, surface compatibility and how removal changes over time",
  },
  {
    category: "Permanent",
    check: "Adhesion and suitability where the label must remain attached",
  },
  {
    category: "Specialist freezer or moisture-resistant stock",
    check: "Stated temperature range, application conditions and compatible printing method",
  },
]

const steps = [
  "Select the correct stock and printer settings.",
  "Print a representative label and check every line.",
  "Apply it according to the supplier's instructions.",
  "Check readability and removal under the intended conditions before adopting the stock.",
]

const faqs = [
  {
    question: "Will any dissolvable label work in a thermal printer?",
    answer:
      "Do not assume so. Confirm that the specific stock supports your printing method and printer requirements.",
  },
  {
    question: "Does dissolvable stock make a label PPDS compliant?",
    answer: "No. The material and the food-information requirements are separate questions.",
  },
  {
    question: "Does InstaLabel guarantee washing performance?",
    answer:
      "No material-performance promise is made on this page. Use the stock supplier's specifications and your own application test.",
  },
]

export const DissolvableKitchenLabelsBody = () => (
  <>
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          The software creates the layout. The stock determines the material behaviour.
        </h2>
        <p className="max-w-3xl text-base leading-relaxed text-mkt-ink8">
          InstaLabel prepares the information to print. Whether a label dissolves, withstands
          moisture or removes cleanly depends on the stock, adhesive, application and washing
          conditions. Do not choose a material based only on the software you use.
        </p>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Match the material to its intended use.
        </h2>
        <div className="overflow-x-auto rounded-xl border border-mkt-steel1 bg-white">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">Label stock selection questions</caption>
            <thead className="bg-mkt-canvas">
              <tr>
                <th className="px-4 py-3 font-semibold text-mkt-ink">Stock category</th>
                <th className="px-4 py-3 font-semibold text-mkt-ink">
                  What to check with the supplier
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.category} className="border-t border-mkt-steel1 align-top">
                  <th className="px-4 py-3 font-medium text-mkt-ink">{row.category}</th>
                  <td className="px-4 py-3 text-mkt-ink8">{row.check}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-mkt-steel">
          These are selection questions, not specifications for a product sold by InstaLabel.
        </p>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Check the roll before buying in quantity.
        </h2>
        <p className="max-w-3xl text-base leading-relaxed text-mkt-ink8">
          Confirm the print method, label width and length, roll/core dimensions, media sensing and
          any required printer settings. Then test the stock on the actual container and in the
          conditions where it will be used.
        </p>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Test a complete label in your own workflow.
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
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Questions about label stock
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
          Check the setup before ordering label stock.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          Tell us your printer model and intended label dimensions if you need help with the
          printing side of the setup.
        </p>
        <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
          <Link href="/about#contact">
            Ask a setup question
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  </>
)

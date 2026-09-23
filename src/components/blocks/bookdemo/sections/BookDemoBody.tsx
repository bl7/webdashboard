"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const topics = [
  {
    title: "Your item information",
    body: "How ingredients, allergens and date settings feed into labels.",
  },
  {
    title: "Your label workflow",
    body: "Select an item, review the preview and prepare a print.",
  },
  {
    title: "Your allergen matrix",
    body: "See how selected item records become a printable menu-wide matrix and what should be reviewed before export.",
  },
  {
    title: "Your equipment",
    body: "Compare desktop PrintBridge and Android printing for your setup.",
  },
]

const faqs = [
  {
    question: "Do I need to create an account first?",
    answer: "You can request a demo using the form on this page.",
  },
  {
    question: "Can you discuss our existing printer?",
    answer: "Yes. Include the exact model and whether you use Windows, macOS or Android.",
  },
  {
    question: "Is submitting the form a confirmed appointment?",
    answer: "No. We will contact you to arrange a suitable time.",
  },
]

export const BookDemoBody = () => (
  <>
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          What we can walk through.
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((item) => (
            <div key={item.title}>
              <h3 className="mb-2 text-lg font-bold text-mkt-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-mkt-ink8">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Bring a printer model or an example item, if you have one.
        </h2>
        <p className="text-base leading-relaxed text-mkt-ink8">
          A printer model helps us discuss compatibility. Bring a representative menu item, recipe
          or supplier specification if you want to see the allergen workflow. You can also join with
          questions alone.
        </p>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Questions about the demo
        </h2>
        <Accordion type="single" collapsible className="mb-8 w-full space-y-3">
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
        <Link
          href="/features"
          className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
        >
          Explore the features first
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  </>
)

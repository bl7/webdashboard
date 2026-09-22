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

const faqs = [
  {
    question: "Do I need to buy an InstaLabel printer?",
    answer:
      "No proprietary InstaLabel printer is required. Check your computer or Android setup on the printer compatibility page before buying hardware.",
  },
  {
    question: "Can I import my existing items?",
    answer:
      "Yes. Use CSV import to bring in item information, then review the imported ingredients, allergens and date settings.",
  },
  {
    question: "Does the software make my kitchen compliant?",
    answer:
      "InstaLabel helps you produce consistent labels. Your business remains responsible for ingredient accuracy, food-safety procedures and the information required for what you sell.",
  },
  {
    question: "Can I see it working first?",
    answer: "Yes. Book a demo to see item setup, label previews and the printing workflow.",
  },
]

export const FAQ = () => (
  <section className="relative bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="container mx-auto max-w-3xl">
      <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
        Questions kitchens ask first
      </h2>
      <Accordion type="single" collapsible className="w-full space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={faq.question}
            value={`item-${index}`}
            className="rounded-lg border border-mkt-steel1 bg-white px-4"
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
        href="/faqs"
        className="mt-8 inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
      >
        View all FAQs
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </div>
  </section>
)

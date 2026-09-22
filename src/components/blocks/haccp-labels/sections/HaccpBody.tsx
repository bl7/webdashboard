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

const roles = [
  {
    title: "Identify the item",
    body: "Use a consistent product name and the appropriate label type.",
  },
  {
    title: "Show the relevant date",
    body: "Apply the date determined by your kitchen's procedure and configured settings.",
  },
  {
    title: "Communicate recorded details",
    body: "Include the supported staff and allergen information needed for the task.",
  },
]

const steps = [
  "Decide which information the kitchen needs at that stage.",
  "Choose the appropriate label type and configure the item information.",
  "Check the printed result against the item and the procedure.",
  "Keep any other required records in the systems your kitchen uses.",
]

const workflowLinks = [
  { href: "/prep-labels", label: "Prep labels" },
  { href: "/cooked-labels", label: "Cooked labels" },
  { href: "/defrost-labels", label: "Defrost labels" },
]

const faqs = [
  {
    question: "Does InstaLabel certify my HACCP system?",
    answer: "No. It is a labelling tool, not a certification or inspection service.",
  },
  {
    question: "Does print history prove a food-safety check happened?",
    answer:
      "It records label activity. Use the relevant operational record to demonstrate a temperature check, cleaning task or other control.",
  },
  {
    question: "Can I use handwritten records as well?",
    answer:
      "Your procedures may use different record formats. What matters is that the information and checks meet the requirements of your system.",
  },
]

export const HaccpBody = () => (
  <>
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Give the next person clear information.
        </h2>
        <ul className="grid gap-8 md:grid-cols-3">
          {roles.map((role) => (
            <li key={role.title} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mkt-teal" />
              <div>
                <h3 className="mb-2 text-lg font-bold text-mkt-ink">{role.title}</h3>
                <p className="text-sm leading-relaxed text-mkt-ink8">{role.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          A label is one part of the process.
        </h2>
        <p className="mb-6 max-w-3xl text-base leading-relaxed text-mkt-ink8">
          HACCP-based food-safety management includes identifying hazards, setting controls,
          monitoring them and keeping appropriate records. Printed labels do not replace cooking or
          storage checks, cleaning procedures, training or corrective actions.
        </p>
        <a
          href="https://www.gov.uk/food-safety-management-systems"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
        >
          GOV.UK food-safety management guidance
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Make the label fit the task.
        </h2>
        <ol className="mb-10 max-w-3xl space-y-4">
          {steps.map((step, i) => (
            <li key={step} className="flex items-start gap-4">
              <span className="mt-0.5 shrink-0 text-xs font-semibold text-mkt-teal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-base leading-relaxed text-mkt-ink8">{step}</p>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {workflowLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
            >
              {link.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Questions about labels and HACCP
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
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Connect your labels to your kitchen routine.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          Show us the stage you want to label and we can walk through the relevant InstaLabel
          workflow.
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

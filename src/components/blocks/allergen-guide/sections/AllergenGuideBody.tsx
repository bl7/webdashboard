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

const allergens = [
  { category: "Celery", examples: "Celery and celeriac" },
  {
    category: "Cereals containing gluten",
    examples: "Wheat, rye, barley and oats; identify the relevant cereal",
  },
  { category: "Crustaceans", examples: "Prawns, crab and lobster" },
  { category: "Eggs", examples: "Egg ingredients" },
  { category: "Fish", examples: "Fish ingredients" },
  { category: "Lupin", examples: "Lupin flour or seeds" },
  { category: "Milk", examples: "Milk ingredients" },
  { category: "Molluscs", examples: "Mussels, squid and oysters" },
  { category: "Mustard", examples: "Mustard ingredients" },
  {
    category: "Nuts",
    examples:
      "Almond, hazelnut, walnut, cashew, pecan, Brazil nut, pistachio and macadamia; identify the relevant nut",
  },
  { category: "Peanuts", examples: "Peanuts and peanut ingredients" },
  { category: "Sesame", examples: "Sesame ingredients" },
  { category: "Soya", examples: "Soya ingredients" },
  {
    category: "Sulphur dioxide and sulphites",
    examples:
      "Declaration applies above 10 mg/kg or 10 mg/litre, expressed as total SO₂, subject to the applicable rules",
  },
]

const contexts = [
  {
    title: "Food packed for direct sale",
    body: "PPDS rules concern food packed before it is selected or ordered in the relevant direct-sale setting. Read the dedicated PPDS guide before choosing a template.",
    href: "/natashas-law",
    link: "PPDS labels",
  },
  {
    title: "Other prepacked food",
    body: "Products supplied from one business to another for sale may fall into a different category with additional labelling requirements. Use the official labelling guidance.",
  },
  {
    title: "Loose food and distance orders",
    body: "Allergen information still matters. Check the rules for how it is communicated, including before purchase and at delivery where applicable.",
  },
]

const checks = [
  "Start with the current recipe and supplier information.",
  "Check bought-in components and substitutions.",
  "Keep the kitchen's allergen record current.",
  "Match the label or customer information to the correct item.",
  "Check that the printed information is complete and readable.",
  "Train staff to check records when unsure and escalate unresolved questions.",
]

const faqs = [
  {
    question: "Do all 14 categories go on every label?",
    answer:
      "No. Identify the relevant allergens present and follow the requirements for that food and sales context.",
  },
  {
    question: "Can a “contains” summary replace a PPDS ingredient list?",
    answer:
      "No. Use the PPDS guidance for the ingredient list and allergen emphasis required for that setting.",
  },
  {
    question: "Can we rely on the colour of a printed allergen?",
    answer:
      "Check that the emphasis remains clear on the printer and stock you use. A colour shown in the app may not appear on a monochrome thermal label.",
  },
  {
    question: "Where should we check the detailed rules?",
    answer:
      "Use the current FSA guidance for England, Wales and Northern Ireland and Food Standards Scotland guidance for Scotland.",
  },
]

const sources = [
  {
    label: "FSA allergen guidance",
    href: "https://www.gov.uk/government/publications/allergen-guidance-for-food-businesses/allergen-guidance-for-food-businesses",
  },
  {
    label: "FSA technical guidance",
    href: "https://www.gov.uk/government/publications/food-allergen-labelling-and-information-requirements-technical-guidance",
  },
  {
    label: "FSA PPDS introduction",
    href: "https://www.gov.uk/government/publications/introduction-to-allergen-labelling-for-ppds-food/introduction-to-allergen-labelling-for-ppds-food",
  },
  {
    label: "FSA allergen checklist",
    href: "https://www.gov.uk/government/publications/allergen-checklist-for-food-businesses",
  },
  {
    label: "Food Standards Scotland PPDS guidance",
    href: "https://www.foodstandards.gov.scot/business-guidance/running-a-food-business/publications/guidance-on-labelling-of-food-sold-prepacked-for-direct-sale",
  },
]

const sectionStyle = { scrollMarginTop: "7rem" }

export const AllergenGuideBody = () => (
  <>
    <section
      id="allergens"
      className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16"
      style={sectionStyle}
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          The 14 regulated allergen categories.
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-mkt-ink8">
          Check the actual ingredients used in your food. The categories below are not a checklist of
          ingredients to put on every label.{" "}
          <a
            href="https://www.gov.uk/food-allergies/information-businesses-provide"
            className="font-semibold text-mkt-teal hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Official allergen categories
          </a>
          .
        </p>
        <div className="overflow-x-auto rounded-xl border border-mkt-steel1">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-mkt-canvas">
              <tr>
                <th className="px-4 py-3 font-semibold text-mkt-ink">Category</th>
                <th className="px-4 py-3 font-semibold text-mkt-ink">Reference examples</th>
              </tr>
            </thead>
            <tbody>
              {allergens.map((row) => (
                <tr key={row.category} className="border-t border-mkt-steel1">
                  <td className="px-4 py-3 font-medium text-mkt-ink">{row.category}</td>
                  <td className="px-4 py-3 text-mkt-ink8">{row.examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-mkt-steel">
          Check the official technical guidance for derivatives, exemptions and naming requirements.
          Do not infer a finished product&apos;s allergens from this table alone.{" "}
          <a
            href="https://www.gov.uk/government/publications/food-allergen-labelling-and-information-requirements-technical-guidance"
            className="font-semibold text-mkt-teal hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            FSA technical guidance
          </a>
          .
        </p>
      </div>
    </section>

    <section
      id="contexts"
      className="scroll-mt-24 bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16"
      style={sectionStyle}
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          How you sell the food changes the information required.
        </h2>
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {contexts.map((item) => (
            <div key={item.title} className="rounded-xl border border-mkt-steel1 bg-white p-6">
              <div className="mb-2 text-base font-bold text-mkt-ink">{item.title}</div>
              <p className="mb-4 text-sm leading-relaxed text-mkt-ink8">{item.body}</p>
              {item.href ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
                >
                  {item.link}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <External href="https://www.gov.uk/government/publications/introduction-to-allergen-labelling-for-ppds-food/introduction-to-allergen-labelling-for-ppds-food">
            FSA PPDS scope
          </External>
          <External href="https://www.gov.uk/government/publications/allergen-guidance-for-food-businesses/allergen-guidance-for-food-businesses">
            FSA allergen guidance
          </External>
          <External href="https://www.foodstandards.gov.scot/business-guidance/running-a-food-business/publications/guidance-on-labelling-of-food-sold-prepacked-for-direct-sale">
            Food Standards Scotland PPDS guidance
          </External>
        </div>
      </div>
    </section>

    <section
      id="checks"
      className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16"
      style={sectionStyle}
    >
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Check the information before you share it.
        </h2>
        <ol className="mb-6 space-y-4">
          {checks.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="mt-0.5 text-xs font-semibold text-mkt-teal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base leading-relaxed text-mkt-ink8">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
          Information checks belong alongside your food-handling procedures. A label does not replace
          cleaning, separation or other controls in your food-safety system.
        </p>
        <External href="https://www.gov.uk/government/publications/allergen-checklist-for-food-businesses">
          Use the official allergen checklist
        </External>
      </div>
    </section>
  </>
)

export const AllergenGuideClosing = () => (
  <>
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Questions kitchens ask about this guide
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

    <section
      id="sources"
      className="scroll-mt-24 bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16"
      style={sectionStyle}
    >
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Keep the official guidance close to hand.
        </h2>
        <p className="mb-8 text-sm text-mkt-steel">
          These links are available without registration. A named reviewer and review date will be
          added after a real review of this page.
        </p>
        <ul className="mb-10 space-y-3">
          {sources.map((item) => (
            <li key={item.href}>
              <External href={item.href}>{item.label}</External>
            </li>
          ))}
        </ul>
        <p className="text-base leading-relaxed text-mkt-ink8">
          Want to see how recorded allergen information reaches an InstaLabel label?{" "}
          <Link href="/allergen-compliance" className="font-semibold text-mkt-teal hover:underline">
            Explore the workflow
          </Link>
          .
        </p>
      </div>
    </section>
  </>
)

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowRight className="ml-2 h-4 w-4" />
    </a>
  )
}

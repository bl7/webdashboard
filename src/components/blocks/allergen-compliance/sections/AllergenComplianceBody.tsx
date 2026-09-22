"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PPDSLabelRenderer } from "@/app/dashboard/ppds/PPDSLabelRenderer"

const steps = [
  {
    title: "Check the source.",
    body: "Use the current supplier specification and the recipe your team actually follows.",
  },
  {
    title: "Record the information.",
    body: "Add the ingredient and allergen details to the correct item in InstaLabel.",
  },
  {
    title: "Review the label.",
    body: "Check the information and the allergen emphasis in the preview and on a test print.",
  },
  {
    title: "Keep it current.",
    body: "Update affected items when a supplier, ingredient or recipe changes.",
  },
]

const helps = [
  {
    title: "Reusable item information",
    body: "Start with the details already recorded for the item.",
  },
  {
    title: "Readable allergen emphasis",
    body: "Make the relevant recorded allergens visible in the label layout.",
    allergen: true,
  },
  {
    title: "A repeatable printing process",
    body: "Review the item and label before printing another batch.",
  },
]

const faqs = [
  {
    question: "Can InstaLabel find every allergen from a dish name?",
    answer:
      "No dish name provides a complete recipe. Check actual ingredients and supplier information before relying on a label.",
  },
  {
    question: "What happens when a supplier changes?",
    answer:
      "Review the new specification, update the affected records and check subsequent labels. Follow your procedure for items already prepared or labelled.",
  },
  {
    question: "Does a label prevent allergen cross-contact?",
    answer:
      "A label communicates information. Your kitchen still needs appropriate handling, cleaning and separation procedures.",
  },
]

const caesarItem = {
  uid: "allergen-ppds-1",
  id: "1",
  type: "menu",
  name: "Chicken Caesar Salad",
  quantity: 1,
  labelType: "ppds",
  ingredients: ["Chicken Breast", "Caesar Dressing", "Croutons"],
  printedOn: "2024-06-01",
  expiryDate: "2024-06-03",
}

const caesarIngredients = [
  { uuid: "a1", ingredientName: "Chicken Breast", allergens: [] },
  {
    uuid: "a2",
    ingredientName: "Caesar Dressing",
    allergens: [{ allergenName: "Egg" }, { allergenName: "Fish" }],
  },
  { uuid: "a3", ingredientName: "Croutons", allergens: [{ allergenName: "Wheat" }] },
]

export const AllergenComplianceBody = () => (
  <>
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Start with the ingredients.
        </h2>
        <ol className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-mkt-steel1 bg-mkt-canvas p-5">
              <div className="mb-2 text-xs font-semibold text-mkt-teal">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mb-2 text-base font-bold text-mkt-ink">{step.title}</div>
              <p className="text-sm leading-relaxed text-mkt-ink8">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <figure>
            <div className="overflow-hidden rounded-xl border border-mkt-steel1 bg-white shadow-sm">
              <Image
                src="/webdashboard/dashboard.png"
                alt="Saved item records in the InstaLabel dashboard"
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-mkt-steel">
              Source: dashboard showing recorded custom allergens, ingredients and menu items. Counts
              are from this screenshot, not a published statistic.
            </figcaption>
          </figure>
          <figure className="flex flex-col items-center lg:items-end">
            <div>
              <PPDSLabelRenderer
                item={caesarItem}
                storageInfo="Keep refrigerated below 5°C. Consume within 2 days of opening."
                businessName="InstaLabel Ltd"
                allIngredients={caesarIngredients}
              />
            </div>
            <figcaption className="mt-3 max-w-sm text-center text-xs text-mkt-steel lg:text-right">
              Result: a PPDS label prepared from recorded ingredients, with allergen names
              emphasised in the layout.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          A consistent place to work from.
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {helps.map((item) => (
            <div
              key={item.title}
              className={`rounded-xl border bg-white p-6 ${
                item.allergen ? "border-[#d8cce8]" : "border-mkt-steel1"
              }`}
            >
              {item.allergen ? (
                <div className="mb-3 inline-flex rounded-full bg-mkt-allergen1 px-3 py-1 text-xs font-semibold text-mkt-allergen">
                  Allergen emphasis
                </div>
              ) : null}
              <div className="mb-2 text-base font-bold text-mkt-ink">{item.title}</div>
              <p className="text-sm leading-relaxed text-mkt-ink8">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Accurate inputs still matter.
        </h2>
        <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
          A menu description cannot reveal every ingredient in a sauce, dressing or bought-in
          component. Check compound ingredients and substitutions against their source information.
          Labelling also sits alongside your kitchen&apos;s handling, cleaning and staff-training
          procedures.
        </p>
        <a
          href="https://www.gov.uk/government/publications/allergen-checklist-for-food-businesses"
          className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official allergen checklist
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Match the label to how the food is sold.
        </h2>
        <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
          Internal container labels and customer-facing PPDS labels do different jobs. Use the PPDS
          guide when food is packed before customers select it, and check the official rules for
          other sales methods.
        </p>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-8">
          <TextLink href="/natashas-law">PPDS labels</TextLink>
          <TextLink href="/allergen-guide">Allergen reference</TextLink>
        </div>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Questions about allergen information
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
          See the allergen workflow with a real item.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          Bring a sample recipe or supplier specification to a demo and see how the information
          reaches the label.
        </p>
        <Link href="/bookdemo">
          <Button
            size="lg"
            className="border-0 font-semibold text-white"
            style={{ backgroundColor: "#142124", backgroundImage: "none" }}
          >
            Book a demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <div className="mt-8">
          <TextLink href="/kitchen-label-printer">Printer compatibility</TextLink>
        </div>
      </div>
    </section>
  </>
)

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

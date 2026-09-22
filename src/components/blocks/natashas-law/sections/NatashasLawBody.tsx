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
import { PPDSLabelRenderer } from "@/app/dashboard/ppds/PPDSLabelRenderer"

const shortbreadItem = {
  uid: "ppds-shortbread-body",
  id: "ppds-shortbread-body",
  type: "menu",
  name: "Butter shortbread",
  quantity: 1,
  labelType: "ppds",
  ingredients: ["flour", "butter", "sugar"],
}

const shortbreadIngredients = [
  { uuid: "s1", ingredientName: "flour", allergens: [{ allergenName: "Wheat" }] },
  { uuid: "s2", ingredientName: "butter", allergens: [{ allergenName: "Milk" }] },
  { uuid: "s3", ingredientName: "sugar", allergens: [] },
]

const steps = [
  {
    title: "Record the recipe.",
    body: "Enter the complete ingredient information for the item.",
  },
  {
    title: "Check allergen emphasis.",
    body: "Compare the record and preview with the current source information.",
  },
  {
    title: "Check the layout.",
    body: "Ensure the ingredient list fits and remains readable at the actual print size.",
  },
  {
    title: "Print a sample.",
    body: "Check the physical output before labelling the products for sale.",
  },
]

const callouts = [
  { title: "Food name", body: "Identifies what is being sold." },
  {
    title: "Ingredient list",
    body: "Describes the actual recipe, including relevant component details.",
  },
  {
    title: "Allergen emphasis",
    body: "Remains visibly distinct in the printed ingredient list.",
  },
]

const faqs = [
  {
    question: "Is a separate “contains” line enough?",
    answer:
      "It does not replace the full ingredient list with allergen emphasis required for PPDS food.",
  },
  {
    question: "Must I use an 80mm printer?",
    answer:
      "Label width is an equipment and layout choice, not a blanket requirement of Natasha's Law. The information must fit and remain legible.",
  },
  {
    question: "Can I use the sample recipe as a production label?",
    answer:
      "No. Use the actual ingredients, quantities and supplier information for your product and check any additional requirements.",
  },
  {
    question: "Will the software update labels already on products?",
    answer:
      "No. Review affected products and labels through your business's procedure when information changes.",
  },
]

export const NatashasLawBody = () => (
  <>
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          First, check whether the food is PPDS.
        </h2>
        <p className="mb-6 max-w-3xl text-base leading-relaxed text-mkt-ink8">
          PPDS generally concerns food packed at the place it is sold or offered to consumers,
          before they select or order it. Food packed after an order, food supplied by another
          business and distance sales need their own assessment. The sales and packing process
          matters, not simply the presence of a container.
        </p>
        <a
          href="https://www.gov.uk/government/publications/introduction-to-allergen-labelling-for-ppds-food/introduction-to-allergen-labelling-for-ppds-food"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
        >
          Check the official PPDS guidance
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          The ingredient list is the starting point.
        </h2>
        <p className="max-w-3xl text-base leading-relaxed text-mkt-ink8">
          For applicable PPDS foods, the label needs the food name and a full ingredient list with
          the relevant allergenic ingredients emphasised. Use the actual recipe and supplier
          information, including compound ingredients where required. Other food-information
          requirements may also apply.{" "}
          <a
            href="https://www.gov.uk/government/publications/food-allergen-labelling-and-information-requirements-technical-guidance/food-allergen-labelling-and-information-requirements-technical-guidance"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-mkt-teal hover:underline"
          >
            FSA technical guidance
          </a>
          .
        </p>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Prepare, review and test the label.
        </h2>
        <ol className="grid gap-8 md:grid-cols-2">
          {steps.map((step, i) => (
            <li key={step.title} className="flex items-start gap-4">
              <span className="mt-0.5 shrink-0 text-xs font-semibold text-mkt-teal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="mb-1 text-lg font-bold text-mkt-ink">{step.title}</h3>
                <p className="text-sm leading-relaxed text-mkt-ink8">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          See the structure of an ingredient label.
        </h2>
        <div className="grid items-start gap-10 lg:grid-cols-[auto_1fr]">
          <div>
            <PPDSLabelRenderer
              item={shortbreadItem}
              storageInfo=""
              businessName=""
              allIngredients={shortbreadIngredients}
            />
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-mkt-steel">
              Illustrative ingredient layout, not a production-ready label.
            </p>
          </div>
          <ul className="space-y-5">
            {callouts.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mkt-teal" />
                <div>
                  <h3 className="text-lg font-bold text-mkt-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-mkt-ink8">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-mkt-ink8">
          This is a layout illustration. Your finished label needs to reflect your own recipe and
          every requirement that applies to your product.
        </p>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Questions about PPDS labels
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
        <p className="mb-8 text-sm leading-relaxed text-mkt-ink8">
          Use the FSA guidance for England, Wales and Northern Ireland and the{" "}
          <a
            href="https://www.foodstandards.gov.scot/business-guidance/running-a-food-business/publications/guidance-on-labelling-of-food-sold-prepacked-for-direct-sale"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-mkt-teal hover:underline"
          >
            Food Standards Scotland guidance
          </a>{" "}
          for Scotland.
        </p>
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          See the PPDS workflow with your own item.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          Bring a representative recipe and we will show how the information is prepared for a
          label.
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

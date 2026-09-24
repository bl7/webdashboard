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
import { ANDROID_PRINTERS, TRIAL_PERIOD_DAYS } from "@/lib/marketing/site"

type FaqItem = {
  question: string
  answer: React.ReactNode
}

const groups: { id: string; title: string; items: FaqItem[] }[] = [
  {
    id: "product",
    title: "Getting started",
    items: [
      {
        question: "What is InstaLabel?",
        answer:
          "InstaLabel is kitchen labelling software for recording item information, preparing labels and printing through a desktop or supported Android setup.",
      },
      {
        question: "Which kitchens is it intended for?",
        answer:
          "Restaurants, cafés, takeaways and catering teams that need a consistent process for identifying ingredients, prepared items and food packed for direct sale.",
      },
      {
        question: "Which label workflows can I use?",
        answer: (
          <>
            Explore ingredient, prep, cooked, defrost, date/stock-rotation and PPDS workflows. The
            fields vary by label type; see the example for the workflow you need.{" "}
            <Link href="/uses" className="font-semibold text-mkt-teal hover:underline">
              Kitchen workflows
            </Link>
            .
          </>
        ),
      },
      {
        question: "Can I import existing item information?",
        answer: (
          <>
            Yes. Use the current CSV import template and review the imported information before
            printing.{" "}
            <Link href="/features#csv-import" className="font-semibold text-mkt-teal hover:underline">
              CSV import
            </Link>
            .
          </>
        ),
      },
    ],
  },
  {
    id: "information",
    title: "Allergens and PPDS",
    items: [
      {
        question: "Does InstaLabel guarantee compliance?",
        answer:
          "No. It helps you create consistent labels from recorded information. Your food business remains responsible for the accuracy of that information and the procedures and requirements that apply to it.",
      },
      {
        question: "Does allergen information still need to be checked?",
        answer:
          "Yes. Check the actual recipe and supplier information, including substitutions and compound ingredients. A dish name is not a complete recipe.",
      },
      {
        question: "How are dates calculated?",
        answer:
          "InstaLabel uses the applicable configured date settings. Your kitchen decides those settings through its food-safety procedures; the software does not measure freshness.",
      },
      {
        question: "Can I change or reprint an expiry date?",
        answer:
          "Any correction must follow your kitchen's procedure and preserve the item's true history. Reprinting does not restart shelf life. Ask about the current workflow if you need a specific date-control function.",
      },
      {
        question: "Does print history replace our other kitchen records?",
        answer:
          "No. It shows recorded label activity. Keep the cooking, storage, supplier and other records your procedures require.",
      },
      {
        question: "What is the allergen matrix?",
        answer:
          "It is a printable view of the 14 regulated allergen categories recorded across the menu items you select. Review the included items and current source information before exporting it.",
      },
      {
        question: "Does the matrix replace a PPDS ingredient label?",
        answer:
          "No. A matrix and a PPDS label serve different contexts. PPDS food needs the applicable food name, full ingredient list and allergen emphasis. Check how the food is packed and sold before choosing the output.",
      },
    ],
  },
  {
    id: "printing",
    title: "Printers",
    items: [
      {
        question: "What do I need for computer printing?",
        answer: (
          <>
            A Windows or macOS computer, a label printer installed in the operating system, suitable
            label stock and PrintBridge. Check the setup and print a test label.{" "}
            <Link href="/printbridge" className="font-semibold text-mkt-teal hover:underline">
              Desktop printing
            </Link>
            .
          </>
        ),
      },
      {
        question: "Which printers work with Android?",
        answer: (
          <>
            The models confirmed for this release are {ANDROID_PRINTERS.join(" and ")}. Ask about
            any other exact model before buying it.{" "}
            <Link
              href="/kitchen-label-printer"
              className="font-semibold text-mkt-teal hover:underline"
            >
              Printer compatibility
            </Link>
            .
          </>
        ),
      },
      {
        question: "Does any Bluetooth printer work?",
        answer:
          "No. Bluetooth is a connection method, not a guarantee that the app supports the printer.",
      },
      {
        question: "Can I work without internet?",
        answer:
          "Do not assume the complete workflow works offline because the printer connection is local. Check the connectivity requirements for the current web or Android workflow before relying on it during an outage.",
      },
      {
        question: "Which label sizes does InstaLabel print?",
        answer:
          "60×40 mm and 56×80 mm. Both sizes can carry prep, opened, cooked, defrost, use-first and PPDS layouts. Choose the size that fits the printer and the amount of information on the label.",
      },
      {
        question: "Is a printer included?",
        answer:
          "No. Desktop printing uses a label printer already installed on Windows or macOS. Android printing uses a MUNBYN RW411B or Born4Ship DB403.",
      },
    ],
  },
  {
    id: "getting-started",
    title: "Trial and price",
    items: [
      {
        question: "How long does setup take?",
        answer:
          "It depends on your printer setup and how much item information needs preparing. Start with a small group of items and check a test print before rolling the workflow out to your team.",
      },
      {
        question: "Is there a trial?",
        answer: (
          <>
            Yes. You can try InstaLabel for {TRIAL_PERIOD_DAYS} days. Review the trial and billing
            terms before starting.{" "}
            <Link href="/plan" className="font-semibold text-mkt-teal hover:underline">
              Pricing
            </Link>
            .
          </>
        ),
      },
      {
        question: "How do I judge whether it suits my kitchen?",
        answer:
          "Trial a few representative items. Check information entry, label readability, printer setup and the steps your team needs to complete the task. Use those observations to assess the fit.",
      },
      {
        question: "Can I see it before signing up?",
        answer: (
          <>
            Yes. Request a demo and tell us which workflow or printer setup you want to discuss.{" "}
            <Link href="/bookdemo" className="font-semibold text-mkt-teal hover:underline">
              Book a demo
            </Link>
            .
          </>
        ),
      },
    ],
  },
  {
    id: "limits",
    title: "What it does not do",
    items: [
      {
        question: "Does InstaLabel make my kitchen legally compliant?",
        answer:
          "No. It prints labels from the information you save. Your business checks recipes, supplier information and dates, and remains responsible for the labelling that applies to the food.",
      },
      {
        question: "Does InstaLabel log temperatures or run a HACCP system?",
        answer:
          "No. It prints the labels a kitchen uses while it runs its own process. Temperature checks and HACCP records stay in that process.",
      },
      {
        question: "Does InstaLabel decide shelf life?",
        answer:
          "No. Your kitchen sets the date rules. InstaLabel applies those settings when it prepares the label.",
      },
    ],
  },
]

const jumps = [
  { href: "#product", label: "Getting started" },
  { href: "#printing", label: "Printers" },
  { href: "#information", label: "Allergens and PPDS" },
  { href: "#limits", label: "What it does not do" },
  { href: "#getting-started", label: "Trial and price" },
]

export const FaqsPage = () => (
  <>
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
            Support
          </div>
          <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl lg:text-6xl">
            Questions about InstaLabel?
          </h1>
          <p className="max-w-xl text-base text-mkt-ink8 sm:text-lg md:text-xl">
            Find the practical details about labels, item information, printing and getting started.
          </p>
          <nav aria-label="FAQ sections" className="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start">
            {jumps.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-mkt-ink ring-1 ring-mkt-steel1 hover:text-mkt-teal"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px] space-y-4 text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-mkt-steel">
            Where to start
          </p>
          <p className="text-lg font-bold text-mkt-ink">Printers, labels, trial</p>
          <p className="text-sm leading-relaxed text-mkt-ink8">
            The printer you already have, what a label can show, and what InstaLabel does not decide.
          </p>
        </motion.div>
      </div>
      <div className="mkt-hero-fade pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full" />
    </section>

    {groups.map((group, groupIndex) => (
      <section
        key={group.id}
        id={group.id}
        style={{ scrollMarginTop: "7rem" }}
        className={`${groupIndex % 2 === 0 ? "bg-white" : "bg-mkt-canvas"} px-4 py-16 sm:px-6 md:px-12 lg:px-16`}
      >
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            {group.title}
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {group.items.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`${group.id}-${index}`}
                className="rounded-lg border border-mkt-steel1 bg-white px-4"
              >
                <AccordionTrigger className="text-left text-sm font-semibold text-mkt-ink hover:text-mkt-teal">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-sm leading-relaxed text-mkt-ink8"
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    ))}

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Need an answer about your own setup?
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          Include your printer model, device and the workflow you want to use so we can give a
          relevant response.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
            <Link href="/about#contact">
              Contact us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/bookdemo">Book a demo</Link>
          </Button>
        </div>
      </div>
    </section>
  </>
)

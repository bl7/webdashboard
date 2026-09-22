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
import { ANDROID_PRINTERS } from "@/lib/marketing/site"

const checks = [
  "The correct printer is selected.",
  "The label feeds and aligns correctly.",
  "The longest item name and ingredient list fit without clipping.",
  "Dates and allergen emphasis are clear at actual size.",
  "The stock works on the intended container in the intended conditions.",
]

const faqs = [
  {
    question: "Will every Android Bluetooth printer work?",
    answer: "No. Use the supported list above or ask about the exact model.",
  },
  {
    question: "Is RW114B the recommended MUNBYN model?",
    answer:
      "The model confirmed for this release is RW411B. Check the model identifier carefully before purchase.",
  },
  {
    question: "Do I need a specific printer width for Natasha's Law?",
    answer:
      "There is no blanket requirement to use the site's previously advertised 80mm format. Choose a supported layout that presents the applicable information clearly.",
  },
  {
    question: "Can I use a receipt printer?",
    answer:
      "Do not assume receipt-paper capability makes a device suitable for your adhesive label stock. Check the printer's media support, sensing and intended workflow.",
  },
]

export const KitchenLabelPrinterBody = () => (
  <>
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Desktop and Android have different requirements.
        </h2>
        <div className="overflow-x-auto rounded-xl border border-mkt-steel1 bg-white">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">Desktop versus Android printing requirements</caption>
            <thead className="bg-mkt-canvas">
              <tr>
                <th className="px-4 py-3 font-semibold text-mkt-ink" />
                <th className="px-4 py-3 font-semibold text-mkt-ink">Desktop</th>
                <th className="px-4 py-3 font-semibold text-mkt-ink">Android</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-mkt-steel1 align-top">
                <th className="px-4 py-3 font-medium text-mkt-ink">Device</th>
                <td className="px-4 py-3 text-mkt-ink8">Windows or macOS computer</td>
                <td className="px-4 py-3 text-mkt-ink8">Compatible Android device</td>
              </tr>
              <tr className="border-t border-mkt-steel1 align-top">
                <th className="px-4 py-3 font-medium text-mkt-ink">Software</th>
                <td className="px-4 py-3 text-mkt-ink8">InstaLabel web app and PrintBridge</td>
                <td className="px-4 py-3 text-mkt-ink8">InstaLabel Android app</td>
              </tr>
              <tr className="border-t border-mkt-steel1 align-top">
                <th className="px-4 py-3 font-medium text-mkt-ink">Printer route</th>
                <td className="px-4 py-3 text-mkt-ink8">
                  Printer installed in the operating system
                </td>
                <td className="px-4 py-3 text-mkt-ink8">Supported Bluetooth printer connection</td>
              </tr>
              <tr className="border-t border-mkt-steel1 align-top">
                <th className="px-4 py-3 font-medium text-mkt-ink">Model guidance</th>
                <td className="px-4 py-3 text-mkt-ink8">
                  Check the printer&apos;s OS driver, paper settings and test output
                </td>
                <td className="px-4 py-3 text-mkt-ink8">{ANDROID_PRINTERS.join("; ")}</td>
              </tr>
              <tr className="border-t border-mkt-steel1 align-top">
                <th className="px-4 py-3 font-medium text-mkt-ink">Setup guide</th>
                <td className="px-4 py-3">
                  <Link href="/printbridge" className="font-semibold text-mkt-teal hover:underline">
                    Desktop printing
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href="/mobile-app" className="font-semibold text-mkt-teal hover:underline">
                    Android app
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-mkt-ink8">
          No proprietary InstaLabel printer is required. Check your exact printer model and working
          setup before buying hardware.
        </p>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Check what you already have.
        </h2>
        <p className="max-w-3xl text-base leading-relaxed text-mkt-ink8">
          For desktop use, confirm the printer works on your computer with its normal driver. Then
          configure the stock size in the printer and InstaLabel workflow and run a test label. A
          brand name alone does not establish whether the full setup is suitable.
        </p>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Match the stock to the printer and the information.
        </h2>
        <p className="mb-6 max-w-3xl text-base leading-relaxed text-mkt-ink8">
          Check the printing method, width and length, roll/core fit and media sensing. Choose
          enough printable space for the longest label you need. A compact internal label and a long
          PPDS ingredient list may need different layouts.
        </p>
        <Link
          href="/dissolvable-kitchen-labels"
          className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
        >
          Choosing label materials
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Test a representative label.
        </h2>
        <ul className="max-w-3xl space-y-3">
          {checks.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-mkt-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mkt-teal" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Questions about printers
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
        <p className="mt-6">
          <Link
            href="/label-printer-uk-comparison"
            className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
          >
            Compare labelling methods
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </p>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Get advice on your exact setup.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          Send the printer model, operating system and intended label dimensions so we can discuss
          the printing route.
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

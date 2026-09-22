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

const needs = [
  "A Windows or macOS computer compatible with the current PrintBridge release.",
  "A label printer installed and working in the computer's operating system.",
  "Label stock suitable for the printer and the intended use.",
  "Access to your InstaLabel account and the current PrintBridge installer.",
]

const steps = [
  {
    title: "Install the printer.",
    body: "Follow the manufacturer's instructions and confirm the computer can print to it.",
  },
  {
    title: "Install PrintBridge.",
    body: "Use the download provided through InstaLabel and follow the setup instructions for your operating system.",
  },
  {
    title: "Choose the printer and label settings.",
    body: "Check the selected printer, stock size and orientation.",
  },
  {
    title: "Print a test label.",
    body: "Confirm that text is readable and nothing is clipped before using the setup during service.",
  },
]

const issues = [
  {
    issue: "Printer is unavailable",
    check: "Confirm power, connection and the printer's status in the operating system.",
  },
  {
    issue: "InstaLabel cannot reach PrintBridge",
    check: "Confirm the installed app is running and follow the connection instructions.",
  },
  {
    issue: "Text is cut off or labels feed incorrectly",
    check: "Check stock dimensions, orientation and printer calibration.",
  },
  {
    issue: "Print is unclear",
    check: "Check the printer's media and print settings against the stock manufacturer's guidance.",
  },
]

const faqs = [
  {
    question: "Is PrintBridge the Android app?",
    answer:
      "No. PrintBridge is the computer printing connection. Android uses the InstaLabel app and a supported Bluetooth printer.",
  },
  {
    question: "Does local printing mean the whole product works offline?",
    answer:
      "No. The connection to the printer is local, while access to the web app and its data can require internet connectivity. Do not plan an offline workflow without confirming its support.",
  },
  {
    question: "Where do I download it?",
    answer: "Log in to InstaLabel and use the current PrintBridge setup/download area.",
  },
]

export const PrintBridgeBody = () => (
  <>
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Prepare your printing station.
        </h2>
        <ul className="mb-6 space-y-4">
          {needs.map((item) => (
            <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-mkt-ink8">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mkt-ink" />
              {item}
            </li>
          ))}
        </ul>
        <TextLink href="/kitchen-label-printer">Check your printer setup</TextLink>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Set up, test, then print.
        </h2>
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <ol className="space-y-5">
            {steps.map((step, i) => (
              <li key={step.title}>
                <div className="mb-1 text-xs font-semibold text-mkt-teal">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mb-1 text-base font-bold text-mkt-ink">{step.title}</div>
                <p className="text-sm leading-relaxed text-mkt-ink8">{step.body}</p>
              </li>
            ))}
          </ol>
          <figure>
            <div className="overflow-hidden rounded-xl border border-mkt-steel1 bg-white shadow-sm">
              <Image
                src="/webdashboard/print.png"
                alt="InstaLabel print screen with printer selection and a label preview"
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-mkt-steel">
              Print screen showing printer selection and a label preview before a test print.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Keep the focus on the label.
        </h2>
        <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
          Open InstaLabel, select the item and label type, review the preview and print through your
          configured station. Keep PrintBridge running while using desktop printing.
        </p>
        <TextLink href="/uses">See the labelling workflow</TextLink>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          If a label does not print as expected.
        </h2>
        <div className="mb-6 overflow-x-auto rounded-xl border border-mkt-steel1 bg-white">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-mkt-canvas">
              <tr>
                <th className="px-4 py-3 font-semibold text-mkt-ink">Issue</th>
                <th className="px-4 py-3 font-semibold text-mkt-ink">First check</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((row) => (
                <tr key={row.issue} className="border-t border-mkt-steel1">
                  <td className="px-4 py-3 font-medium text-mkt-ink">{row.issue}</td>
                  <td className="px-4 py-3 text-mkt-ink8">{row.check}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed text-mkt-ink8">
          Still need help? Send us your operating system, printer model and a description of the
          problem.           Do not send passwords.{" "}
          <a href="/about#contact" className="font-semibold text-mkt-teal hover:underline">
            Contact.
          </a>
        </p>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Questions about desktop printing
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
          Check your existing printer before replacing it.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          Tell us its exact model and the computer you use so we can discuss the setup.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="border-0 font-semibold text-white"
            style={{ backgroundColor: "#142124", backgroundImage: "none" }}
            asChild
          >
            <a href="/about#contact">
              Ask about my printer
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-mkt-steel1 font-semibold text-mkt-ink hover:border-mkt-ink hover:bg-mkt-ink hover:text-white"
            asChild
          >
            <Link href="/plan">View pricing</Link>
          </Button>
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

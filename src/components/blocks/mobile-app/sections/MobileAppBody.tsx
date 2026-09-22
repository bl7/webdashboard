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
import instalabelImage from "@/assets/images/instaLabel2.png"
import { ANDROID_PRINTERS, PLAY_STORE_URL } from "@/lib/marketing/site"

const steps = [
  {
    title: "Connect your printer.",
    body: "Follow the app's instructions for your supported model.",
  },
  {
    title: "Select the item.",
    body: "Choose the ingredient or product you want to label.",
  },
  {
    title: "Review the details.",
    body: "Check the label type, dates, recorded allergens and preview.",
  },
  {
    title: "Print and apply.",
    body: "Check the printed result and attach it to the correct item.",
  },
]

const faqs = [
  {
    question: "Is there an iPhone app?",
    answer: "This page covers the Android app. No iOS app is being offered here.",
  },
  {
    question: "Will any Bluetooth printer work?",
    answer: "No. Use a supported model or ask us about your exact printer before purchasing.",
  },
  {
    question: "Do I need PrintBridge on Android?",
    answer:
      "No. PrintBridge is for computer printing; the Android app uses its supported mobile printing connection.",
  },
  {
    question: "Can I rely on it without internet?",
    answer:
      "Confirm the current app's connectivity requirements for your workflow before planning offline use. Offline operation is not promised on this page.",
  },
]

export const MobileAppBody = () => (
  <>
    <section
      id="printers"
      className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16"
      style={{ scrollMarginTop: "7rem" }}
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Choose a confirmed printer model.
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-mkt-ink8">
          Check the exact model before buying a printer. A Bluetooth connection alone does not
          establish compatibility with the app.
        </p>
        <div className="mb-6 overflow-x-auto rounded-xl border border-mkt-steel1 bg-white">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <caption className="sr-only">Supported Android models</caption>
            <thead className="bg-mkt-canvas">
              <tr>
                <th className="px-4 py-3 font-semibold text-mkt-ink">Supported Android models</th>
                <th className="px-4 py-3 font-semibold text-mkt-ink">Status</th>
              </tr>
            </thead>
            <tbody>
              {ANDROID_PRINTERS.map((model) => (
                <tr key={model} className="border-t border-mkt-steel1">
                  <td className="px-4 py-3 font-medium text-mkt-ink">{model}</td>
                  <td className="px-4 py-3 text-mkt-ink8">Supported</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <a
          href="/about#contact"
          className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
        >
          Ask about another model
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          From item to label in one workflow.
        </h2>
        <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title}>
              <div className="mb-2 text-xs font-semibold text-mkt-teal">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mb-2 text-lg font-bold text-mkt-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-mkt-ink8">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          See the app before you start.
        </h2>
        <figure className="flex flex-col items-center">
          <Image
            src={instalabelImage}
            alt="InstaLabel Android app sign-in screen"
            width={280}
            height={336}
            className="h-auto w-full max-w-[280px]"
          />
          <figcaption className="mt-3 text-center text-xs text-mkt-steel">
            Sign in to the InstaLabel Android app.
          </figcaption>
        </figure>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Questions about Android printing
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
          Set up your Android printing station.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          Check your printer model, install the app and run a test label before service.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="border-0 font-semibold text-white"
            style={{ backgroundColor: "#142124", backgroundImage: "none" }}
            asChild
          >
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
              Get it on Google Play
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-mkt-steel1 font-semibold text-mkt-ink hover:border-mkt-ink hover:bg-mkt-ink hover:text-white"
            asChild
          >
            <a href="/about#contact">Ask a setup question</a>
          </Button>
        </div>
        <p className="mt-6">
          <Link
            href="/printbridge"
            className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
          >
            Desktop printing with PrintBridge
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </p>
      </div>
    </section>
  </>
)

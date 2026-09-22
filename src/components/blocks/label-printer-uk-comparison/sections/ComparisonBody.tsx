"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"

const rows = [
  {
    consideration: "Item information",
    handwritten: "Written from the kitchen's records",
    standalone: "Entered or stored according to the printer/software",
    instalabel: "Reused from saved item information",
  },
  {
    consideration: "Formatting",
    handwritten: "Depends on the written format",
    standalone: "Depends on configured templates",
    instalabel: "Uses the available kitchen label layouts",
  },
  {
    consideration: "Dates",
    handwritten: "Worked out and written by staff",
    standalone: "Depends on template/software capabilities",
    instalabel: "Calculated from configured date rules and reviewed by staff",
  },
  {
    consideration: "Allergen information",
    handwritten: "Checked and written by staff",
    standalone: "Depends on entered information and template",
    instalabel: "Prepared from recorded ingredient/allergen information",
  },
  {
    consideration: "Recipe changes",
    handwritten: "Update records and future labels",
    standalone: "Update relevant templates or stored items",
    instalabel: "Update affected saved items and check subsequent labels",
  },
  {
    consideration: "Printing equipment",
    handwritten: "No printer required",
    standalone: "Hardware and software requirements vary",
    instalabel: "Desktop PrintBridge or supported Android setup",
  },
  {
    consideration: "Records",
    handwritten: "Separate records may be maintained",
    standalone: "Depends on the system",
    instalabel: "Available print history alongside other kitchen records",
  },
  {
    consideration: "Costs",
    handwritten: "Materials and staff time",
    standalone: "Hardware, supplies and any software fees",
    instalabel: "Subscription, appropriate hardware and supplies as applicable",
  },
]

const checks = [
  "Readable at the actual size",
  "No clipped text",
  "Dates understood",
  "Changes easy to maintain",
  "Hardware works at the intended station",
]

export const ComparisonBody = () => (
  <>
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Compare the work behind the label.
        </h2>
        <div className="overflow-x-auto rounded-xl border border-mkt-steel1 bg-white">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <caption className="sr-only">
              Comparison of handwritten labels, standalone printer workflows and InstaLabel
            </caption>
            <thead className="bg-mkt-canvas">
              <tr>
                <th className="px-4 py-3 font-semibold text-mkt-ink">Consideration</th>
                <th className="px-4 py-3 font-semibold text-mkt-ink">Handwritten labels</th>
                <th className="px-4 py-3 font-semibold text-mkt-ink">
                  Standalone printer/template workflow
                </th>
                <th className="px-4 py-3 font-semibold text-mkt-ink">InstaLabel workflow</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.consideration} className="border-t border-mkt-steel1 align-top">
                  <th className="px-4 py-3 font-medium text-mkt-ink">{row.consideration}</th>
                  <td className="px-4 py-3 text-mkt-ink8">{row.handwritten}</td>
                  <td className="px-4 py-3 text-mkt-ink8">{row.standalone}</td>
                  <td className="px-4 py-3 text-mkt-ink8">{row.instalabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-mkt-steel">
          Capabilities vary between products. This compares typical workflows, not every competing
          brand or model.
        </p>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Run a small, realistic trial.
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-mkt-ink8">
          Choose a few items your team labels regularly. Include a longer ingredient list and a
          supplier substitution. Check the time needed to prepare, review and print the labels, then
          inspect the result on the containers you actually use.
        </p>
        <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
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
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Compare the whole setup.
        </h2>
        <p className="mb-6 max-w-3xl text-base leading-relaxed text-mkt-ink8">
          Consider the subscription, printer, label stock, setup work and staff time together. Use
          measurements from your own trial instead of a universal cost-per-label or return-on-investment
          promise.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Link
            href="/plan"
            className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
          >
            View InstaLabel pricing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/dissolvable-kitchen-labels"
            className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
          >
            Choose label materials
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Compare InstaLabel using your own items.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          See the workflow in a demo or try it with a representative selection from your kitchen.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
            <Link href="/bookdemo">
              Book a demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/register">Start free trial</Link>
          </Button>
        </div>
      </div>
    </section>
  </>
)

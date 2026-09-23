"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"

const csvColumns = [
  { name: "menu_item_name", meaning: "The product or dish you label." },
  { name: "ingredient_name", meaning: "One ingredient used in that item." },
  { name: "shelf_life_days", meaning: "The number of days your kitchen has set for that ingredient." },
  { name: "allergens", meaning: "Allergen names recorded for that ingredient." },
]

const csvRows = [
  ["Caesar Salad", "Parmesan Cheese", "7", "Dairy"],
  ["Caesar Salad", "Caesar Dressing", "14", "Eggs, Fish"],
  ["Caesar Salad", "Croutons", "30", "Gluten, Wheat"],
]

const printHistoryFields = [
  "Item name",
  "Quantity",
  "Label type",
  "Platform",
  "Printed at",
  "Printer",
  "Staff initials",
]

export const FeaturesBody = () => (
  <>
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            Start with information your team can reuse.
          </h2>
          <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
            Save the items you label regularly with their ingredient information. When a recipe or
            supplier changes, update the saved details before preparing more labels.
          </p>
          <ul className="space-y-4 text-sm leading-relaxed text-mkt-ink8">
            <li>
              <strong className="text-mkt-ink">A consistent starting point: </strong>
              Select an existing item instead of rewriting its details for every label.
            </li>
            <li>
              <strong className="text-mkt-ink">Ingredients in context: </strong>
              Keep ingredient information with the products that use it.
            </li>
            <li>
              <strong className="text-mkt-ink">A review habit: </strong>
              Check saved information against current supplier specifications and recipes.
            </li>
          </ul>
        </div>
        <Figure
          src="/webdashboard/dashboard.png"
          alt="Saved items in the InstaLabel dashboard"
          caption="Saved item records in the dashboard. This is an item list, not an approval status."
        />
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Keep allergen information visible.
        </h2>
        <p className="mb-4 text-base leading-relaxed text-mkt-ink8">
          Use the ingredient information recorded for your items to prepare labels with clear
          allergen emphasis. Your team checks the source information; InstaLabel helps carry it into
          a consistent label layout.
        </p>
        <p className="mb-6 text-sm text-mkt-steel">
          Supplier substitutions and recipe changes need a fresh check before the next print run.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <TextLink href="/allergen-compliance">Allergen labelling workflow</TextLink>
          <TextLink href="/natashas-law">PPDS labels</TextLink>
        </div>
      </div>
    </section>

    <section id="matrix" className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16" style={{ scrollMarginTop: "7rem" }}>
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Generate an allergen matrix from the same item records.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          Select the active dishes you want to include, review their recorded allergens and export a
          clear 14-allergen matrix. When a recipe or supplier changes, update the item record and
          generate a fresh version after review.
        </p>
        <ol className="mb-8 grid gap-4 sm:grid-cols-3">
          <li className="rounded-xl border border-mkt-steel1 bg-mkt-canvas p-5">
            <div className="mb-2 text-xs font-semibold text-mkt-teal">01</div>
            <h3 className="mb-2 text-base font-bold text-mkt-ink">Choose the menu.</h3>
            <p className="text-sm leading-relaxed text-mkt-ink8">
              Include the active items that belong on this chart.
            </p>
          </li>
          <li className="rounded-xl border border-mkt-steel1 bg-mkt-canvas p-5">
            <div className="mb-2 text-xs font-semibold text-mkt-teal">02</div>
            <h3 className="mb-2 text-base font-bold text-mkt-ink">Review the records.</h3>
            <p className="text-sm leading-relaxed text-mkt-ink8">
              Resolve duplicate names, blank records and changes before export.
            </p>
          </li>
          <li className="rounded-xl border border-mkt-steel1 bg-mkt-canvas p-5">
            <div className="mb-2 text-xs font-semibold text-mkt-teal">03</div>
            <h3 className="mb-2 text-base font-bold text-mkt-ink">Export the matrix.</h3>
            <p className="text-sm leading-relaxed text-mkt-ink8">
              Generate a dated PDF for the intended kitchen or customer-information use.
            </p>
          </li>
        </ol>
        <p className="mb-6 text-sm leading-relaxed text-mkt-steel">
          InstaLabel organises the information you record. Your team remains responsible for checking
          current ingredients, suppliers and the finished matrix.
        </p>
        <TextLink href="/allergen-compliance#matrix">See the allergen matrix</TextLink>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Apply your kitchen&apos;s date rules consistently.
        </h2>
        <p className="mb-4 text-base leading-relaxed text-mkt-ink8">
          Set the date rules your business uses for its items and workflows. InstaLabel uses those
          settings when creating labels, so staff can review the resulting date in a consistent
          format.
        </p>
        <p className="mb-6 text-sm text-mkt-steel">
          Shelf-life decisions belong in your food-safety procedures. The software does not
          determine whether an item is safe to eat.
        </p>
        <TextLink href="/expiry-date-labels">Explore expiry date labels</TextLink>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            Choose the label. Check the result.
          </h2>
          <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
            Select the label type for your task, review the item details and inspect the preview
            before printing. Keep product names, dates and allergen information readable on the
            label stock you use. Choose the quantity you need for the batch.
          </p>
          <ol className="mb-6 grid gap-3 sm:grid-cols-3">
            {["Select an item", "Review the preview", "Print the label"].map((step, i) => (
              <li key={step} className="rounded-xl border border-mkt-steel1 bg-white p-4">
                <div className="mb-1 text-xs font-semibold text-mkt-teal">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="text-sm font-bold text-mkt-ink">{step}</div>
              </li>
            ))}
          </ol>
          <TextLink href="/uses">See the kitchen workflows</TextLink>
        </div>
        <Figure
          src="/webdashboard/print.png"
          alt="Label preview before printing"
          caption="Label preview on the print screen, before the label is sent to the printer."
        />
      </div>
    </section>

    <section id="csv-import" className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
              Bring your existing item information with you.
            </h2>
            <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
              Use CSV import to prepare your ingredient and product information in a structured
              file. Review it before it becomes part of your labelling workflow.
            </p>
            <ol className="space-y-4 text-sm leading-relaxed text-mkt-ink8">
              <li>
                <strong className="text-mkt-ink">Use the current template. </strong>
                Start with the template provided in the application&apos;s import area.
              </li>
              <li>
                <strong className="text-mkt-ink">Add your information. </strong>
                Match the required columns and save the file as CSV.
              </li>
              <li>
                <strong className="text-mkt-ink">Upload the file. </strong>
                Follow the import screen and resolve any errors it reports.
              </li>
              <li>
                <strong className="text-mkt-ink">Check the imported items. </strong>
                Review ingredients, allergens and date settings before printing.
              </li>
            </ol>
            <div className="mt-6">
              <TextLink href="/bookdemo">See import in a demo</TextLink>
            </div>
          </div>
          <div className="space-y-4">
            <Figure
              src="/webdashboard/upload.png"
              alt="CSV import screen in InstaLabel"
              caption="Import screen where the template is downloaded and files are uploaded."
            />
            <div className="overflow-x-auto rounded-xl border border-mkt-steel1 bg-white">
              <table className="min-w-full text-left text-xs">
                <caption className="sr-only">Required CSV columns from the current import template</caption>
                <thead className="bg-mkt-canvas text-mkt-ink">
                  <tr>
                    {csvColumns.map((col) => (
                      <th key={col.name} className="px-3 py-2 font-semibold">
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvRows.map((row) => (
                    <tr key={row.join("-")} className="border-t border-mkt-steel1 text-mkt-ink8">
                      {row.map((cell, i) => (
                        <td key={`${row[0]}-${csvColumns[i].name}`} className="px-3 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="space-y-1 text-xs text-mkt-steel">
              {csvColumns.map((col) => (
                <li key={col.name}>
                  <code className="text-mkt-ink">{col.name}</code> — {col.meaning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Print from the setup your team uses.
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-mkt-steel1 bg-white p-6">
            <h3 className="mb-3 text-lg font-bold text-mkt-ink">Desktop</h3>
            <p className="mb-4 text-sm leading-relaxed text-mkt-ink8">
              Print from the browser through PrintBridge to a label printer installed on Windows or
              macOS.
            </p>
            <TextLink href="/printbridge">Desktop setup</TextLink>
          </div>
          <div className="rounded-2xl border border-mkt-steel1 bg-white p-6">
            <h3 className="mb-3 text-lg font-bold text-mkt-ink">Android</h3>
            <p className="mb-4 text-sm leading-relaxed text-mkt-ink8">
              Print from the InstaLabel app with a supported Bluetooth printer.
            </p>
            <TextLink href="/mobile-app">Android setup</TextLink>
          </div>
        </div>
        <p className="mt-6">
          <TextLink href="/kitchen-label-printer">Compare equipment requirements</TextLink>
        </p>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            Look back at your label activity.
          </h2>
          <p className="mb-4 text-base leading-relaxed text-mkt-ink8">
            Review the label activity recorded in InstaLabel when checking what your team has
            printed. Use the available item and print details alongside your kitchen&apos;s own
            operational records.
          </p>
          <p className="mb-6 text-sm text-mkt-steel">
            A print record shows label activity. It does not confirm that food was stored, cooked or
            handled correctly.
          </p>
          <p className="text-sm text-mkt-ink8">
            Fields currently shown include {printHistoryFields.join(", ").toLowerCase()}.
          </p>
        </div>
        <Figure
          src="/webdashboard/sessions.png"
          alt="Print history in InstaLabel"
          caption="Print history listing item name, quantity, label type, printer and print time."
        />
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          See how the features work together.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          Walk through an item, its label preview and the printing setup in a demo tailored to your
          kitchen.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
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
          <Link href="/plan">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-mkt-steel1 font-semibold text-mkt-ink hover:border-mkt-ink hover:bg-mkt-ink hover:text-white"
            >
              View pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </>
)

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline">
      {children}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  )
}

function Figure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-xl border border-mkt-steel1 bg-white shadow-sm">
        <Image src={src} alt={alt} width={1200} height={800} className="h-auto w-full object-cover" />
      </div>
      <figcaption className="mt-3 text-xs text-mkt-steel">{caption}</figcaption>
    </figure>
  )
}

"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import { MediaSlot } from "@/components/marketing/MediaSlot"

const steps = [
  {
    title: "Ingredients",
    body: "Save the ingredients your kitchen uses, including the allergen information recorded for each one.",
    file: "dashboard-items.png",
    alt: "Ingredient records in the InstaLabel dashboard",
  },
  {
    title: "Menu item",
    body: "Attach those ingredients to the dish or prep item staff will select at the printer.",
    file: "hand-on-screen.png",
    alt: "Choosing a menu item in InstaLabel",
  },
  {
    title: "Allergens",
    body: "Allergen information saved on the ingredients can be carried onto the label. Staff still check the recipe and the supplier information.",
    file: "dashboard-matrix.png",
    alt: "Allergen information recorded for menu items",
  },
  {
    title: "Date rules you set",
    body: "Your business sets the date rules. InstaLabel applies those settings when it prepares the label. It does not decide shelf life.",
    file: "dashboard-print.png",
    alt: "A label preview with the date from kitchen settings",
  },
  {
    title: "Finished label",
    body: "Review the preview, then print from a computer with PrintBridge or from the Android app on a supported printer.",
    file: "prep-on-container.png",
    alt: "A finished prep label",
  },
]

const csvColumns = [
  { name: "menu_item_name", meaning: "The product or dish you label." },
  { name: "ingredient_name", meaning: "One ingredient used in that item." },
  { name: "shelf_life_days", meaning: "The number of days your kitchen has set for that ingredient." },
  { name: "allergens", meaning: "Allergen names recorded for that ingredient." },
]

export const FeaturesBody = () => (
  <>
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-3 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Five steps. Then a label.
        </h2>
        <p className="mb-10 max-w-2xl text-base leading-relaxed text-mkt-ink8">
          Save the information once. Staff select the item, check it, and print.
        </p>
        <ol className="grid gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="grid items-center gap-6 lg:grid-cols-2">
              <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                <p className="text-sm font-bold text-mkt-teal">{index + 1}</p>
                <h3 className="mt-1 text-2xl font-extrabold text-mkt-ink">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-mkt-ink8">{step.body}</p>
              </div>
              <MediaSlot file={step.file} alt={step.alt} label={step.title} />
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section id="matrix" className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16" style={{ scrollMarginTop: "7rem" }}>
      <div className="container mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            The same records can build a matrix.
          </h2>
          <p className="text-base leading-relaxed text-mkt-ink8">
            The allergen matrix uses the item records already saved for labels. Review it against current recipes and supplier information. A blank cell means nothing is recorded there, not that the item is allergen-free.
          </p>
        </div>
        <MediaSlot
          file="matrix-screen.mp4"
          poster="dashboard-matrix.png"
          alt="Allergen matrix on screen"
          label="Allergen matrix, from the same item records."
        />
      </div>
    </section>

    <section id="csv-import" className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16" style={{ scrollMarginTop: "7rem" }}>
      <div className="container mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            Bring a menu you already have.
          </h2>
          <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
            Import a CSV, then review every row before anyone prints. Importing does not check that ingredients or allergens are correct.
          </p>
          <ul className="space-y-2 text-sm text-mkt-ink8">
            {csvColumns.map((column) => (
              <li key={column.name}>
                <strong className="text-mkt-ink">{column.name}. </strong>
                {column.meaning}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button size="lg" className="bg-mkt-ink text-white hover:bg-mkt-ink" asChild>
              <Link href="/register">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <MediaSlot
          file="setup-screen.mp4"
          poster="setup-screen.png"
          alt="Importing menu items"
          label="Import, review, then print."
        />
      </div>
    </section>
  </>
)

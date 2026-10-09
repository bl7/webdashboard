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
    file: "dashboard-allergens.png",
    alt: "Allergen records in the InstaLabel dashboard",
  },
  {
    title: "Date rules you set",
    body: "Your business sets the date rules. InstaLabel applies those settings when it prepares the label. It does not decide shelf life.",
    file: "dashboard-settings.png",
    alt: "Date settings in the InstaLabel dashboard",
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
          From saved ingredients to a printed label.
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

    <section id="cleaning" className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16" style={{ scrollMarginTop: "7rem" }}>
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 max-w-2xl text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Cleaning checklists for the tasks you already run.
        </h2>
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-mkt-ink8">
          Labelling stays the main job. In the same dashboard you can keep the cleaning list: what needs doing, how often, and whether it was done.
        </p>
        <img
          src="/marketing/cleaning-checklist.jpg"
          alt="Cleaning checklist on the InstaLabel dashboard and the Android app"
          className="mb-10 w-full rounded-lg border border-mkt-steel1"
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Set the task",
              body: "Choose an area, then daily, weekly or monthly. If a monthly date does not exist, the task runs on the last day of that month.",
            },
            {
              title: "Staff complete it",
              body: "On the Android app they open the tasks due, pick who did the check, and mark it done.",
            },
            {
              title: "Look back by day",
              body: "History is that day’s checklist, not a list of future dates. The PDF prints one page per day, using the business name on your profile.",
            },
            {
              title: "One overdue email",
              body: "If a task passes its due time and emails are on, the account receives one message. Opening the dashboard does not send another.",
            },
          ].map((item) => (
            <li key={item.title} className="rounded-xl border border-mkt-steel1 bg-white p-6">
              <h3 className="text-lg font-extrabold text-mkt-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mkt-ink8">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-mkt-ink8">
          This records the cleaning checks you schedule. It does not replace your HACCP records or certify the kitchen.
        </p>
        <h3 className="mb-4 mt-16 max-w-2xl text-3xl font-black tracking-tight text-mkt-ink">
          Temperature records in the same diary.
        </h3>
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-mkt-ink8">
          Staff enter equipment, food and delivery temperatures on the phone. The dashboard shows today’s record and what is still to enter. Those checks stay separate from the cleaning list.
        </p>
        <img
          src="/marketing/temperature-records.jpg"
          alt="Temperature records on the InstaLabel dashboard and the Android app"
          className="w-full rounded-lg border border-mkt-steel1"
        />
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

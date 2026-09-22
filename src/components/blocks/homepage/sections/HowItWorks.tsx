"use client"

import React from "react"

const steps = [
  {
    title: "Add your items.",
    body: "Enter ingredients and products, or bring existing information in with CSV import.",
  },
  {
    title: "Choose the label.",
    body: "Select the item and the label type for the task.",
  },
  {
    title: "Check the details.",
    body: "Review allergens, dates and the label preview before printing.",
  },
  {
    title: "Print and apply.",
    body: "Send the label to your configured printer and apply it to the correct item.",
  },
]

export const HowItWorks = () => (
  <section className="relative bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="container mx-auto max-w-6xl">
      <h2 className="mb-10 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
        From item information to a printed label.
      </h2>
      <ol className="grid gap-8 md:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title}>
            <div className="mb-3 text-sm font-semibold text-mkt-teal">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="mb-2 text-lg font-bold text-mkt-ink">{step.title}</h3>
            <p className="text-sm leading-relaxed text-mkt-ink8">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
)

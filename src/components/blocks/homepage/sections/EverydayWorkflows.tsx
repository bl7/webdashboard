"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const workflows = [
  { label: "Store", href: "/ingredient-labels", body: "Identify stored ingredients." },
  { label: "Prepare", href: "/prep-labels", body: "Label prepared food." },
  { label: "Cook", href: "/cooked-labels", body: "Distinguish cooked batches." },
  { label: "Pack for sale", href: "/natashas-law", body: "PPDS ingredient lists and allergen emphasis." },
]

export const EverydayWorkflows = () => (
  <section className="relative bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="container mx-auto max-w-6xl">
      <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
        The right label for the next task.
      </h2>
      <p className="mb-10 max-w-3xl text-base leading-relaxed text-mkt-ink8">
        Identify stored ingredients, label prepared food, distinguish cooked batches and organise
        items moving through defrosting. Preparing food for direct sale? Use the PPDS workflow for
        ingredient lists and allergen emphasis.
      </p>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {workflows.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-mkt-steel1 bg-white p-5 transition-colors hover:border-mkt-ink"
          >
            <div className="text-base font-bold text-mkt-ink">{item.label}</div>
            <p className="mt-2 text-sm text-mkt-ink8">{item.body}</p>
          </Link>
        ))}
      </div>
      <Link
        href="/uses"
        className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
      >
        Explore kitchen workflows
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </div>
  </section>
)

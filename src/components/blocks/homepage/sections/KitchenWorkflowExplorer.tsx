"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { emitHomeEvent, HomeSpecimen, type HomeLabelKind } from "../home-labels"

const workflows: {
  key: HomeLabelKind
  choice: string
  heading: string
  body: string
  href: string
  link: string
}[] = [
  {
    key: "prep",
    choice: "Prep",
    heading: "Prep done. Details sorted.",
    body: "Give food prepared ahead of service a clear identity, with the item name, recorded allergens and dates from your kitchen’s settings.",
    href: "/prep-labels",
    link: "Explore prep labels",
  },
  {
    key: "cooked",
    choice: "Cooked",
    heading: "A new batch. A clear label.",
    body: "Help the next shift identify cooked food and read its recorded details. Keep cooking and cooling records in your kitchen’s food-safety process.",
    href: "/cooked-labels",
    link: "Explore cooked labels",
  },
  {
    key: "defrost",
    choice: "Defrost",
    heading: "Keep the next step clear.",
    body: "Identify food moving through your defrosting workflow, with its recorded allergens and relevant date information. Follow your kitchen’s defrosting procedure.",
    href: "/defrost-labels",
    link: "Explore defrost labels",
  },
  {
    key: "ingredients",
    choice: "Ingredients",
    heading: "Know what’s in the container.",
    body: "Keep ingredient names, recorded allergens and date information readable after items move from their original packaging into kitchen storage.",
    href: "/ingredient-labels",
    link: "Explore ingredient labels",
  },
  {
    key: "usefirst",
    choice: "Use first",
    heading: "Make the next pick easier.",
    body: "Add a clear use-first prompt to support your stock rotation routine. Keep the original product information and expiry date visible.",
    href: "/uses",
    link: "Explore kitchen workflows",
  },
  {
    key: "ppds",
    choice: "PPDS",
    heading: "Ready for the counter. Clear on the pack.",
    body: "Prepare PPDS labels with the food name, full ingredient information and clear allergen emphasis. Check the recipe and the finished label before sale.",
    href: "/natashas-law",
    link: "Explore PPDS labels",
  },
]

export const KitchenWorkflowExplorer = () => {
  const [selected, setSelected] = useState<HomeLabelKind>("prep")
  const current = workflows.find((item) => item.key === selected) ?? workflows[0]

  return (
    <section id="workflows" className="home-dark home-section" style={{ scrollMarginTop: "7rem" }}>
      <div className="home-wrap">
        <div className="home-eyebrow" style={{ background: "var(--home-deep)", color: "var(--home-lime)" }}>
          From first prep to final pack
        </div>
        <h2 className="home-h2 mt-4">
          One kitchen.
          <br />
          A whole lot of labels.
        </h2>
        <p className="home-lead mt-4">
          Different jobs need different information. Explore the labels that keep your kitchen’s day
          moving.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[16rem_1fr]">
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {workflows.map((item) => (
              <button
                key={item.key}
                type="button"
                className="home-chip"
                style={{
                  background: selected === item.key ? "var(--home-lime)" : "transparent",
                  color: selected === item.key ? "var(--home-ink)" : "#fff",
                  borderColor: selected === item.key ? "var(--home-lime)" : "rgba(255,255,255,0.25)",
                }}
                aria-pressed={selected === item.key}
                onClick={() => {
                  setSelected(item.key)
                  emitHomeEvent("workflow_select", { type: item.key })
                }}
              >
                {item.choice}
              </button>
            ))}
          </div>

          <div className="grid items-start gap-8 md:grid-cols-[auto_1fr]">
            <div>
              <HomeSpecimen key={current.key} kind={current.key} />
              <p className="mt-3 max-w-xs text-xs text-white/70">
                Illustrative layout. Dates must follow your kitchen’s procedures.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold">{current.heading}</h3>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-[#c9d4cc]">{current.body}</p>
              <Link href={current.href} className="home-link mt-5 inline-flex items-center gap-2">
                {current.link}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="sr-only" aria-live="polite">
                Showing {current.choice} labels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

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
    heading: "Prep",
    body: "Food prepared ahead of service gets a clear label with the information your team needs.",
    href: "/prep-labels",
    link: "Explore prep labels",
  },
  {
    key: "ingredients",
    choice: "Opened",
    heading: "Opened",
    body: "Know when an opened product needs to be used.",
    href: "/ingredient-labels",
    link: "Explore opened-product labels",
  },
  {
    key: "cooked",
    choice: "Cooked",
    heading: "Cooked",
    body: "Keep cooked food clearly identified and dated.",
    href: "/cooked-labels",
    link: "Explore cooked labels",
  },
  {
    key: "defrost",
    choice: "Defrost",
    heading: "Defrost",
    body: "Keep track of when food was defrosted and when it needs to be used.",
    href: "/defrost-labels",
    link: "Explore defrost labels",
  },
  {
    key: "usefirst",
    choice: "Use first",
    heading: "Use first",
    body: "Make food that needs attention easy for the team to identify.",
    href: "/uses",
    link: "Explore kitchen workflows",
  },
  {
    key: "ppds",
    choice: "PPDS",
    heading: "PPDS",
    body: "Create customer-facing labels with ingredient and allergen information.",
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
          From first prep
          <br />
          to final pack.
        </h2>
        <p className="home-lead mt-4">
          These are moments in a kitchen day, not a list of software features. The same saved
          information can be printed for each job.
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

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="flex flex-col items-center">
              <div className="flex w-full justify-center overflow-visible rounded-2xl bg-white px-8 py-16 md:px-12 md:py-20">
                <div className="home-workflow-specimen">
                  <HomeSpecimen key={current.key} kind={current.key} />
                </div>
              </div>
              <p className="mt-3 max-w-md text-center text-xs text-white/70">
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

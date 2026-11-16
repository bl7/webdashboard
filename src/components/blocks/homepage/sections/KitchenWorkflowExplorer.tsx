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
    choice: "Default",
    heading: "Default",
    body: "Identify a stored ingredient with its name, recorded allergens and date.",
    href: "/ingredient-labels",
    link: "Explore ingredient labels",
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
    href: "/use-first-labels",
    link: "Explore use-first labels",
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
          Label types
        </div>
        <h2 className="home-h2 mt-4">A label for each stage of the kitchen day.</h2>
        <p className="home-lead mt-4">
          These are moments in a kitchen day, not a list of software features. The same saved
          information can be printed for each job.
        </p>

        <div className="home-catalogue">
          <div className="home-catalogue-index">
            <p className="home-catalogue-kicker">Contents</p>
            <ol>
              {workflows.map((item, index) => (
                <li key={item.key}>
                  <button
                    type="button"
                    className="home-catalogue-row"
                    aria-pressed={selected === item.key}
                    onClick={() => {
                      setSelected(item.key)
                      emitHomeEvent("workflow_select", { type: item.key })
                    }}
                  >
                    <span className="home-catalogue-num">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="home-catalogue-name">{item.choice}</span>
                      <span className="home-catalogue-line">{item.body}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="home-catalogue-spine" aria-hidden="true" />
          <div className="home-catalogue-sheet">
            <p className="home-catalogue-kicker">{current.choice}</p>
            <div className={`home-catalogue-label${current.key === "ppds" ? " is-tall" : ""}`}>
              <div className="home-workflow-specimen">
                <HomeSpecimen key={current.key} kind={current.key} />
              </div>
            </div>
            <h3 className="home-catalogue-title">{current.heading}</h3>
            <Link href={current.href} className="home-link home-catalogue-link">
              {current.link}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="home-catalogue-note">
              Illustrative layout. Dates must follow your kitchen’s procedures.
            </p>
            <p className="sr-only" aria-live="polite">
              Showing {current.choice} labels.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

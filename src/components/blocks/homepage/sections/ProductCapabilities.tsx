"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { HomeSpecimen, ILLUSTRATIVE_EXPIRY, ILLUSTRATIVE_PRINTED } from "../home-labels"

const ingredients = [
  { name: "Carrots", allergen: false },
  { name: "Broccoli", allergen: false },
  { name: "Celery", allergen: true },
  { name: "Peppers", allergen: false },
]

function kitchenDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const steps = [
  {
    key: "ingredients",
    label: "Ingredients",
    title: "Save the ingredients with the item.",
    body: "Ingredients saved with the item are carried onto the label, including an allergen recorded against one of them.",
    href: "/features",
    link: "Explore the software",
  },
  {
    key: "item",
    label: "Menu item",
    title: "Choose the item. Check the details.",
    body: "Menu items and ingredients stay in one place. Staff pick the job, review what is already saved, and print.",
    href: "/features",
    link: "Explore the software",
  },
  {
    key: "allergens",
    label: "Allergen information",
    title: "Allergens travel with the item.",
    body: "Saved allergen information can be carried onto the label, with the ingredients that contain them emphasised.",
    href: "/allergen-compliance",
    link: "Explore allergen labelling",
  },
  {
    key: "dates",
    label: "Date rules",
    title: "Your kitchen’s date rules.",
    body: "Your business sets the date rules. InstaLabel applies those settings when generating labels, so the team sees a consistent format to check before printing.",
    href: "/expiry-date-labels",
    link: "Explore date labelling",
  },
  {
    key: "label",
    label: "Finished label",
    title: "The saved information becomes the label.",
    body: "InstaLabel applies the saved item, allergens and date rules when it prints. It does not decide whether a label is legally compliant.",
    href: "#workflows",
    link: "See the label types",
  },
] as const

export const ProductCapabilities = () => {
  const [selected, setSelected] = useState<(typeof steps)[number]["key"]>("item")
  const current = steps.find((step) => step.key === selected) ?? steps[1]

  return (
    <section id="features" className="home-section" style={{ scrollMarginTop: "7rem" }}>
      <div className="home-wrap">
        <div className="home-eyebrow">Behind every label</div>
        <h2 className="home-h2 mt-4">Save the information, then print the label.</h2>
        <p className="home-lead mt-4 max-w-2xl">
          InstaLabel stores the information your kitchen already works from, then uses it to
          generate the finished label.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--home-muted)]">
          Your business sets the ingredients, allergens and date rules. InstaLabel applies those
          settings when it prints. It does not decide whether a label is legally compliant.
        </p>

        <div className="home-path home-card">
          <div className="home-path-steps" role="tablist" aria-label="How a label is built">
            {steps.map((step, index) => (
              <button
                key={step.key}
                type="button"
                role="tab"
                className="home-path-step"
                aria-selected={selected === step.key}
                onClick={() => setSelected(step.key)}
              >
                <span className="home-path-num">{index + 1}</span>
                <span>{step.label}</span>
              </button>
            ))}
          </div>

          <div className="home-path-stage" role="tabpanel">
            <div>
              <h3 className="text-2xl font-extrabold">{current.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
                {current.body}
              </p>
              {current.key === "allergens" && (
                <p className="mt-3 text-sm font-semibold">
                  Always check the current recipe and supplier information.
                </p>
              )}
              <Link href={current.href} className="home-link mt-4 inline-flex items-center gap-2">
                {current.link}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="home-path-visual">
              {current.key === "ingredients" && (
                <ul className="home-path-list">
                  {ingredients.map((item) => (
                    <li key={item.name}>
                      <span>{item.name}</span>
                      {item.allergen && <span className="home-path-tag">Allergen recorded</span>}
                    </li>
                  ))}
                </ul>
              )}
              {current.key === "item" && (
                <Image
                  src="/webdashboard/print.png"
                  alt="InstaLabel printing interface, with an item selected and a label preview"
                  width={1200}
                  height={800}
                  className="h-auto w-full rounded-xl"
                />
              )}
              {current.key === "allergens" && (
                <div className="flex flex-col items-center">
                  <HomeSpecimen kind="ppds" />
                  <p className="mt-3 text-center text-xs text-[var(--home-muted)]">
                    Illustrative PPDS layout from the InstaLabel label renderer, using bread,
                    cheddar and butter with allergen emphasis. Not a production-ready label.
                  </p>
                </div>
              )}
              {current.key === "dates" && (
                <dl className="home-path-dates">
                  <div>
                    <dt>Printed</dt>
                    <dd>{kitchenDate(ILLUSTRATIVE_PRINTED)}</dd>
                  </div>
                  <div>
                    <dt>Expires</dt>
                    <dd>{kitchenDate(ILLUSTRATIVE_EXPIRY)}</dd>
                  </div>
                </dl>
              )}
              {current.key === "label" && <HomeSpecimen kind="prep" />}
            </div>
            <p className="sr-only" aria-live="polite">
              Showing {current.label}.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

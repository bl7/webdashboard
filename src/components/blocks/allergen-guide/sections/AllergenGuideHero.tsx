"use client"

import React from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import { motion } from "framer-motion"

const categories = [
  "Celery",
  "Cereals containing gluten",
  "Crustaceans",
  "Eggs",
  "Fish",
  "Lupin",
  "Milk",
  "Molluscs",
  "Mustard",
  "Nuts",
  "Peanuts",
  "Sesame",
  "Soya",
  "Sulphur dioxide and sulphites",
]

const jumps = [
  { href: "#allergens", label: "14 allergen categories" },
  { href: "#contexts", label: "Labelling contexts" },
  { href: "#checks", label: "Checking routine" },
  { href: "#matrix", label: "Allergen matrix" },
  { href: "#quiz", label: "Practice quiz" },
  { href: "#sources", label: "Official resources" },
]

export const AllergenGuideHero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-mkt-canvas px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-mkt-steel1 opacity-50 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-mkt-ink opacity-10 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-mkt-canvas opacity-80 blur-3xl" />

      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl space-y-6 text-center md:text-left"
        >
          <div className="inline-flex items-center rounded-full bg-mkt-allergen1 px-4 py-2 text-sm font-medium text-mkt-allergen ring-1 ring-[#d8cce8]">
            Allergen reference
          </div>

          <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl lg:text-6xl">
            An allergen labelling reference for kitchen teams.
          </h1>

          <p className="max-w-xl text-base text-mkt-ink8 sm:text-lg md:text-xl">
            Use this guide to identify the regulated allergen categories, understand why the sales
            context matters and practise the checks your team makes before sharing food information.
          </p>

          <p className="text-sm text-mkt-steel">
            This is a practical reference. Follow the current official guidance for your location,
            products and sales method.
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm md:justify-start">
            {jumps.map((item, index) => (
              <span key={item.href} className="inline-flex items-center gap-3">
                {index > 0 ? <span className="text-mkt-steel" aria-hidden="true">·</span> : null}
                <a href={item.href} className="font-semibold text-mkt-teal hover:underline">
                  {item.label}
                </a>
              </span>
            ))}
          </nav>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 md:justify-start">
            <Button size="lg" className="bg-mkt-ink px-6 py-3 text-white hover:bg-mkt-ink" asChild>
              <a href="#allergens">
                View the 14 categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#quiz">Practice quiz</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="space-y-4">
            <div className="rounded-lg border border-mkt-steel1 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-mkt-ink">14 regulated categories</h2>
                <div className="rounded bg-mkt-allergen1 px-2 py-1 text-xs font-medium text-mkt-allergen">
                  Reference
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                {categories.map((allergen) => (
                  <div
                    key={allergen}
                    className="rounded border border-mkt-steel1 bg-mkt-canvas px-2 py-1 text-[11px] font-medium text-mkt-ink"
                  >
                    {allergen}
                  </div>
                ))}
              </div>
              <p className="text-xs text-mkt-steel">
                These categories are not a checklist to print on every label.
              </p>
            </div>

            <div className="ml-4 rounded-lg border border-mkt-steel1 bg-white p-4 shadow-lg">
              <h3 className="mb-1 text-sm font-bold text-mkt-ink">Sales context matters</h3>
              <p className="text-xs leading-relaxed text-mkt-ink8">
                PPDS, other prepacked food and loose or distance sales have different information
                requirements.
              </p>
            </div>

            <div className="ml-8 rounded-lg border border-mkt-steel1 bg-white p-4 shadow-sm">
              <h3 className="mb-1 text-sm font-bold text-mkt-ink">A practice quiz, not a certificate</h3>
              <p className="text-xs leading-relaxed text-mkt-ink8">
                Ten questions to discuss with your team. Completing them is not an inspection result.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)" }}
      />
    </section>
  )
}

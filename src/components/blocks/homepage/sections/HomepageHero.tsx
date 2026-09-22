"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { emitHomeEvent, HomeSpecimen, type HomeLabelKind } from "../home-labels"

const types: { key: Extract<HomeLabelKind, "prep" | "cooked" | "ppds">; label: string }[] = [
  { key: "prep", label: "Prep" },
  { key: "cooked", label: "Cooked" },
  { key: "ppds", label: "PPDS" },
]

export const HomepageHero = () => {
  const [kind, setKind] = useState<Extract<HomeLabelKind, "prep" | "cooked" | "ppds">>("prep")
  const [printing, setPrinting] = useState(false)
  const [status, setStatus] = useState("")

  useEffect(() => {
    setPrinting(false)
    setStatus("")
  }, [kind])

  useEffect(() => {
    if (!printing) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = window.setTimeout(
      () => {
        setPrinting(false)
        setStatus("Demonstration complete. No printer was used.")
      },
      reduce ? 50 : 900
    )
    return () => window.clearTimeout(timer)
  }, [printing])

  const tryPrint = () => {
    if (printing) return
    emitHomeEvent("demo_print", { type: kind })
    setStatus("Demonstration in progress. No printer is being used.")
    setPrinting(true)
  }

  return (
    <section className="home-hero home-section relative overflow-hidden">
      <div className="home-wrap grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="space-y-6 text-center md:text-left">
          <div className="home-eyebrow">Kitchen labelling software</div>
          <h1 className="home-h1">
            Your kitchen moves fast.
            <br />
            <span style={{ color: "var(--home-forest)" }}>Your labels should too.</span>
          </h1>
          <p className="home-lead mx-auto md:mx-0">
            Less writing. More cooking. Turn your saved ingredients, allergen information and date
            rules into clear, consistent labels for every stage of kitchen prep.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Link
              href="/register"
              className="home-btn home-btn-primary"
              onClick={() => emitHomeEvent("trial_click", { location: "hero" })}
            >
              Start free trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#workflows" className="home-btn home-btn-ghost">
              See the labels in action
            </a>
          </div>
          <p className="text-sm" style={{ color: "var(--home-muted)" }}>
            Print from a computer or the Android app.
          </p>
        </div>

        <div>
          <div className="home-print-stage">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-white/70">Demo</p>
                <p className="text-lg font-extrabold">A little order. On a roll.</p>
              </div>
              <span className="home-sticker">Made for the rush.</span>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {types.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="home-chip"
                  aria-pressed={kind === item.key}
                  onClick={() => {
                    setKind(item.key)
                    emitHomeEvent("hero_label_select", { type: item.key })
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="home-print-scale py-2">
              <div className={`home-print-label ${printing ? "is-printing" : ""}`}>
                <HomeSpecimen key={kind} kind={kind} />
              </div>
            </div>
            <p className="mt-3 text-xs text-white/70">
              Illustrative labels. No printer needed for this demo.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="home-btn home-btn-primary"
                style={{ background: "var(--home-lime)", color: "var(--home-ink)" }}
                onClick={tryPrint}
                disabled={printing}
              >
                Try a demo print
              </button>
              <p className="text-xs text-white/80" role="status" aria-live="polite">
                {status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

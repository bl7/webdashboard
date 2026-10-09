"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { emitHomeEvent } from "../home-labels"

export const HomepageClosingCTA = () => (
  <section className="home-end home-section">
    <div className="home-wrap text-center">
      <div className="home-eyebrow">Free trial</div>
      <h2 className="home-h2 mx-auto mt-4 max-w-3xl">
        Print kitchen labels from the information you already keep.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-[1.05rem] leading-relaxed">
        Start a free trial, or book a demo to walk through your printer and the labels your team
        needs.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/register"
          className="home-btn home-btn-primary"
          onClick={() => emitHomeEvent("trial_click", { location: "closing" })}
        >
          Start free trial
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/bookdemo"
          className="home-btn home-btn-ghost"
          style={{ borderColor: "var(--home-ink)" }}
          onClick={() => emitHomeEvent("demo_click", { location: "closing" })}
        >
          Book a demo
        </Link>
      </div>
    </div>
  </section>
)

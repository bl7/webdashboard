"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { emitHomeEvent } from "../home-labels"

export const HomepageClosingCTA = () => (
  <section className="home-close home-section">
    <div className="home-wrap text-center">
      <div className="home-eyebrow" style={{ background: "#fff", color: "var(--home-ink)" }}>
        Less label fuss. More good food.
      </div>
      <h2 className="home-h2 mx-auto mt-4 max-w-3xl">
        Bring a little order
        <br />
        to the beautiful chaos.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-[1.05rem] leading-relaxed">
        Start with your own items, or let us walk you through your first label.
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

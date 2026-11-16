"use client"

import React from "react"
import Link from "next/link"

export const PlanHero = () => {
  return (
    <header className="mx-auto max-w-6xl px-4 pb-2 pt-28 sm:px-6 md:px-12 lg:px-16">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mkt-teal">Pricing</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-mkt-ink sm:text-5xl">
        Kitchen labelling software for the printer you already have.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mkt-ink8">
        There is no printer in the box. Use a label printer already installed on Windows or macOS,
        or the Android app with a MUNBYN RW411B, Born4Ship DB403 or Rongta RP425. New subscriptions
        start with a 14-day trial. Payment details are collected at checkout, there is no charge
        during the trial, and billing continues after it until you cancel.
      </p>
      <p className="mt-4 text-sm">
        <Link href="/bookdemo" className="font-semibold text-mkt-teal">
          Book a demo
        </Link>
      </p>
    </header>
  )
}

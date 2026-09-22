"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const WhyInstaLabel = () => {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          See what InstaLabel does.
        </h2>
        <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
          Explore the features or follow a typical kitchen workflow from selecting an item to
          applying its label.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link
            href="/features"
            className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
          >
            Explore features
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/uses"
            className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
          >
            Explore workflows
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

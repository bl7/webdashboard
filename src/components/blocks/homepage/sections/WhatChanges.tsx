"use client"

import React from "react"

const points = [
  {
    title: "Keep item details together.",
    body: "Reuse saved ingredient and allergen information when you prepare labels.",
  },
  {
    title: "Make dates easier to read.",
    body: "Apply your configured date rules and print them in a consistent format.",
  },
  {
    title: "Give each shift the same starting point.",
    body: "Use the same label layouts across everyday kitchen tasks.",
  },
]

export const WhatChanges = () => (
  <section className="relative bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="container mx-auto max-w-6xl">
      <h2 className="mb-10 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
        Less rewriting. Clearer information.
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {points.map((point) => (
          <div key={point.title} className="space-y-2">
            <h3 className="text-lg font-bold text-mkt-ink">{point.title}</h3>
            <p className="text-sm leading-relaxed text-mkt-ink8">{point.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

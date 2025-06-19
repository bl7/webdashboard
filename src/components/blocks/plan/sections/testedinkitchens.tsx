"use client"

import React from "react"

export const TestedInKitchens = () => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto max-w-4xl space-y-10 px-4 text-center sm:px-6 md:px-12 lg:px-16">
        {/* Heading */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">
            Built with Real Kitchens, Refined with Feedback
          </h2>
          <p className="text-lg text-muted-foreground">
            Before launching InstaLabel, we tested it with real kitchens across London — from
            family-run takeaways to high-volume dark kitchens. The result? A simpler, faster, and
            more compliant way to label food.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-muted/10 p-6 text-left shadow-sm">
            <h3 className="text-lg font-semibold text-primary">📦 Fast to Deploy</h3>
            <p className="mt-2 text-muted-foreground">
              Kitchen staff were up and printing within 10 minutes — no IT team needed.
            </p>
          </div>

          <div className="rounded-xl bg-muted/10 p-6 text-left shadow-sm">
            <h3 className="text-lg font-semibold text-primary">🔁 Feedback-Driven</h3>
            <p className="mt-2 text-muted-foreground">
              We rebuilt key flows based on chef and manager input — fewer taps, fewer mistakes.
            </p>
          </div>

          <div className="rounded-xl bg-muted/10 p-6 text-left shadow-sm">
            <h3 className="text-lg font-semibold text-primary">✅ EHO-Approved Layouts</h3>
            <p className="mt-2 text-muted-foreground">
              Labels meet food safety guidelines. Several testers passed inspections while using
              InstaLabel.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

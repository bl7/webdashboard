"use client"

import React from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import Link from "next/link"
import { motion } from "framer-motion"

export const DissolvableKitchenLabelsHero = () => (
  <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-mkt-canvas px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
    <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-mkt-steel1 opacity-50 blur-3xl" />
    <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-mkt-ink opacity-10 blur-3xl" />
    <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-10 md:flex-row md:gap-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl space-y-6 text-center md:text-left"
      >
        <div className="inline-flex items-center rounded-full bg-mkt-canvas px-4 py-2 text-sm font-medium text-mkt-ink ring-1 ring-mkt-steel1">
          Label materials
        </div>
        <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl lg:text-6xl">
          Choose label stock for the job it needs to do.
        </h1>
        <p className="max-w-xl text-base text-mkt-ink8 sm:text-lg md:text-xl">
          Dissolvable stock is designed for removal under specified conditions. Before using it in
          your kitchen, check the manufacturer&apos;s instructions, printer compatibility and the
          surface where the label will be applied.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
          <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
            <Link href="/kitchen-label-printer">
              Check your printer setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about#contact">Ask a setup question</Link>
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="w-full max-w-[500px] space-y-4 text-left"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-mkt-steel">
          Check before you buy
        </p>
        <p className="text-lg font-bold text-mkt-ink">Printer fit</p>
        <p className="text-sm leading-relaxed text-mkt-ink8">
          Confirm the print method, width, roll and media sensing with the stock supplier.
        </p>
        <p className="text-lg font-bold text-mkt-ink">Application</p>
        <p className="text-sm leading-relaxed text-mkt-ink8">
          Test the label on the actual container and in the conditions where it will be used.
        </p>
        <p className="text-lg font-bold text-mkt-ink">Removal</p>
        <p className="text-sm leading-relaxed text-mkt-ink8">
          Follow the specified removal method, temperature and time. Software does not change how
          the material behaves.
        </p>
      </motion.div>
    </div>
    <div className="mkt-hero-fade pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full" />
  </section>
)

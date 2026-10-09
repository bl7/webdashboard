"use client"

import React from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import Link from "next/link"
import { motion } from "framer-motion"

export const NatashasLawHero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-mkt-canvas px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-mkt-steel1 opacity-60 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-mkt-ink opacity-10 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-mkt-canvas opacity-80 blur-3xl" />

      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl space-y-6 text-center md:text-left"
        >
          <div className="inline-flex items-center rounded-full bg-mkt-canvas px-4 py-2 text-sm font-medium text-mkt-ink ring-1 ring-mkt-steel1">
            Packed food
          </div>
          <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl lg:text-6xl">
            Packed-food labels from your saved ingredient information.
          </h1>
          <p className="max-w-xl text-base text-mkt-ink8 sm:text-lg md:text-xl">
            This PPDS labelling software prepares PPDS labels from the food name and ingredient
            list you save. Natasha’s Law labels use the same Natasha’s Law label software preview,
            and you still review the recipe and the printed result before offering the product for
            sale.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
            <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
              <Link href="/bookdemo">
                See a PPDS demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/allergen-guide">Read the allergen guide</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex w-full max-w-[500px] flex-col items-center md:items-end"
        >
          <img
            src="/marketing/ppds-tall-close.jpg"
            alt="Taller PPDS label on a packed California roll"
            className="w-full max-w-[420px] rounded-lg border border-mkt-steel1 object-contain"
          />
          <p className="mt-3 text-center text-xs text-mkt-steel md:text-right">
            A 56×80 mm PPDS label on packed food.
          </p>
        </motion.div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)" }} />
    </section>
  )
}

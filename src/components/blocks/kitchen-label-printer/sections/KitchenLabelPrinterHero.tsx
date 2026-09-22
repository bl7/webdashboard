"use client"

import React from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import Link from "next/link"
import { motion } from "framer-motion"
import { ANDROID_PRINTERS } from "@/lib/marketing/site"

export const KitchenLabelPrinterHero = () => (
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
          Printer compatibility
        </div>
        <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl lg:text-6xl">
          Choose the right printer setup for InstaLabel.
        </h1>
        <p className="max-w-xl text-base text-mkt-ink8 sm:text-lg md:text-xl">
          Start with the device your team will print from. Desktop printing uses PrintBridge and the
          operating system&apos;s printer setup. Android printing uses supported Bluetooth models.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
          <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
            <Link href="/about#contact">
              Ask about my printer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/bookdemo">Book a demo</Link>
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
          Two printing routes
        </p>
        <p className="text-lg font-bold text-mkt-ink">Desktop</p>
        <p className="text-sm leading-relaxed text-mkt-ink8">
          InstaLabel in the browser with PrintBridge and a printer installed on Windows or macOS.
        </p>
        <p className="text-lg font-bold text-mkt-ink">Android</p>
        <p className="text-sm leading-relaxed text-mkt-ink8">
          InstaLabel app with {ANDROID_PRINTERS.join(" or ")}.
        </p>
      </motion.div>
    </div>
    <div className="mkt-hero-fade pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full" />
  </section>
)

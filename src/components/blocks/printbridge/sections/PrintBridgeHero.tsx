"use client"

import { Button } from "@/components/ui"
import { ArrowRight, Download, Wifi, Shield } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export const PrintBridgeHero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
      {/* Background elements */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-10 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-10 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-10 blur-3xl" />

      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl space-y-6 text-center md:text-left"
        >
          {/* 1. Tagline pill at the top (with Wifi icon, matching Uses hero pill style) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
              <Wifi className="mr-2 h-4 w-4" />
              PrintBridge Technology
            </div>
          </motion.div>

          {/* 2. Headline: two lines only, first line purple, second line black, both short. Font and spacing match Uses hero. Subheadline/explanation in paragraph below. Adjust vertical spacing to match other heroes. */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="text-purple-600">No More Print Popups</span>
              <br className="hidden md:block" />
              <span>PrintBridge ends browser print dialog frustration</span>
            </h1>
          </motion.div>

          {/* 3. Subheadline: PrintBridge description as a <p> below the headline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
              PrintBridge is our simple printing solution—a small app for Windows
              and Mac. PrintBridge links your web dashboard to your thermal printers. No tricky network
              setup. No cloud needed. Just fast, reliable printing for your kitchen labels.
            </p>
          </motion.div>

          {/* 4. Key benefits grid (same as before) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Local & Secure</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Download className="h-4 w-4 text-purple-600" />
                <span>One-Click Setup</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Wifi className="h-4 w-4 text-purple-600" />
                <span>Always Connected</span>
              </div>
            </div>
          </motion.div>

          {/* 5. CTAs (primary: 'Start Free Trial', secondary: 'Learn More About PrintBridge') */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Button size="lg" className="bg-purple-600 px-6 py-3 text-white hover:bg-purple-700">
                <Link href="/register">Start Free Trial</Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/printbridge">
                  Learn More About PrintBridge
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-500 md:justify-start">
              <span>✓ Works with any thermal printer</span>
              <span>✓ No internet required for printing</span>
              <span>✓ Automatic reconnection</span>
            </div>
          </motion.div>
        </motion.div>

        {/* 6. Right visual: single stylized card, matching Uses hero's card style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="relative">
            {/* Split-screen card */}
            <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg md:flex-row">
              {/* Left: Browser Print Dialog */}
              <div className="flex flex-1 flex-col justify-between border-b border-gray-100 bg-gray-50 p-4 md:border-b-0 md:border-r">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-gray-500">Print</span>
                  </div>
                  <div className="mb-2 space-y-1">
                    <div className="h-3 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-3 w-1/2 rounded bg-gray-100"></div>
                    <div className="h-3 w-2/3 rounded bg-gray-100"></div>
                  </div>
                  <div className="mb-2 text-xs text-gray-400">
                    Select Printer: <span className="text-gray-600">HP LaserJet (Offline)</span>
                  </div>
                </div>
                <button className="mt-2 w-full rounded bg-purple-200 py-1 text-xs font-semibold text-purple-700 shadow">
                  Print
                </button>
                <div className="mt-2 text-[10px] text-red-400">
                  Wrong printer? Confused? Popup blocked?
                </div>
              </div>
              {/* Right: Success Message */}
              <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                <div className="mb-2 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mb-1 text-lg font-bold text-gray-800">Label Printed!</div>
                <div className="text-xs text-gray-500">No popups. No confusion. Just done.</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Bottom fade overlay */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)" }}
      />
    </section>
  )
}

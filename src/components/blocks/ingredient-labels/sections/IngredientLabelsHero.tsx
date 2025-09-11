"use client"

import { Button } from "@/components/ui"
import { ArrowRight, Calendar, Package, Users } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export const IngredientLabelsHero = () => {
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
          {/* 1. Tagline pill at the top */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
              <Package className="mr-2 h-4 w-4" />
              Ingredient Labels
            </div>
          </motion.div>

          {/* 2. Headline: two lines only, first line purple, second line black */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="text-purple-600">Ingredient Labels</span>
              <br className="hidden md:block" />
              <span>That Keep Your Kitchen Organised</span>
            </h1>
          </motion.div>

          {/* 3. Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
              Label storage containers and prep stations with clear expiry dates and staff initials.
            </p>
          </motion.div>

          {/* 4. Key benefits grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span>Auto Expiry Dates</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Users className="h-4 w-4 text-purple-600" />
                <span>Staff Initials</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Package className="h-4 w-4 text-purple-600" />
                <span>40mm Labels</span>
              </div>
            </div>
          </motion.div>

          {/* 5. CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Button size="lg" className="bg-purple-600 px-6 py-3 text-white hover:bg-purple-700">
                <Link href="/register">Try Ingredient Labels</Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/uses">See All Label Types</Link>
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
              <span>✓ Clear expiry dates</span>
              <span>✓ Staff initials</span>
              <span>✓ 40mm label option</span>
            </div>
          </motion.div>
        </motion.div>

        {/* 6. Right visual: split-screen card, matching PrintBridge hero's card style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="relative">
            {/* Split-screen card */}
            <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg md:flex-row">
              {/* Left: Unlabeled Container */}
              <div className="flex flex-1 flex-col justify-between border-b border-gray-100 bg-gray-50 p-4 md:border-b-0 md:border-r">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-gray-500">Storage Container</span>
                  </div>
                  <div className="mb-2 space-y-1">
                    <div className="h-3 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-3 w-1/2 rounded bg-gray-100"></div>
                    <div className="h-3 w-2/3 rounded bg-gray-100"></div>
                  </div>
                  <div className="mb-2 text-xs text-gray-400">
                    Contents: <span className="text-gray-600">Unknown</span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-red-400">
                  No expiry date? No staff initials? Confusion!
                </div>
              </div>
              {/* Right: Labeled Success */}
              <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
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
                <div className="mb-1 text-lg font-bold text-gray-800">Fresh Basil</div>
                <div className="text-xs text-gray-500">Expires: SUN 15 Dec 2024</div>
                <div className="text-xs text-gray-500">Staff: BR</div>
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

"use client"

import { Button } from "@/components/ui"
import { ArrowRight, Shield, CheckCircle, AlertTriangle } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export const NatashasLawHero = () => {
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
              <Shield className="mr-2 h-4 w-4" />
              Natasha's Law / PPDS Labels
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
              <span className="text-purple-600">Natasha's Law / PPDS Labels</span>
              <br className="hidden md:block" />
              <span>— Compliance Made Effortless</span>
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
              Print fully compliant PPDS labels in seconds. InstaLabel automatically formats
              ingredients, highlights allergens, and includes all legally required info.
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
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>FSA Compliant</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <AlertTriangle className="h-4 w-4 text-purple-600" />
                <span>Allergen Highlighted</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Legal Protection</span>
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
                <Link href="/register">Start Free Trial</Link>
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
              <span>✓ Fully FSA compliant</span>
              <span>✓ Automatic allergen detection</span>
              <span>✓ 80mm thermal printer ready</span>
            </div>
          </motion.div>
        </motion.div>

        {/* 6. Right visual: PPDS label mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="relative">
            {/* PPDS Label Mockup */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              {/* Label Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Chicken Caesar Salad</h3>
                  <div className="rounded-full bg-white/20 px-2 py-1 text-xs font-semibold text-white">
                    PPDS
                  </div>
                </div>
              </div>

              {/* Label Content */}
              <div className="p-4">
                <div className="mb-3">
                  <h4 className="mb-2 text-sm font-semibold text-gray-800">Ingredients:</h4>
                  <div className="space-y-1 text-xs text-gray-700">
                    <div>Chicken Breast, Romaine Lettuce</div>
                    <div className="font-semibold text-red-600">
                      Caesar Dressing (contains: Egg, Fish)
                    </div>
                    <div className="font-semibold text-red-600">
                      Parmesan Cheese (contains: Milk)
                    </div>
                    <div className="font-semibold text-red-600">Croutons (contains: Wheat)</div>
                  </div>
                </div>

                <div className="mb-3 border-t border-gray-200 pt-3">
                  <div className="text-xs text-gray-600">
                    <div className="font-semibold">Storage:</div>
                    <div>Keep refrigerated below 5°C. Consume within 2 days.</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="text-xs text-gray-500">
                    <div>InstaLabel Ltd</div>
                    <div>Best before: 03/06/2024</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Label indicator */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Fully Compliant PPDS Label
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

"use client"

import React from "react"
import { Target, ArrowRight, Smartphone, BarChart3, ChefHat, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui"
import Link from "next/link"
import { motion } from "framer-motion"

export const UsesHero = () => {
  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
        {/* Background blobs (standardized) */}
        <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-15 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-15 blur-3xl" />
        <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-15 blur-3xl" />

        <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl space-y-6 text-center md:text-left"
          >
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
              <Target className="mr-2 h-4 w-4" />
              Perfect for Every Kitchen Need
            </div>

            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="text-purple-600">Label Everything,</span>
              <br />
              <span className="">Everywhere.</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              We built InstaLabel to remove chaos from food labeling — and help you stay mobile
              devices. Track usage with live analytics. Get detailed reports to improve your kitchen
              operations and reduce waste.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Target className="h-4 w-4 text-purple-600" />
                <span>All Kitchen Uses</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Smartphone className="h-4 w-4 text-purple-600" />
                <span>Mobile Compatible</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span>Usage Analytics</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Button size="lg" className="bg-purple-600 px-8 py-3 text-white hover:bg-purple-700">
                <Link href="/register">Start Free Trial</Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/features">
                <Button variant="outline" size="lg">
                  Explore Uses
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <span>✓ Free 14-day trial</span>
              <span>✓ No charges during trial</span>
              <span>✓ Mobile Compatible</span>
            </div>
          </motion.div>

          {/* Visual Representation - Kitchen Workflow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full max-w-[500px]"
          >
            <div className="relative">
              {/* Kitchen Workflow Steps */}
              <div className="space-y-4">
                {/* Step 1: Prep */}
                <div className="rounded-lg border-l-4 border-blue-500 bg-white p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <ChefHat className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">Prep Labels</h4>
                      <p className="text-sm text-gray-600">
                        Fresh ingredients, prep times, expiry dates
                      </p>
                    </div>
                    <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      PREP
                    </div>
                  </div>
                </div>

                {/* Step 2: Cook */}
                <div className="ml-4 rounded-lg border-l-4 border-green-500 bg-white p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">Cook Labels</h4>
                      <p className="text-sm text-gray-600">Cook times, temperatures, allergens</p>
                    </div>
                    <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      COOKED
                    </div>
                  </div>
                </div>

                {/* Step 3: PPDS */}
                <div className="ml-8 rounded-lg border-l-4 border-purple-500 bg-white p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">PPDS Labels</h4>
                      <p className="text-sm text-gray-600">
                        Full ingredient lists, allergen warnings
                      </p>
                    </div>
                    <div className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                      PPDS
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">Prep</div>
                  <div className="text-xs text-gray-600">Daily Prep Items</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">Cook</div>
                  <div className="text-xs text-gray-600">Hot Food Items</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">PPDS</div>
                  <div className="text-xs text-gray-600">Pre-Packaged</div>
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
    </>
  )
}

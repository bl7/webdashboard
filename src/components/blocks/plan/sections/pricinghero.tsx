"use client"

import React from "react"
import { CreditCard, ArrowRight, Smartphone, BarChart3, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui"
import Link from "next/link"
import { motion } from "framer-motion"

export const PricingHero = () => {
  return (
    <section className="relative mt-24 flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-16 sm:mt-32 sm:px-6 md:mt-16 md:px-12 lg:px-16">
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
            <CreditCard className="mr-2 h-4 w-4" />
            Simple, Transparent Pricing
          </div>

          <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            <span className="text-purple-600">Fair pricing, </span>
            <br className="hidden md:block" />
            <span className="">limitless potential.</span>
          </h1>

          <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
            All plans include web dashboard printing, android device compatibility, real-time
            analytics, and our local bridge app. Start free, scale as you grow.
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <CreditCard className="h-4 w-4 text-purple-600" />
              <span>Flexible Plans</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <Smartphone className="h-4 w-4 text-purple-600" />
              <span>Android Compatible</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span>Analytics Included</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
            <Button size="lg" className="bg-purple-600 px-8 py-3 text-white hover:bg-purple-700">
              <Link href="/register">Start Free Trial</Link>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/features">See All Features</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-500 md:justify-start">
            <span>✓ Free 14-day trial</span>
            <span>✓ No charges during trial</span>
            <span>✓ Cancel anytime</span>
          </div>
        </motion.div>

        {/* Visual Representation - Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="relative">
            {/* Plan Cards Stack */}
            <div className="space-y-4">
              {/* Starter Plan */}
              {/* <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-bold text-gray-900">Starter</h4>
                  <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                    FREE TRIAL
                  </span>
                </div>
                <p className="mb-2 text-sm text-gray-600">Perfect for small kitchens</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Up to 500 labels/month</span>
                  <span>£29/month</span>
                </div>
              </div> */}

              {/* Professional Plan */}
              <div className="relative ml-4 rounded-lg border-2 border-purple-500 bg-white p-4 shadow-lg">
                <div className="absolute -right-2 -top-2">
                  <div className="rounded-full bg-orange-500 px-2 py-1 text-xs text-white">
                    Best Value
                  </div>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-bold text-gray-900">One Stop</h4>
                  {/* <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800">
                    BEST VALUE
                  </span> */}
                </div>
                <p className="mb-2 text-sm text-gray-600">For growing restaurants</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>15.99/month</span>
                </div>
              </div>

              {/* Enterprise Plan */}
              {/* <div className="ml-8 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-bold text-gray-900">Enterprise</h4>
                  <span className="rounded bg-purple-100 px-2 py-1 text-xs text-blue-800">
                    CUSTOM
                  </span>
                </div>
                <p className="mb-2 text-sm text-gray-600">For large operations</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Unlimited labels</span>
                  <span>Contact us</span>
                </div>
              </div> */}
            </div>

            {/* Features Legend */}
            <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Web Dashboard</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Mobile Support</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Analytics</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>24/7 Support</span>
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

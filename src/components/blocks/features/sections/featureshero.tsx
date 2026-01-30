"use client"

import React from "react"
import { Wifi, Download, Zap, ArrowRight, Smartphone, BarChart3, Shield } from "lucide-react"
import { Button } from "@/components/ui"
import Link from "next/link"
import { motion } from "framer-motion"

export const FeaturesHero = () => {
  return (
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
            <Zap className="mr-2 h-4 w-4" />
            Powerful Kitchen Management Features
          </div>

          <h2 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            <span className="text-purple-600">Your Kitchen,</span>
            <br className="hidden md:block" />
            <span className="">Simplified.</span>
          </h2>

          <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
            We built InstaLabel to remove chaos from food labeling and help you stay inspection-ready. Print from web dashboard or mobile devices, track usage with real-time analytics, and optimize your kitchen operations with comprehensive reporting.
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <Download className="h-4 w-4 text-purple-600" />
              <span>Web Dashboard</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <Smartphone className="h-4 w-4 text-purple-600" />
              <span>Mobile Ready</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span>Real-time Analytics</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
            <Button size="lg" className="bg-purple-600 px-8 py-3 text-white hover:bg-purple-700" asChild>
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/printbridge">
                <Wifi className="mr-2 h-4 w-4" />
                Learn About PrintBridge
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-500 md:justify-start">
            <span>✓ Free 14-day trial</span>
            <span>✓ No charges during trial</span>
            <span>✓ Local bridge app included</span>
          </div>
        </motion.div>

        {/* Visual Representation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="relative">
            {/* Dashboard Mockup */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-xs text-gray-500">InstaLabel Dashboard</div>
              </div>
              <div className="space-y-2">
                <div className="h-4 rounded bg-purple-100"></div>
                <div className="h-4 w-3/4 rounded bg-gray-100"></div>
                <div className="h-4 w-1/2 rounded bg-gray-100"></div>
              </div>
            </div>

            {/* Feature Icons */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                <Shield className="mx-auto mb-2 h-8 w-8 text-purple-600" />
                <p className="text-xs font-medium text-gray-700">Compliance</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                <Smartphone className="mx-auto mb-2 h-8 w-8 text-purple-600" />
                <p className="text-xs font-medium text-gray-700">Mobile Ready</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                <Zap className="mx-auto mb-2 h-8 w-8 text-purple-600" />
                <p className="text-xs font-medium text-gray-700">Fast Printing</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                <BarChart3 className="mx-auto mb-2 h-8 w-8 text-purple-600" />
                <p className="text-xs font-medium text-gray-700">Analytics</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Bottom fade overlay */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)",
        }}
      />
    </section>
  )
}

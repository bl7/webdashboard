"use client"

import { Button } from "@/components/ui"
import { ArrowRight, Printer, Shield, Zap, CheckCircle } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export const KitchenLabelPrinterHero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-white px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
      {/* Background elements - subtle, no gradients */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-5 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-5 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-5 blur-3xl" />

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
              <Printer className="mr-2 h-4 w-4" />
              #1 Kitchen Labeling Software
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
              <span className="text-purple-600">The Best Kitchen Label</span>
              <br className="hidden md:block" />
              <span>Software for Any Printer</span>
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
              InstaLabel works with any thermal label printer - the industry standard for kitchen
              labeling. Our intelligent software automatically generates compliant labels,
              calculates expiry dates, and ensures Natasha's Law compliance. No more manual labeling
              errors.
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
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Natasha's Law Compliant</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Zap className="h-4 w-4 text-purple-600" />
                <span>Works with Any Printer</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>AI-Powered Accuracy</span>
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
                <Link href="/bookdemo">Book Demo</Link>
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
              <span>✓ 500+ UK restaurants trust InstaLabel</span>
              <span>✓ 99.9% uptime with AWS cloud</span>
              <span>✓ 14-day free trial, no credit card</span>
            </div>
          </motion.div>
        </motion.div>

        {/* 6. Right visual: InstaLabel software interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="relative">
            {/* InstaLabel software interface mockup */}
            <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              {/* Software Header */}
              <div className="bg-purple-600 p-4 text-center text-white">
                <div className="text-lg font-bold">InstaLabel Dashboard</div>
                <div className="text-sm opacity-90">Kitchen Label Management</div>
              </div>

              {/* Software Content */}
              <div className="p-6">
                <div className="mb-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Smart Label Generation:</span>
                    <span className="font-semibold text-green-600">✓ Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Printer Compatibility:</span>
                    <span className="text-gray-900">Any Thermal Label Printer</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Compliance:</span>
                    <span className="font-bold text-green-600">Natasha's Law ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">AI Analysis:</span>
                    <span className="text-gray-900">Allergen Detection</span>
                  </div>
                </div>

                {/* Feature Badge */}
                <div className="mt-4 rounded bg-purple-100 p-2 text-center">
                  <span className="text-xs font-semibold text-purple-800">
                    ✓ Works with Your Existing Printer
                  </span>
                </div>
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

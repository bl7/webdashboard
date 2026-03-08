"use client"

import { Button } from "@/components/ui"
import { ArrowRight, Shield, Award, Clock, CheckCircle2, Zap } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export const AllergenComplianceHero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-white px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
      {/* Background blobs (standardized) */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-5 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-5 blur-3xl" />

      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl space-y-6 text-center md:text-left"
        >
          {/* Tagline pill */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
              <Shield className="mr-2 h-4 w-4" />
              #1 Allergen Compliance Software
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="text-purple-600">100% Allergen Compliance</span>
              <br className="hidden md:block" />
              <span>with AI-Powered Software</span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
              InstaLabel automatically generates compliant labels with all 14 UK allergens, ensures
              Natasha's Law compliance, and works with USB and Bluetooth printers (PC: any USB; mobile: Munbyn RW114B recommended). Start your free trial
              today.
            </p>
          </motion.div>

          {/* Key benefits grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>14 Allergens Auto-Detection</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Zap className="h-4 w-4 text-purple-600" />
                <span>30-Second Labels</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                <span>100% Natasha's Law</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
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
              <span>✓ 95% reduction in labeling time</span>
              <span>✓ 14-day free trial, no credit card</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual Representation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="bg-purple-600 p-4 text-center text-white">
              <div className="text-lg font-bold">InstaLabel Allergen System</div>
              <div className="text-sm opacity-90">AI-Powered Compliance Software</div>
            </div>
            <div className="p-6">
              <div className="mb-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Allergen Detection:</span>
                  <span className="font-bold text-green-600">14/14 ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Natasha's Law:</span>
                  <span className="font-semibold text-green-600">100% ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Label Time:</span>
                  <span className="text-gray-900">30 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Printer Support:</span>
                  <span className="text-gray-900">Any Thermal</span>
                </div>
              </div>
              <div className="mt-4 rounded bg-green-100 p-2 text-center">
                <span className="text-xs font-semibold text-green-800">
                  ✓ Allergen Labels in 30 Seconds
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

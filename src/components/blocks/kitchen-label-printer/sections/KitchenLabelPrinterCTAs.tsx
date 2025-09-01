"use client"
import React from "react"
import { Button } from "@/components/ui"
import { ArrowRight, Download, Smartphone } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export const KitchenLabelPrinterCTAs = () => (
  <section className="relative w-full bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="mx-auto max-w-5xl text-center">
      {/* Main CTA */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="mb-6 text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Ready to Transform Your Kitchen Labeling?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          Join 500+ UK restaurants that trust InstaLabel for intelligent, compliant kitchen
          labeling. Our AI-powered software works with any printer and eliminates manual errors.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-purple-600 px-8 py-4 text-lg text-white hover:bg-purple-700"
          >
            <Link href="/register">Start Free Trial</Link>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-4 text-lg" asChild>
            <Link href="/bookdemo">Book Demo</Link>
          </Button>
        </div>
      </motion.div>

      {/* Secondary Actions */}
      <motion.div
        className="grid gap-6 md:grid-cols-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Download Guide */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <div className="mb-4 flex justify-center">
            <Download className="h-12 w-12 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Download Kitchen Labeling Guide</h3>
          <p className="mb-4 text-gray-600">
            Get our comprehensive "Kitchen Labeling Best Practices Guide" with compliance tips,
            workflow optimization, and InstaLabel implementation strategies.
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/blog/kitchen-labeling-best-practices-guide">Download Free Guide</Link>
          </Button>
        </div>

        {/* Mobile App */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <div className="mb-4 flex justify-center">
            <Smartphone className="h-12 w-12 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Try Mobile App</h3>
          <p className="mb-4 text-gray-600">
            Experience InstaLabel's mobile-first design. Download our Android app to see how easy
            kitchen labeling can be on mobile devices.
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/features#mobile">Learn About Mobile App</Link>
          </Button>
        </div>
      </motion.div>

      {/* Trust Statement */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <p className="text-sm text-gray-500">
          <strong>Trusted by 500+ UK restaurants.</strong> InstaLabel reduces labeling time by 95%
          while ensuring 100% Natasha's Law compliance. Start your 14-day free trial today.
        </p>
      </motion.div>
    </div>
  </section>
)

"use client"
import React from "react"
import { CheckCircle, Lightbulb, Target, Zap, Shield, Clock } from "lucide-react"
import { motion } from "framer-motion"

export const KitchenLabelPrinterSolution = () => (
  <section className="relative w-full bg-gray-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="mx-auto max-w-5xl">
      {/* Section Header */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="mb-4 inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 ring-1 ring-green-200">
          <Lightbulb className="mr-2 h-4 w-4" />
          InstaLabel Solution
        </div>
        <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Intelligent Software That Works with Any Printer
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          InstaLabel's AI-powered software automatically generates compliant labels, calculates
          expiry dates, and ensures Natasha's Law compliance - regardless of your printer.
        </p>
      </motion.div>

      {/* Solution Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Solution 1 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Target className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">AI-Powered Label Generation</h3>
          <p className="text-gray-600">
            InstaLabel's AI automatically analyzes menu descriptions to identify ingredients and
            allergens. Generate compliant labels in seconds, not minutes.
          </p>
        </motion.div>

        {/* Solution 2 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Automatic Compliance</h3>
          <p className="text-gray-600">
            Every label automatically includes required allergen information, ingredients, and
            expiry dates. Natasha's Law compliance guaranteed every time.
          </p>
        </motion.div>

        {/* Solution 3 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Zap className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Thermal Printer Support</h3>
          <p className="text-gray-600">
            Works with any thermal label printer - the industry standard for kitchen labeling. PrintBridge technology ensures
            seamless connectivity without special drivers or setup.
          </p>
        </motion.div>

        {/* Solution 4 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Smart Expiry Management</h3>
          <p className="text-gray-600">
            Automatically calculates use-by dates based on food type and preparation method. Track
            food freshness and reduce waste with intelligent expiry management.
          </p>
        </motion.div>

        {/* Solution 5 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <CheckCircle className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Complete Audit Trail</h3>
          <p className="text-gray-600">
            Every label is automatically recorded with full traceability. Ready for food safety
            audits and EHO inspections with comprehensive documentation.
          </p>
        </motion.div>

        {/* Solution 6 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Lightbulb className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Mobile-First Design</h3>
          <p className="text-gray-600">
            Use InstaLabel on any device - web dashboard, Android app, or mobile browser. Create and
            print labels from anywhere in your kitchen.
          </p>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        viewport={{ once: true }}
      >
        <p className="text-lg font-semibold text-gray-700">
          Ready to transform your kitchen labeling?{" "}
          <span className="font-bold text-purple-700">Start your free trial today.</span>
        </p>
      </motion.div>
    </div>
  </section>
)

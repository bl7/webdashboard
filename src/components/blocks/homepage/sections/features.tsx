"use client"

import React from "react"
import { motion } from "framer-motion"

export const Feature = () => {
  return (
    <section className="-mt-10 bg-gradient-to-br from-white via-white/30 to-white px-4 py-16 text-foreground sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 space-y-4 text-center"
        >
          <h3 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-mkt-ink">
              Why Smart Kitchens Choose
            </span>
            <br />
            <span className="text-gray-900">InstaLabel Over Basic Label Printers</span>
          </h3>
        </motion.div>

        {/* Comparison Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          {/* Basic Label Printers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg"
          >
            <div className="mb-6 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <span className="text-3xl">🖨️</span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">Basic Label Printers</h3>
              <p className="text-gray-600">Outdated tools that hold back modern kitchens</p>
            </div>
            <ul className="space-y-3 text-base">
              <li className="flex items-start gap-3">
                <span className="text-xl">❌</span>Manual handwriting or basic templates
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">❌</span>No allergen warnings
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">❌</span>No expiry date intelligence
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">❌</span>No prep logs or print history
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">❌</span>Not compliant with Natasha's Law
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">❌</span>Can't print from mobile devices
              </li>
            </ul>
          </motion.div>

          {/* InstaLabel Smart System */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-2xl border-2 border-mkt-steel1 bg-mkt-canvas p-8 shadow-lg"
          >
            <div className="mb-6 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                InstaLabel Smart Labelling System
              </h3>
              <p className="text-gray-600">
                Built for modern food businesses that value speed, compliance, and accuracy
              </p>
            </div>
            <ul className="space-y-3 text-base">
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>Compliant label templates for prep, cook, PPDS,
                and more
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>Auto-calculated expiry dates for full
                traceability
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>Allergen highlighting built-in
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>Works with USB & TSPL Bluetooth label printers. Computer: a label printer installed on Windows or macOS, through PrintBridge. Android: MUNBYN RW411B or Born4Ship DB403.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>Print logs for traceability & audits
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>Override expiry logic when needed
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>Blazing fast PNG-to-label conversion — no
                drivers, no dialog boxes
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>Bulk printing for multiple labels at once
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* CTA Section with Internal Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="rounded-2xl bg-mkt-canvas p-8">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              Ready to Upgrade Your Kitchen Labeling?
            </h3>
            <p className="mb-6 text-gray-600">
              Explore our features, see pricing plans, or book a free demo to see InstaLabel in
              action.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/features"
                className="inline-flex items-center rounded-lg bg-mkt-ink px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-mkt-ink"
              >
                Explore All Features
              </a>
              <a
                href="/plan"
                className="inline-flex items-center rounded-lg border-2 border-mkt-steel1 bg-white px-6 py-3 font-semibold text-mkt-ink transition-all duration-300 hover:border-mkt-ink hover:bg-mkt-canvas"
              >
                View Pricing Plans
              </a>
              <a
                href="/bookdemo"
                className="inline-flex items-center rounded-lg border-2 border-mkt-steel1 bg-white px-6 py-3 font-semibold text-mkt-ink transition-all duration-300 hover:border-mkt-ink hover:bg-mkt-canvas"
              >
                Book Free Demo
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

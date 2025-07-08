'use client'

import React from "react"
import { motion } from "framer-motion"

export const Feature = () => {
  return (
    <section className="-mt-10 px-4 py-16 text-foreground sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-white via-purple-50/30 to-white">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Why Smart Kitchens Choose
            </span>
            <br />
            <span className="text-gray-900">InstaLabel Over Basic Label Printers</span>
          </h2>
        </motion.div>

        {/* Comparison Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Basic Label Printers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <span className="text-3xl">🖨️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Label Printers</h3>
              <p className="text-gray-600">Outdated tools that hold back modern kitchens</p>
            </div>
            <ul className="space-y-3 text-base">
              <li className="flex items-start gap-3"><span className="text-xl">❌</span>Manual handwriting or basic templates</li>
              <li className="flex items-start gap-3"><span className="text-xl">❌</span>No allergen warnings</li>
              <li className="flex items-start gap-3"><span className="text-xl">❌</span>No expiry date intelligence</li>
              <li className="flex items-start gap-3"><span className="text-xl">❌</span>No prep logs or print history</li>
              <li className="flex items-start gap-3"><span className="text-xl">❌</span>Not compliant with Natasha's Law</li>
              <li className="flex items-start gap-3"><span className="text-xl">❌</span>Can't print from mobile devices</li>
            </ul>
          </motion.div>

          {/* InstaLabel Smart System */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">InstaLabel Smart Labelling System</h3>
              <p className="text-gray-600">Built for modern food businesses that value speed, compliance, and accuracy</p>
            </div>
            <ul className="space-y-3 text-base">
              <li className="flex items-start gap-3"><span className="text-xl">✅</span>Compliant label templates for prep, cook, PPDS, and more</li>
              <li className="flex items-start gap-3"><span className="text-xl">✅</span>Auto-calculated expiry dates for full traceability</li>
              <li className="flex items-start gap-3"><span className="text-xl">✅</span>Allergen highlighting built-in</li>
              <li className="flex items-start gap-3"><span className="text-xl">✅</span>Works with USB & portable Sunmi printers</li>
              <li className="flex items-start gap-3"><span className="text-xl">✅</span>Print logs for traceability & audits</li>
              <li className="flex items-start gap-3"><span className="text-xl">✅</span>Override expiry logic when needed</li>
              <li className="flex items-start gap-3"><span className="text-xl">✅</span>Blazing fast PNG-to-label conversion — no drivers, no dialog boxes</li>
            </ul>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

"use client"
import React from "react"
import {
  Star,
  Shield,
  Zap,
  Clock,
  Calendar,
  Users,
  FileText,
  Smartphone,
  BarChart3,
  CheckCircle,
} from "lucide-react"
import { motion } from "framer-motion"

export const ExpiryDateLabelsFeatures = () => (
  <section id="features" className="relative w-full bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="mx-auto max-w-5xl">
      {/* Section Header */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="mb-4 inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 ring-1 ring-purple-200">
          <Star className="mr-2 h-4 w-4" />
          InstaLabel Expiry Date Features
        </div>
        <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Powerful Features That Transform Expiry Date Labeling
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          InstaLabel combines AI intelligence, automatic compliance, and thermal printer support to
          make expiry date labeling effortless, accurate, and legally compliant.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Feature 1 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">AI-Powered Expiry Calculation</h3>
          <p className="text-gray-600">
            InstaLabel's AI automatically calculates use-by dates based on food type, preparation
            method, and current food safety guidelines. No more manual calculations or guesswork.
          </p>
        </motion.div>

        {/* Feature 2 */}
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
          <h3 className="mb-3 text-xl font-bold text-gray-900">100% Natasha's Law Compliance</h3>
          <p className="text-gray-600">
            Every label automatically includes required allergen information, ingredients, and
            expiry dates. PPDS label formatting meets FSA requirements without manual work.
          </p>
        </motion.div>

        {/* Feature 3 */}
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
          <h3 className="mb-3 text-xl font-bold text-gray-900">30-Second Label Generation</h3>
          <p className="text-gray-600">
            Generate professional expiry date labels in under 30 seconds. Clear, legible text that
            never smudges or fades, even in kitchen environments.
          </p>
        </motion.div>

        {/* Feature 4 */}
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
          <h3 className="mb-3 text-xl font-bold text-gray-900">Smart Food Freshness Tracking</h3>
          <p className="text-gray-600">
            Track preparation times and automatically calculate optimal expiry dates. Monitor food
            freshness and reduce waste with intelligent expiry management.
          </p>
        </motion.div>

        {/* Feature 5 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Staff Training in Minutes</h3>
          <p className="text-gray-600">
            Simple interface that any kitchen staff can use. Minimal training required with built-in
            guidance and error prevention for expiry date labeling.
          </p>
        </motion.div>

        {/* Feature 6 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Complete Audit Trail</h3>
          <p className="text-gray-600">
            Every expiry date label is automatically recorded with full traceability. Track who
            prepared what and when for food safety audits and inspections.
          </p>
        </motion.div>

        {/* Feature 7 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Smartphone className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Mobile-First Design</h3>
          <p className="text-gray-600">
            Native Android app for mobile kitchen operations. Touch-optimized interface for kitchen
            glove compatibility with offline printing capabilities.
          </p>
        </motion.div>

        {/* Feature 8 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Expiry Analytics & Reporting</h3>
          <p className="text-gray-600">
            Track expiry date labels by date, staff member, and food type. Generate monthly
            compliance reports and identify food waste patterns for optimization.
          </p>
        </motion.div>

        {/* Feature 9 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <CheckCircle className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Thermal Printer Support</h3>
          <p className="text-gray-600">
            Works with any thermal label printer via USB, Bluetooth, or network. PrintBridge
            technology ensures seamless connectivity without special drivers or setup.
          </p>
        </motion.div>
      </div>

      {/* Bottom Note */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.0 }}
        viewport={{ once: true }}
      >
        <p className="text-lg font-semibold text-gray-700">
          <span className="font-bold text-purple-700">Pro Tip:</span> InstaLabel's AI reduces expiry
          date labeling time by 95% while ensuring 100% Natasha's Law compliance. Start your free
          trial today.
        </p>
      </motion.div>
    </div>
  </section>
)

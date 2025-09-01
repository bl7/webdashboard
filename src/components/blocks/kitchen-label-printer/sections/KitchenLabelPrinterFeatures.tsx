"use client"
import React from "react"
import { Star, Shield, Zap, Clock, Users, FileText, Smartphone, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

export const KitchenLabelPrinterFeatures = () => (
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
        <div className="mb-4 inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 ring-1 ring-purple-200">
          <Star className="mr-2 h-4 w-4" />
          InstaLabel Software Features
        </div>
        <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Powerful Features That Transform Kitchen Labeling
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          InstaLabel combines AI intelligence, compliance automation, and universal printer support
          to make kitchen labeling effortless and error-free.
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
            <Zap className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">AI-Powered Ingredient Analysis</h3>
          <p className="text-gray-600">
            InstaLabel's AI automatically analyzes menu descriptions to identify ingredients and
            detect all 14 UK required allergens. Generate compliant labels in seconds.
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
          <h3 className="mb-3 text-xl font-bold text-gray-900">Natasha's Law Compliance</h3>
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
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Smart Expiry Management</h3>
          <p className="text-gray-600">
            Automatically calculates use-by dates based on food type and preparation method. Track
            food freshness and reduce waste with intelligent expiry management.
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
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Thermal Printer Support</h3>
          <p className="text-gray-600">
            Works with any thermal label printer via USB, Bluetooth, or network.
            PrintBridge technology ensures seamless connectivity without special drivers.
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
            <Smartphone className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Mobile-First Design</h3>
          <p className="text-gray-600">
            Native Android app for mobile kitchen operations. Touch-optimized interface for kitchen
            glove compatibility with offline printing capabilities.
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
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Analytics & Reporting</h3>
          <p className="text-gray-600">
            Track labels printed by date, staff member, and label type. Generate monthly compliance
            reports and identify peak printing times for workflow optimization.
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
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Bulk Operations</h3>
          <p className="text-gray-600">
            Process 100+ labels in under 30 seconds with batch operations. Excel/CSV import with
            duplicate detection and validation for high-volume kitchens.
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
            <Star className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Cloud-First Architecture</h3>
          <p className="text-gray-600">
            Unlimited product storage with real-time sync across devices. AWS cloud infrastructure
            provides automatic backups every 15 minutes with 99.9% uptime.
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
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Enterprise Security</h3>
          <p className="text-gray-600">
            256-bit AES encryption for all data in transit and at rest. GDPR compliance with
            automatic data retention policies and role-based access controls.
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
          <span className="font-bold text-purple-700">Pro Tip:</span> InstaLabel's AI reduces
          labeling time by 95% while ensuring 100% compliance. Start your free trial today.
        </p>
      </motion.div>
    </div>
  </section>
)

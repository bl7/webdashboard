"use client"
import React from "react"
import {
  CheckCircle,
  Lightbulb,
  Target,
  Zap,
  Shield,
  Clock,
  Calendar,
  FileText,
} from "lucide-react"
import { motion } from "framer-motion"

export const ExpiryDateLabelsSolution = () => (
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
          Date labels from the rules you set
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Your business sets the date rules. InstaLabel applies those settings when it prints a
          label. Your team still checks the date against your food-safety procedure.
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
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mkt-canvas">
            <Target className="h-6 w-6 text-mkt-teal" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Your date rules</h3>
          <p className="text-gray-600">
            InstaLabel does not decide a use-by date from the type of food. It applies the date
            settings your business has chosen.
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
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mkt-canvas">
            <Shield className="h-6 w-6 text-mkt-teal" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">PPDS labelling support</h3>
          <p className="text-gray-600">
            Every label automatically includes required allergen information, ingredients, and
            expiry dates. PPDS label formatting meets FSA requirements without manual work.
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
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mkt-canvas">
            <Zap className="h-6 w-6 text-mkt-teal" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">30-Second Label Generation</h3>
          <p className="text-gray-600">
            Generate professional expiry date labels from your saved information. Clear, legible text that
            never smudges or fades, even in kitchen environments.
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
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mkt-canvas">
            <Calendar className="h-6 w-6 text-mkt-teal" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Smart Food Freshness Tracking</h3>
          <p className="text-gray-600">
            Track preparation times and automatically calculate optimal expiry dates. Monitor food
            freshness and reduce waste with intelligent expiry management.
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
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mkt-canvas">
            <FileText className="h-6 w-6 text-mkt-teal" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Complete Audit Trail</h3>
          <p className="text-gray-600">
            Every expiry date label is automatically recorded with full traceability. Ready for food
            safety audits and EHO inspections with comprehensive documentation.
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
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mkt-canvas">
            <Clock className="h-6 w-6 text-mkt-teal" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Thermal Printer Compatibility</h3>
          <p className="text-gray-600">
            Works with USB and Bluetooth thermal label printers. Computer: a label printer installed on Windows or macOS, through PrintBridge. Android: MUNBYN RW411B or Born4Ship DB403. PrintBridge
            technology ensures seamless connectivity without special drivers or setup.
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
          Ready to automate your expiry date labeling?{" "}
          <span className="font-bold text-mkt-ink">Start your free trial today.</span>
        </p>
      </motion.div>
    </div>
  </section>
)

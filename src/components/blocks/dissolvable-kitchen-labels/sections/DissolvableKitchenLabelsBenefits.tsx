"use client"
import React from "react"
import { TrendingUp, DollarSign, Clock, Shield, Users, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export const DissolvableKitchenLabelsBenefits = () => (
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
          <TrendingUp className="mr-2 h-4 w-4" />
          InstaLabel Benefits
        </div>
        <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Why Choose InstaLabel for Dissolvable Kitchen Labels?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          InstaLabel transforms dissolvable label printing from a time-consuming chore into an
          automated, compliant process that saves time and ensures food safety.
        </p>
      </motion.div>

      {/* Benefits Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Benefit 1 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Massive Time Savings</h3>
          <p className="mb-4 text-gray-600">
            Reduce dissolvable label creation time from 2-3 minutes to just a couple of clicks.
            That's a 95% reduction in labeling time, allowing your kitchen staff to focus on food
            preparation instead of manual labeling.
          </p>
          <div className="text-sm font-semibold text-purple-600">✓ 95% faster label generation</div>
        </motion.div>

        {/* Benefit 2 */}
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
          <h3 className="mb-3 text-xl font-bold text-gray-900">100% Compliance Guarantee</h3>
          <p className="mb-4 text-gray-600">
            Every dissolvable label automatically meets Natasha's Law requirements. No more
            compliance errors, food safety violations, or EHO inspection issues. InstaLabel ensures
            perfect formatting every single time.
          </p>
          <div className="text-sm font-semibold text-purple-600">✓ Zero compliance errors</div>
        </motion.div>

        {/* Benefit 3 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Reduced Food Waste</h3>
          <p className="mb-4 text-gray-600">
            Accurate expiry dates and clear ingredient information reduce food waste caused by
            incorrect labeling. InstaLabel's AI ensures every dissolvable label contains precise,
            legible information.
          </p>
          <div className="text-sm font-semibold text-purple-600">✓ 20-30% less food waste</div>
        </motion.div>

        {/* Benefit 4 */}
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
          <h3 className="mb-3 text-xl font-bold text-gray-900">Staff Efficiency</h3>
          <p className="mb-4 text-gray-600">
            Minimal training required - any kitchen staff can use InstaLabel in minutes. Built-in
            error prevention and guidance ensure consistent, high-quality dissolvable labels
            regardless of staff experience.
          </p>
          <div className="text-sm font-semibold text-purple-600">✓ 5-minute staff training</div>
        </motion.div>
      </div>

      {/* Bottom Statistics */}
      <motion.div
        className="mt-12 grid gap-6 md:grid-cols-3"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="rounded-lg bg-purple-50 p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-purple-600">95%</div>
          <div className="text-sm font-medium text-purple-800">Time Saved</div>
          <div className="mt-1 text-xs text-purple-600">From 35 minutes to 30 seconds</div>
        </div>
        <div className="rounded-lg bg-green-50 p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-green-600">100%</div>
          <div className="text-sm font-medium text-green-800">Compliance Rate</div>
          <div className="mt-1 text-xs text-green-600">Every label meets FSA standards</div>
        </div>
        <div className="rounded-lg bg-blue-50 p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-blue-600">500+</div>
          <div className="text-sm font-medium text-blue-800">UK Restaurants</div>
          <div className="mt-1 text-xs text-blue-600">Trust InstaLabel for dissolvable labels</div>
        </div>
      </motion.div>
    </div>
  </section>
)

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
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mkt-canvas">
            <Clock className="h-6 w-6 text-mkt-teal" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Massive Time Savings</h3>
          <p className="mb-4 text-gray-600">
            Spend less time writing labels by hand. Select a saved item and print, so the team can
            get back to the food.
          </p>
          <div className="text-sm font-semibold text-mkt-teal">✓ less time writing labels</div>
        </motion.div>

        {/* Benefit 2 */}
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
          <h3 className="mb-3 text-xl font-bold text-gray-900">Built for Compliance</h3>
          <p className="mb-4 text-gray-600">
            InstaLabel prints the information you have saved. It does not certify the label material
            or decide whether the finished label meets the law. Your team still checks it.
          </p>
          <div className="text-sm font-semibold text-mkt-teal">✓ Your team still checks the label</div>
        </motion.div>

        {/* Benefit 3 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mkt-canvas">
            <DollarSign className="h-6 w-6 text-mkt-teal" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Reduced Food Waste</h3>
          <p className="mb-4 text-gray-600">
            Accurate expiry dates and clear ingredient information reduce food waste caused by
            incorrect labeling. InstaLabel prints the information you have saved, so the label can stay
            legible information.
          </p>
          <div className="text-sm font-semibold text-mkt-teal">✓ Clearer dates on the label</div>
        </motion.div>

        {/* Benefit 4 */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mkt-canvas">
            <Users className="h-6 w-6 text-mkt-teal" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Staff Efficiency</h3>
          <p className="mb-4 text-gray-600">
            Minimal training required - any kitchen staff can use InstaLabel in minutes. Built-in
            error prevention and guidance ensure consistent, high-quality dissolvable labels
            regardless of staff experience.
          </p>
          <div className="text-sm font-semibold text-mkt-teal">✓ Short to learn during a shift</div>
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
        <div className="rounded-lg bg-mkt-canvas p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-mkt-teal">Less writing</div>
          <div className="text-sm font-medium text-mkt-ink">Than handwriting</div>
          <div className="mt-1 text-xs text-mkt-teal">Select a saved item and print</div>
        </div>
        <div className="rounded-lg bg-green-50 p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-green-600">Your check</div>
          <div className="text-sm font-medium text-green-800">Still required</div>
          <div className="mt-1 text-xs text-green-600">Your team checks the finished label</div>
        </div>
        <div className="rounded-lg bg-blue-50 p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-blue-600">Real</div>
          <div className="text-sm font-medium text-blue-800">Kitchens</div>
          <div className="mt-1 text-xs text-blue-600">Used for kitchen labelling</div>
        </div>
      </motion.div>
    </div>
  </section>
)

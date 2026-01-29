"use client"
import React from "react"
import { AlertTriangle, CheckCircle, Clock, Zap, FileText, Shield } from "lucide-react"
import { motion } from "framer-motion"

export const KitchenLabelPrinterBeforeAfter = () => (
  <section className="relative w-full bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="mx-auto max-w-5xl">
      {/* Section Header */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          See the Transformation: Before vs. After InstaLabel
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Watch how InstaLabel transforms kitchen labeling from a time-consuming manual process into
          an automated, compliant system.
        </p>
      </motion.div>

      {/* Before/After Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* BEFORE: Manual Process */}
        <motion.div
          className="rounded-lg border-2 border-red-200 bg-red-50 p-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-red-800">BEFORE: Manual Process</h3>
          </div>

          {/* Visual: Manual Kitchen Label */}
          <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-3 text-center">
              <div className="mx-auto h-24 w-32 rounded border-2 border-dashed border-red-300 bg-red-50 p-2">
                <div className="text-center text-xs text-red-600">
                  <div className="font-bold">Chicken Curry</div>
                  <div className="text-red-500">Ingredients: ???</div>
                  <div className="text-red-500">Allergens: ???</div>
                  <div className="text-red-500">Expiry: ???</div>
                  <div className="text-red-500">Handwritten</div>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-red-700">
              Manual handwritten label
              <br />
              Incomplete information
              <br />
              Risk of compliance errors
            </div>
          </div>

          {/* Problems List */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="mt-1 h-4 w-4 text-red-600" />
              <div>
                <div className="font-semibold text-red-800">2-3 minutes per label</div>
                <div className="text-sm text-red-600">
                  Staff manually typing ingredients and allergens
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-4 w-4 text-red-600" />
              <div>
                <div className="font-semibold text-red-800">34% compliance errors</div>
                <div className="text-sm text-red-600">
                  Missing allergens, incomplete information
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-4 w-4 text-red-600" />
              <div>
                <div className="font-semibold text-red-800">No audit trail</div>
                <div className="text-sm text-red-600">
                  Unable to prove compliance for inspections
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AFTER: InstaLabel Software */}
        <motion.div
          className="rounded-lg border-2 border-green-200 bg-green-50 p-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-800">AFTER: InstaLabel Software</h3>
          </div>

          {/* Visual: Professional Kitchen Label */}
          <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-3 text-center">
              <div className="mx-auto h-24 w-32 rounded border-2 border-green-300 bg-green-50 p-2">
                <div className="text-center text-xs text-green-800">
                  <div className="font-bold">Chicken Curry</div>
                  <div className="text-green-600">Ingredients: Chicken, Rice, Curry</div>
                  <div className="text-green-600">Allergens: None</div>
                  <div className="text-green-600">Expiry: 18 Jan 2025</div>
                  <div className="text-green-600">Natasha's Law ✓</div>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-green-700">
              Professional printed label
              <br />
              Complete compliance information
              <br />
              100% Natasha's Law compliant
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Zap className="mt-1 h-4 w-4 text-green-600" />
              <div>
                <div className="font-semibold text-green-800">Couple of clicks</div>
                <div className="text-sm text-green-600">
                  Select template and print with all data
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="mt-1 h-4 w-4 text-green-600" />
              <div>
                <div className="font-semibold text-green-800">Consistent compliance workflows</div>
                <div className="text-sm text-green-600">Structured templates, consistent formatting</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-4 w-4 text-green-600" />
              <div>
                <div className="font-semibold text-green-800">Complete audit trail</div>
                <div className="text-sm text-green-600">Full documentation for inspections</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transformation Statistics */}
      <motion.div
        className="mt-12 grid gap-6 md:grid-cols-3"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-red-600">2-3 min</div>
          <div className="text-sm font-medium text-red-800">Before: Manual Creation</div>
          <div className="mt-1 text-xs text-red-600">Staff typing each label manually</div>
        </div>
        <div className="rounded-lg bg-purple-50 p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-purple-600">Couple clicks</div>
          <div className="text-sm font-medium text-purple-800">After: InstaLabel</div>
          <div className="mt-1 text-xs text-purple-600">Select template and print</div>
        </div>
        <div className="rounded-lg bg-green-50 p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-green-600">90%</div>
          <div className="text-sm font-medium text-green-800">Time Saved</div>
          <div className="mt-1 text-xs text-green-600">Significant efficiency improvement</div>
        </div>
      </motion.div>

      {/* Bottom Note */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <p className="text-lg font-semibold text-gray-700">
          <span className="font-bold text-purple-700">
            Ready to transform your kitchen labeling?
          </span>
          Start your free trial and see the difference InstaLabel makes.
        </p>
      </motion.div>
    </div>
  </section>
)

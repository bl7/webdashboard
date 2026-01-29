"use client"
import React from "react"
import { Check, X, Info, Zap, Clock, Shield } from "lucide-react"
import { motion } from "framer-motion"

export const KitchenLabelPrinterComparison = () => (
  <section
    id="comparison"
    className="relative w-full bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16"
  >
    <div className="mx-auto max-w-5xl">
      {/* Section Header */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
          <Info className="mr-2 h-4 w-4" />
          InstaLabel vs Manual Labeling
        </div>
        <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Why InstaLabel Beats Manual Kitchen Labeling
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          See how InstaLabel's intelligent software transforms kitchen labeling from a
          time-consuming chore into an automated, compliant process.
        </p>
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Table Header */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="bg-gray-50 p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">Feature</h3>
          </div>
          <div className="bg-purple-50 p-6 text-center">
            <h3 className="text-lg font-bold text-purple-900">InstaLabel Software</h3>
            <p className="mt-2 text-sm text-purple-600">Best for modern kitchens</p>
          </div>
          <div className="bg-red-50 p-6 text-center">
            <h3 className="text-lg font-bold text-red-900">Manual Labeling</h3>
            <p className="mt-2 text-sm text-red-600">Traditional approach</p>
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
          {/* Label Creation Speed */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="bg-gray-50 p-4 font-medium text-gray-900">Label Creation Speed</div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">30 seconds</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">AI-powered generation</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                <span className="font-medium">2-3 minutes</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Manual typing & formatting</p>
            </div>
          </div>

          {/* Compliance Accuracy */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="bg-gray-50 p-4 font-medium text-gray-900">Compliance Accuracy</div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">99.9%</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Automatic compliance</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                <span className="font-medium">66%</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Human error prone</p>
            </div>
          </div>

          {/* Allergen Detection */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="bg-gray-50 p-4 font-medium text-gray-900">Allergen Detection</div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">AI-Powered</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Automatic identification</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                <span className="font-medium">Manual Research</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Time-consuming & error-prone</p>
            </div>
          </div>

          {/* Expiry Date Management */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="bg-gray-50 p-4 font-medium text-gray-900">Expiry Date Management</div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">Automatic</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Smart calculations</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                <span className="font-medium">Manual</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Risk of errors</p>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="bg-gray-50 p-4 font-medium text-gray-900">Audit Trail</div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">Complete</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Full traceability</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                <span className="font-medium">None</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">No documentation</p>
            </div>
          </div>

          {/* Staff Training */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="bg-gray-50 p-4 font-medium text-gray-900">Staff Training</div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">5 minutes</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Intuitive interface</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                <span className="font-medium">Hours</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Complex procedures</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recommendation */}
      <motion.div
        className="mt-12 rounded-lg bg-purple-50 p-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <h3 className="mb-3 text-xl font-bold text-purple-900">Why Choose InstaLabel?</h3>
        <p className="text-purple-700">
          <strong>InstaLabel saves 95% of labeling time</strong> while supporting compliance workflows. Our
          AI-powered software works with any printer and eliminates manual errors.
          <strong>Start your free trial today and see the difference.</strong>
        </p>
      </motion.div>
    </div>
  </section>
)

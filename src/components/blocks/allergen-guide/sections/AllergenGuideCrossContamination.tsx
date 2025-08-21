"use client"

import { Shield, CheckCircle2, AlertTriangle, Users, Settings, FileText } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"

export const AllergenGuideCrossContamination = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
            Preventing Cross-Contamination
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Key steps to prevent allergen cross-contamination in your kitchen and keep food
            preparation safe.
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg"
        >
          <div className="grid gap-8 md:grid-cols-2">
            {/* Kitchen Procedures */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Kitchen Procedures</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="text-gray-700">
                    Use separate preparation areas for allergen-free dishes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="text-gray-700">
                    Use dedicated utensils, cutting boards, and equipment
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="text-gray-700">Clean and sanitize equipment between uses</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="text-gray-700">Store allergen-free ingredients separately</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="text-gray-700">
                    Use color-coded equipment for different allergens
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="text-gray-700">Regular deep cleaning of preparation areas</span>
                </li>
              </ul>
            </div>

            {/* Staff Training */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Staff Training</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                  <span className="text-gray-700">Train all staff on allergen awareness</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                  <span className="text-gray-700">Regular updates on allergen procedures</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                  <span className="text-gray-700">
                    Clear communication about allergen requirements
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                  <span className="text-gray-700">Emergency procedures for allergic reactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                  <span className="text-gray-700">How to handle customer allergen inquiries</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                  <span className="text-gray-700">Documentation and record-keeping procedures</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Additional Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h4 className="font-semibold text-red-800">High Risk Areas</h4>
            </div>
            <p className="text-sm text-red-700">
              Pay special attention to areas where multiple allergens are handled. Use separate
              equipment and maintain strict cleaning protocols.
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Verification Process</h4>
            </div>
            <p className="text-sm text-blue-700">
              Implement verification steps to ensure allergen-free dishes are prepared correctly.
              Double-check ingredients and preparation methods.
            </p>
          </div>

          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <FileText className="h-6 w-6 text-green-600" />
              <h4 className="font-semibold text-green-800">Documentation</h4>
            </div>
            <p className="text-sm text-green-700">
              Keep detailed records of cross-contamination prevention procedures, staff training,
              and any incidents for EHO inspections.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

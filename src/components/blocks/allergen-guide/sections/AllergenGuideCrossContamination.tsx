"use client"

import { Shield, CheckCircle2, AlertTriangle, Users, Settings, FileText } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"

export const AllergenGuideCrossContamination = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Preventing Cross-Contamination
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Essential steps to prevent allergen cross-contamination in your kitchen and ensure safe food preparation.
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
        >
          <div className="grid gap-8 md:grid-cols-2">
            {/* Kitchen Procedures */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Kitchen Procedures</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Use separate preparation areas for allergen-free dishes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Use dedicated utensils, cutting boards, and equipment</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Clean and sanitize equipment between uses</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Store allergen-free ingredients separately</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Use color-coded equipment for different allergens</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Regular deep cleaning of preparation areas</span>
                </li>
              </ul>
            </div>

            {/* Staff Training */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Staff Training</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Train all staff on allergen awareness</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Regular updates on allergen procedures</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Clear communication about allergen requirements</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Emergency procedures for allergic reactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">How to handle customer allergen inquiries</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
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
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h4 className="font-semibold text-red-800">High Risk Areas</h4>
            </div>
            <p className="text-sm text-red-700">
              Pay special attention to areas where multiple allergens are handled. Use separate equipment and maintain strict cleaning protocols.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Verification Process</h4>
            </div>
            <p className="text-sm text-blue-700">
              Implement verification steps to ensure allergen-free dishes are prepared correctly. Double-check ingredients and preparation methods.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-green-600" />
              <h4 className="font-semibold text-green-800">Documentation</h4>
            </div>
            <p className="text-sm text-green-700">
              Keep detailed records of cross-contamination prevention procedures, staff training, and any incidents for EHO inspections.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 
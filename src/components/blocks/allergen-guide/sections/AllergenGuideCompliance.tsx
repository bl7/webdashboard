"use client"

import { Shield, CheckCircle2, AlertTriangle, FileText, Users, Clock } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"

export const AllergenGuideCompliance = () => {
  return (
    <section className="bg-gray-50 py-24">
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
            Natasha's Law Compliance Requirements
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            What you need to know about allergen labeling in the UK and how to follow EHO rules.
          </p>
        </motion.div>

        {/* Compliance Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* What You Must Do */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-xl border border-red-200 bg-white p-8 shadow-lg"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-800">What You Must Do</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <span className="text-gray-700">
                  Clearly declare all 14 allergens on your menu or food labels
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <span className="text-gray-700">
                  Provide allergen information for all food items
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <span className="text-gray-700">
                  Train staff on allergen awareness and procedures
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <span className="text-gray-700">
                  Keep records of allergen information for inspection
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <span className="text-gray-700">
                  Update allergen information when recipes change
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <span className="text-gray-700">
                  Have procedures to prevent cross-contamination
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Best Practices */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-xl border border-blue-200 bg-white p-8 shadow-lg"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-800">Best Practices</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <span className="text-gray-700">Use clear, easy-to-read allergen labels</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <span className="text-gray-700">
                  Separate preparation areas for allergen-free dishes
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <span className="text-gray-700">Use dedicated utensils and equipment</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <span className="text-gray-700">Regular staff training on allergen procedures</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <span className="text-gray-700">Keep allergen information up to date</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <span className="text-gray-700">
                  Have emergency procedures for allergic reactions
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Additional Compliance Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Documentation</h4>
            </div>
            <p className="text-sm text-gray-600">
              Keep detailed records of all allergen information, training sessions, and procedures.
              EHO inspectors may request these during visits.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Staff Training</h4>
            </div>
            <p className="text-sm text-gray-600">
              Regular training sessions ensure all staff understand allergen requirements and can
              handle customer inquiries confidently.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Regular Updates</h4>
            </div>
            <p className="text-sm text-gray-600">
              Review and update allergen information regularly, especially when menu items or
              suppliers change.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

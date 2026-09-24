"use client"
import React from "react"
import { Shield, CheckCircle, AlertTriangle, FileText, Zap, Clock } from "lucide-react"
import { motion } from "framer-motion"

export const ExpiryDateLabelsCompliance = () => (
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
        <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
          <Shield className="mr-2 h-4 w-4" />
          InstaLabel Compliance Features
        </div>
        <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Built for Natasha's Law & Food Safety Compliance
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          InstaLabel's intelligent software automatically ensures every expiry date label meets all
          UK food labeling requirements. No more compliance worries or manual formatting.
        </p>
      </motion.div>

      {/* Compliance Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Natasha's Law */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">PPDS labelling support</h3>
          <p className="mb-4 text-gray-600">
            Every label automatically includes required allergen information, ingredients, and
            expiry dates as mandated by Natasha's Law (PPDS regulations). InstaLabel handles the
            complexity so you don't have to.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              saved allergen information
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Automatic ingredient listing
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              FSA-compliant formatting
            </li>
          </ul>
        </motion.div>

        {/* Food Safety Standards */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">HACCP & Food Safety Ready</h3>
          <p className="mb-4 text-gray-600">
            Meet HACCP requirements and food safety audit standards with automated labeling that
            ensures consistency and accuracy. Every label is inspection-ready.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              HACCP compliant templates
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Complete audit trail
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              EHO inspection ready
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Compliance Benefits */}
      <motion.div
        className="mt-12 rounded-lg bg-white p-8 shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="text-center">
          <h3 className="mb-6 text-2xl font-bold text-gray-900">
            Why InstaLabel Supports Consistent Compliance Workflows
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <Zap className="h-8 w-8 text-mkt-teal" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">Accuracy</h4>
              <p className="text-sm text-gray-600">
                Allergen emphasis uses the information you have saved. Your team still checks every
                label is 100% accurate and compliant.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">Automatic Formatting</h4>
              <p className="text-sm text-gray-600">
                Every label automatically follows FSA requirements and Natasha's Law formatting
                standards. No manual formatting needed.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <Clock className="h-8 w-8 text-green-500" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">Real-Time Updates</h4>
              <p className="text-sm text-gray-600">
                InstaLabel automatically updates when UK food safety regulations change, ensuring
                your labels follow current compliance requirements.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Compliance Statistics */}
      <motion.div
        className="mt-12 grid gap-6 md:grid-cols-3"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <div className="rounded-lg bg-mkt-canvas p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-mkt-teal">Your rules</div>
          <div className="text-sm font-medium text-mkt-ink">Date settings</div>
          <div className="mt-1 text-xs text-mkt-teal">Your team checks the finished label</div>
        </div>
        <div className="rounded-lg bg-green-50 p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-green-600">Less writing</div>
          <div className="text-sm font-medium text-green-800">Than handwriting</div>
          <div className="mt-1 text-xs text-green-600">Select a saved item and print</div>
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

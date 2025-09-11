"use client"

import React from "react"
import { motion } from "framer-motion"
import { Clock, Thermometer, AlertTriangle, Users, Zap } from "lucide-react"

export const CookedLabelsFeatures = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <div className="mb-2 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200">
            <Zap className="mr-2 h-4 w-4" />
            Features
          </div>
          <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need for HACCP-Compliant Cook Labels
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600">
            InstaLabel's cook labeling system provides all the tools you need to track food safety,
            comply with HACCP regulations, and ensure hot food safety.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                <Clock className="h-7 w-7 text-orange-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Cooking Date + Time Auto-Stamped</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Every cook label automatically includes the cooking date and time, ensuring complete
              traceability and HACCP compliance.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Automatic timestamping</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>HACCP compliance</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Complete traceability</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>No manual entry errors</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Allergen Summary Included</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Clear allergen information prominently displayed to prevent cross-contamination and
              ensure customer safety.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Allergen highlighting</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Clear allergen summary</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Safety compliance</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Easy identification</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                <Thermometer className="h-7 w-7 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Temperature Entry Field</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Record cooking temperatures directly on the label for complete HACCP compliance and
              food safety tracking.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Temperature recording</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>HACCP compliance</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Food safety tracking</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Easy temperature logging</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                <Users className="h-7 w-7 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Staff Initials + Batch Tracking</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Track who cooked each batch and assign unique batch codes for complete traceability
              and accountability.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Staff initials tracking</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Unique batch codes</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Complete traceability</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Accountability system</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-8">
            <h4 className="mb-6 text-center text-xl font-bold text-gray-900">
              Simple 3-Step Process
            </h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
                  1
                </div>
                <h5 className="font-semibold text-gray-900">Select Dish</h5>
                <p className="text-sm text-gray-600">Choose from your menu items database</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
                  2
                </div>
                <h5 className="font-semibold text-gray-900">Record Temperature</h5>
                <p className="text-sm text-gray-600">Enter cooking temperature &amp; time</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
                  3
                </div>
                <h5 className="font-semibold text-gray-900">Print &amp; Apply</h5>
                <p className="text-sm text-gray-600">Print label and apply to hot food container</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

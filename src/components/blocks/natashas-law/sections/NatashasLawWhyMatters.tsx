"use client"
import React from "react"
import { AlertTriangle, FileText, Clock, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

export const NatashasLawWhyMatters = () => (
  <section className="relative w-full bg-gradient-to-br from-white via-purple-50 to-pink-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row">
      {/* Visual: Problem illustration */}
      <motion.div
        className="mx-auto w-full max-w-md flex-1"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-semibold text-gray-700">Manual PPDS Labels</span>
          </div>

          {/* Handwritten label mockup */}
          <div className="space-y-3">
            <div className="rounded border border-gray-300 bg-white p-3">
              <div className="text-sm font-semibold text-gray-800">Chicken Caesar Salad</div>
              <div className="mt-1 text-xs text-gray-600">
                Chicken, lettuce, dressing, cheese, croutons
              </div>
              <div className="mt-2 text-xs text-red-600">⚠️ Missing allergen info</div>
            </div>

            <div className="text-xs text-gray-500">
              <div>❌ No storage instructions</div>
              <div>❌ No business details</div>
              <div>❌ Not FSA compliant</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        className="flex-1 space-y-6 text-center md:text-left"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="mb-1 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Why PPDS Matters
        </div>
        <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
          Natasha's Law Requires Every PPDS Product to List Full Ingredients and Allergens
        </h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 text-red-600" />
              <div>
                <h4 className="font-semibold text-red-800">
                  Manual Labels = Errors, Fines, Unhappy Customers
                </h4>
                <p className="mt-1 text-sm text-red-700">
                  Handwritten labels are prone to mistakes, missing allergen information, and
                  non-compliance with FSA requirements.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-purple-600" />
              <span>Time-consuming manual process</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <span>Risk of costly compliance fines</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <AlertTriangle className="h-4 w-4 text-purple-600" />
              <span>Customer safety concerns</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <FileText className="h-4 w-4 text-purple-600" />
              <span>Inconsistent formatting</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="text-sm font-semibold text-purple-800">
            <span className="font-bold text-purple-700">Natasha's Law Impact:</span> Since October
            2021, all food businesses selling prepacked for direct sale (PPDS) products must include
            full ingredient lists and allergen information on labels.
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

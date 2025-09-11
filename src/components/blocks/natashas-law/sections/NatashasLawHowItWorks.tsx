"use client"
import React from "react"
import { CheckCircle, Search, FileText, Building, Ruler, Zap } from "lucide-react"
import { motion } from "framer-motion"

const solutions = [
  {
    icon: <Search className="h-7 w-7 text-purple-600" />,
    title: "Automatic Allergen Detection & Highlighting",
    description:
      "InstaLabel automatically identifies allergens in your ingredients and highlights them in red for maximum visibility and compliance.",
    features: [
      "Smart ingredient analysis",
      "Red highlighting for allergens",
      "FSA-compliant formatting",
      "No manual allergen checking needed",
    ],
  },
  {
    icon: <FileText className="h-7 w-7 text-green-600" />,
    title: "Storage & Handling Instructions Built In",
    description:
      "Add custom storage instructions, temperature requirements, and handling guidelines directly to your PPDS labels.",
    features: [
      "Custom storage instructions",
      "Temperature requirements",
      "Handling guidelines",
      "Best before date tracking",
    ],
  },
  {
    icon: <Building className="h-7 w-7 text-blue-600" />,
    title: "Business Info + Traceability Fields",
    description:
      "Include your business name, contact details, and traceability information to meet all FSA requirements.",
    features: [
      "Business name & contact",
      "Traceability codes",
      "Batch information",
      "FSA compliance fields",
    ],
  },
  {
    icon: <Ruler className="h-7 w-7 text-pink-600" />,
    title: "80mm Layouts for Maximum Clarity",
    description:
      "Optimized 80mm thermal printer layouts ensure all information is clearly readable and professionally formatted.",
    features: [
      "80mm thermal printer ready",
      "Clear, readable formatting",
      "Professional appearance",
      "Maximum information density",
    ],
  },
]

export const NatashasLawHowItWorks = () => (
  <section className="relative w-full bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="mx-auto max-w-6xl">
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="mb-2 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200">
          <Zap className="mr-2 h-4 w-4" />
          How InstaLabel Solves It
        </div>
        <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
          Complete PPDS Compliance in Seconds
        </h3>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600">
          InstaLabel transforms the complex process of creating compliant PPDS labels into a simple,
          automated workflow that ensures you meet all FSA requirements every time.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-8 md:grid-cols-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        {solutions.map((solution, i) => (
          <motion.div
            key={i}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">{solution.icon}</div>
              <h4 className="text-lg font-bold text-gray-900">{solution.title}</h4>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-gray-600">{solution.description}</p>

            <ul className="space-y-2">
              {solution.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* Process flow */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-8">
          <h4 className="mb-6 text-center text-xl font-bold text-gray-900">
            Simple 3-Step Process
          </h4>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                1
              </div>
              <h5 className="font-semibold text-gray-900">Add Ingredients</h5>
              <p className="text-sm text-gray-600">Enter your recipe ingredients</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                2
              </div>
              <h5 className="font-semibold text-gray-900">Auto-Format</h5>
              <p className="text-sm text-gray-600">System highlights allergens & formats</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                3
              </div>
              <h5 className="font-semibold text-gray-900">Print & Go</h5>
              <p className="text-sm text-gray-600">Print compliant PPDS labels instantly</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

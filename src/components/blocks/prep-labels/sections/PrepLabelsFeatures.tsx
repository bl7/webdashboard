"use client"
import React from "react"
import { CheckCircle, Calendar, Users, AlertTriangle, Ruler, Zap } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: <Calendar className="h-7 w-7 text-purple-600" />,
    title: "Product Name + Expiry Auto-Filled",
    description:
      "Every prep label automatically includes the product name and expiry date, eliminating manual entry errors.",
    features: [
      "Auto-filled product names",
      "Automatic expiry calculation",
      "No manual data entry",
      "Consistent formatting",
    ],
  },
  {
    icon: <Users className="h-7 w-7 text-green-600" />,
    title: "Staff Initials + Batch Codes",
    description:
      "Track who prepared each item and assign unique batch codes for complete traceability and accountability.",
    features: [
      "Staff initials tracking",
      "Unique batch codes",
      "Complete traceability",
      "Accountability system",
    ],
  },
  {
    icon: <AlertTriangle className="h-7 w-7 text-blue-600" />,
    title: "Allergen Summary + Highlights",
    description:
      "Clear allergen information prominently displayed to prevent cross-contamination and ensure customer safety.",
    features: [
      "Allergen highlighting",
      "Clear allergen summary",
      "Safety compliance",
      "Easy identification",
    ],
  },
  {
    icon: <Ruler className="h-7 w-7 text-pink-600" />,
    title: "Works with 40/80mm Printers",
    description:
      "Compatible with both 40mm and 80mm thermal printers, perfect for different prep station sizes.",
    features: [
      "40mm printer support",
      "80mm printer support",
      "Flexible sizing",
      "Thermal printer ready",
    ],
  },
]

export const PrepLabelsFeatures = () => (
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
          Features
        </div>
        <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
          Everything You Need for Automated Prep Labels
        </h3>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600">
          InstaLabel's prep labeling system provides all the tools you need to keep your kitchen
          organized, compliant, and efficient.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">{feature.icon}</div>
              <h4 className="text-lg font-bold text-gray-900">{feature.title}</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">{feature.description}</p>
            <ul className="space-y-2">
              {feature.features.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

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
              <h5 className="font-semibold text-gray-900">Select Product</h5>
              <p className="text-sm text-gray-600">Choose from your prep items database</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                2
              </div>
              <h5 className="font-semibold text-gray-900">Auto-Generate</h5>
              <p className="text-sm text-gray-600">
                System fills in expiry, allergens & batch code
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                3
              </div>
              <h5 className="font-semibold text-gray-900">Print & Apply</h5>
              <p className="text-sm text-gray-600">Print label and apply to prep container</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

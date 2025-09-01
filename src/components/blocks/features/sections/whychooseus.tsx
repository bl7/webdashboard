"use client"

import { CheckCircle, Globe, Download, Zap, Shield, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const setupSupport = [
  {
    title: "Free 30-minute onboarding call",
    description: "To verify printer compatibility",
    icon: <Globe className="h-5 w-5 text-blue-600" />,
  },
  {
    title: "Guided PrintBridge installation",
    description: "Step-by-step assistance",
    icon: <Download className="h-5 w-5 text-green-600" />,
  },
  {
    title: "15-minute staff training session",
    description: "Via video call",
    icon: <Zap className="h-5 w-5 text-purple-600" />,
  },
  {
    title: "First-week check-in",
    description: "To ensure optimal usage",
    icon: <Shield className="h-5 w-5 text-orange-600" />,
  },
]

export const WhyChooseUs = () => {
  return (
    <section className="relative bg-white px-4 py-12 sm:px-6 sm:py-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative mx-auto max-w-7xl space-y-16 sm:space-y-20">
        <div className="space-y-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
            System Requirements & Setup Support
          </h3>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
            Everything you need to know to get up and running with InstaLabel quickly and
            efficiently.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {/* Technical Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h5 className="mb-4 text-lg font-semibold text-gray-900">Technical Requirements</h5>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                <span className="text-sm text-gray-700">
                  Modern web browser (Chrome, Firefox, Safari, Edge)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                <span className="text-sm text-gray-700">
                  USB thermal printer OR Android device with Bluetooth printer
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                <span className="text-sm text-gray-700">
                  Internet connection for dashboard access
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                <span className="text-sm text-gray-700">
                  140MB storage space for PrintBridge (if using USB printing)
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Setup Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h5 className="mb-4 text-lg font-semibold text-gray-900">Setup Support Included</h5>
            <div className="space-y-4">
              {setupSupport.map((support, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 rounded-lg bg-gray-100 p-2">{support.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900">{support.title}</div>
                    <div className="text-sm text-gray-600">{support.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

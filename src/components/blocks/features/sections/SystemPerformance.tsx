"use client"
import React from "react"
import { motion } from "framer-motion"
import {
  Zap,
  Database,
  Shield,
  Clock,
  Cloud,
  Download,
  CheckCircle,
  BarChart3,
  Cpu,
  HardDrive,
} from "lucide-react"

export const SystemPerformance = () => {
  const performanceMetrics = [
    {
      category: "Software Performance Metrics",
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      metrics: [
        {
          title: "Labels",
          value: "Saved items",
          description: "Ingredients, allergens and your date rules",
        },
        {
          title: "Sizes",
          value: "Two formats",
          description: "60 × 40 mm and 56 × 80 mm",
        },
        {
          title: "Computer",
          value: "PrintBridge",
          description: "A printer installed on Windows or macOS",
        },
        {
          title: "Android",
          value: "Two models",
          description: "MUNBYN RW411B and Born4Ship DB403",
        },
      ],
    },
    {
      category: "What you manage",
      icon: <Database className="h-8 w-8 text-blue-600" />,
      metrics: [
        {
          title: "Menu data",
          value: "Your account",
          description: "Items stay in InstaLabel",
        },
        {
          title: "Import",
          value: "CSV",
          description: "Review ingredients and allergens after import",
        },
        {
          title: "Dates",
          value: "Your rules",
          description: "InstaLabel applies the settings you choose",
        },
        {
          title: "Checks",
          value: "Your team",
          description: "Recipes and finished labels still need a check",
        },
      ],
    },
  ]

  return (
    <section className="relative bg-mkt-canvas py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-3 inline-flex items-center rounded-full bg-mkt-canvas px-3 py-1 text-xs font-semibold text-mkt-ink ring-1 ring-mkt-steel1">
            <Zap className="mr-2 h-4 w-4 text-mkt-teal" />
            Performance & Reliability
          </div>
          <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
            What the software actually does
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            A kitchen labelling system: saved items, two label sizes, and printing from a computer
            or a supported Android printer.
          </p>
        </motion.div>

        {/* Performance Showcase - Split Layout */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h4 className="mb-6 text-xl font-semibold text-gray-900">How you print</h4>
              <div className="space-y-6">
                {performanceMetrics[0].metrics.map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between border-b border-gray-200 pb-4"
                  >
                    <div>
                      <h5 className="font-semibold text-gray-900">{metric.title}</h5>
                      <p className="text-sm text-gray-600">{metric.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-mkt-teal">{metric.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Data Management */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h4 className="mb-6 text-xl font-semibold text-gray-900">Data Management</h4>
              <div className="space-y-6">
                {performanceMetrics[1].metrics.map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between border-b border-gray-200 pb-4"
                  >
                    <div>
                      <h5 className="font-semibold text-gray-900">{metric.title}</h5>
                      <p className="text-sm text-gray-600">{metric.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{metric.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom: Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-8 text-center">
            <h4 className="mb-2 text-xl font-semibold text-gray-900">Why This Matters</h4>
            <p className="text-gray-600">
              Fast, reliable performance means your kitchen operations never slow down
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-mkt-teal">High</div>
              <div className="text-sm text-gray-600">Availability</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-green-600">&lt;2s</div>
              <div className="text-sm text-gray-600">Page load time</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Support available</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

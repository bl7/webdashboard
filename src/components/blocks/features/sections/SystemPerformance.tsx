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
          title: "Page load time",
          value: "Under 2 seconds",
          description: "Globally optimized performance",
        },
        {
          title: "Label generation",
          value: "Under 500ms",
          description: "Per label processing speed",
        },
        {
          title: "Bulk operations",
          value: "100+ labels",
          description: "Processed in under 30 seconds",
        },
        {
          title: "Printer communication",
          value: "Real-time",
          description: "Via WebSocket connection",
        },
      ],
    },
    {
      category: "Data Management Capabilities",
      icon: <Database className="h-8 w-8 text-blue-600" />,
      metrics: [
        {
          title: "Cloud storage",
          value: "Unlimited",
          description: "Menu items and ingredients",
        },
        {
          title: "Data retention",
          value: "5 years",
          description: "For compliance purposes",
        },
        {
          title: "Export formats",
          value: "CSV",
          description: "Data export and reporting",
        },
        {
          title: "Offline storage",
          value: "Cached every other day",
          description: "Local PrintBridge storage",
        },
      ],
    },
  ]

  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-3 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200">
            <Zap className="mr-2 h-4 w-4 text-purple-600" />
            Performance & Reliability
          </div>
          <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Built for Speed & Reliability
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            InstaLabel delivers enterprise-grade performance with lightning-fast label generation
            and rock-solid reliability.
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
              <h4 className="mb-6 text-xl font-semibold text-gray-900">Performance Metrics</h4>
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
                      <div className="text-2xl font-bold text-purple-600">{metric.value}</div>
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
              <div className="mb-2 text-3xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime guarantee</div>
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

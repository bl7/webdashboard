"use client"
import React from "react"
import { motion } from "framer-motion"
import {
  Users,
  Database,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"

export const WorkflowIntegration = () => {
  const workflowAreas = [
    {
      title: "Staff Training & Onboarding",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      challenge: "New staff need to learn labeling procedures quickly",
      solution: "InstaLabel Solution",
      features: [
        "Simple tap-and-print interface requires minimal training",
        "Built-in prompts guide staff through correct labeling procedures",
        "Mistake prevention through automatic validation and suggestions",
        "Visual label preview shows exactly what will print",
      ],
      result: "Most staff productive within 60 seconds",
      color: "blue",
    },
    {
      title: "Inventory Management",
      icon: <Database className="h-8 w-8 text-green-600" />,
      challenge: "Tracking ingredient usage and expiry dates manually",
      solution: "InstaLabel Solution",
      features: [
        "Automatic expiry date calculations based on food type and storage",
        "Use-first labeling for items approaching expiry dates",
        "Barcode scanning for quick label reprints and inventory tracking",
        "Usage analytics to identify waste patterns and improvement opportunities",
      ],
      result: "Average 25-30% reduction in food waste",
      color: "green",
    },
    {
      title: "Compliance Documentation",
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      challenge: "Maintaining records for EHO inspections and audits",
      solution: "InstaLabel Solution",
      features: [
        "Automatic audit trail for all labeling activities",
        "Staff accountability with name and timestamp on every label",
        "Complete ingredient and allergen documentation",
        "Exportable reports for inspection preparation",
      ],
      result: "98% first-time pass rate for EHO inspections",
      color: "purple",
    },
  ]

  return (
    <section className="relative bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Integration with Kitchen Operations
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            InstaLabel seamlessly integrates with your existing kitchen workflows, making food
            safety and compliance second nature to your team.
          </p>
        </motion.div>

        {/* Workflow Areas - Timeline Style Layout */}
        <div className="relative mb-20">
          {/* Connection Line */}
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-1 -translate-x-1/2 transform bg-gradient-to-b from-blue-200 via-green-200 to-purple-200 lg:block" />

          <div className="space-y-16">
            {workflowAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center gap-8 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Icon & Connection Point */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full bg-${area.color}-100 border-4 border-white shadow-lg`}
                  >
                    {area.icon}
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1">
                  <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg">
                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="mb-2 text-2xl font-bold text-gray-900">{area.title}</h3>
                      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    </div>

                    {/* Challenge & Solution Grid */}
                    <div className="grid gap-6 lg:grid-cols-2">
                      {/* Challenge */}
                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Challenge
                        </h4>
                        <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                          <p className="text-sm text-gray-700">{area.challenge}</p>
                        </div>
                      </div>

                      {/* Solution */}
                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                          <Zap className="h-5 w-5 text-yellow-500" />
                          {area.solution}
                        </h4>
                        <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4">
                          <ul className="space-y-2">
                            {area.features.map((feature, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-3"
                              >
                                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Result */}
                    <div className="mt-6 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                        <div>
                          <span className="font-semibold text-gray-900">Result: </span>
                          <span className="font-medium text-green-800">{area.result}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow for Flow */}
                {index < workflowAreas.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="hidden lg:block"
                  >
                    <ArrowRight className="h-8 w-8 text-purple-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Integration Benefits Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="rounded-2xl border border-purple-200 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">Why Integration Matters</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 transition-colors duration-200 group-hover:bg-blue-200">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Time Savings</h4>
                <p className="text-sm text-gray-600">
                  60-second staff training vs. hours of manual instruction
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 transition-colors duration-200 group-hover:bg-green-200">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Risk Reduction</h4>
                <p className="text-sm text-gray-600">
                  98% inspection success rate vs. industry average of 85%
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 transition-colors duration-200 group-hover:bg-purple-200">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Efficiency Gains</h4>
                <p className="text-sm text-gray-600">
                  25-30% reduction in food waste through better tracking
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

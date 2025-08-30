"use client"

import {
  CheckCircle2,
  Shield,
  BookOpen,
  ClipboardList,
  Users,
  FileText,
  AlertCircle,
} from "lucide-react"
import { motion } from "framer-motion"

export const AllergenComplianceSolution = () => {
  const toolkitItems = [
    {
      icon: Shield,
      title: "14 Allergens Visual Reference Card",
      description: "Kitchen-ready poster",
      color: "purple",
    },
    {
      icon: BookOpen,
      title: "Hidden Allergen Sources Guide",
      description: "300+ ingredients decoded",
      color: "blue",
    },
    {
      icon: ClipboardList,
      title: "Cross-Contamination Prevention Checklist",
      description: "HACCP-compliant",
      color: "green",
    },
    {
      icon: Users,
      title: "Staff Training Template",
      description: "Customize for your team",
      color: "purple",
    },
    {
      icon: FileText,
      title: "Natasha's Law Compliance Audit",
      description: "25-point inspection",
      color: "blue",
    },
    {
      icon: AlertCircle,
      title: "Emergency Allergen Response Protocol",
      description: "Liability protection",
      color: "red",
    },
  ]

  const getIconColor = (color: string) => {
    switch (color) {
      case "purple":
        return "text-purple-600 bg-purple-100"
      case "blue":
        return "text-blue-600 bg-blue-100"
      case "green":
        return "text-green-600 bg-green-100"
      case "red":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl"
          >
            Complete UK Allergen Compliance Toolkit
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-xl text-gray-600"
          >
            Everything you need for UK Natasha's Law compliance and EHO inspections
          </motion.p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {toolkitItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-full p-3 ${getIconColor(item.color)} flex-shrink-0`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <div>
                      <h3 className="mb-1 font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
          className="rounded-xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-8 text-center"
        >
          <div className="mx-auto max-w-2xl">
            <h3 className="mb-2 text-2xl font-bold text-yellow-800">
              Normally £149 from food safety consultants
            </h3>
            <p className="text-lg font-semibold text-yellow-700">Yours completely free</p>
            <p className="mt-2 text-sm text-yellow-600">
              No hidden costs, no upsells, no strings attached
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

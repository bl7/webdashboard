"use client"

import { CheckCircle2, Shield, BookOpen, ClipboardList, Users, FileText, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export const AllergenComplianceSolution = () => {
  const toolkitItems = [
    {
      icon: Shield,
      title: "14 Allergens Visual Reference Card",
      description: "Kitchen-ready poster",
      color: "purple"
    },
    {
      icon: BookOpen,
      title: "Hidden Allergen Sources Guide",
      description: "300+ ingredients decoded",
      color: "blue"
    },
    {
      icon: ClipboardList,
      title: "Cross-Contamination Prevention Checklist",
      description: "HACCP-compliant",
      color: "green"
    },
    {
      icon: Users,
      title: "Staff Training Template",
      description: "Customize for your team",
      color: "purple"
    },
    {
      icon: FileText,
      title: "Natasha's Law Compliance Audit",
      description: "25-point inspection",
      color: "blue"
    },
    {
      icon: AlertCircle,
      title: "Emergency Allergen Response Protocol",
      description: "Liability protection",
      color: "red"
    }
  ]

  const getIconColor = (color: string) => {
    switch (color) {
      case "purple": return "text-purple-600 bg-purple-100"
      case "blue": return "text-blue-600 bg-blue-100"
      case "green": return "text-green-600 bg-green-100"
      case "red": return "text-red-600 bg-red-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
          >
            Complete UK Allergen Compliance Toolkit
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Everything you need for UK Natasha's Law compliance and EHO inspections
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {toolkitItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${getIconColor(item.color)} flex-shrink-0`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
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
          className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-yellow-800 mb-2">
              Normally £149 from food safety consultants
            </h3>
            <p className="text-lg text-yellow-700 font-semibold">
              Yours completely free
            </p>
            <p className="text-sm text-yellow-600 mt-2">
              No hidden costs, no upsells, no strings attached
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 
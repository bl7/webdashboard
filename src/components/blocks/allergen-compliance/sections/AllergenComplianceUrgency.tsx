"use client"

import { AlertTriangle, Clock, DollarSign, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export const AllergenComplianceUrgency = () => {
  const urgencyPoints = [
    {
      icon: AlertTriangle,
      title: "New",
      description: "Natasha's Law enforcement ramping up in 2024",
      color: "text-red-600"
    },
    {
      icon: DollarSign,
      title: "£12,000",
      description: "Average EHO fine (plus legal costs and reputation damage)",
      color: "text-red-600"
    },
    {
      icon: Clock,
      title: "15 min",
      description: "This toolkit takes to implement vs. weeks of research",
      color: "text-green-600"
    }
  ]

  return (
    <section className="py-20 px-4 bg-red-50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
        >
          Don't Wait for Your Next EHO Visit
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {urgencyPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className={`text-2xl font-bold mb-2 ${point.color}`}>
                {point.title}
              </div>
              <p className="text-gray-700">{point.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8 shadow-lg border"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Get Your Free Allergen Compliance Toolkit
          </h3>
          <p className="text-gray-600 mb-6">
            Join 500+ professional kitchens that are already compliant
          </p>
          <div className="flex items-center justify-center gap-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <span className="text-gray-700 font-medium">Instant download available</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 
"use client"

import { AlertTriangle, Clock, DollarSign, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export const AllergenComplianceUrgency = () => {
  const urgencyPoints = [
    {
      icon: AlertTriangle,
      title: "New",
      description: "Natasha's Law enforcement ramping up in 2024",
      color: "text-red-600",
    },
    {
      icon: DollarSign,
      title: "£12,000",
      description: "Average EHO fine (plus legal costs and reputation damage)",
      color: "text-red-600",
    },
    {
      icon: Clock,
      title: "15 min",
      description: "This toolkit takes to implement vs. weeks of research",
      color: "text-green-600",
    },
  ]

  return (
    <section className="bg-red-50 px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl"
        >
          Don't Wait for Your Next EHO Visit
        </motion.h3>

        <div className="mb-8 grid gap-8 md:grid-cols-3">
          {urgencyPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className={`mb-2 text-2xl font-bold ${point.color}`}>{point.title}</div>
              <p className="text-gray-700">{point.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-white p-8 shadow-lg"
        >
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Get Your Free Allergen Compliance Toolkit
          </h3>
          <p className="mb-6 text-gray-600">
            Join 500+ professional kitchens that are already compliant
          </p>
          <div className="flex items-center justify-center gap-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <span className="font-medium text-gray-700">Instant download available</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { Mail, Users, Clock } from "lucide-react"
import { motion } from "framer-motion"

export const AllergenComplianceBonus = () => {
  const bonusFeatures = [
    {
      icon: Mail,
      title: "Weekly compliance updates",
      description: "Delivered to your inbox",
    },
    {
      icon: Users,
      title: "Industry insights",
      description: "From 500+ professional kitchens",
    },
    {
      icon: Clock,
      title: "First to know",
      description: "About regulation changes",
    },
  ]

  return (
    <section className="bg-gray-50 px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-6 text-3xl font-bold text-gray-900"
        >
          Plus: Get Our Weekly Food Safety Tips
        </motion.h3>

        <div className="grid gap-8 md:grid-cols-3">
          {bonusFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <feature.icon className="mx-auto mb-4 h-8 w-8 text-purple-600" />
              <h3 className="mb-2 font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { Mail, Users, Clock } from "lucide-react"
import { motion } from "framer-motion"

export const AllergenComplianceBonus = () => {
  const bonusFeatures = [
    {
      icon: Mail,
      title: "Weekly compliance updates",
      description: "Delivered to your inbox"
    },
    {
      icon: Users,
      title: "Industry insights",
      description: "From 500+ professional kitchens"
    },
    {
      icon: Clock,
      title: "First to know",
      description: "About regulation changes"
    }
  ]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-gray-900 mb-6"
        >
          Plus: Get Our Weekly Food Safety Tips
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {bonusFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <feature.icon className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 
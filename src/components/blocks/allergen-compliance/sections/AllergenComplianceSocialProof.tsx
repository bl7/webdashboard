"use client"

import { Users, Download, Shield } from "lucide-react"
import { motion } from "framer-motion"

export const AllergenComplianceSocialProof = () => {
  const testimonials = [
    {
      quote: "Saved us hours of research and potential fines. The visual reference cards are now posted in every station.",
      author: "Head Chef",
      location: "Manchester"
    },
    {
      quote: "Finally, allergen compliance that makes sense. Our staff actually use the checklists daily.",
      author: "Owner",
      location: "Local Deli Group"
    },
    {
      quote: "Our EHO inspector was impressed with our documentation. The audit checklist caught issues we missed.",
      author: "Kitchen Manager",
      location: "London"
    }
  ]

  const stats = [
    { number: "1,200+", label: "Downloads", icon: Download },
    { number: "500+", label: "Kitchens using daily", icon: Users },
    { number: "Zero", label: "Compliance issues reported", icon: Shield }
  ]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
          >
            Trusted by Professional Kitchens Across the UK
          </motion.h2>
        </div>

        {/* Testimonials */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              className="bg-purple-50 rounded-xl p-6"
            >
              <div className="flex items-center justify-center mb-3">
                <stat.icon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
              <p className="text-gray-700">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 
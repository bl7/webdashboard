"use client"

import { Users, Download, Shield } from "lucide-react"
import { motion } from "framer-motion"

export const AllergenComplianceSocialProof = () => {
  const testimonials = [
    {
      quote:
        "Saved us hours of research and potential fines. The visual reference cards are now posted in every station.",
      author: "Head Chef",
      location: "Manchester",
    },
    {
      quote:
        "Finally, allergen compliance that makes sense. Our staff actually use the checklists daily.",
      author: "Owner",
      location: "Local Deli Group",
    },
    {
      quote:
        "Our EHO inspector was impressed with our documentation. The audit checklist caught issues we missed.",
      author: "Kitchen Manager",
      location: "London",
    },
  ]

  const stats = [
    { number: "1,200+", label: "Downloads", icon: Download },
    { number: "500+", label: "Kitchens using daily", icon: Users },
    { number: "Zero", label: "Compliance issues reported", icon: Shield },
  ]

  return (
    <section className="bg-gray-50 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl"
          >
            Trusted by Professional Kitchens Across the UK
          </motion.h3>
        </div>

        {/* Testimonials */}
        <div className="mb-12 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
              <p className="italic leading-relaxed text-gray-700">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid gap-8 text-center md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl bg-purple-50 p-6"
            >
              <div className="mb-3 flex items-center justify-center">
                <stat.icon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mb-2 text-3xl font-bold text-purple-600">{stat.number}</div>
              <p className="text-gray-700">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"
import React from "react"
import { CheckCircle, Shield, Clock, Users, Award, Zap } from "lucide-react"
import { motion } from "framer-motion"

const benefits = [
  {
    icon: <Shield className="h-8 w-8 text-purple-600" />,
    title: "No More Guessing If an Ingredient Is Safe",
    description: "Clear expiry dates eliminate guesswork, ensuring food safety and reducing waste.",
    features: [
      "Clear expiry dates",
      "Food safety compliance",
      "Reduced waste",
      "Easy identification",
    ],
  },
  {
    icon: <Users className="h-8 w-8 text-green-600" />,
    title: "Staff Accountability and Traceability",
    description:
      "Staff initials and printed dates provide complete traceability for every ingredient in your kitchen.",
    features: ["Staff accountability", "Complete traceability", "Quality control", "Easy tracking"],
  },
  {
    icon: <Award className="h-8 w-8 text-blue-600" />,
    title: "Professional Kitchen Organization",
    description:
      "Clean, consistent labeling system demonstrates your commitment to food safety and compliance.",
    features: [
      "Professional appearance",
      "Consistent formatting",
      "Easy to read",
      "40mm format for small containers",
    ],
  },
]

const stats = [
  {
    number: "50%",
    label: "Less Food Waste",
    description: "Clear expiry dates reduce waste",
  },
  {
    number: "100%",
    label: "Traceability",
    description: "Staff initials and printed dates",
  },
  {
    number: "40mm",
    label: "Small Containers",
    description: "Perfect for spice jars and small containers",
  },
  {
    number: "24/7",
    label: "Printing",
    description: "Print labels anytime, anywhere",
  },
]

export const IngredientLabelsBenefits = () => (
  <section className="relative w-full bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="mx-auto max-w-6xl">
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="mb-2 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200">
          <Zap className="mr-2 h-4 w-4" />
          Benefits
        </div>
        <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
          Why Choose InstaLabel for Ingredient Labels
        </h3>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600">
          InstaLabel's ingredient labeling system transforms kitchen organization from a
          time-consuming task into a simple, automated process that saves time and reduces waste.
        </p>
      </motion.div>

      {/* Main Benefits Grid */}
      <motion.div
        className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        {benefits.map((benefit, i) => (
          <motion.div
            key={i}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">{benefit.icon}</div>
              <h4 className="text-lg font-bold text-gray-900">{benefit.title}</h4>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-gray-600">{benefit.description}</p>

            <ul className="space-y-2">
              {benefit.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="mb-6 text-center">
          <h4 className="text-2xl font-bold">The Numbers Don't Lie</h4>
          <p className="text-purple-100">
            See why 500+ UK kitchens trust InstaLabel for ingredient organization
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-1 text-3xl font-bold text-white">{stat.number}</div>
              <div className="mb-1 text-sm font-semibold text-purple-100">{stat.label}</div>
              <div className="text-xs text-purple-200">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Additional Benefits */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <div className="mb-3 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h5 className="font-bold text-green-800">Kitchen Organization</h5>
            </div>
            <p className="text-sm text-green-700">
              Clear ingredient labels with expiry dates and staff initials keep your kitchen
              organized and efficient.
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <div className="mb-3 flex items-center gap-3">
              <Clock className="h-6 w-6 text-blue-600" />
              <h5 className="font-bold text-blue-800">Food Safety</h5>
            </div>
            <p className="text-sm text-blue-700">
              No more guessing ingredient safety. Clear expiry dates and traceability ensure food
              safety compliance.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

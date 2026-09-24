"use client"
import React from "react"
import { CheckCircle, Shield, Clock, DollarSign, Users, Zap } from "lucide-react"
import { motion } from "framer-motion"

const benefits = [
  {
    icon: <Shield className="h-8 w-8 text-mkt-teal" />,
    title: "Stay Compliant with Zero Training",
    description:
      "InstaLabel handles all FSA requirements automatically. No need to learn complex compliance rules or worry about missing information.",
    features: [
      "Automatic FSA formatting",
      "Built-in compliance checks",
      "No training required",
      "Consistent formatting and compliance checks",
    ],
  },
  {
    icon: <Users className="h-8 w-8 text-green-600" />,
    title: "Protect Customers and Your Business",
    description:
      "Ensure customer safety with accurate allergen information while protecting your business from costly compliance violations.",
    features: [
      "Accurate allergen information",
      "Customer safety protection",
      "Legal compliance coverage",
      "Reduced liability risk",
    ],
  },
  {
    icon: <Clock className="h-8 w-8 text-blue-600" />,
    title: "Save Hours Compared to Manual Handwriting",
    description:
      "What used to take 10+ minutes per label now takes seconds. Focus on food preparation instead of label writing.",
    features: [
      "Spend less time writing labels by hand",
      "Consistent formatting",
      "No handwriting errors",
      "More time for food prep",
    ],
  },
]

const stats = [
  {
    number: "PPDS",
    label: "Customer-facing labels",
    description: "Ingredient list and allergen emphasis from your records",
  },
  {
    number: "Your check",
    label: "Still required",
    description: "Your team checks the recipe and the finished label",
  },
  {
    number: "56 × 80",
    label: "More room",
    description: "Useful when a PPDS label needs a longer ingredient list",
  },
  {
    number: "60 × 40",
    label: "Also supported",
    description: "PPDS is not limited to one label size",
  },
]

export const NatashasLawBenefits = () => (
  <section className="relative w-full bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="mx-auto max-w-6xl">
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="mb-2 inline-flex items-center rounded-full bg-mkt-canvas px-3 py-1 text-xs font-semibold text-mkt-ink ring-1 ring-mkt-steel1">
          <Zap className="mr-2 h-4 w-4" />
          Key Benefits
        </div>
        <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
          Why Choose InstaLabel for PPDS Labels
        </h3>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600">
          InstaLabel transforms PPDS labeling from a time-consuming, error-prone task into a simple,
          automated process that ensures compliance and saves you time.
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
        className="rounded-xl text-white p-8 text-white"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="mb-6 text-center">
          <h4 className="text-2xl font-bold">The Numbers Don't Lie</h4>
          <p className="text-white/80">
            See how real kitchens use InstaLabel for PPDS compliance
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
              <div className="mb-1 text-sm font-semibold text-white/80">{stat.label}</div>
              <div className="text-xs text-white/70">{stat.description}</div>
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
              <h5 className="font-bold text-green-800">Peace of Mind</h5>
            </div>
            <p className="text-sm text-green-700">
              Never worry about compliance again. InstaLabel ensures every label meets FSA
              requirements, protecting both your customers and your business.
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <div className="mb-3 flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
              <h5 className="font-bold text-blue-800">Cost Effective</h5>
            </div>
            <p className="text-sm text-blue-700">
              Avoid costly compliance fines and save hours of manual work. InstaLabel pays for
              itself with time savings and risk reduction.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

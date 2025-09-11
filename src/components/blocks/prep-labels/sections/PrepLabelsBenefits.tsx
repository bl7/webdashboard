"use client"
import React from "react"
import { CheckCircle, Shield, Clock, Users, Award, Zap } from "lucide-react"
import { motion } from "framer-motion"

const benefits = [
  {
    icon: <Clock className="h-8 w-8 text-purple-600" />,
    title: "Close Down Kitchens Faster",
    description:
      "Automated prep labels eliminate time-consuming handwriting, helping staff finish prep work quickly and efficiently.",
    features: [
      "No more handwriting",
      "Faster prep completion",
      "Reduced prep time",
      "Efficient workflow",
    ],
  },
  {
    icon: <Shield className="h-8 w-8 text-green-600" />,
    title: "Reduce Waste and Mislabelling",
    description:
      "Clear, consistent labels prevent misidentification and reduce food waste from expired or mislabeled items.",
    features: ["Clear identification", "Reduced food waste", "Accurate labeling", "Cost savings"],
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Trace Batches in Seconds",
    description:
      "Staff initials and batch codes provide complete traceability for every prep item, making quality control effortless.",
    features: ["Complete traceability", "Batch tracking", "Quality control", "Easy tracking"],
  },
]

const stats = [
  {
    number: "60%",
    label: "Faster Prep",
    description: "Automated labels speed up prep work",
  },
  {
    number: "40%",
    label: "Less Waste",
    description: "Clear labels reduce food waste",
  },
  {
    number: "100%",
    label: "Traceability",
    description: "Complete batch tracking",
  },
  {
    number: "24/7",
    label: "Printing",
    description: "Print labels anytime, anywhere",
  },
]

export const PrepLabelsBenefits = () => (
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
          Why Choose InstaLabel for Prep Labels
        </h3>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600">
          InstaLabel's prep labeling system transforms kitchen prep work from a time-consuming task
          into a simple, automated process that saves time and reduces waste.
        </p>
      </motion.div>

      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">{benefit.icon}</div>
              <h4 className="text-lg font-bold text-gray-900">{benefit.title}</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">{benefit.description}</p>
            <ul className="space-y-2">
              {benefit.features.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

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
            See why 500+ UK kitchens trust InstaLabel for prep organization
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-1 text-3xl font-bold text-white">{stat.number}</div>
              <div className="mb-1 text-sm font-semibold text-purple-100">{stat.label}</div>
              <div className="text-xs text-purple-200">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
              <h5 className="font-bold text-green-800">Kitchen Efficiency</h5>
            </div>
            <p className="text-sm text-green-700">
              Automated prep labels with expiry dates, allergen info, and batch details keep your
              kitchen organized and efficient.
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <div className="mb-3 flex items-center gap-3">
              <Clock className="h-6 w-6 text-blue-600" />
              <h5 className="font-bold text-blue-800">Food Safety</h5>
            </div>
            <p className="text-sm text-blue-700">
              Clear allergen information and expiry dates ensure food safety compliance and prevent
              cross-contamination.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

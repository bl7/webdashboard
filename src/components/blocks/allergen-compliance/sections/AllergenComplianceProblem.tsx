"use client"

import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export const AllergenComplianceProblem = () => {
  return (
    <section className="bg-gray-50 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl"
          >
            Allergen Compliance is Getting Harder
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600"
          >
            The stakes have never been higher for UK food businesses
          </motion.p>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  EHO inspections increasing 40% year-over-year
                </h3>
                <p className="text-gray-600">
                  Local authorities are ramping up enforcement of Natasha's Law
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Non-compliance fines start at £5,000 per violation
                </h3>
                <p className="text-gray-600">Plus legal costs and potential criminal charges</p>
              </div>
            </motion.div>
          </div>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  73% of food businesses struggle with consistent allergen labeling
                </h3>
                <p className="text-gray-600">Manual tracking leads to human error and liability</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  One missed allergen label could shut down your kitchen
                </h3>
                <p className="text-gray-600">The cost of a single mistake is devastating</p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
        >
          <h3 className="mb-2 text-xl font-bold text-red-900">
            One missed allergen label could shut down your kitchen
          </h3>
          <p className="text-red-800">Don't wait for an incident to happen. Get compliant today.</p>
        </motion.div>
      </div>
    </section>
  )
}

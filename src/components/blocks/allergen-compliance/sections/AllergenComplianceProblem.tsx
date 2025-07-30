"use client"

import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export const AllergenComplianceProblem = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
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

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">EHO inspections increasing 40% year-over-year</h3>
                <p className="text-gray-600">Local authorities are ramping up enforcement of Natasha's Law</p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Non-compliance fines start at £5,000 per violation</h3>
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
              <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">73% of food businesses struggle with consistent allergen labeling</h3>
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
              <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">One missed allergen label could shut down your kitchen</h3>
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
          className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
        >
          <h3 className="text-xl font-bold text-red-900 mb-2">
            One missed allergen label could shut down your kitchen
          </h3>
          <p className="text-red-800">
            Don't wait for an incident to happen. Get compliant today.
          </p>
        </motion.div>
      </div>
    </section>
  )
} 
"use client"
import React from "react"
import { AlertTriangle, FileText, Clock, DollarSign, Shield } from "lucide-react"
import { motion } from "framer-motion"

export const KitchenLabelPrinterProblem = () => (
  <section className="relative w-full bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row">
      {/* Visual: Kitchen labeling problems illustration */}
      <motion.div
        className="mx-auto w-full max-w-md flex-1"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-center">
            <FileText className="h-16 w-16 text-gray-400" />
          </div>
          <div className="space-y-3 text-center">
            <div className="text-sm font-medium text-gray-700">Kitchen Labeling Chaos</div>
            <div className="flex justify-center space-x-2">
              <div className="h-2 w-8 rounded bg-red-300"></div>
              <div className="h-2 w-8 rounded bg-yellow-300"></div>
              <div className="h-2 w-8 rounded bg-green-300"></div>
            </div>
            <div className="text-xs text-gray-500">
              Manual ingredient typing
              <br />
              Expiry date calculations
              <br />
              Allergen compliance errors
            </div>
          </div>
        </div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        className="flex-1 space-y-6 text-center md:text-left"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="mb-1 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Kitchen Labeling Problems
        </div>
        <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
          Manual Kitchen Labeling is Error-Prone & Time-Consuming
        </h3>
        <ul className="mx-auto max-w-md list-disc space-y-2 pl-6 text-base text-gray-700 md:mx-0">
          <li>Staff spend 2-3 minutes typing ingredient lists for each dish</li>
          <li>Manual expiry date calculations lead to food safety violations</li>
          <li>Allergen information is often incomplete or inaccurate</li>
          <li>Natasha's Law compliance requires perfect formatting every time</li>
          <li>No audit trail for food safety inspections</li>
        </ul>
        <div className="mt-4 text-lg font-semibold text-gray-700">
          <span className="font-bold text-purple-700">Average time per label:</span> 2-3 minutes,
          <span className="font-bold text-purple-700"> 34% compliance errors</span>
        </div>
        <div className="mt-2 text-base text-gray-500">
          Manual kitchen labeling puts your food safety at risk and wastes valuable prep time.{" "}
          <span className="font-bold text-purple-700">InstaLabel automates everything.</span>
        </div>
      </motion.div>
    </div>
  </section>
)

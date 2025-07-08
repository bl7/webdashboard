'use client'
import React from "react"
import { Clock, ClipboardList, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

export const WhyInstaLabel = () => {
  return (
    <section className="relative bg-white px-4 sm:px-6 py-12 sm:py-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative mx-auto max-w-7xl space-y-16 sm:space-y-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          {/* Header */}
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Why InstaLabel?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Born from real kitchen challenges, designed to simplify and secure your food operations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 max-w-5xl mx-auto"
        >
          {/* Benefits Grid */}
          {/* Card 1 - Save Time */}
          <div className="group">
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full hover:border-purple-200 hover:shadow-md transition-all duration-200 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Save Time & Reduce Waste
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Automate ingredient labeling and expiry tracking, streamlining kitchen workflows and
                cutting down waste.
              </p>
              
              <div className="inline-flex items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 ring-1 ring-purple-200">
                50+ labels saved daily
              </div>
            </div>
          </div>

          {/* Card 2 - Compliance */}
          <div className="group">
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full hover:border-purple-200 hover:shadow-md transition-all duration-200 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
                  <ClipboardList className="w-6 h-6" />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Simplify Compliance
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Ensure accurate allergen and ingredient information with easy-to-use smart labels that
                meet safety standards.
              </p>
              
              <div className="inline-flex items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 ring-1 ring-purple-200">
                HACCP & EHO Compliant
              </div>
            </div>
          </div>

          {/* Card 3 - Food Safety */}
          <div className="group">
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full hover:border-purple-200 hover:shadow-md transition-all duration-200 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Boost Food Safety
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Minimize risks in your kitchen with reliable tracking that protects your customers and
                your reputation.
              </p>
              
              <div className="inline-flex items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 ring-1 ring-purple-200">
                500+ Kitchens Trust Us
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA/Trust Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-6 p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Trusted by 500+ restaurants</span> • 
              <span className="ml-1">HACCP Compliant</span> • 
              <span className="ml-1">No training required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
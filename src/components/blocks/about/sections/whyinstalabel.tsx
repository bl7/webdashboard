"use client"
import React from "react"
import { Clock, ClipboardList, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

export const WhyInstaLabel = () => {
  return (
    <section className="relative bg-white px-4 py-12 sm:px-6 sm:py-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative mx-auto max-w-7xl space-y-16 sm:space-y-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-4 text-center"
        >
          {/* Header */}
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Why InstaLabel?
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Born from real kitchen challenges, designed to simplify and secure your food operations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2"
        >
          {/* Benefits Grid */}
          {/* Card 1 - Save Time */}
          <div className="group">
            <div className="h-full rounded-lg border border-gray-200 bg-white p-6 text-center transition-all duration-200 hover:border-purple-200 hover:shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors duration-200 group-hover:bg-purple-100">
                  <Clock className="h-6 w-6" />
                </div>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-gray-900">Save Time & Reduce Waste</h3>
              <p className="mb-4 text-base leading-relaxed text-gray-600">
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
            <div className="h-full rounded-lg border border-gray-200 bg-white p-6 text-center transition-all duration-200 hover:border-purple-200 hover:shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors duration-200 group-hover:bg-purple-100">
                  <ClipboardList className="h-6 w-6" />
                </div>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-gray-900">Simplify Compliance</h3>
              <p className="mb-4 text-base leading-relaxed text-gray-600">
                Ensure accurate allergen and ingredient information with easy-to-use smart labels
                that meet safety standards.
              </p>

              <div className="inline-flex items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 ring-1 ring-purple-200">
                HACCP & EHO Compliant
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA/Trust Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-base text-gray-600">
              {/* <span className="font-semibold text-gray-900">Trusted by 500+ restaurants</span> •  */}
              <span className="ml-1 font-semibold">HACCP Compliant</span> •
              <span className="ml-1">No training required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

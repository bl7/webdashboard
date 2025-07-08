"use client"

import React from "react"
import { Upload, Printer, Smartphone, BadgeCheck, Layers, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export const HowItWorks = () => (
  <section className="relative px-4 py-16 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-white via-blue-50/30 to-white">
    <div className="container mx-auto max-w-6xl">
      {/* Section Header with Compliance Badge */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-12 text-center flex flex-col items-center justify-center"
      >
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-semibold text-xs ring-1 ring-purple-200 mb-3">
          <BadgeCheck className="h-4 w-4 mr-1 text-purple-600" />
          100% Natasha’s Law & EHO Compliant
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-gray-900">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            How InstaLabel Works
          </span>
          <br />
          <span className="text-gray-900">From Setup to Printing in Minutes</span>
        </h2>
      </motion.div>
      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        {[
          { icon: <Upload className="h-8 w-8 text-purple-600" />, bg: "bg-purple-100", title: "Upload or Enter Menu", desc: "Import your menu and ingredients, or enter them manually in minutes." },
          { icon: <Printer className="h-8 w-8 text-pink-600" />, bg: "bg-pink-100", title: "Connect Any Printer", desc: "Works with any USB label printer — no special hardware required." },
          { icon: <Layers className="h-8 w-8 text-blue-600" />, bg: "bg-blue-100", title: "Select Label Type", desc: "Choose Prep, Cook, Use-First, PPDS, or custom labels — all ready to go." },
          { icon: <Smartphone className="h-8 w-8 text-green-600" />, bg: "bg-green-100", title: "Print Instantly", desc: "Print from the dashboard or directly on a Sunmi device (app runs natively)." },
        ].map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 * (i + 1) }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 ${step.bg}`}>{step.icon}</div>
            <div className="font-bold text-lg text-gray-900 mb-1">{step.title}</div>
            <div className="text-sm text-gray-600">{step.desc}</div>
          </motion.div>
        ))}
      </div>
      {/* Sunmi Device Note */}
      <div className="flex items-center justify-center mt-8">
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm gap-2">
          <Smartphone className="h-5 w-5 text-blue-600" />
          Print directly from Sunmi device — InstaLabel app runs natively on Sunmi Android.
        </span>
      </div>
    </div>
  </section>
) 
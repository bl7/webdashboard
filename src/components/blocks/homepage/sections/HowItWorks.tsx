"use client"

import React from "react"
import { Upload, Printer, Smartphone, BadgeCheck, Layers, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export const HowItWorks = () => (
  <section className="relative bg-gradient-to-br from-white via-blue-50/30 to-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="container mx-auto max-w-6xl">
      {/* Section Header with Compliance Badge */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-12 flex flex-col items-center justify-center text-center"
      >
        <span className="mb-3 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200">
          <BadgeCheck className="mr-1 h-4 w-4 text-purple-600" />
          100% Natasha’s Law & EHO Compliant
        </span>
        <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            How InstaLabel Works
          </span>
          <br />
          <span className="text-gray-900">From Setup to Printing in Minutes</span>
        </h3>
      </motion.div>
      {/* Steps */}
      <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4">
        {[
          {
            icon: <Upload className="h-8 w-8 text-purple-600" />,
            bg: "bg-purple-100",
            title: "Upload or Enter Menu",
            desc: "Import your menu and ingredients, or enter them manually in minutes.",
          },
          {
            icon: <Printer className="h-8 w-8 text-purple-600" />,
            bg: "bg-purple-100",
            title: "Print Labels",
            desc: "Print from the dashboard or directly on mobile devices with our app.",
          },
          {
            icon: <Layers className="h-8 w-8 text-blue-600" />,
            bg: "bg-blue-100",
            title: "Select Label Type",
            desc: "Choose Prep, Cook, Use-First, PPDS, or custom labels — all ready to go.",
          },
          {
            icon: <Smartphone className="h-8 w-8 text-green-600" />,
            bg: "bg-green-100",
            title: "Print Instantly",
            desc: "Print from the dashboard or directly on mobile devices with our app.",
          },
        ].map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 * (i + 1) }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div
              className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${step.bg}`}
            >
              {step.icon}
            </div>
            <div className="mb-1 text-lg font-bold text-gray-900">{step.title}</div>
            <div className="text-sm text-gray-600">{step.desc}</div>
          </motion.div>
        ))}
      </div>
      {/* Mobile Device Note */}
      <div className="mt-4 rounded-lg bg-purple-50 p-4 text-center">
        <p className="text-sm text-purple-800">
          Print directly from mobile devices — InstaLabel app runs on Android.
        </p>
      </div>
    </div>
  </section>
)

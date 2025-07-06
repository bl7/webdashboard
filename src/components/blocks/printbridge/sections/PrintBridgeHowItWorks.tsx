"use client"

import React from "react"
import { motion } from "framer-motion"
import { Globe, Download, Wifi, Printer, CheckCircle } from "lucide-react"

export const PrintBridgeHowItWorks = () => {
  const steps = [
    {
      icon: <Download className="h-8 w-8" />,
      title: "Download PrintBridge",
      description: "Download our lightweight local bridge app to your computer or server. It's a small, secure application that runs in the background.",
      color: "purple"
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      title: "Connect to Printer",
      description: "PrintBridge automatically detects and connects to your thermal printers. No complex network configuration required - it just works.",
      color: "purple"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Use Web Dashboard",
      description: "Access your InstaLabel dashboard from any browser. Create labels, manage inventory, and track expiry dates with our intuitive interface.",
      color: "purple"
    },
    {
      icon: <Printer className="h-8 w-8" />,
      title: "Print Instantly",
      description: "When you click print, PrintBridge receives the command and sends it directly to your thermal printer. Labels print in seconds.",
      color: "purple"
    }
  ]

  return (
    <section className="relative bg-white px-2 sm:px-6 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            How PrintBridge Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A simple, secure bridge between your web dashboard and thermal printers
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-purple-200 z-0" style={{ width: 'calc(100% + 2rem)' }}></div>
              )}

              <div className="relative z-10 bg-white border border-gray-200 rounded-xl p-6 h-full hover:border-purple-200 hover:shadow-lg transition-all duration-200 text-center">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full font-bold text-lg mb-4">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4 text-purple-600">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Summary */}
        <div className="mt-10 sm:mt-16 text-center">
          <div className="inline-flex items-center gap-6 p-6 rounded-lg bg-purple-50 border border-purple-200">
            <div className="flex items-center gap-2 text-sm text-purple-700">
              <CheckCircle className="h-4 w-4" />
              <span>No cloud dependencies</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-700">
              <CheckCircle className="h-4 w-4" />
              <span>Works offline</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-700">
              <CheckCircle className="h-4 w-4" />
              <span>Automatic reconnection</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
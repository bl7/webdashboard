"use client"

import React from "react"
import { motion } from "framer-motion"
import { Globe, Download, Wifi, Printer, CheckCircle } from "lucide-react"
import { ZentraTechnologySection } from "../ZentraTechnologySection"
export const PrintBridgeHowItWorks = () => {
  const steps = [
    {
      icon: <Download className="h-8 w-8" />,
      title: "Download Zentra",
      description:
        "Download Zentra, our lightweight local bridge app, to your computer or server. It's a small, secure application that runs in the background and powers PrintBridge.",
      color: "purple",
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      title: "Connect to Printer",
      description:
        "Zentra automatically detects and connects to your thermal printers. No complex network configuration required—it just works.",
      color: "purple",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Use Web Dashboard",
      description:
        "Access your InstaLabel dashboard from any browser. Create labels, manage inventory, and track expiry dates with our intuitive interface.",
      color: "purple",
    },
    {
      icon: <Printer className="h-8 w-8" />,
      title: "Print Instantly",
      description:
        "When you click print, Zentra receives the command and sends it directly to your thermal printer. Labels print in seconds—this is the PrintBridge experience.",
      color: "purple",
    },
  ]

  return (
    <section className="relative bg-white bg-gradient-to-br from-purple-50 via-pink-50 to-white px-2 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Lead-in and Technical Credibility */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="mb-6 space-y-2 text-center">
            <div className="mb-1 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200">
              PrintBridge, powered by Zentra
            </div>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
              The Local Print Solution That Changes Everything
            </h2>
            <div className="mx-auto max-w-2xl text-base text-gray-600">
              Zentra connects your web dashboard to any USB printer. It bypasses browser
              limitations. WebSocket bridge, USB auto-discovery, silent printing.
            </div>
          </div>
        </motion.div>
        <ZentraTechnologySection />

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                  <div
                    className="absolute left-full top-12 z-0 hidden h-0.5 w-full bg-purple-200 lg:block"
                    style={{ width: "calc(100% + 2rem)" }}
                  ></div>
                )}

                <div className="relative z-10 h-full rounded-xl border border-gray-200 bg-white p-6 text-center transition-all duration-200 hover:border-purple-200 hover:shadow-lg">
                  {/* Step number */}
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 flex justify-center text-purple-600">{step.icon}</div>

                  {/* Content */}
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Summary */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="mt-10 text-center sm:mt-16">
            <div className="inline-flex items-center gap-6 rounded-lg border border-purple-200 bg-purple-50 p-6">
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
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import React from "react"
import { motion } from "framer-motion"
import { Shield, Zap, Wifi, Cpu, Download, Settings } from "lucide-react"

export const PrintBridgeFeatures = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Local & Secure",
      description: "All printing happens locally on your network with PrintBridge. No data sent to external servers, ensuring maximum security for your kitchen operations.",
      color: "purple"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Direct local connection via PrintBridge means instant printing. No delays from cloud processing or network latency.",
      color: "purple"
    },
    {
      icon: <Wifi className="h-6 w-6" />,
      title: "Auto-Discovery",
      description: "PrintBridge automatically finds and connects to your thermal printers. No manual IP configuration needed.",
      color: "purple"
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Low Resource Usage",
      description: "PrintBridge is a lightweight application that runs efficiently in the background without impacting your computer's performance.",
      color: "purple"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "One-Click Setup",
      description: "Download, install PrintBridge, and start printing in under 2 minutes. No technical expertise required.",
      color: "purple"
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Advanced Configuration",
      description: "Customize printer settings, label formats, and connection preferences in PrintBridge's intuitive interface.",
      color: "purple"
    }
  ]

  return (
    <section className="relative bg-gray-50 px-2 sm:px-6 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-10 sm:mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            PrintBridge Features
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Built for reliability, security, and ease of use in professional kitchen environments
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white border border-gray-200 rounded-lg p-6 h-full hover:border-purple-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
                    {feature.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Specs */}
        <div className="mt-10 sm:mt-16 max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Technical Specifications
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">2MB</div>
                <div className="text-sm text-gray-600">File Size</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">Windows</div>
                <div className="text-sm text-gray-600">macOS</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">USB</div>
                <div className="text-sm text-gray-600">Network</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
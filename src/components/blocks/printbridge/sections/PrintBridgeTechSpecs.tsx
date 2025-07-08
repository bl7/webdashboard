"use client"
import React from "react"
import { Cpu, Lock, RefreshCw, Network, Wifi } from "lucide-react"
import { motion } from "framer-motion"

const specs = [
  {
    icon: <Cpu className="h-7 w-7 text-purple-600" />,
    title: "Native Apps",
    desc: "Real Node.js (macOS) and .NET (Windows) applications—not browser extensions."
  },
  {
    icon: <Network className="h-7 w-7 text-blue-600" />,
    title: "Architecture",
    desc: "WebSocket communication, USB driver integration, auto-discovery protocols."
  },
  {
    icon: <Lock className="h-7 w-7 text-green-600" />,
    title: "Security",
    desc: "All local processing, zero external dependencies, enterprise-grade security."
  },
  {
    icon: <RefreshCw className="h-7 w-7 text-pink-600" />,
    title: "Reliability",
    desc: "Self-healing connections, automatic updates, 99.9% uptime."
  }
]

export const PrintBridgeTechSpecs = () => (
  <section className="relative w-full py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-white via-purple-50 to-pink-50">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 pb-10">
      {/* Visual: Original hero image/visual */}
      <motion.div
        className="flex-1 w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        {/* (Paste your original hero image/visual JSX here) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            {/* Web Dashboard Mockup */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-xs text-gray-500"> Dashboard</div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-purple-100 rounded"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>

            {/* Connection Line */}
            <div className="absolute left-1/2 top-full h-16 w-0.5 bg-purple-300 transform -translate-x-1/2 "></div>

            {/* PrintBridge App */}
            <div className="absolute left-1/2 top-full mt-16 transform -translate-x-1/2 ">
              <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-3 shadow-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
                  <Wifi className="h-4 w-4" />
                  PrintBridge
                </div>
                <div className="mt-1 text-xs text-purple-600">Connected</div>
              </div>
            </div>

            {/* Connection Line to Printer */}
            <div className="absolute left-1/2 top-full mt-32 h-16 w-0.5 bg-purple-300 transform -translate-x-1/2"></div>

            {/* Printer */}
            <div className="absolute left-1/2 top-full mt-48 transform -translate-x-1/2">
              <div className="rounded-lg border border-gray-300 bg-gray-100 p-3 shadow-lg">
                <div className="text-sm font-medium text-gray-700">Thermal Printer</div>
                <div className="text-xs text-gray-500">Ready to Print</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      {/* Text Content */}
      <motion.div
        className="flex-1 space-y-6 text-center md:text-left"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200 mb-1">
          Built by Developers, For Developers
        </div>
        <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-gray-900">
          Technical Specifications
        </h2>
        <div className="text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
          Native Node.js and .NET apps, WebSocket communication, USB driver integration, enterprise-grade security.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {specs.map((spec, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4 bg-white rounded-lg border border-gray-200 shadow p-4"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div>{spec.icon}</div>
              <div>
                <div className="font-bold text-gray-900 mb-1">{spec.title}</div>
                <div className="text-sm text-gray-600">{spec.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
) 
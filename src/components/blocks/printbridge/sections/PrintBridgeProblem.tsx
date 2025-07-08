"use client"
import React from "react"
import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export const PrintBridgeProblem = () => (
  <section className="relative w-full py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-white via-purple-50 to-pink-50">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
      {/* Visual: Browser Print Dialog (reuse hero left visual) */}
      <motion.div
        className="flex-1 w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="rounded-lg border border-gray-200 bg-gray-50 shadow-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-xs text-gray-500">Print</span>
          </div>
          <div className="space-y-1 mb-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            <div className="h-3 bg-gray-100 rounded w-2/3"></div>
          </div>
          <div className="text-xs text-gray-400 mb-2">Select Printer: <span className="text-gray-600">HP LaserJet (Offline)</span></div>
          <button className="mt-2 w-full rounded bg-purple-200 text-purple-700 py-1 text-xs font-semibold shadow">Print</button>
          <div className="text-[10px] text-red-400 mt-2">Wrong printer? Confused? Popup blocked?</div>
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
        <div className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200 mb-1">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Printing Pain Point
        </div>
        <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-gray-900">
          Every Web App Has the Same Printing Problem
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base max-w-md mx-auto md:mx-0">
          <li>Wrong printer selected</li>
          <li>Confused users, popup blockers</li>
          <li>Wasted time, support tickets</li>
        </ul>
        <div className="text-lg font-semibold text-gray-700 mt-4">
          <span className="text-purple-700 font-bold">Average print job:</span> 6 clicks, 15 seconds, 23% error rate
        </div>
        <div className="text-base text-gray-500 mt-2">
          Web browsers can't talk to USB printers. <span className="font-bold text-purple-700">Until now.</span>
        </div>
      </motion.div>
    </div>
  </section>
) 
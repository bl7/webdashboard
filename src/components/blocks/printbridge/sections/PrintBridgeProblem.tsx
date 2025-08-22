"use client"
import React from "react"
import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export const PrintBridgeProblem = () => (
  <section className="relative w-full bg-gradient-to-br from-white via-purple-50 to-pink-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row">
      {/* Visual: Browser Print Dialog (reuse hero left visual) */}
      <motion.div
        className="mx-auto w-full max-w-md flex-1"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-lg">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-xs text-gray-500">Print</span>
          </div>
          <div className="mb-2 space-y-1">
            <div className="h-3 w-3/4 rounded bg-gray-200"></div>
            <div className="h-3 w-1/2 rounded bg-gray-100"></div>
            <div className="h-3 w-2/3 rounded bg-gray-100"></div>
          </div>
          <div className="mb-2 text-xs text-gray-400">
            Select Printer: <span className="text-gray-600">HP LaserJet (Offline)</span>
          </div>
          <button className="mt-2 w-full rounded bg-purple-200 py-1 text-xs font-semibold text-purple-700 shadow">
            Print
          </button>
          <div className="mt-2 text-[10px] text-red-400">
            Wrong printer? Confused? Popup blocked?
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
          Printing Pain Point
        </div>
        <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
          Every Web App Has the Same Printing Problem
        </h3>
        <ul className="mx-auto max-w-md list-disc space-y-2 pl-6 text-base text-gray-700 md:mx-0">
          <li>Wrong printer selected</li>
          <li>Confused users, popup blockers</li>
          <li>Wasted time, support tickets</li>
        </ul>
        <div className="mt-4 text-lg font-semibold text-gray-700">
          <span className="font-bold text-purple-700">Average print job:</span> 6 clicks, 15
          seconds, 23% error rate
        </div>
        <div className="mt-2 text-base text-gray-500">
          Web browsers can't talk to USB printers.{" "}
          <span className="font-bold text-purple-700">Until now.</span>
        </div>
      </motion.div>
    </div>
  </section>
)

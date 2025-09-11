"use client"

import React from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Clock, FileText, Thermometer } from "lucide-react"

export const CookedLabelsWhyMatters = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-white via-purple-50 to-pink-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row">
        {/* Left: Problem Visual */}
        <div className="mx-auto w-full max-w-md flex-1">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-semibold text-gray-700">Handwritten Cook Logs</span>
            </div>
            <div className="space-y-3">
              <div className="rounded border border-gray-300 bg-white p-3">
                <div className="text-sm font-semibold text-gray-800">Chicken Curry</div>
                <div className="mt-1 text-xs text-gray-600">Cooked: ??? (illegible)</div>
                <div className="mt-2 text-xs text-red-600">⚠️ No temperature recorded</div>
              </div>
              <div className="rounded border border-gray-300 bg-white p-3">
                <div className="text-sm font-semibold text-gray-800">Beef Stew</div>
                <div className="mt-1 text-xs text-gray-600">Cooked: ??? (illegible)</div>
                <div className="mt-2 text-xs text-red-600">⚠️ No allergen info</div>
              </div>
              <div className="text-xs text-gray-500">
                <div>❌ Incomplete records</div>
                <div>❌ No temperature tracking</div>
                <div>❌ HACCP violations</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-1 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Why Cook Labels
            </div>
            <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
              Food Safety Regulations Require Hot Food to Be Tracked. Handwritten Logs Are Slow and
              Error-Prone.
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 text-red-600" />
                  <div>
                    <h4 className="font-semibold text-red-800">
                      Handwritten Logs Create HACCP Violations
                    </h4>
                    <p className="mt-1 text-sm text-red-700">
                      Incomplete temperature records, missing cook times, and illegible handwriting
                      lead to food safety violations and potential health risks.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span>Missing cook times</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Thermometer className="h-4 w-4 text-purple-600" />
                  <span>No temperature records</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span>Incomplete logs</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <AlertTriangle className="h-4 w-4 text-purple-600" />
                  <span>HACCP violations</span>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="text-sm font-semibold text-purple-800">
                <span className="font-bold text-purple-700">The Solution:</span> Automated cook
                labels with temperature tracking, cook times, and allergen information ensure HACCP
                compliance and food safety.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

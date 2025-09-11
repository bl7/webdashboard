"use client"
import React from "react"
import Image from "next/image"
import { AlertTriangle, Clock, XCircle, FileText } from "lucide-react"
import { motion } from "framer-motion"

export const PrepLabelsWhyMatters = () => (
  <section className="relative w-full bg-gradient-to-br from-white via-purple-50 to-pink-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row">
      {/* Visual: Problem illustration */}
      <motion.div
        className="mx-auto w-full max-w-md flex-1"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-semibold text-gray-700">Handwritten Labels</span>
          </div>

          {/* Real handwritten label image */}
          <div className="relative">
            <Image
              src="/hand-written-prep-label.png"
              alt="Handwritten prep label showing illegible handwriting and missing information"
              width={400}
              height={300}
              className="rounded-lg shadow-md"
              priority
            />
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <div>❌ Illegible handwriting</div>
            <div>❌ Missing allergen info</div>
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
          Why Prep Labels Matter
        </div>
        <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
          EHOs Expect Every Prepared Food to Have Product + Expiry. Handwritten Labels = Errors +
          Lost Time.
        </h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-red-600" />
              <div>
                <h4 className="font-semibold text-red-800">
                  Handwritten Labels Slow Down Kitchens
                </h4>
                <p className="mt-1 text-sm text-red-700">
                  Staff waste time writing labels by hand, leading to errors, illegible text, and
                  missing critical information like allergens and batch codes.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <XCircle className="h-4 w-4 text-purple-600" />
              <span>Illegible handwriting</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <FileText className="h-4 w-4 text-purple-600" />
              <span>Missing allergen info</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-purple-600" />
              <span>No batch tracking</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <AlertTriangle className="h-4 w-4 text-purple-600" />
              <span>EHO violations</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="text-sm font-semibold text-purple-800">
            <span className="font-bold text-purple-700">The Solution:</span> Automated prep labels
            with expiry dates, allergen information, and batch details keep your kitchen compliant
            and efficient.
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

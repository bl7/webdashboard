"use client"
import React from "react"
import Image from "next/image"
import beforeImage from "@/assets/images/before.png"
import afterImage from "@/assets/images/after.png"
import { motion } from "framer-motion"

export const KitchenLabelPrinterImageSection = () => {
  return (
    <section className="relative w-full bg-gray-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            See the Transformation
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            From handwritten labels with crossed-out dates to professional, compliant labels printed in seconds.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Before Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
              Before: Manual Process
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-red-200 shadow-lg">
              <Image
                src={beforeImage}
                alt="Before: Manual handwritten labels"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Handwritten labels with incomplete information and compliance risks
            </p>
          </motion.div>

          {/* After Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 ring-1 ring-green-200">
              After: InstaLabel Software
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-green-200 shadow-lg">
              <Image
                src={afterImage}
                alt="After: Professional printed labels"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Professional printed labels with complete compliance information
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-lg font-semibold text-gray-700">
            <span className="font-bold text-purple-700">Ready to transform your kitchen labeling?</span>
            Start your free trial and see the difference InstaLabel makes.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

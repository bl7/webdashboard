"use client"

import { CheckCircle } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export const FeaturesGrid = () => {
  const features = [
    "Plug & play label printing",
    "Local bridge makes printing through the web fast and reliable",
    "Sunmi gives you the portability to print anywhere",
    "Web dashboard for control & analytics",
  ]

  return (
    <section className="bg-white py-8 sm:py-24">
      <div className="container grid items-center gap-8 sm:gap-12 px-2 sm:px-4 md:grid-cols-2 md:px-12 lg:px-16">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Everything you need, nothing you don't
          </h2>
          <p className="max-w-xl text-xl text-gray-600 mb-6">
            InstaLabel is built for speed and simplicity. Print directly from the web or sunmi device, monitor
            usage, and choose the right hardware for your business.
          </p>

          <ul className="space-y-4 text-base text-gray-700">
            {features.map((feature, i) => (
              <motion.li 
                key={i} 
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="mt-1 h-5 w-5 text-green-600" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Image / Illustration */}
        <motion.div 
          className="relative aspect-video w-full rounded-xl bg-muted shadow-sm mt-6 md:mt-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Image
            src="/dashboard.png"
            alt="Feature overview"
            fill
            className="rounded-xl object-cover"
          />
        </motion.div>
      </div>
    </section>
  )
}

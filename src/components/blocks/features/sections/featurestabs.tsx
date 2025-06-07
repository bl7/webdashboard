"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const featuresDetails = [
  {
    title: "Web Dashboard",
    description:
      "Manage all your printing tasks effortlessly from our intuitive web dashboard. Track print jobs, view reports, and customize settings from anywhere.",
  },
  {
    title: "Unlimited Prints",
    description:
      "Print as much as you need with no extra charges. Perfect for businesses that require high volume label printing without limits.",
  },
  {
    title: "Device Compatibility",
    description:
      "Supports multiple devices including Epson TM-M30 and Sunmi printers to fit your business needs seamlessly.",
  },
  {
    title: "Print History Tracking",
    description:
      "Keep track of your printing activity with detailed history logs to monitor usage and manage costs effectively.",
  },
  {
    title: "24/7 Customer Support",
    description:
      "Our dedicated support team is available round the clock to help you with any questions or issues.",
  },
]

export const FeaturesTabs = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="container py-20">
      <h2 className="mb-8 text-center text-4xl font-semibold text-primary">
        What Makes InstaLabel Stand Out
      </h2>
      <div className="mx-auto max-w-5xl">
        {/* Tabs Buttons */}
        <div className="mb-6 flex justify-center space-x-6 border-b border-muted">
          {featuresDetails.map((feature, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative whitespace-nowrap border-b-2 pb-3 text-lg font-medium transition-colors",
                activeIndex === i
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-primary hover:text-primary"
              )}
            >
              {feature.title}
              {activeIndex === i && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border border-muted bg-white p-8 text-center text-lg text-foreground shadow-md"
          >
            {featuresDetails[activeIndex].description}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

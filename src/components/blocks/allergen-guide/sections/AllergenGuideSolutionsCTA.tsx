"use client"

import React from "react"
import { motion } from "framer-motion"

export const AllergenGuideSolutionsCTA = () => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Correct labelling isn't just about passing a quiz — it's the law. 
            With InstaLabel, you can print compliant allergen labels in seconds.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

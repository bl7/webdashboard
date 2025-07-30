"use client"

import { Button } from "@/components/ui"
import { ArrowRight, Download, Shield, CheckCircle2 } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export const AllergenGuideCTA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Get Your Complete Allergen Compliance Kit
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Download our free comprehensive toolkit with visual reference cards, checklists, and training templates for complete Natasha's Law compliance.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3 mb-12"
          >
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Visual Reference Cards</h3>
              </div>
              <p className="text-sm text-gray-600">
                Kitchen-ready posters with all 14 allergens clearly displayed for quick reference.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold text-gray-900">HACCP Checklists</h3>
              </div>
              <p className="text-sm text-gray-600">
                Complete checklists for cross-contamination prevention and EHO compliance.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <Download className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Training Templates</h3>
              </div>
              <p className="text-sm text-gray-600">
                Staff training materials and emergency response protocols for allergic reactions.
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button size="lg" className="bg-purple-600 text-white px-8 py-3 hover:bg-purple-700">
              <Link href="/allergen-compliance">
                Download Free Toolkit
              </Link>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600"
          >
            <span>✓ Used by 500+ UK kitchens</span>
            <span>✓ EHO approved information</span>
            <span>✓ 100% free download</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 
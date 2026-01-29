"use client"
import React from "react"
import {
  Shield,
  Zap,
  Users,
  FileText,
  CheckCircle,
  BarChart3,
  AlertTriangle,
  Clock,
  Smartphone,
} from "lucide-react"
import { motion } from "framer-motion"

export const AllergenComplianceFeatures = () => (
  <section className="relative w-full bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="mx-auto max-w-5xl">
      {/* Section Header */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Powerful Allergen Compliance Features
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          InstaLabel combines AI intelligence, automatic compliance, and thermal printer support to
          make allergen labeling effortless with structured templates.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">14 Allergens Auto-Detection</h3>
          <p className="text-gray-600">
            AI automatically identifies all 14 UK required allergens from your menu descriptions. No
            more manual checking or missing allergens.
          </p>
        </motion.div>

        <motion.div
          className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Zap className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">30-Second Allergen Labels</h3>
          <p className="text-gray-600">
            Generate fully compliant allergen labels in just a couple of clicks. From 2-3 minutes to
            instant printing - that's significant time savings.
          </p>
        </motion.div>

        <motion.div
          className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <CheckCircle className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">100% Natasha's Law Compliance</h3>
          <p className="text-gray-600">
            Every label automatically meets Natasha's Law requirements with full ingredient lists
            and allergen declarations. Zero compliance errors.
          </p>
        </motion.div>

        <motion.div
          className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">5-Minute Staff Training</h3>
          <p className="text-gray-600">
            Simple interface that any kitchen staff can use. Minimal training required with built-in
            guidance and error prevention.
          </p>
        </motion.div>

        <motion.div
          className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Complete Audit Trail</h3>
          <p className="text-gray-600">
            Every allergen label is automatically recorded with full traceability. Ready for food
            safety audits and EHO inspections.
          </p>
        </motion.div>

        <motion.div
          className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Smartphone className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Mobile & Web Access</h3>
          <p className="text-gray-600">
            Access InstaLabel from any device - desktop, tablet, or mobile. Generate allergen labels
            anywhere in your kitchen.
          </p>
        </motion.div>

        <motion.div
          className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Allergen Analytics</h3>
          <p className="text-gray-600">
            Track allergen usage, identify trends, and generate compliance reports. Perfect for food
            safety audits and staff training.
          </p>
        </motion.div>

        <motion.div
          className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <AlertTriangle className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Hidden Allergen Detection</h3>
          <p className="text-gray-600">
            AI identifies hidden allergen sources in ingredients and preparation methods. Prevents
            cross-contamination and ensures complete safety.
          </p>
        </motion.div>

        <motion.div
          className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Real-Time Updates</h3>
          <p className="text-gray-600">
            Instantly update allergen information when recipes change. All labels automatically
            reflect the latest ingredient and allergen data.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
)

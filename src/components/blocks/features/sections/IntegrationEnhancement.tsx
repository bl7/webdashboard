"use client"
import React from "react"
import { motion } from "framer-motion"
import { Link, CheckCircle, Shield, Zap } from "lucide-react"

export const IntegrationEnhancement = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          <h3 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Seamless Integrations & Enterprise Features
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
            InstaLabel works with your existing systems and scales with your business growth.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Link className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-gray-900">Square POS Integration</h4>
              <p className="text-sm text-gray-600">
                One-click connection with automatic menu import, AI-powered allergen detection, and
                real-time sync.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-gray-900">Enterprise Security</h4>
              <p className="text-sm text-gray-600">
                End-to-end encryption, GDPR compliance, role-based access controls, and
                comprehensive audit trails.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

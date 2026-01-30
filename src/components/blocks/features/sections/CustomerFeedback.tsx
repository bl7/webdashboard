"use client"
import React from "react"
import { motion } from "framer-motion"
import { CheckCircle, ArrowRight, Download, Globe, Zap, Shield } from "lucide-react"
import Link from "next/link"

export const CustomerFeedback = () => {
  const comparisonFeatures = [
    {
      title: "Full web dashboard access",
      freeTrial: true,
      fullFeatures: true,
    },
    {
      title: "Up to 100 label prints for testing",
      freeTrial: true,
      fullFeatures: false,
    },
    {
      title: "Unlimited label printing",
      freeTrial: false,
      fullFeatures: true,
    },
    {
      title: "Basic analytics and usage reporting",
      freeTrial: true,
      fullFeatures: true,
    },
    {
      title: "Advanced multi-location analytics",
      freeTrial: false,
      fullFeatures: true,
    },
    {
      title: "All standard label templates",
      freeTrial: true,
      fullFeatures: true,
    },
    {
      title: "Custom label templates and branding",
      freeTrial: false,
      fullFeatures: true,
    },
    {
      title: "Email support and setup assistance",
      freeTrial: true,
      fullFeatures: true,
    },
    {
      title: "Priority phone and chat support",
      freeTrial: false,
      fullFeatures: true,
    },
  ]

  const setupSupport = [
    {
      title: "Free 30-minute onboarding call",
      description: "To verify printer compatibility",
      icon: <Globe className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Guided PrintBridge installation",
      description: "Step-by-step assistance",
      icon: <Download className="h-5 w-5 text-green-600" />,
    },
    {
      title: "15-minute staff training session",
      description: "Via video call",
      icon: <Zap className="h-5 w-5 text-purple-600" />,
    },
    {
      title: "First-week check-in",
      description: "To ensure optimal usage",
      icon: <Shield className="h-5 w-5 text-orange-600" />,
    },
  ]

  return (
    <section className="relative bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">Ready to Get Started?</h3>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            Start your free trial today and discover how InstaLabel can transform your kitchen
            operations.
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-8">
            <h4 className="mb-4 text-lg font-semibold text-gray-900">
              Ready to Experience All Features?
            </h4>
            <p className="mb-6 text-gray-600">
              Start your free trial today and discover how InstaLabel can transform your kitchen
              operations.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/plan"
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-purple-700"
              >
                Start Free Trial - Test All Features
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/bookdemo"
                className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-white px-6 py-3 font-semibold text-purple-700 transition-colors duration-200 hover:bg-purple-50"
              >
                Book Feature Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6">
              <Link
                href="/printbridge"
                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
              >
                <Download className="h-4 w-4" />
                Download PrintBridge
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

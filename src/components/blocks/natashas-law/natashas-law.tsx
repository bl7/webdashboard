"use client"
import React from "react"
import { Button } from "@/components/ui"
import {
  ArrowRight,
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  Zap,
  Clock,
  Users,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export const NatashasLawPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-white px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
        {/* Background elements */}
        <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-5 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-5 blur-3xl" />

        <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl space-y-6 text-center md:text-left"
          >
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
              <Shield className="mr-2 h-4 w-4" />
              #1 Natasha's Law Compliance Software
            </div>

            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="text-purple-600">100% Natasha's Law</span>
              <br className="hidden md:block" />
              <span>Compliance Guaranteed</span>
            </h1>

            <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
              InstaLabel's AI automatically generates compliant labels with allergen information,
              ingredients, and expiry dates. Meet all PPDS requirements without manual work.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>100% PPDS Compliant</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Zap className="h-4 w-4 text-purple-600" />
                <span>AI-Powered Allergen Detection</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Works with Any Thermal Printer</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Button size="lg" className="bg-purple-600 px-6 py-3 text-white hover:bg-purple-700">
                <Link href="/register">Start Free Trial</Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/bookdemo">Book Demo</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-500 md:justify-start">
              <span>✓ 500+ UK restaurants trust InstaLabel</span>
              <span>✓ 95% reduction in labeling time</span>
              <span>✓ 14-day free trial, no credit card</span>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full max-w-[500px]"
          >
            <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="bg-purple-600 p-4 text-center text-white">
                <div className="text-lg font-bold">InstaLabel Natasha's Law</div>
                <div className="text-sm opacity-90">AI-Powered Compliance Software</div>
              </div>
              <div className="p-6">
                <div className="mb-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Compliance:</span>
                    <span className="font-bold text-green-600">100% ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Allergen Detection:</span>
                    <span className="font-semibold text-green-600">✓ AI Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">PPDS Format:</span>
                    <span className="text-gray-900">Automatic</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Printer Support:</span>
                    <span className="text-gray-900">Any Thermal</span>
                  </div>
                </div>
                <div className="mt-4 rounded bg-green-100 p-2 text-center">
                  <span className="text-xs font-semibold text-green-800">
                    ✓ Compliant Labels in 30 Seconds
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative w-full bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Natasha's Law Compliance Problems
            </div>
            <h2 className="mb-6 text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
              Manual Natasha's Law Compliance is Error-Prone & Risky
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Staff spend 2-3 minutes per label ensuring compliance. Manual errors lead to food
              safety violations, EHO fines, and customer health risks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
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
              InstaLabel Automates Natasha's Law Compliance
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              AI-powered software that automatically generates compliant labels with allergen
              information, ingredients, and expiry dates in under 30 seconds.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              className="rounded-lg bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">AI Allergen Detection</h3>
              <p className="text-gray-600">
                Automatically identifies all 14 UK required allergens from menu descriptions. No
                more manual ingredient analysis or missed allergens.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">PPDS Formatting</h3>
              <p className="text-gray-600">
                Every label automatically follows FSA PPDS requirements. Perfect formatting for
                Natasha's Law compliance without manual work.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">30-Second Compliance</h3>
              <p className="text-gray-600">
                Generate fully compliant Natasha's Law labels in under 30 seconds. From 2-3 minutes
                to a couple of clicks - that's significant time savings.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

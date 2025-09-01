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
  BarChart3,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export const HaccpLabelsPage = () => {
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
              #1 HACCP Compliance Software
            </div>

            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="text-purple-600">100% HACCP Compliance</span>
              <br className="hidden md:block" />
              <span>Guaranteed with AI</span>
            </h1>

            <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
              InstaLabel's AI automatically generates HACCP-compliant labels with full traceability,
              ensuring your food business passes every safety audit.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>HACCP Compliant</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Zap className="h-4 w-4 text-purple-600" />
                <span>AI-Powered Labels</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Full Traceability</span>
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
                <div className="text-lg font-bold">InstaLabel HACCP System</div>
                <div className="text-sm opacity-90">AI-Powered Food Safety Compliance</div>
              </div>
              <div className="p-6">
                <div className="mb-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">HACCP Status:</span>
                    <span className="font-bold text-green-600">100% ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Traceability:</span>
                    <span className="font-semibold text-green-600">✓ Complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Audit Ready:</span>
                    <span className="text-gray-900">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Printer Support:</span>
                    <span className="text-gray-900">Any Thermal</span>
                  </div>
                </div>
                <div className="mt-4 rounded bg-green-100 p-2 text-center">
                  <span className="text-xs font-semibold text-green-800">
                    ✓ HACCP Labels in Couple of Clicks
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
              HACCP Compliance Problems
            </div>
            <h2 className="mb-6 text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
              Manual HACCP Labeling is Error-Prone & Audit-Risky
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Staff spend 2-3 minutes per label ensuring HACCP compliance. Manual errors lead to
              failed audits, food safety violations, and potential business closure.
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
              InstaLabel Automates HACCP Compliance
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              AI-powered software that automatically generates HACCP-compliant labels with full
              traceability in just a couple of clicks.
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
              <h3 className="mb-3 text-xl font-bold text-gray-900">AI-Powered HACCP Labels</h3>
              <p className="text-gray-600">
                Automatically generates HACCP-compliant labels with all required information. No
                more manual compliance checking or formatting errors.
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
              <h3 className="mb-3 text-xl font-bold text-gray-900">Complete Traceability</h3>
              <p className="text-gray-600">
                Every HACCP label is automatically recorded with full traceability. Ready for food
                safety audits and EHO inspections.
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
              <h3 className="mb-3 text-xl font-bold text-gray-900">Quick Compliance</h3>
              <p className="text-gray-600">
                Generate fully HACCP-compliant labels in just a couple of clicks. From 2-3 minutes
                to instant printing - that's significant time savings.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative w-full bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Powerful HACCP Features
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              InstaLabel combines AI intelligence, automatic compliance, and thermal printer support
              to make HACCP labeling effortless and error-free.
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
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">HACCP Templates</h3>
              <p className="text-gray-600">
                Pre-built HACCP-compliant label templates that meet all UK food safety requirements
                and audit standards.
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
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Staff Training</h3>
              <p className="text-gray-600">
                Simple interface that any kitchen staff can use. Minimal training required with
                built-in guidance and error prevention.
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
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Audit Reports</h3>
              <p className="text-gray-600">
                Generate comprehensive HACCP compliance reports for food safety audits, EHO
                inspections, and certification renewals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

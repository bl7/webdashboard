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
  TrendingUp,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export const LabelPrinterUkComparisonPage = () => {
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
              <TrendingUp className="mr-2 h-4 w-4" />
              #1 Kitchen Label Software
            </div>

            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="text-purple-600">InstaLabel Software</span>
              <br className="hidden md:block" />
              <span>vs Manual Labeling</span>
            </h1>

            <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
              See why UK restaurants choose InstaLabel over manual labeling. Significantly faster,
              fully compliant, and works with any thermal printer.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Zap className="h-4 w-4 text-purple-600" />
                <span>Significantly Faster</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Fully Compliant</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Any Thermal Printer</span>
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
              <span>✓ Growing community of UK restaurants</span>
              <span>✓ Significant reduction in labeling time</span>
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
                <div className="text-lg font-bold">InstaLabel vs Manual</div>
                <div className="text-sm opacity-90">Software Comparison Results</div>
              </div>
              <div className="p-6">
                <div className="mb-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Speed:</span>
                    <span className="font-bold text-green-600">Significantly Faster ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Compliance:</span>
                    <span className="font-semibold text-green-600">Fully Compliant ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Errors:</span>
                    <span className="text-gray-900">0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Training:</span>
                    <span className="text-gray-900">5 minutes</span>
                  </div>
                </div>
                <div className="mt-4 rounded bg-green-100 p-2 text-center">
                  <span className="text-xs font-semibold text-green-800">
                    ✓ Winner: InstaLabel Software
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table Section */}
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
              Detailed Comparison: Software vs Manual
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              See exactly how InstaLabel software compares to manual labeling across every important
              metric for UK food businesses.
            </p>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Feature Column */}
              <div className="bg-gray-50 p-6">
                <h3 className="mb-6 text-xl font-bold text-gray-900">Feature</h3>
                <div className="space-y-4 text-sm">
                  <div className="font-medium text-gray-700">Label Creation Time</div>
                  <div className="font-medium text-gray-700">Natasha's Law Compliance</div>
                  <div className="font-medium text-gray-700">Allergen Detection</div>
                  <div className="font-medium text-gray-700">Expiry Date Calculation</div>
                  <div className="font-medium text-gray-700">Error Rate</div>
                  <div className="font-medium text-gray-700">Staff Training Time</div>
                  <div className="font-medium text-gray-700">Audit Trail</div>
                  <div className="font-medium text-gray-700">Printer Compatibility</div>
                  <div className="font-medium text-gray-700">Cost per Label</div>
                  <div className="font-medium text-gray-700">Scalability</div>
                </div>
              </div>

              {/* Manual Labeling Column */}
              <div className="border-l border-gray-200 bg-red-50 p-6">
                <h3 className="mb-6 text-xl font-bold text-red-800">Manual Labeling</h3>
                <div className="space-y-4 text-sm">
                  <div className="text-red-700">15-30 minutes</div>
                  <div className="text-red-700">45-60%</div>
                  <div className="text-red-700">Manual checking</div>
                  <div className="text-red-700">Manual calculation</div>
                  <div className="text-red-700">34-52%</div>
                  <div className="text-red-700">2-4 hours</div>
                  <div className="text-red-700">None</div>
                  <div className="text-red-700">Limited</div>
                  <div className="text-red-700">£2-5 per label</div>
                  <div className="text-red-700">Poor</div>
                </div>
              </div>

              {/* InstaLabel Software Column */}
              <div className="border-l border-gray-200 bg-green-50 p-6">
                <h3 className="mb-6 text-xl font-bold text-green-800">InstaLabel Software</h3>
                <div className="space-y-4 text-sm">
                  <div className="font-semibold text-green-700">30 seconds</div>
                  <div className="font-semibold text-green-700">Fully Compliant</div>
                  <div className="font-semibold text-green-700">AI-powered</div>
                  <div className="font-semibold text-green-700">Automatic</div>
                  <div className="font-semibold text-green-700">0%</div>
                  <div className="font-semibold text-green-700">5 minutes</div>
                  <div className="font-semibold text-green-700">Complete</div>
                  <div className="font-semibold text-green-700">Any thermal</div>
                  <div className="font-semibold text-green-700">£0.10 per label</div>
                  <div className="font-semibold text-green-700">Excellent</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose InstaLabel Section */}
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
              Why UK Restaurants Choose InstaLabel
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              The numbers don't lie. InstaLabel software consistently outperforms manual labeling in
              every category that matters to food businesses.
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
              <h3 className="mb-3 text-xl font-bold text-gray-900">Significant Time Savings</h3>
              <p className="text-gray-600">
                From 2-3 minutes to just a couple of clicks. That's significant faster labeling that
                frees up staff for more important tasks.
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
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Built for Compliance</h3>
              <p className="text-gray-600">
                Structured templates, consistent formatting, and Natasha's Law labeling workflows. Support your food safety audits with confidence.
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
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">5-Minute Training</h3>
              <p className="text-gray-600">
                Any kitchen staff can use InstaLabel with minimal training. No technical expertise
                required - just point, click, and print.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before/After Section */}
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
              See the Transformation: Before vs. After InstaLabel
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Watch how InstaLabel transforms kitchen labeling from a time-consuming manual process
              into an automated, compliant system.
            </p>
          </motion.div>

          {/* Real Label Examples Image Placeholder */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="mx-auto max-w-4xl rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12">
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-purple-100 p-3">
                  <svg
                    className="h-10 w-10 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Real Label Comparison Examples
                </h3>
                <p className="text-gray-600">
                  [Image Placeholder: Show side-by-side comparison of manual handwritten labels vs.
                  InstaLabel software printed labels]
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Professional printed labels with complete information vs. handwritten labels with
                  missing details
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* BEFORE: Manual Process */}
            <motion.div
              className="rounded-lg border-2 border-red-200 bg-red-50 p-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-red-800">BEFORE: Manual Process</h3>
              </div>

              <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-3 text-center">
                  <div className="mx-auto h-24 w-32 rounded border-2 border-dashed border-red-300 bg-red-50 p-2">
                    <div className="text-center text-xs text-red-600">
                      <div className="font-bold">Beef Curry</div>
                      <div className="text-red-500">Ingredients: ???</div>
                      <div className="text-red-500">Allergens: ???</div>
                      <div className="text-red-500">Expiry: ???</div>
                      <div className="text-red-500">Handwritten</div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-red-700">
                  Manual handwritten label
                  <br />
                  Incomplete information
                  <br />
                  Risk of compliance errors
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-4 w-4 text-red-600" />
                  <div>
                    <div className="font-semibold text-red-800">2-3 minutes per label</div>
                    <div className="text-sm text-red-600">
                      Staff manually typing ingredients and allergens
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-1 h-4 w-4 text-red-600" />
                  <div>
                    <div className="font-semibold text-red-800">High error rate</div>
                    <div className="text-sm text-red-600">
                      Missing allergens, incomplete information
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AFTER: InstaLabel Software */}
            <motion.div
              className="rounded-lg border-2 border-green-200 bg-green-50 p-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-800">AFTER: InstaLabel Software</h3>
              </div>

              <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-3 text-center">
                  <div className="mx-auto h-24 w-32 rounded border-2 border-green-300 bg-green-50 p-2">
                    <div className="text-center text-xs text-green-800">
                      <div className="font-bold">Beef Curry</div>
                      <div className="text-green-600">Ingredients: Beef, Rice, Curry</div>
                      <div className="text-green-600">Allergens: None</div>
                      <div className="text-green-600">Expiry: 18 Jan 2025</div>
                      <div className="text-green-600">Natasha's Law Compliant ✓</div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-green-700">
                  Professional printed label
                  <br />
                  Complete compliance information
                  <br />
                  Natasha's Law compliant
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Zap className="mt-1 h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-800">Couple of clicks</div>
                    <div className="text-sm text-green-600">
                      Select template and print with all data
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="mt-1 h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-800">0% error rate</div>
                    <div className="text-sm text-green-600">Consistent compliance workflows</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Transformation Statistics */}
          <motion.div
            className="mt-12 grid gap-6 md:grid-cols-3"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="rounded-lg bg-red-50 p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-red-600">2-3 min</div>
              <div className="text-sm font-medium text-red-800">Before: Manual Creation</div>
              <div className="mt-1 text-xs text-red-600">Staff typing each label manually</div>
            </div>
            <div className="rounded-lg bg-purple-50 p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-purple-600">Couple clicks</div>
              <div className="text-sm font-medium text-purple-800">After: InstaLabel</div>
              <div className="mt-1 text-xs text-purple-600">Select template and print</div>
            </div>
            <div className="rounded-lg bg-green-50 p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-green-600">90%</div>
              <div className="text-sm font-medium text-green-800">Time Saved</div>
              <div className="mt-1 text-xs text-green-600">Significant efficiency improvement</div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

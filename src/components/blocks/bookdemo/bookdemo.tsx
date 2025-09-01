"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui"
import { ArrowRight, Calendar, Smartphone, BarChart3, Video, Clock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export const BookDemo = () => {
  const [status, setStatus] = useState<null | "success" | "error">(null)
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus(null)
    setMessage("")
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const firstName = formData.get("firstName")?.toString().trim() || ""
    const lastName = formData.get("lastName")?.toString().trim() || ""
    const email = formData.get("email")?.toString().trim() || ""
    const phone = formData.get("phone")?.toString().trim() || ""
    const company = formData.get("business")?.toString().trim() || ""
    const role = formData.get("kitchenSize")?.toString().trim() || ""
    const messageField = formData.get("message")?.toString().trim() || ""

    if (!firstName || !lastName || !email || !company || !role) {
      setStatus("error")
      setMessage("Please fill in all required fields.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/bookdemo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          company,
          role,
          message: messageField,
          source: "web",
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to submit demo request.")
      }
      setStatus("success")
      setMessage("Thank you! Your demo request has been received. We will contact you soon.")
      form.reset()
    } catch (err: any) {
      setStatus("error")
      setMessage(err.message || "Failed to submit demo request.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        {/* Background blobs */}
        <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-15 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-15 blur-3xl" />
        <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-15 blur-3xl" />

        <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl space-y-6 text-center md:text-left"
          >
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
              <Calendar className="mr-2 h-4 w-4" />
              See InstaLabel in Action
            </div>

            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="text-purple-600">Book Your</span>
              <br className="hidden md:block" />
              <span className="">Free Demo.</span>
            </h1>

            <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
              Experience InstaLabel's powerful kitchen labeling solution in action. See live
              demonstrations showing web dashboard printing, mobile device compatibility, real-time
              analytics, and compliance features that keep your kitchen inspection-ready.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Video className="h-4 w-4 text-purple-600" />
                <span>Live Demo</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Smartphone className="h-4 w-4 text-purple-600" />
                <span>Mobile Devices</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span>Analytics Demo</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Button size="lg" className="bg-purple-600 px-8 py-3 text-white hover:bg-purple-700">
                <Link href="#demo-form">Book Demo Now</Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-500 md:justify-start">
              <span>✓ Free 14-day trial</span>
              <span>✓ No credit card required</span>
              <span>✓ Mobile Devices</span>
            </div>
          </motion.div>

          {/* Visual Representation - Demo Setup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full max-w-[500px]"
          >
            <div className="relative">
              {/* Demo Elements */}
              <div className="space-y-4">
                {/* Video Call */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <Video className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Live Demo</h4>
                      <p className="text-sm text-gray-600">Screen sharing session</p>
                    </div>
                  </div>
                  <div className="flex h-24 items-center justify-center rounded bg-gray-100">
                    <span className="text-xs text-gray-500">Your kitchen setup</span>
                  </div>
                </div>

                {/* Demo Features */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm">
                    <Clock className="mx-auto mb-1 h-6 w-6 text-purple-600" />
                    <p className="text-xs font-medium text-gray-700">30 min session</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm">
                    <Smartphone className="mx-auto mb-1 h-6 w-6 text-purple-600" />
                    <p className="text-xs font-medium text-gray-700">Device setup</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm">
                    <BarChart3 className="mx-auto mb-1 h-6 w-6 text-purple-600" />
                    <p className="text-xs font-medium text-gray-700">Analytics walkthrough</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm">
                    <Calendar className="mx-auto mb-1 h-6 w-6 text-purple-600" />
                    <p className="text-xs font-medium text-gray-700">Q&A included</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Bottom fade overlay */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)" }}
        />
      </section>

      {/* Demo Overview Section */}
      <section className="relative overflow-hidden bg-white py-20">
        {/* Background Elements */}
        <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-5 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-pink-300 opacity-5 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-6xl"
          >
            <div className="mb-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6 inline-flex items-center rounded-full bg-purple-100 px-6 py-3 text-sm font-medium text-purple-800 ring-1 ring-purple-200"
              >
                <Video className="mr-2 h-4 w-4" />
                Interactive Demo Experience
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              >
                What You'll See in Your 30-Minute Demo
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mx-auto max-w-3xl text-xl text-gray-600 lg:text-2xl"
              >
                Get hands-on experience with every aspect of InstaLabel's kitchen labeling system
              </motion.p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Live Kitchen Simulation */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-8 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Live Kitchen Simulation
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Watch our team demonstrate real kitchen scenarios using InstaLabel:
                  </p>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-purple-700">
                        Morning prep labeling workflow from ingredient arrival to storage
                      </span>
                    </li>
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-purple-700">
                        Lunch rush label printing with time-sensitive items
                      </span>
                    </li>
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-purple-700">
                        End-of-day stock rotation and expiry management
                      </span>
                    </li>
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-purple-700">
                        Emergency allergen response and re-labeling procedures
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Technology Walkthrough */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Technology Walkthrough
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Get hands-on experience with all InstaLabel components:
                  </p>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-blue-700">
                        <strong>Web Dashboard:</strong> Create custom labels, manage inventory,
                        track usage analytics
                      </span>
                    </li>
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-blue-700">
                        <strong>PrintBridge Setup:</strong> See how our local bridge connects web
                        dashboard to thermal printers
                      </span>
                    </li>
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-blue-700">
                        <strong>Mobile Integration:</strong> Experience mobile device printing and
                        Android app functionality
                      </span>
                    </li>
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-blue-700">
                        <strong>Square POS Integration:</strong> Watch real-time menu sync and
                        allergen detection
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Compliance Deep-Dive */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-8 shadow-lg transition-all duration-300 hover:border-green-300 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Compliance Deep-Dive
                  </h3>
                  <p className="mb-6 text-gray-600">
                    See exactly how InstaLabel keeps you inspection-ready:
                  </p>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-green-700">
                        Natasha's Law label generation with automatic allergen highlighting
                      </span>
                    </li>
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-green-700">
                        EHO-compliant prep labels with traceability information
                      </span>
                    </li>
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-green-700">
                        HACCP documentation and audit trail demonstration
                      </span>
                    </li>
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-green-700">
                        Cross-contamination prevention labeling workflows
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Preparation Guide */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50 py-20">
        {/* Background Elements */}
        <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-5 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-pink-300 opacity-5 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-6xl"
          >
            <div className="mb-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6 inline-flex items-center rounded-full bg-purple-100 px-6 py-3 text-sm font-medium text-purple-800 ring-1 ring-purple-200"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Demo Preparation
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              >
                Prepare for Your Demo
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mx-auto max-w-3xl text-xl text-gray-600 lg:text-2xl"
              >
                Maximize your demo value with these preparation tips
              </motion.p>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Information to Have Ready */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="group"
              >
                <div className="mb-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Information to Have Ready
                  </h3>
                </div>
                <div className="space-y-8">
                  <div className="group/item">
                    <h4 className="mb-4 text-xl font-semibold text-gray-800 transition-colors duration-300 group-hover/item:text-purple-700">
                      Current Setup Details
                    </h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="group/bullet flex items-center">
                        <span className="mr-3 h-2 w-2 rounded-full bg-purple-600 transition-all duration-300 group-hover/bullet:scale-150"></span>
                        <span className="transition-colors duration-300 group-hover/bullet:text-purple-700">
                          Number of kitchen locations
                        </span>
                      </li>
                      <li className="group/bullet flex items-center">
                        <span className="mr-3 h-2 w-2 rounded-full bg-purple-600 transition-all duration-300 group-hover/bullet:scale-150"></span>
                        <span className="transition-colors duration-300 group-hover/bullet:text-purple-700">
                          Existing printer models (Epson, Brother, etc.)
                        </span>
                      </li>
                      <li className="group/bullet flex items-center">
                        <span className="mr-3 h-2 w-2 rounded-full bg-purple-600 transition-all duration-300 group-hover/bullet:scale-150"></span>
                        <span className="transition-colors duration-300 group-hover/bullet:text-purple-700">
                          Current labeling methods (handwritten, pre-printed, etc.)
                        </span>
                      </li>
                      <li className="group/bullet flex items-center">
                        <span className="mr-3 h-2 w-2 rounded-full bg-purple-600 transition-all duration-300 group-hover/bullet:scale-150"></span>
                        <span className="transition-colors duration-300 group-hover/bullet:text-purple-700">
                          Staff size and shift patterns
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="group/item">
                    <h4 className="mb-4 text-xl font-semibold text-gray-800 transition-colors duration-300 group-hover/item:text-purple-700">
                      Menu Information
                    </h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="group/bullet flex items-center">
                        <span className="mr-3 h-2 w-2 rounded-full bg-purple-600 transition-all duration-300 group-hover/bullet:scale-150"></span>
                        <span className="transition-colors duration-300 group-hover/bullet:text-purple-700">
                          Approximate number of menu items
                        </span>
                      </li>
                      <li className="group/bullet flex items-center">
                        <span className="mr-3 h-2 w-2 rounded-full bg-purple-600 transition-all duration-300 group-hover/bullet:scale-150"></span>
                        <span className="transition-colors duration-300 group-hover/bullet:text-purple-700">
                          Common allergens in your dishes
                        </span>
                      </li>
                      <li className="group/bullet flex items-center">
                        <span className="mr-3 h-2 w-2 rounded-full bg-purple-600 transition-all duration-300 group-hover/bullet:scale-150"></span>
                        <span className="transition-colors duration-300 group-hover/bullet:text-purple-700">
                          Prep-ahead items and storage times
                        </span>
                      </li>
                      <li className="group/bullet flex items-center">
                        <span className="mr-3 h-2 w-2 rounded-full bg-purple-600 transition-all duration-300 group-hover/bullet:scale-150"></span>
                        <span className="transition-colors duration-300 group-hover/bullet:text-purple-700">
                          Special dietary offerings (vegan, gluten-free, etc.)
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="group/item">
                    <h4 className="mb-4 text-xl font-semibold text-gray-800 transition-colors duration-300 group-hover/item:text-purple-700">
                      Pain Points to Discuss
                    </h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="group/bullet flex items-center">
                        <span className="mr-3 h-2 w-2 rounded-full bg-purple-600 transition-all duration-300 group-hover/bullet:scale-150"></span>
                        <span className="transition-colors duration-300 group-hover/bullet:text-purple-700">
                          Biggest labeling challenges
                        </span>
                      </li>
                      <li className="group/bullet flex items-center">
                        <span className="mr-3 h-2 w-2 rounded-full bg-purple-600 transition-all duration-300 group-hover/bullet:scale-150"></span>
                        <span className="transition-colors duration-300 group-hover/bullet:text-purple-700">
                          Compliance concerns
                        </span>
                      </li>
                      <li className="group/bullet flex items-center">
                        <span className="mr-3 h-2 w-2 rounded-full bg-purple-600 transition-all duration-300 group-hover/bullet:scale-150"></span>
                        <span className="transition-colors duration-300 group-hover/bullet:text-purple-700">
                          Time-consuming manual processes
                        </span>
                      </li>
                      <li className="group/bullet flex items-center">
                        <span className="mr-3 h-2 w-2 rounded-full bg-purple-600 transition-all duration-300 group-hover/bullet:scale-150"></span>
                        <span className="transition-colors duration-300 group-hover/bullet:text-purple-700">
                          Staff training difficulties
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Questions We'll Answer */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-8"
              >
                <h3 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Questions We'll Answer
                </h3>
                <div className="space-y-6">
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="mb-4 text-xl font-semibold text-gray-800">
                        Setup & Implementation
                      </h4>
                      <ul className="space-y-4 text-gray-700">
                        <li className="group/item flex items-start">
                          <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                          <div>
                            <strong className="text-purple-700">Setup time:</strong> Exact setup
                            time for your kitchen configuration
                          </div>
                        </li>
                        <li className="group/item flex items-start">
                          <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                          <div>
                            <strong className="text-purple-700">Training requirements:</strong>{" "}
                            Training needs for your team size
                          </div>
                        </li>
                        <li className="group/item flex items-start">
                          <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                          <div>
                            <strong className="text-purple-700">Integration possibilities:</strong>{" "}
                            With your current systems
                          </div>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="mb-4 text-xl font-semibold text-gray-800">Pricing & ROI</h4>
                      <ul className="space-y-4 text-gray-700">
                        <li className="group/item flex items-start">
                          <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                          <div>
                            <strong className="text-purple-700">Pricing options:</strong> For your
                            business size
                          </div>
                        </li>
                        <li className="group/item flex items-start">
                          <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                          <div>
                            <strong className="text-purple-700">Implementation timeline:</strong>{" "}
                            And support process
                          </div>
                        </li>
                        <li className="group/item flex items-start">
                          <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                          <div>
                            <strong className="text-purple-700">ROI expectations:</strong> Based on
                            your current setup
                          </div>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Demo Experience */}
      <section className="relative overflow-hidden bg-white py-20">
        {/* Background Elements */}
        <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-5 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-pink-300 opacity-5 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-6xl"
          >
            <div className="mb-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6 inline-flex items-center rounded-full bg-purple-100 px-6 py-3 text-sm font-medium text-purple-800 ring-1 ring-purple-200"
              >
                <Video className="mr-2 h-4 w-4" />
                Live Demo Experience
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              >
                Your 30-Minute Live Demo
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mx-auto max-w-3xl text-xl text-gray-600 lg:text-2xl"
              >
                Interactive session designed to answer all your questions
              </motion.p>
            </div>

            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <h3 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  What's Included
                </h3>
                <div className="space-y-6">
                  <motion.div
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 transition-all duration-300"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">
                      <strong className="text-purple-700">Format:</strong> Live screen sharing
                      session via Zoom/Teams
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 transition-all duration-300"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">
                      <strong className="text-purple-700">Duration:</strong> 30 minutes with time
                      for questions
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 transition-all duration-300"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">
                      <strong className="text-purple-700">Led by:</strong> InstaLabel product
                      specialist
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 transition-all duration-300"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                      <Smartphone className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">
                      <strong className="text-purple-700">Interactive:</strong> Ask questions and
                      see custom examples
                    </span>
                  </motion.div>
                </div>

                <h4 className="mb-6 mt-12 text-2xl font-semibold text-gray-800">Demo Agenda</h4>
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ x: 8, scale: 1.02 }}
                    className="group flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4 shadow-sm transition-all duration-300 hover:shadow-lg"
                  >
                    <span className="text-gray-700 transition-colors duration-300 group-hover:text-purple-700">
                      Quick overview of your current labeling challenges
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-purple-600 shadow-sm">
                      5 min
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 8, scale: 1.02 }}
                    className="group flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4 shadow-sm transition-all duration-300 hover:shadow-lg"
                  >
                    <span className="text-gray-700 transition-colors duration-300 group-hover:text-purple-700">
                      Live walkthrough of InstaLabel dashboard and printing
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-purple-600 shadow-sm">
                      15 min
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 8, scale: 1.02 }}
                    className="group flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4 shadow-sm transition-all duration-300 hover:shadow-lg"
                  >
                    <span className="text-gray-700 transition-colors duration-300 group-hover:text-purple-700">
                      Device setup demonstration (web and mobile)
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-purple-600 shadow-sm">
                      5 min
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 8, scale: 1.02 }}
                    className="group flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4 shadow-sm transition-all duration-300 hover:shadow-lg"
                  >
                    <span className="text-gray-700 transition-colors duration-300 group-hover:text-purple-700">
                      Q&A and next steps discussion
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-purple-600 shadow-sm">
                      5 min
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-8 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="mb-6 text-2xl font-bold text-gray-900">Technical Requirements</h4>
                  <ul className="space-y-4 text-gray-700">
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-purple-700">
                        Stable internet connection
                      </span>
                    </li>
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-purple-700">
                        Computer or tablet with camera/microphone
                      </span>
                    </li>
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-purple-700">
                        Zoom or Teams capability (we'll send the link)
                      </span>
                    </li>
                    <li className="group/item flex items-start">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600 transition-all duration-300 group-hover/item:scale-150"></span>
                      <span className="transition-colors duration-300 group-hover/item:text-purple-700">
                        Optional: Have your current printer model handy for compatibility check
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Frequently Asked Demo Questions
              </h3>
              <p className="text-xl text-gray-600">
                Get answers to the most common questions before your demo
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Setup & Implementation */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Setup & Implementation
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-800">
                      Q: How long does initial setup take?
                    </h4>
                    <p className="text-sm text-gray-700">
                      A: Most kitchens are printing labels within 15 minutes. Complete menu import
                      and staff training typically takes 2-3 hours total.
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-800">
                      Q: Do you support our existing printers?
                    </h4>
                    <p className="text-sm text-gray-700">
                      A: InstaLabel works with any USB thermal printer. We'll verify compatibility
                      for your specific models during the demo.
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-800">
                      Q: What if our internet goes down?
                    </h4>
                    <p className="text-sm text-gray-700">
                      A: PrintBridge operates locally, so you can continue printing even with
                      limited internet connectivity.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance & Training */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Compliance & Training
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-800">
                      Q: How does InstaLabel ensure Natasha's Law compliance?
                    </h4>
                    <p className="text-sm text-gray-700">
                      A: Our system automatically formats labels according to FSA requirements,
                      includes all 14 allergens, and provides audit trails for EHO inspections.
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-800">
                      Q: How much training do staff need?
                    </h4>
                    <p className="text-sm text-gray-700">
                      A: Most team members become proficient within 60 seconds. We'll demonstrate
                      the simple tap-and-print workflow during your demo.
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-800">
                      Q: What's included in the pricing?
                    </h4>
                    <p className="text-sm text-gray-700">
                      A: We'll provide transparent pricing for your specific setup, including
                      devices, software, support, and ongoing updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Success Preview */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                See InstaLabel in Action
              </h3>
              <p className="text-xl text-gray-600">Real results from real kitchens across the UK</p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Before InstaLabel
                  </h3>
                  <p className="mb-4 text-gray-700">
                    <strong>Manchester Restaurant Group</strong> was spending 3+ hours daily on
                    manual labeling:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Handwritten labels often illegible</li>
                    <li>• Frequent allergen information errors</li>
                    <li>• Time-consuming prep date calculations</li>
                    <li>• Inconsistent labeling across locations</li>
                    <li>• EHO compliance concerns</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    After Implementation
                  </h3>
                  <p className="mb-4 text-gray-700">
                    <strong>Results within 30 days:</strong>
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• 75% reduction in labeling time</li>
                    <li>• Zero allergen labeling errors</li>
                    <li>• Consistent branding across all locations</li>
                    <li>• Perfect EHO inspection scores</li>
                    <li>• Staff productivity increase of 40%</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 rounded-lg border border-purple-200 bg-white p-4">
                <p className="text-center italic text-gray-700">
                  "The demo showed us exactly how InstaLabel would fit our workflow. Implementation
                  was seamless, and the time savings were immediate."
                </p>
                <p className="mt-2 text-center font-semibold text-purple-600">
                  — Operations Manager, Manchester Restaurant Group
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="relative bg-gray-50 px-2 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 space-y-4 text-center sm:mb-16">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Not Ready for a Demo Yet?
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600"
            >
              While you're deciding, grab these free resources
            </motion.p>
          </div>

          <div className="mx-auto mb-10 grid max-w-4xl grid-cols-1 gap-6 sm:mb-16 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-purple-200 hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors duration-200 group-hover:bg-purple-100">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      Free Allergen Compliance Kit
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600">
                      Complete Natasha's Law checklist and visual guides
                    </p>
                    <Link href="/allergen-compliance">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        Download Kit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-purple-200 hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors duration-200 group-hover:bg-purple-100">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Compliance Blog</h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600">
                      Latest updates on food safety regulations
                    </p>
                    <Link href="/blog">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        Read Blog
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="mb-6 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Questions Before Booking?
              </h3>
              <p className="mb-6 text-center text-gray-600">
                Check out these resources while you decide:
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/features"
                  className="font-medium text-purple-600 transition-colors duration-200 hover:text-purple-700"
                >
                  System features
                </Link>
                <Link
                  href="/printbridge"
                  className="font-medium text-purple-600 transition-colors duration-200 hover:text-purple-700"
                >
                  PrintBridge technology
                </Link>
                <Link
                  href="/allergen-guide"
                  className="font-medium text-purple-600 transition-colors duration-200 hover:text-purple-700"
                >
                  Allergen guide
                </Link>
                <Link
                  href="/allergen-compliance"
                  className="font-medium text-purple-600 transition-colors duration-200 hover:text-purple-700"
                >
                  Compliance info
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Form Section */}
      <section id="demo-form" className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Ready to See InstaLabel in Action?
              </h2>
              <p className="text-gray-600">
                Fill out the form below and we'll schedule your personalized demo.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="business" className="mb-2 block text-sm font-medium text-gray-700">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="business"
                  name="business"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="kitchenSize"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Kitchen Size *
                </label>
                <select
                  id="kitchenSize"
                  name="kitchenSize"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select kitchen size</option>
                  <option value="small">Small (1-10 staff)</option>
                  <option value="medium">Medium (11-25 staff)</option>
                  <option value="large">Large (26+ staff)</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your current labeling setup and any specific needs..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-purple-600 px-8 py-3 text-white hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <span>Book My Demo</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              {status && (
                <div
                  className={`mt-6 rounded-lg p-4 text-base font-medium ${status === "success" ? "border border-green-200 bg-green-50 text-green-800" : "border border-red-200 bg-red-50 text-red-800"}`}
                >
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

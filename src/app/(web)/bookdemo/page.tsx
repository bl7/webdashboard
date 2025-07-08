"use client"

import React, { useState } from "react"
import { Calendar, ArrowRight, Smartphone, BarChart3, Video, Clock } from "lucide-react"
import { Button } from "@/components/ui"
import Link from "next/link"
import { motion } from "framer-motion"

export default function BookDemoPage() {
  const [status, setStatus] = useState<null | 'success' | 'error'>(null)
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
      setStatus('error')
      setMessage('Please fill in all required fields.')
      setLoading(false)
      return
    }
    try {
      const res = await fetch('/api/bookdemo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          company,
          role,
          message: messageField,
          source: 'web',
        })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to submit demo request.')
      }
      setStatus('success')
      setMessage('Thank you! Your demo request has been received. We will contact you soon.')
      form.reset()
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Failed to submit demo request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 py-16">
        {/* Background blobs (standardized) */}
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
              See how InstaLabel can transform your kitchen operations. Get a personalized demo 
              showing web dashboard printing, Sunmi device compatibility, real-time analytics, 
              and our local bridge app in action.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Video className="h-4 w-4 text-purple-600" />
                <span>Live Demo</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Smartphone className="h-4 w-4 text-purple-600" />
                <span>Sunmi Devices</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span>Analytics Demo</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Button size="lg" className="bg-purple-600 px-8 py-3 text-white hover:bg-purple-700">
                <Link href="#demo-form">
                  Book Demo Now
                </Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-500 md:justify-start">
              <span>✓ 30-minute demo</span>
              <span>✓ No sales pressure</span>
              <span>✓ Free consultation</span>
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
                <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Video className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Live Demo</h4>
                      <p className="text-sm text-gray-600">Screen sharing session</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded h-24 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Your kitchen setup</span>
                  </div>
                </div>

                {/* Demo Features */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-200">
                    <Clock className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-700">30 min session</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-200">
                    <Smartphone className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-700">Device setup</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-200">
                    <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-700">Analytics walkthrough</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-200">
                    <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-700">Q&A included</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Bottom fade overlay */}
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 z-0" style={{background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)'}} />
      </section>

      {/* Demo Form Section */}
      <section id="demo-form" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to See InstaLabel in Action?</h2>
              <p className="text-gray-600">Fill out the form below and we'll schedule your personalized demo.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="business"
                  name="business"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="kitchenSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Kitchen Size *
                </label>
                <select
                  id="kitchenSize"
                  name="kitchenSize"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select kitchen size</option>
                  <option value="small">Small (1-10 staff)</option>
                  <option value="medium">Medium (11-25 staff)</option>
                  <option value="large">Large (26+ staff)</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your current labeling setup and any specific needs..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ></textarea>
              </div>

              <div className="text-center">
                <Button type="submit" size="lg" className="bg-purple-600 px-8 py-3 text-white hover:bg-purple-700" disabled={loading}>
                  {loading ? 'Submitting...' : (<><span>Book My Demo</span><ArrowRight className="ml-2 h-4 w-4" /></>)}
                </Button>
              </div>
              {status && (
                <div className={`mt-6 rounded-lg p-4 text-base font-medium ${status === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{message}</div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
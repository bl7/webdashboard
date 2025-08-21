"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui"
import { Truck, Package, CreditCard, Shield, Zap, Clock, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

export const LabelOrdering = () => {
  return (
    <section className="relative bg-gray-50 px-2 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 space-y-4 text-center sm:mb-16">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Never Run Out of Labels Again
          </h3>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
            Order labels directly from your dashboard with bulk pricing, fast delivery, and seamless
            billing. Focus on your kitchen, we'll handle the supplies.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-2">
          {/* Left: Ordering Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="grid gap-4">
              <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-purple-200 hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors duration-200 group-hover:bg-purple-100">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">
                      Bulk Ordering Savings
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Save up to 40% with bulk quantities. Order 500+ labels and get premium pricing
                      with volume discounts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-purple-200 hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors duration-200 group-hover:bg-purple-100">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Next-Day Delivery</h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Free next-day delivery to your kitchen. Track your order in real-time through
                      your dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-purple-200 hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors duration-200 group-hover:bg-purple-100">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Seamless Billing</h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Labels are automatically added to your monthly subscription bill. No separate
                      payments or invoices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-purple-200 hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors duration-200 group-hover:bg-purple-100">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Quality Guaranteed</h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      All labels are tested for durability and compliance. 100% satisfaction
                      guarantee with free replacements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Ordering Process & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Ordering Process */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">How to Order</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                    1
                  </div>
                  <span className="text-gray-700">
                    Go to your dashboard's "Order Labels" section
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                    2
                  </div>
                  <span className="text-gray-700">
                    Select quantity and label type (40mm, 60mm, etc.)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                    3
                  </div>
                  <span className="text-gray-700">
                    Confirm order - labels arrive next business day
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                <div className="mb-2 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">24h</div>
                <div className="text-sm text-gray-600">Delivery Time</div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                <div className="mb-2 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-600">On-Time Delivery</div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                <div className="mb-2 flex items-center justify-center">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-600">Customer Rating</div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                <div className="mb-2 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">2min</div>
                <div className="text-sm text-gray-600">Order Time</div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <p className="mt-2 text-sm text-gray-500">No commitment required • Cancel anytime</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

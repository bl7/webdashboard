"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui"
import { Truck, Package, CreditCard, Shield, Zap, Clock, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

export const LabelOrdering = () => {
  return (
    <section className="relative bg-gray-50 px-2 sm:px-6 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Never Run Out of Labels Again
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Order labels directly from your dashboard with bulk pricing, fast delivery, and seamless billing. 
            Focus on your kitchen, we'll handle the supplies.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          {/* Left: Ordering Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="grid gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Bulk Ordering Savings
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Save up to 40% with bulk quantities. Order 500+ labels and get premium pricing with volume discounts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Next-Day Delivery
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Free next-day delivery to your kitchen. Track your order in real-time through your dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Seamless Billing
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Labels are automatically added to your monthly subscription bill. No separate payments or invoices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Quality Guaranteed
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      All labels are tested for durability and compliance. 100% satisfaction guarantee with free replacements.
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
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Order</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-gray-700">Go to your dashboard's "Order Labels" section</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-gray-700">Select quantity and label type (40mm, 60mm, etc.)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-gray-700">Confirm order - labels arrive next business day</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">24h</div>
                <div className="text-sm text-gray-600">Delivery Time</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-600">On-Time Delivery</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-600">Customer Rating</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">2min</div>
                <div className="text-sm text-gray-600">Order Time</div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/register">
                  Start Free Trial
                </Link>
              </Button>
              <p className="text-sm text-gray-500 mt-2">No commitment required • Cancel anytime</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 
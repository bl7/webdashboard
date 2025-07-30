"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X, Star, ArrowRight, Shield, Clock, Users, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui"
import Link from "next/link"

const defaultFeatures = [
  "Device Provided",
  "Unlimited Label Printing",
  "Access to Web Dashboard",
  "Sunmi Printer Support",
  "Weekly Free Prints",
]

export const PricingGrid = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [plans, setPlans] = useState<any[]>([])
  const [features, setFeatures] = useState<string[]>(defaultFeatures)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/plans/public")
      .then((res) => res.json())
      .then((data) => {
        setPlans(data)
        // Collect all unique features from all plans
        const allFeatures = new Set<string>()
        data.forEach((plan: any) => {
          if (Array.isArray(plan.features)) {
            plan.features.forEach((f: string) => allFeatures.add(f))
          } else if (plan.features && typeof plan.features === "object") {
            Object.keys(plan.features).forEach((f) => allFeatures.add(f))
          }
        })
        if (allFeatures.size > 0) setFeatures(Array.from(allFeatures))
      })
      .catch(() => setPlans([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full animate-spin mb-4">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
        </div>
        <p className="text-lg font-medium text-slate-600">Loading plans...</p>
      </div>
    )
  }

  const getIcon = (index: number) => {
    const icons = [Clock, Users, Zap, Shield]
    const Icon = icons[index % icons.length]
    return <Icon className="w-5 h-5" />
  }

  return (
    <section id="pricing" className="relative py-24 sm:py-32 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-800 ring-1 ring-purple-200">
              <Star className="mr-2 h-4 w-4" />
              Start Free Trial
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              <span>Simple, Transparent</span>
              <br />
              <span className="text-gray-900">Pricing</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Choose the perfect plan for your kitchen. All plans include a free trial to get you started.
            </p>
          </motion.div>

          {/* Enhanced Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8 inline-flex items-center p-1 bg-white rounded-full shadow-lg border border-purple-200"
          >
            {["monthly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setBillingCycle(type as "monthly" | "yearly")}
                className={cn(
                  "relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300",
                  billingCycle === type
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-purple-800 hover:bg-purple-50"
                )}
              >
                {type === "monthly" ? "Monthly" : "Yearly"}
                {type === "yearly" && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Enhanced Pricing Cards */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-white p-8 text-left shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2",
                  index === 1
                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 ring-2 ring-purple-200 scale-105"
                    : "border-gray-200 hover:border-purple-300"
                )}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                      <Star className="mr-1 h-4 w-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-black text-gray-900">
                      {billingCycle === "monthly"
                        ? plan.price_monthly
                          ? `£${(plan.price_monthly / 100).toFixed(2)}`
                          : "Contact us"
                        : plan.price_yearly
                          ? `£${(plan.price_yearly / 100).toFixed(2)}`
                          : "Custom Pricing"}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {billingCycle === "monthly" ? "/mo" : "/yr"}
                    </span>
                  </div>
                </div>

                {/* Features list - from API */}
                <div className="space-y-3 mb-8">
                  {Array.isArray(plan.features) && plan.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/register" className="mt-auto">
                  <Button
                    className={cn(
                      "w-full py-3 font-semibold transition-all duration-300",
                      index === 1
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    )}
                  >
                    {index === 1 ? "Start Free Trial" : "Get Started"}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
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
            
            <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Simple, Transparent
              </span>
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
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
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
          <div className="grid gap-8 lg:grid-cols-3 max-w-6xl">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={cn(
                  "relative group rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl",
                  index === 1
                    ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl border-2 border-purple-200"
                    : "bg-white border border-gray-200 shadow-lg hover:border-purple-300"
                )}
              >
                {/* Popular Badge */}
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      <Star className="mr-1 h-4 w-4 inline" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={cn(
                    "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4",
                    index === 1 ? "bg-white/20" : "bg-gradient-to-r from-purple-100 to-pink-100"
                  )}>
                    <div className={cn(
                      "flex items-center justify-center",
                      index === 1 ? "text-white" : "text-purple-600"
                    )}>
                      {getIcon(index)}
                    </div>
                  </div>
                  
                  <h3 className={cn(
                    "text-2xl font-bold mb-2",
                    index === 1 ? "text-white" : "text-gray-900"
                  )}>
                    {plan.name}
                  </h3>
                  
                  <p className={cn(
                    "text-sm mb-4",
                    index === 1 ? "text-white/80" : "text-gray-600"
                  )}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className={cn(
                      "text-4xl font-black",
                      index === 1 ? "text-white" : "text-gray-900"
                    )}>
                      {billingCycle === "monthly"
                        ? plan.price_monthly
                          ? `£${(plan.price_monthly / 100).toFixed(2)}`
                          : "Custom"
                        : plan.price_yearly
                          ? `£${(plan.price_yearly / 100).toFixed(2)}`
                          : "Custom"}
                    </div>
                    <div className={cn(
                      "text-sm",
                      index === 1 ? "text-white/80" : "text-gray-500"
                    )}>
                      {billingCycle === "monthly" ? "per month" : "per year"}
                    </div>
                  </div>
                </div>

                {/* Enhanced CTA Button */}
                <Link href="/register" className="block">
                  <Button
                    className={cn(
                      "w-full py-4 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl",
                      index === 1
                        ? "bg-white text-purple-600 hover:bg-gray-50"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                    )}
                  >
                    {plan.price_monthly ? "Start Free Trial" : "Contact Sales"}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

                {/* Enhanced Features Preview */}
                <div className="mt-8 pt-6 border-t border-gray-200/20">
                  <p className={cn(
                    "text-xs font-semibold mb-4 uppercase tracking-wide",
                    index === 1 ? "text-white/80" : "text-gray-500"
                  )}>
                    Key Features:
                  </p>
                  <div className="space-y-3">
                    {features.slice(0, 4).map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <Check className={cn(
                          "w-4 h-4 flex-shrink-0",
                          index === 1 ? "text-white" : "text-purple-500"
                        )} />
                        <span className={cn(
                          index === 1 ? "text-white/90" : "text-gray-600"
                        )}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-3xl font-black mb-4">
              Ready to transform your kitchen?
            </h3>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Join 1,500+ UK businesses using InstaLabel for HACCP-compliant labeling. 
              Start your free trial today—no credit card required.
            </p>
            <Link href="/register">
              <Button className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
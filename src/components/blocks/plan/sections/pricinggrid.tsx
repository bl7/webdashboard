"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X, Star, ArrowRight, Shield, Clock, Users, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <section id="pricing" className="relative py-12 sm:py-16 bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Start Free Trial
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose the perfect plan for your kitchen. All plans include a free trial to get you started.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8 inline-flex items-center p-1 bg-white rounded-full shadow-lg border border-slate-200"
          >
            {["monthly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setBillingCycle(type as "monthly" | "yearly")}
                className={cn(
                  "relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200",
                  billingCycle === type
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {type === "monthly" ? "Monthly" : "Yearly"}
                {type === "yearly" && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="flex justify-center">
          <div className="grid gap-8 lg:grid-cols-3 max-w-5xl">
            {plans.map((plan, index) => (
            <motion.div
              key={plan.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "relative group rounded-2xl p-8 transition-all duration-300 hover:scale-105",
                index === 1
                  ? "bg-purple-600 text-white shadow-2xl border-2 border-purple-200"
                  : "bg-white border border-slate-200 shadow-lg hover:shadow-xl"
              )}
            >
              {/* Popular Badge */}
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={cn(
                  "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4",
                  index === 1 ? "bg-white/20" : "bg-purple-100"
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
                  index === 1 ? "text-white" : "text-slate-900"
                )}>
                  {plan.name}
                </h3>
                
                <p className={cn(
                  "text-sm mb-4",
                  index === 1 ? "text-white/80" : "text-slate-600"
                )}>
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className={cn(
                    "text-4xl font-bold",
                    index === 1 ? "text-white" : "text-slate-900"
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
                    index === 1 ? "text-white/80" : "text-slate-500"
                  )}>
                    {billingCycle === "monthly" ? "per month" : "per year"}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <a href="/register">
                <button
                  className="bg-primary px-8 py-4 text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 text-base font-semibold rounded-xl w-full"
                >
                  {plan.price_monthly ? "Start Free Trial" : "Contact Sales"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </a>

              {/* Features Preview */}
              <div className="mt-6 pt-6 border-t border-slate-200/20">
                <p className={cn(
                  "text-xs font-medium mb-3",
                  index === 1 ? "text-white/80" : "text-slate-500"
                )}>
                  Key Features:
                </p>
                <div className="space-y-2">
                  {features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className={cn(
                        "w-4 h-4 flex-shrink-0",
                        index === 1 ? "text-white" : "text-purple-500"
                      )} />
                      <span className={cn(
                        index === 1 ? "text-white/90" : "text-slate-600"
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



        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to transform your kitchen?
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join 1,500+ UK businesses using InstLabel for HACCP-compliant labeling. 
              Start your free trial today—no credit card required.
            </p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-colors shadow-lg">
              Start Free Trial
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
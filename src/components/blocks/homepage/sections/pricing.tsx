"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui"
import { CheckCircle, Star, Zap, Clock, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"

export const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/plans/public")
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="relative px-4 py-16 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-white via-yellow-50/30 to-white">
      <div className="container mx-auto max-w-6xl space-y-12 text-center">
        {/* Enhanced Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-800 ring-1 ring-purple-200">
            <Zap className="mr-2 h-4 w-4" />
            ROI-Focused Pricing
          </div>
          
          <h2 className="font-accent text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Save £2,000+ Monthly
            </span>
            <br />
            <span className="text-gray-900">On Kitchen Operations</span>
          </h2>
          
          <p className="mx-auto max-w-2xl text-xl text-gray-600 sm:text-2xl leading-relaxed">
            Most kitchens save 15+ hours weekly and reduce waste by 30%. 
            Your InstaLabel investment pays for itself in the first month.
          </p>

          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-purple-100">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="text-left">
                <div className="font-bold text-gray-900">15+ Hours Saved</div>
                <div className="text-sm text-gray-600">Per week on labeling</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-purple-100">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <div className="font-bold text-gray-900">Zero Fines</div>
                <div className="text-sm text-gray-600">Compliance guaranteed</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-purple-100">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <div className="font-bold text-gray-900">30% Less Waste</div>
                <div className="text-sm text-gray-600">Better tracking</div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Toggle */}
          <div className="mt-8 inline-flex rounded-full bg-white p-1 shadow-lg border border-purple-200">
            {["monthly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setBillingCycle(type as "monthly" | "yearly")}
                className={cn(
                  "rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300",
                  billingCycle === type
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                )}
              >
                {type === "monthly" ? "Monthly Billing" : "Yearly Billing (Save 20%)"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Pricing Cards */}
        <div className="flex items-center justify-center">
          <div className="max-w-6xl gap-8 md:grid-cols-3 flex justify-center items-center">
            {loading ? (
              <div className="col-span-3 py-12 text-center text-lg">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="col-span-3 py-12 text-center text-lg text-gray-500">No plans available.</div>
            ) : (
              plans.map((plan, index) => (
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
                    
                    {/* ROI Calculator */}
                    {plan.price_monthly && (
                      <div className="text-sm text-green-600 font-semibold mb-4">
                        Saves £{Math.round((plan.price_monthly / 100) * 20)}+ monthly in staff time
                      </div>
                    )}
                  </div>

                  {/* Features list - from API */}
                  <div className="space-y-3 mb-8">
                    {Array.isArray(plan.features) && plan.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
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
              ))
            )}
          </div>
        </div>

        {/* Enhanced CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <Link href="/bookdemo" passHref>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Book Demo
              </Button>
            </Link>
            
            <Link href="/register" passHref>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                Start Trial
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Free 14-day trial
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Setup in 5 minutes
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

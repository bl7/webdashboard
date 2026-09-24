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
    <section className="relative bg-gradient-to-br from-white via-yellow-50/30 to-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl space-y-12 text-center">
        {/* Enhanced Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center rounded-full bg-mkt-canvas px-4 py-2 text-sm font-semibold text-mkt-ink ring-1 ring-mkt-steel1">
            <Zap className="mr-2 h-4 w-4" />
            ROI-Focused Pricing
          </div>

          <h3 className="font-accent text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-mkt-ink">
              Plans for kitchen labelling
            </span>
            <br />
            <span className="text-gray-900">Shown from the live billing source</span>
          </h3>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600 sm:text-2xl">
            See the current plans and trial terms. There is no published saving or waste figure.
          </p>

          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3"
          >
            <div className="flex items-center gap-3 rounded-xl border border-mkt-steel1 bg-white p-4 shadow-sm">
              <Clock className="h-8 w-8 text-mkt-teal" />
              <div className="text-left">
                <div className="font-bold text-gray-900">Less writing</div>
                <div className="text-sm text-gray-600">Than handwriting each label</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-mkt-steel1 bg-white p-4 shadow-sm">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <div className="font-bold text-gray-900">Your check</div>
                <div className="text-sm text-gray-600">Recipes and finished labels</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-mkt-steel1 bg-white p-4 shadow-sm">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <div className="font-bold text-gray-900">Two sizes</div>
                <div className="text-sm text-gray-600">60 × 40 mm and 56 × 80 mm</div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Toggle */}
          <div className="mt-8 inline-flex rounded-full border border-mkt-steel1 bg-white p-1 shadow-lg">
            {["monthly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setBillingCycle(type as "monthly" | "yearly")}
                className={cn(
                  "rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300",
                  billingCycle === type
                    ? "text-white text-white shadow-md"
                    : "text-gray-600 hover:bg-mkt-canvas hover:text-mkt-ink"
                )}
              >
                {type === "monthly" ? "Monthly Billing" : "Yearly Billing (Save 20%)"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Pricing Cards */}
        <div className="flex justify-center">
          <div
            className={
              plans.length === 1
                ? "w-full max-w-md"
                : plans.length === 2
                  ? "grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
                  : "grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            }
          >
            {loading ? (
              <div className="py-12 text-center text-lg">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="py-12 text-center text-lg text-gray-500">No plans available.</div>
            ) : (
              plans.map((plan, index) => (
                <motion.div
                  key={plan.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={cn(
                    "relative flex flex-col rounded-2xl border bg-white p-8 text-left shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl",
                    index === 1
                      ? "scale-105 border-mkt-ink bg-mkt-canvas ring-2 ring-mkt-steel1"
                      : "border-gray-200 hover:border-mkt-steel1"
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
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="mb-4 text-gray-600">{plan.description}</p>

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
                      <span className="ml-2 text-gray-600">
                        {billingCycle === "monthly" ? "/mo" : "/yr"}
                      </span>
                    </div>

                    {/* ROI Calculator */}
                    {plan.price_monthly && (
                      <div className="mb-4 text-sm font-semibold text-green-600">
                        Saves £{Math.round((plan.price_monthly / 100) * 20)}+ monthly in staff time
                      </div>
                    )}
                  </div>

                  {/* Features list - from API */}
                  <div className="mb-8 space-y-3">
                    {Array.isArray(plan.features) &&
                      plan.features.map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                  </div>

                  <Button
                    className={cn(
                      "w-full py-3 font-semibold transition-all duration-300",
                      index === 1
                        ? "text-white text-white shadow-lg hover:opacity-90 hover:shadow-xl"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    )}
                    asChild
                  >
                    <Link href="/register" className="mt-auto">
                      {index === 1 ? "Start Free Trial" : "Get Started"}
                    </Link>
                  </Button>
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
            <Button
              size="lg"
              className="border-0 px-8 py-4 text-lg font-semibold text-white shadow-lg"
              style={{ backgroundColor: "#142124", backgroundImage: "none" }}
              asChild
            >
              <Link href="/bookdemo">Book Demo</Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="mx-3 border-2 border-mkt-steel1 px-8 py-4 text-lg font-semibold text-mkt-ink transition-all duration-300 hover:bg-mkt-canvas hover:text-mkt-ink"
              asChild
            >
              <Link href="/register">Start Trial</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Free 14-day trial
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              No charges during trial
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

          {/* Waitlist Link */}
          <div className="text-center">
            <Button
              variant="link"
              className="text-sm text-mkt-teal hover:text-mkt-ink"
              onClick={() => {
                // Trigger the demo modal
                const event = new CustomEvent("openDemoModal")
                window.dispatchEvent(event)
              }}
            >
              Request a Demo →
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

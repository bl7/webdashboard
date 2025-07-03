"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
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
    return <div className="py-24 text-center text-lg">Loading plans...</div>
  }

  return (
    <section id="pricing" className="bg-muted/20 py-8 sm:py-24">
      <div className="container space-y-10 sm:space-y-16 px-2 sm:px-4 text-center sm:px-6 md:px-12 lg:px-16">
        {/* Heading */}
        <div className="mx-auto max-w-3xl space-y-2 sm:space-y-4">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Start Free</h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Get free trial with all our plans.
          </p>

          {/* Toggle */}
          <div className="mt-4 sm:mt-6 inline-flex rounded-full bg-muted p-1">
            {["monthly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setBillingCycle(type as "monthly" | "yearly")}
                className={cn(
                  "rounded-full px-5 py-1.5 text-sm font-medium transition",
                  billingCycle === type
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted/60"
                )}
              >
                {type === "monthly" ? "Monthly Billing" : "Yearly Billing"}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "relative flex flex-col rounded-xl border bg-white p-6 text-left shadow-sm transition-all hover:shadow-md",
                index === 1 ? "border-primary bg-primary/5 ring-2 ring-primary" : "border-border"
              )}
            >
              {index === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs text-white shadow">
                  Best Value
                </span>
              )}

              <h3 className="text-xl font-semibold text-primary">{plan.name}</h3>
              <p className="my-1 text-lg font-bold text-foreground">
                {billingCycle === "monthly"
                  ? plan.price_monthly
                    ? `£${plan.price_monthly}/mo`
                    : "Contact us"
                  : plan.price_yearly
                    ? `£${plan.price_yearly}/yr`
                    : "Custom Pricing"}
              </p>

              <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>

              <button
                className={cn(
                  "mt-auto w-full rounded-md py-2 text-sm font-semibold transition",
                  index === 1
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-muted text-primary hover:bg-primary/10"
                )}
              >
                {plan.price_monthly ? "Start Plan" : "Contact Us"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-t border-muted bg-white pt-6 sm:pt-10 shadow-md">
          <table className="min-w-full table-fixed text-left text-xs sm:text-sm">
            <thead className="bg-primary/10">
              <tr>
                <th className="w-1/3 p-4 font-semibold text-primary">Feature</th>
                {plans.map((plan, i) => (
                  <th key={plan.id || i} className="p-4 text-center font-semibold text-primary">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr key={i} className={cn("hover:bg-muted/50", i % 2 === 0 ? "bg-muted/30" : "")}> 
                  <td className="p-4 font-medium text-muted-foreground">{feature}</td>
                  {plans.map((plan, j) => {
                    let value = null
                    if (Array.isArray(plan.features)) {
                      value = plan.features.includes(feature)
                    } else if (plan.features && typeof plan.features === "object") {
                      value = plan.features[feature]
                    }
                    return (
                      <td key={j} className="p-4 text-center text-muted-foreground">
                        {value === true ? (
                          <Check className="mx-auto h-5 w-5 text-green-600" />
                        ) : value === false ? (
                          <X className="mx-auto h-5 w-5 text-red-400" />
                        ) : value ? (
                          <span className="text-sm font-normal">{value}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  "Device Provided",
  "Unlimited Label Printing",
  "Access to Web Dashboard",
  "Sunmi Printer Support",
  "Weekly Free Prints",
]
const plans = [
  {
    name: "Starter Kitchen",
    monthly: "£10/mo",
    yearly: "£108/yr (10% off)",
    features: {
      "Device Provided": false,
      "Unlimited Label Printing": true,
      "Access to Web Dashboard": true,
      "Sunmi Printer Support": false,
      "Optional Rolls Add-on": "5 rolls/mo for £5",
    },
    description:
      "Perfect for small kitchens with their own printer. Unlimited printing. Optional add-on: 5 rolls/month for just £5.",
    highlight: false,
    cta: "Start Starter Plan",
  },
  {
    name: "Pro Kitchen",
    monthly: "£25/mo",
    yearly: "£270/yr (10% off)",
    features: {
      "Device Provided": "Sunmi or Epson Included",
      "Unlimited Label Printing": true,
      "Access to Web Dashboard": true,
      "Sunmi Printer Support": true,
      "Monthly Rolls Included": "5 rolls/mo",
    },
    description:
      "Includes a device, unlimited prints, Sunmi support, and 5 rolls every month. Ideal for busy kitchens.",
    highlight: true,
    cta: "Start Pro Plan",
  },
  {
    name: "Multi-Site Mastery",
    monthly: "Contact us",
    yearly: "Custom Pricing",
    features: {
      "Device Provided": "All Devices Supported",
      "Unlimited Label Printing": true,
      "Access to Web Dashboard": true,
      "Sunmi Printer Support": true,
      "Multi-Location Support": true,
    },
    description:
      "Tailored for enterprise kitchens and chains. Comes with everything — let's talk and set it up for your needs.",
    highlight: false,
    cta: "Contact Us",
  },
]

export const PricingGrid = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <section id="pricing" className="bg-muted/20 py-24">
      <div className="container space-y-16 text-center">
        {/* Heading */}
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">Start Free, Scale as You Grow</h2>
          <p className="text-lg text-muted-foreground">
            Begin with 20 free weekly prints — upgrade anytime when you're ready to go all-in.
          </p>

          {/* Toggle */}
          <div className="mt-6 inline-flex rounded-full bg-muted p-1">
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
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "relative flex flex-col rounded-xl border bg-white p-6 text-left shadow-sm transition-all hover:shadow-md",
                plan.highlight ? "border-primary bg-primary/5 ring-2 ring-primary" : "border-border"
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs text-white shadow">
                  Best Value
                </span>
              )}

              <h3 className="text-xl font-semibold text-primary">{plan.name}</h3>
              <p className="my-1 text-lg font-bold text-foreground">{plan[billingCycle]}</p>

              <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>

              <button
                className={cn(
                  "mt-auto w-full rounded-md py-2 text-sm font-semibold transition",
                  plan.highlight
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-muted text-primary hover:bg-primary/10"
                )}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-t border-muted bg-white pt-10 shadow-md">
          <table className="min-w-full table-fixed text-left text-sm">
            <thead className="bg-primary/10">
              <tr>
                <th className="w-1/3 p-4 font-semibold text-primary">Feature</th>
                {plans.map((plan, i) => (
                  <th key={i} className="p-4 text-center font-semibold text-primary">
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
                    const value = plan.features[feature as keyof typeof plan.features]
                    return (
                      <td key={j} className="p-4 text-center text-muted-foreground">
                        {value === true ? (
                          <Check className="mx-auto h-5 w-5 text-green-600" />
                        ) : value === false ? (
                          <X className="mx-auto h-5 w-5 text-red-400" />
                        ) : (
                          <span className="text-sm font-normal">{value}</span>
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

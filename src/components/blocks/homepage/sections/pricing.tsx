"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  "Device Included",
  "Unlimited Prints",
  "Web Dashboard",
  "Sunmi Support",
  "Free Prints",
]

const plans = [
  {
    name: "Free Plan",
    monthly: "Free",
    yearly: "Free",
    features: {
      "Device Included": false,
      "Unlimited Prints": false,
      "Web Dashboard": true,
      "Sunmi Support": false,
      "Free Prints": true,
    },
    description:
      "Perfect for testing or small-scale use. Use your own Epson TM-M30 and get 20 free prints weekly.",
    highlight: false,
    cta: "Start Free",
  },
  {
    name: "Basic Plan",
    monthly: "£20/mo",
    yearly: "£216/yr (10% off)",
    features: {
      "Device Included": "Epson TM-M30",
      "Unlimited Prints": true,
      "Web Dashboard": false,
      "Sunmi Support": false,
      "Free Prints": false,
    },
    description:
      "Great for businesses needing unlimited label printing with the Epson device included.",
    highlight: true,
    cta: "Choose Basic",
  },
  {
    name: "Premium Plan",
    monthly: "£25/mo",
    yearly: "£270/yr",
    features: {
      "Device Included": "Sunmi or Epson",
      "Unlimited Prints": true,
      "Web Dashboard": true,
      "Sunmi Support": true,
      "Free Prints": false,
    },
    description:
      "Everything in Basic, plus Sunmi device support and printing via our web dashboard.",
    highlight: false,
    cta: "Go Premium",
  },
]

export const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <section id="pricing" className="bg-muted/20 py-24">
      <div className="container space-y-16 text-center">
        {/* Heading */}
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your needs. Upgrade or cancel anytime.
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
      </div>
    </section>
  )
}

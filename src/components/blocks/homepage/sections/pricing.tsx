"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui"
import Link from "next/link"

const plans = [
  {
    name: "Basic Plan",
    monthly: "£20/mo",
    yearly: "£216/yr (10% off)",
    description:
      "Great for businesses needing unlimited label printing with the Epson device included.",
    highlight: true,
  },
  {
    name: "Premium Plan",
    monthly: "£25/mo",
    yearly: "£270/yr",
    description:
      "Everything in Basic, plus Sunmi device support and printing via our web dashboard.",
    highlight: false,
  },
]

export const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <section id="pricing" className="bg-muted/20 px-4 py-24 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl space-y-16 text-center">
        {/* Heading */}
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="font-accent text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Transparent Pricing
          </h2>
          <p className="mx-auto max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
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
        <div className="flex justify-center">
          <div className="grid max-w-4xl gap-8 md:grid-cols-2">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "relative flex flex-col rounded-xl border bg-white p-6 text-left shadow-sm transition-all hover:shadow-md",
                  plan.highlight
                    ? "border-primary bg-primary/5 ring-2 ring-primary"
                    : "border-border"
                )}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs text-white shadow">
                    Best Value
                  </span>
                )}

                <h3 className="text-xl font-semibold text-primary">{plan.name}</h3>
                <p className="my-1 text-lg font-bold text-foreground">{plan[billingCycle]}</p>

                <p className="mb-4 text-sm text-gray-600">{plan.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Button below cards */}
        <Link href="/plan" passHref>
          <Button
            size="lg"
            className="bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
          >
            See Full List of Features
          </Button>
        </Link>
      </div>
    </section>
  )
}

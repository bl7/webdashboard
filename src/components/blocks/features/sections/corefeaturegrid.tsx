"use client"

import { Printer, Monitor, Zap, ShieldCheck, Globe, Wrench } from "lucide-react"

import { motion } from "framer-motion"
import React from "react"

const coreFeatures = [
  {
    title: "Fast Printing",
    icon: <Printer className="h-6 w-6 text-primary" />,
    description: "Lightning-fast label printing with zero setup delays.",
  },
  {
    title: "Cloud Dashboard",
    icon: <Monitor className="h-6 w-6 text-primary" />,
    description: "Manage devices, usage, and print activity from any browser.",
  },
  {
    title: "One-Click Setup",
    icon: <Zap className="h-6 w-6 text-primary" />,
    description: "Install and start printing within minutes — no tech support needed.",
  },
  {
    title: "Secure & Reliable",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    description: "Built-in protections and updates to keep your data and prints secure.",
  },
  {
    title: "Works Anywhere",
    icon: <Globe className="h-6 w-6 text-primary" />,
    description: "Cross-platform support for Sunmi, Epson, and web-connected devices.",
  },
  {
    title: "Always Supported",
    icon: <Wrench className="h-6 w-6 text-primary" />,
    description: "Need help? Our support is here for Sunmi, Epson, and beyond.",
  },
]

export const CoreFeaturesGrid = () => {
  return (
    <section className="bg-muted/20 py-24">
      <div className="container space-y-12 text-center">
        <div className="mx-auto max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything You Need to Label Smarter
          </h2>
          <p className="text-muted-foreground">
            InstaLabel is packed with powerful features that simplify your workflow — whether you're
            running a retail shop or scaling operations across locations.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {coreFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm hover:shadow-md"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

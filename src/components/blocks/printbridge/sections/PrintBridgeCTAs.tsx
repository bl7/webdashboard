"use client"
import React from "react"
import { Rocket, BadgeCheck, BookOpen, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

const ctas = [
  {
    icon: <Rocket className="h-8 w-8 text-purple-600" />,
    title: "Start Free Trial",
    desc: "Try InstaLabel with Zentra PrintBridge included. No credit card required.",
    button: "Start Free Trial",
    href: "/register",
  },
  {
    icon: <BadgeCheck className="h-8 w-8 text-green-600" />,
    title: "Enable Zentra PrintBridge",
    desc: "Already using InstaLabel? Download Zentra from your dashboard to enable PrintBridge.",
    button: "Enable Zentra",
    href: "/login",
  },

  {
    icon: <Phone className="h-8 w-8 text-pink-600" />,
    title: "Talk to Sales",
    desc: "Having trouble integrating Zentra PrintBridge? Our team is here to help.",
    button: "Contact Sales",
    href: "/about#contact",
  },
]

export const PrintBridgeCTAs = () => (
  <section className="relative w-full bg-gradient-to-br from-white via-purple-50 to-pink-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="mx-auto max-w-6xl">
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="mb-2 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200">
          Get Started with PrintBridge
        </div>
        <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
          Choose Your Path
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600">
          PrintBridge is included with every InstaLabel account. Whether you’re new or already a
          customer, pick the option that fits you best.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
          {ctas.map((cta, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow">
                <div className="mb-3">{cta.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{cta.title}</h3>
                <div className="mb-3 text-sm text-gray-600">{cta.desc}</div>
                <Button asChild className="mt-auto w-full">
                  <Link href={cta.href}>{cta.button}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
)

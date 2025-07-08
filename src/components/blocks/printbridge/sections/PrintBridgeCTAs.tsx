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
    href: "/register"
  },
  {
    icon: <BadgeCheck className="h-8 w-8 text-green-600" />,
    title: "Enable Zentra PrintBridge",
    desc: "Already using InstaLabel? Download Zentra from your dashboard to enable PrintBridge.",
    button: "Enable Zentra",
    href: "/login"
  },
 
  {
    icon: <Phone className="h-8 w-8 text-pink-600" />,
    title: "Talk to Sales",
    desc: "Having trouble integrating Zentra PrintBridge? Our team is here to help.",
    button: "Contact Sales",
    href: "/about#contact"
  }
]

export const PrintBridgeCTAs = () => (
  <section className="relative w-full py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-white via-purple-50 to-pink-50">
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200 mb-2">
          Get Started with PrintBridge
        </div>
        <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-gray-900">
          Choose Your Path
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-2">
          PrintBridge is included with every InstaLabel account. Whether you’re new or already a customer, pick the option that fits you best.
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {ctas.map((cta, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
              <div className="bg-white rounded-xl border border-gray-200 shadow p-6 flex flex-col items-center text-center">
                <div className="mb-3">{cta.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{cta.title}</h3>
                <div className="text-sm text-gray-600 mb-3">{cta.desc}</div>
                <Link href={cta.href} passHref legacyBehavior>
                  <Button asChild className="w-full mt-auto">
                    <a>{cta.button}</a>
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
) 
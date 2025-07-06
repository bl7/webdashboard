"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui"
import { ArrowRight, Clock, DollarSign, Shield, Users } from "lucide-react"
import Link from "next/link"

export const PrintBridgeBenefits = () => {
  const benefits = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Save Time",
      description: "No more waiting for cloud processing or dealing with network issues. Print labels instantly when you need them.",
      metric: "50% faster printing"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Reduce Costs",
      description: "Eliminate cloud printing fees and reduce network infrastructure costs with local printing.",
      metric: "Save £200+ monthly"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enhanced Security",
      description: "Keep your printing data local and secure. No sensitive information transmitted over the internet.",
      metric: "100% local processing"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Better Reliability",
      description: "Work without internet interruptions. PrintBridge maintains connection even when web access is limited.",
      metric: "99.9% uptime"
    }
  ]

  return (
    <section className="relative bg-white px-4 sm:px-6 py-12 sm:py-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative mx-auto max-w-7xl space-y-16 sm:space-y-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Why Choose PrintBridge?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the benefits of local printing technology designed for professional kitchens
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-purple-600">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {benefit.description}
              </p>
              <div className="text-sm font-semibold text-purple-600">
                {benefit.metric}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Experience Seamless Printing?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join hundreds of kitchens already using PrintBridge for reliable, fast, and secure label printing. 
              Start your free trial today and see the difference local printing technology makes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="bg-purple-600 px-8 py-3 text-white hover:bg-purple-700">
                <Link href="/register">
                  Start Free Trial
                </Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                Download PrintBridge
              </Button>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              ✓ 14-day free trial • ✓ No credit card required • ✓ Setup in 2 minutes
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
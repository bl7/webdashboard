"use client"

import { Zap, ShieldCheck, BarChart3, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

const pillars = [
  {
    icon: <Zap className="h-8 w-8 text-purple-600" />, 
    title: "Instant Setup",
    description: "Plug in and print in minutes. No IT support or drivers required."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-green-600" />, 
    title: "Compliant by Design",
    description: "Natasha’s Law, HACCP, and EHO compliance built in."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-pink-600" />, 
    title: "Real-Time Analytics",
    description: "Track label usage, staff activity, and expiry alerts live."
  },
]



export const FeaturesGrid = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4 text-center">
          Why Kitchens Switch to InstaLabel
        </h2>
        <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12 text-center">
          The only labeling platform built for real kitchens, not just IT departments.
        </p>
        <div className="grid gap-6 sm:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mb-12">
          {pillars.map((item, i) => (
            <motion.div
              key={i}
              className="rounded-2xl border bg-gray-50 p-8 shadow-sm flex flex-col items-center text-center h-full"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 flex items-center justify-center">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-base">{item.description}</p>
            </motion.div>
          ))}
        </div>
       
      </div>
    </section>
  )
}

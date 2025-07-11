"use client"

import React from "react"
import Image from "next/image"
import { AlertTriangle, CheckCircle, Clock, Users, Zap, Shield, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui"
import { ArrowRight, StepForward } from "lucide-react"
import Link from "next/link"
import FeatureImage from "@/assets/images/feature.png"
import { motion } from "framer-motion"

export const Services = () => {
  const problems = [
    {
      icon: Clock,
      title: "Time-Consuming Manual Labeling",
      desc: "Staff spend 2-3 hours daily handwriting labels, calculating dates, and managing allergen information.",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: AlertTriangle,
      title: "Compliance Risks & Fines",
      desc: "Missing allergen info, incorrect dates, or illegible handwriting can result in £5,000+ fines and legal action.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      icon: Users,
      title: "Staff Training & Turnover Issues",
      desc: "New staff need weeks to learn proper labeling procedures, and mistakes are common during busy periods.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      icon: FileText,
      title: "Inconsistent Quality & Waste",
      desc: "Poor labeling leads to food waste, customer complaints, and potential health risks from expired items.",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
  ]

  const solutions = [
    {
      icon: Zap,
      title: "Instant Professional Labels",
      desc: "Tap to print compliant labels in seconds - no handwriting, no calculations, no errors.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: Shield,
      title: "Automatic Compliance",
      desc: "Every label includes allergens, prep dates, and expiry times - automatically calculated and formatted.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Users,
      title: "Zero Training Required",
      desc: "Intuitive interface means new staff can start printing compliant labels on day one.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: CheckCircle,
      title: "Consistent Quality & Safety",
      desc: "Professional labels reduce waste, improve food safety, and enhance customer trust.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
  ]

  return (
    <section id="problems-solutions" className="relative px-4 py-16 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-white via-red-50/30 to-white">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-800 ring-1 ring-purple-200">
              <AlertTriangle className="mr-2 h-4 w-4 text-purple-600" />
              The Kitchen Labeling Crisis
            </div>
            
            <h2 className="font-accent text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Problems Every Kitchen
              </span>
              <br />
              <span className="text-gray-900">Faces Daily</span>
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Traditional labeling methods are costing kitchens time, money, and compliance. 
              Here's what's broken and how InstaLabel fixes it.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Problems Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-2xl font-bold text-red-700 mb-2">The Problems</h3>
              <p className="text-gray-600">What's costing your kitchen time and money</p>
            </div>

            <div className="space-y-4">
              {problems.map(({ icon: Icon, title, desc, color, bgColor, borderColor }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="flex items-start space-x-4 p-6 rounded-xl bg-white border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className={`flex-shrink-0 rounded-xl ${bgColor} p-4 transition-all duration-300 group-hover:scale-110`}>
                      <Icon className={`h-7 w-7 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2">{title}</h3>
                      <p className="text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solutions Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-2xl font-bold text-green-700 mb-2">The InstaLabel Solution</h3>
              <p className="text-gray-600">How smart automation transforms your kitchen</p>
            </div>

            <div className="space-y-4">
              {solutions.map(({ icon: Icon, title, desc, color, bgColor, borderColor }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="flex items-start space-x-4 p-6 rounded-xl bg-white border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className={`flex-shrink-0 rounded-xl ${bgColor} p-4 transition-all duration-300 group-hover:scale-110`}>
                      <Icon className={`h-7 w-7 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">{title}</h3>
                      <p className="text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Enhanced CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-4 pt-12"
        >
          <Link href='/bookdemo'>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Book Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href='/register'>
            <Button variant="outline" size="lg" className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-semibold transition-all duration-300">
              Start Trial
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
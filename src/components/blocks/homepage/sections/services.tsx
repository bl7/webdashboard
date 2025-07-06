"use client"

import React from "react"
import Image from "next/image"
import { ClipboardCheck, Smartphone, Monitor, Printer, Zap, Shield, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui"
import { ArrowRight, StepForward } from "lucide-react"
import Link from "next/link"
import FeatureImage from "@/assets/images/feature.png"
import { motion } from "framer-motion"

export const Services = () => {
  const features = [
    {
      icon: Printer,
      title: "Print in Seconds",
      desc: "No more handwriting or sticky notes. Select, tap, print.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: ClipboardCheck,
      title: "Track Prep & Expiry Dates Automatically",
      desc: "We calculate everything — so your staff doesn't have to.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: Shield,
      title: "Comply with Natasha's Law & EHO Standards",
      desc: "Every label includes allergens, prep dates, and times — automatically.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: Smartphone,
      title: "Works on Web & Sunmi Devices",
      desc: "If you have a label printer, you can use InstaLabel.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
  ]

  return (
    <section id="features" className="relative px-4 py-24 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-white via-purple-50/30 to-white">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative container mx-auto max-w-6xl">
        <div className="flex flex-col-reverse items-center gap-16 md:flex-row md:items-center">
          {/* Enhanced Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full max-w-2xl space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-800 ring-1 ring-purple-200">
                <Zap className="mr-2 h-4 w-4" />
                Built for Kitchens, by Kitchens
              </div>
              
              <h2 className="font-accent text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Powerful Features
                </span>
                <br />
                <span className="text-gray-900">That Just Work</span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform your kitchen operations with intelligent automation that saves time, 
                ensures compliance, and reduces errors. No training required.
              </p>
            </div>

            {/* Enhanced Features List */}
            <div className="space-y-4">
              {features.map(({ icon: Icon, title, desc, color, bgColor, borderColor }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="flex items-start space-x-4 p-6 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className={`flex-shrink-0 rounded-xl ${bgColor} p-4 transition-all duration-300 group-hover:scale-110`}>
                      <Icon className={`h-7 w-7 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">{title}</h3>
                      <p className="text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-6">
              <Link href='/features'>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  See Full Feature List
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href='/bookdemo'>
                <Button variant="outline" size="lg" className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 px-6 py-4 text-lg font-semibold transition-all duration-300">
                  <StepForward className="mr-2 h-5 w-5" />
                  Book Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Enhanced Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center md:w-1/2 lg:w-2/5"
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Animated gradient background */}
              <div className="absolute -inset-8 bg-gradient-to-br from-purple-200/40 via-pink-200/40 to-blue-200/40 rounded-3xl blur-2xl animate-pulse"></div>
              
              {/* Main image container with enhanced styling */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-200 transform hover:scale-105 transition-transform duration-300">
                {/* Kitchen environment overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10"></div>
                
                <div className="aspect-[3/4] relative">
                  <Image
                    src={FeatureImage}
                    alt="Professional kitchen staff using InstaLabel system - showing instant label printing and food safety compliance"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  />
                </div>
                
                {/* Enhanced brand overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-gray-800">Live Kitchen Demo</span>
                      <div className="ml-auto bg-purple-100 px-2 py-1 rounded-full">
                        <span className="text-xs font-medium text-purple-700">HD Quality</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-xl border-2 border-white transform hover:scale-110 transition-transform duration-200"
              >
                <Printer className="w-8 h-8 text-green-600" />
              </motion.div>
              
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-xl border-2 border-white transform hover:scale-110 transition-transform duration-200"
              >
                <ClipboardCheck className="w-8 h-8 text-purple-600" />
              </motion.div>
              
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 -left-6 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-lg border-2 border-white transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
              >
                <Shield className="w-7 h-7 text-purple-600" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
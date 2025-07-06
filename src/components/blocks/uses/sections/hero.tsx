"use client"

import React from "react"
import { Target, ArrowRight, Smartphone, BarChart3, FileText } from "lucide-react"
import { Button } from "@/components/ui"
import Link from "next/link"
import { motion } from "framer-motion"

export const UsesHero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 py-16">
      {/* Background blobs (standardized) */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-15 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-15 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-15 blur-3xl" />

      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl space-y-6 text-center md:text-left"
        >
          <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
            <Target className="mr-2 h-4 w-4" />
            Perfect for Every Kitchen Need
          </div>

          <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            <span className="text-purple-600">Label Everything,</span>
            <br className="hidden md:block" />
            <span className="">Everywhere.</span>
          </h1>

          <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
            From allergen warnings to expiry dates, prep labels to HACCP compliance — InstaLabel
            handles every labeling need. Print from web dashboard or Sunmi devices, track usage with real-time analytics, 
            and optimize your kitchen operations with comprehensive reporting.
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <Target className="h-4 w-4 text-purple-600" />
              <span>All Kitchen Uses</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <Smartphone className="h-4 w-4 text-purple-600" />
              <span>Sunmi Compatible</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span>Usage Analytics</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
            <Button size="lg" className="bg-purple-600 px-8 py-3 text-white hover:bg-purple-700">
              <Link href="/register">
                Start Free Trial
              </Link>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link href="/features">
              <Button variant="outline" size="lg">
                Explore Uses
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-500 md:justify-start">
            <span>✓ Free 14-day trial</span>
            <span>✓ No credit card required</span>
            <span>✓ Works with any thermal printer</span>
          </div>
        </motion.div>

        {/* Visual Representation - Label Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="relative">
            {/* Label Stack - 41mm realistic format */}
            <div className="space-y-4">
              {/* Allergen Label - 41mm */}
              <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-300" style={{ width: '5.6cm', height: '3.95cm' }}>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-900 text-sm">CHICKEN CURRY</h4>
                  <span className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded font-bold">ALLERGENS</span>
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  <span className="font-semibold">Contains:</span> Nuts, Dairy, Gluten
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  <span className="font-semibold">Prep:</span> 14:30 | <span className="font-semibold">Exp:</span> 18:30
                </div>
                <div className="text-xs text-gray-400">
                  <span className="font-semibold">Printed:</span> 14:25 | <span className="font-semibold">By:</span> JC
                </div>
              </div>

              {/* Prep Label - 41mm */}
              <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-300 ml-4" style={{ width: '5.6cm', height: '3.95cm' }}>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-900 text-sm">MIXED VEGETABLES</h4>
                  <span className="text-xs bg-purple-100 text-blue-800 px-1 py-0.5 rounded font-bold">PREP</span>
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  Fresh cut vegetables, carrots, broccoli
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  <span className="font-semibold">Prep:</span> 15:00 | <span className="font-semibold">Exp:</span> 21:00
                </div>
                <div className="text-xs text-gray-400">
                  <span className="font-semibold">Printed:</span> 14:55 | <span className="font-semibold">By:</span> MK
                </div>
              </div>

              {/* Cooked Label - 41mm */}
              <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-300 ml-8" style={{ width: '5.6cm', height: '3.95cm' }}>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-900 text-sm">BEEF STEAK</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded font-bold">COOKED</span>
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  Medium rare, rested, seasoned
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  <span className="font-semibold">Cook:</span> 16:45 | <span className="font-semibold">Exp:</span> 20:45
                </div>
                <div className="text-xs text-gray-400">
                  <span className="font-semibold">Printed:</span> 16:40 | <span className="font-semibold">By:</span> AS
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Bottom fade overlay */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 z-0" style={{background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)'}} />
    </section>
  )
}
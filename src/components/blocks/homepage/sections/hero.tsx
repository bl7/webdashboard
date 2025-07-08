"use client"

import { Button } from "@/components/ui"
import { ArrowRight, Combine, Download, Smartphone, BarChart3, Zap, Shield, Users } from "lucide-react"
import Image from "next/image"
import React from "react"
import instaLabel from "@/assets/images/instaLabel.png"
import { motion } from "framer-motion"
import Link from "next/link"

export const Hero = () => {
  return (
    <section className="relative flex flex-col md:flex-row min-h-screen items-center overflow-hidden px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 py-16 mt-12 sm:mt-16 md:mt-20 gap-8 md:gap-16">
      {/* Enhanced Background blobs */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-20 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-20 blur-3xl" />
      <div className="absolute right-[20%] top-[60%] isolate -z-10 h-64 w-64 rounded-full bg-purple-400 opacity-15 blur-3xl" />

      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-8 md:gap-16 md:flex-row">
        {/* Product Image with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[260px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[500px] mb-4 md:mb-0"
        >
          <div className="relative">
            <Image
              src={instaLabel}
              alt="InstaLabel Kitchen Labeling System - Professional Food Safety Labels and Thermal Printer"
              className="w-full object-contain transition duration-300 hover:-rotate-2 hover:scale-105"
              priority
            />
            {/* Floating elements around the image */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg border border-purple-200"
            >
              <Zap className="h-6 w-6 text-purple-600" />
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg border border-purple-200"
            >
              <Shield className="h-6 w-6 text-green-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Hero Text + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-xl space-y-6 sm:space-y-8 text-center md:text-left"
        >
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-xs sm:text-sm font-semibold text-purple-800 ring-1 ring-purple-200 shadow-sm">
          👌 One of the Best Kitchen Labeling Systems in the UK
          </div>

          <div className="space-y-2 sm:space-y-4">
            <h1 className="font-accent text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-gray-900">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Revolutionize
              </span>
              <br className="hidden md:block" />
              <span className="text-gray-900">Your Kitchen</span>
            </h1>
            <p className="text-lg sm:text-2xl font-bold text-purple-600">
              Professional Labeling • Smart Analytics • Zero Hassle
            </p>
          </div>

          <p className="max-w-xl text-base sm:text-lg text-gray-600 leading-relaxed">
          The future of food labeling is here, use instalable to eliminate handwritten labels, 
            ensure HACCP compliance, and boost kitchen efficiency. Print seamlessly from 
            web dashboard or Sunmi devices with real-time analytics.
          </p>

          {/* Enhanced Key Benefits */}
          <div className="grid grid-cols-1 gap-2 sm:gap-4 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-gray-700 md:justify-start bg-white/50 rounded-lg p-2 sm:p-3 border border-purple-100">
              <div className="bg-purple-100 p-1 sm:p-2 rounded-full">
                <Download className="h-4 w-4 text-purple-600" />
              </div>
              <span>Web Dashboard</span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-gray-700 md:justify-start bg-white/50 rounded-lg p-2 sm:p-3 border border-purple-100">
              <div className="bg-purple-100 p-1 sm:p-2 rounded-full">
                <Smartphone className="h-4 w-4 text-purple-600" />
              </div>
              <span>Sunmi Devices</span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-gray-700 md:justify-start bg-white/50 rounded-lg p-2 sm:p-3 border border-purple-100">
              <div className="bg-purple-100 p-1 sm:p-2 rounded-full">
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </div>
              <span>Real-time Analytics</span>
            </div>
          </div>

          {/* Enhanced Social proof */}
          <div className="space-y-2 sm:space-y-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-2 sm:p-4 border border-purple-200">
            <p className="text-xs sm:text-sm italic text-gray-600">
              "We used to handwrite 50+ labels daily. Now we just tap and print with the bridge app." 
              <span className="font-semibold text-purple-600"> – Head Chef, Noodle Bar, Bournemouth</span>
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2 sm:pt-4 md:justify-start">
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 sm:px-8 py-2 sm:py-4 text-white hover:from-purple-700 hover:to-pink-700 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/register">
                Start Free Trial
              </Link>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/printbridge">
              <Button variant="outline" size="sm" >
                <Combine className="mr-2 h-5 w-5" />
                Learn About PrintBridge
              </Button>
            </Link>
          </div>

          {/* Enhanced Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 sm:pt-4 text-xs sm:text-sm text-gray-600 md:justify-start">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Free 14-day trial
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Local bridge app included
            </span>
          </div>
        </motion.div>
      </div>
      {/* Bottom fade overlay */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-12 sm:h-24 z-0" style={{background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)'}} />
    </section>
  )
}

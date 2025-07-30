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
    <section className="relative flex flex-col-reverse md:flex-row min-h-screen items-center overflow-hidden px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-32 pb-16" style={{ minHeight: '100vh' }}>
      {/* Enhanced Background blobs */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-20 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-20 blur-3xl" />
      <div className="absolute right-[20%] top-[60%] isolate -z-10 h-64 w-64 rounded-full bg-purple-400 opacity-15 blur-3xl" />

      <div className="container relative z-10 mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-10 h-full">
        {/* Left: Product Image (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full flex-[1.2] max-w-none mb-2 md:mb-0 flex items-center justify-center"
        >
          <div className="relative w-full max-w-[800px]">
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
        {/* Right: Content (headline, subheadline, CTAs, etc.) */}
        <div className="w-full max-w-xl space-y-6 text-center md:text-left flex-1">
          {/* Headline block with tagline */}
          <div>
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200 mb-1">
              Fast, Compliant, Hassle-Free
            </div>
            <h1 className="font-accent text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mt-0">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Fast, Compliant Kitchen Labels — Without the Hassle
              </span>
            </h1>
          </div>
          {/* Power Statement */}
          <div className="text-sm sm:text-base font-semibold text-purple-700 mt-2 mb-1">
            From PPDS to prep — get compliant labels in seconds, not hours.
          </div>
          {/* Key Benefits (Visual with Icons) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-2 py-1">
            <div className="flex items-start gap-2">
              <span className="text-lg">🧾</span>
              <div>
                <div className="font-bold text-gray-900 text-sm">Built-in Label Templates</div>
                <div className="text-xs text-gray-600">Prep, Cook, Use-First, and PPDS — ready out of the box.</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <div className="font-bold text-gray-900 text-sm">Allergen Highlighting</div>
                <div className="text-xs text-gray-600">Stay compliant with Natasha’s Law — no missed ingredients.</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📆</span>
              <div>
                <div className="font-bold text-gray-900 text-sm">Auto Expiry Tracking</div>
                <div className="text-xs text-gray-600">Know exactly when food was prepped, cooked, or defrosted.</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🔌</span>
              <div>
                <div className="font-bold text-gray-900 text-sm">Works With Any USB Printer</div>
                <div className="text-xs text-gray-600">No fancy hardware needed — plug in and go.</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📱</span>
              <div>
                <div className="font-bold text-gray-900 text-sm">Print from Sunmi Devices</div>
                <div className="text-xs text-gray-600">Mobile kitchen? Our Android app makes it portable.</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🧑‍🍳</span>
              <div>
                <div className="font-bold text-gray-900 text-sm">Designed for Real Kitchens</div>
                <div className="text-xs text-gray-600">Print logs, override expiry dates, and queue up multiple labels — all in one dashboard.</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🔄</span>
              <div>
                <div className="font-bold text-gray-900 text-sm">Smart Square Integration</div>
                <div className="text-xs text-gray-600">Bidirectional sync with smart allergen detection & safe create-only mode.</div>
              </div>
            </div>
          </div>
          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2 justify-center md:justify-start mt-2">
            <Link href="/bookdemo">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                Book Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="border-2 border-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 font-semibold transition-all duration-300">
                Start Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Bottom fade overlay */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-12 sm:h-24 z-0" style={{background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)'}} />
    </section>
  )
}

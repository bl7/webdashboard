"use client"

import { Button } from "@/components/ui"
import { ArrowRight, Download, Wifi, Shield } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export const PrintBridgeHero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 py-16">
      {/* Background elements */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-10 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-10 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-10 blur-3xl" />

      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl space-y-6 text-center md:text-left"
        >
          <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
            <Wifi className="mr-2 h-4 w-4" />
            Local Bridge Technology
          </div>

          <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            <span className="text-purple-600">Seamless Printing</span>
            <br className="hidden md:block" />
            <span className="">From Web to Printer</span>
          </h1>

          <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
            PrintBridge is our lightweight local bridge app that connects your web dashboard directly to your thermal printers. 
            No complex network setup, no cloud dependencies - just instant, reliable printing for your kitchen labels.
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <Shield className="h-4 w-4 text-purple-600" />
              <span>Local & Secure</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <Download className="h-4 w-4 text-purple-600" />
              <span>One-Click Setup</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <Wifi className="h-4 w-4 text-purple-600" />
              <span>Always Connected</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
            <Button size="lg" className="bg-purple-600 px-6 py-3 text-white hover:bg-purple-700">
              <Link href="/register">
                Start Free Trial
              </Link>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="border-purple-200 text-purple-700 hover:bg-purple-50">
              <Download className="mr-2 h-4 w-4" />
              Download PrintBridge
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-500 md:justify-start">
            <span>✓ Works with any thermal printer</span>
            <span>✓ No internet required for printing</span>
            <span>✓ Automatic reconnection</span>
          </div>
        </motion.div>

        {/* Visual Representation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="relative">
            {/* Web Dashboard Mockup */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-xs text-gray-500">InstaLabel Dashboard</div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-purple-100 rounded"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>

            {/* Connection Line */}
            <div className="absolute left-1/2 top-full h-16 w-0.5 bg-purple-300 transform -translate-x-1/2"></div>

            {/* PrintBridge App */}
            <div className="absolute left-1/2 top-full mt-16 transform -translate-x-1/2">
              <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-3 shadow-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
                  <Wifi className="h-4 w-4" />
                  PrintBridge
                </div>
                <div className="mt-1 text-xs text-purple-600">Connected</div>
              </div>
            </div>

            {/* Connection Line to Printer */}
            <div className="absolute left-1/2 top-full mt-32 h-16 w-0.5 bg-purple-300 transform -translate-x-1/2"></div>

            {/* Printer */}
            <div className="absolute left-1/2 top-full mt-48 transform -translate-x-1/2">
              <div className="rounded-lg border border-gray-300 bg-gray-100 p-3 shadow-lg">
                <div className="text-sm font-medium text-gray-700">Thermal Printer</div>
                <div className="text-xs text-gray-500">Ready to Print</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 
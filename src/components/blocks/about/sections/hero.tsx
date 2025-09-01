"use client"

import React from "react"
import { Users, Heart, ArrowRight, Smartphone, BarChart3, Target } from "lucide-react"
import { Button } from "@/components/ui"
import Link from "next/link"
import { motion } from "framer-motion"

export const AboutHero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
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
            <Heart className="mr-2 h-4 w-4" />
            Built by Kitchen Staff, for Kitchen Staff
          </div>

          <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            <span className="text-purple-600">Smart Labeling That</span>
            <br className="hidden md:block" />
            <span className="">Works.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            We built InstaLabel to remove chaos from food labeling — and help you stay training
            needed. Print from web dashboard or mobile devices, track usage with real-time
            analytics, and optimize your kitchen operations with comprehensive reporting.
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <Users className="h-4 w-4 text-purple-600" />
              <span>Kitchen-Tested</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <Smartphone className="h-4 w-4 text-purple-600" />
              <span>Mobile Compatible</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span>Smart Analytics</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
            <Button size="lg" className="bg-purple-600 px-8 py-3 text-white hover:bg-purple-700">
              <Link href="/register">Start Free Trial</Link>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-500 md:justify-start">
            <span>✓ Free 14-day trial</span>
            <span>✓ No credit card required</span>
            <span>✓ Mobile Compatible</span>
          </div>
        </motion.div>

        {/* Visual Representation - Team Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="relative">
            {/* Team Members */}
            <div className="space-y-4">
              {/* Chef */}
              <div className="rounded-lg border-l-4 border-purple-500 bg-white p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Head Chef</h4>
                    <p className="text-sm text-gray-600">15+ years experience</p>
                  </div>
                </div>
              </div>

              {/* Kitchen Manager */}
              <div className="ml-4 rounded-lg border-l-4 border-purple-500 bg-white p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Kitchen Manager</h4>
                    <p className="text-sm text-gray-600">Operations expert</p>
                  </div>
                </div>
              </div>

              {/* Development Team */}
              <div className="ml-8 rounded-lg border-l-4 border-green-500 bg-white p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Development Team</h4>
                    <p className="text-sm text-gray-600">Tech meets hospitality</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            {/* <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-xs text-gray-600">Kitchens</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">1M+</div>
                <div className="text-xs text-gray-600">Labels Printed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">99.9%</div>
                <div className="text-xs text-gray-600">Uptime</div>
              </div>
            </div> */}
          </div>
        </motion.div>
      </div>
      {/* Bottom fade overlay */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)" }}
      />
    </section>
  )
}

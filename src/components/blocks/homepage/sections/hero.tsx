"use client"

import { Button } from "@/components/ui"
import { ArrowRight, StepForward } from "lucide-react"
import Image from "next/image"
import React from "react"
import instaLabel from "@/assets/images/instaLabel.png"
import { motion } from "framer-motion"
import Link from "next/link"
export const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 sm:px-6 md:px-12 lg:px-16 bg-white py-16">
      {/* Background blobs (standardized) */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-15 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-15 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-15 blur-3xl" />

      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[380px] sm:max-w-[480px] md:max-w-[500px] lg:max-w-[600px]"
        >
          <Image
            src={instaLabel}
            alt="InstaLabel Kitchen Labeling System - Professional Food Safety Labels and Thermal Printer"
            className="w-full object-contain transition duration-300 hover:-rotate-3 hover:scale-105"
            priority
          />
        </motion.div>

        {/* Hero Text + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-2xl space-y-6 text-center md:text-left"
        >
          <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            <span className="text-primary">Professional Kitchen Labeling System</span>
            <br className="hidden md:block" />
            <span className="">Food Safety Labels & Expiry Tracking</span>
          </h1>

          <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
            InstaLabel: The #1 kitchen labeling system for restaurants, cafes, and food businesses. Print HACCP-compliant food safety labels, allergen warnings, expiry dates, and prep labels instantly with thermal printers. No training needed.
          </p>

          {/* Social proof */}
          <div className="space-y-2">
            <p className="text-sm italic text-gray-500 md:text-base">
              "We used to handwrite 50+ labels daily. Now we just tap and print." – Head Chef, Manchester
            </p>
            <p className="text-xs text-gray-400">
              Trusted by 500+ restaurants • HACCP Compliant • Thermal Printer Compatible
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
            <Button  size="lg" className="bg-primary px-6 py-3 text-white hover:bg-primary/90">
              <Link href="/register">
                Start Free Trial
              </Link>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link href="https://www.youtube.com/@brownDdude">
            <Button variant="ghost" size="lg" className="border border-primary text-primary">
              
                <StepForward className="mr-2 h-5 w-5" />
                Watch Demo
            </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-500 md:justify-start">
            <span>✓ Free 14-day trial</span>
            <span>✓ No credit card required</span>
            <span>✓ Setup in 5 minutes</span>
          </div>
        </motion.div>
      </div>
      {/* Bottom fade overlay */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 z-0" style={{background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)'}} />
    </section>
  )
}

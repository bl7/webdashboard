"use client"

import { Button } from "@/components/ui"
import { ArrowRight, StepForward } from "lucide-react"
import Image from "next/image"
import React from "react"
import instaLabel from "@/assets/images/instaLabel.png"
import { motion } from "framer-motion"

export const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 sm:px-6 md:px-12 lg:px-16">
      {/* Floating Orb Accent */}
      <motion.div
        className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

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
            alt="InstaLabel Printer"
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
            <span className="text-primary">InstaLabel:</span>
            <br className="hidden md:block" />
            <span className="">Smart Labelling Built for Fast-Paced Kitchens</span>
          </h1>

          <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
            Kitchen-safe labels for prep, cook, and allergen tracking — printed at the tap of a
            button. No training needed. No handwriting. No guesswork.
          </p>

          {/* Optional: real-world quote */}
          <p className="text-sm italic text-gray-500 md:text-base">
            “We used to handwrite 50+ labels daily. Now we just tap and print.” – Head Chef,
            Manchester
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
            <Button size="lg" className="bg-primary px-6 py-3 text-white hover:bg-primary/90">
              Book a Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" size="lg" className="border border-primary text-primary">
              <StepForward className="mr-2 h-5 w-5" />
              Start Free
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

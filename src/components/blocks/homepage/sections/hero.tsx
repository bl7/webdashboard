"use client"

import { Button } from "@/components/ui"
import { ArrowRight, PlayCircle } from "lucide-react"
import Image from "next/image"
import React from "react"
import instaLabel from "@/assets/images/instaLabel.png"
import { motion } from "framer-motion"

export const Hero = () => {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
      {/* Animated Orb */}
      <motion.div
        className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row md:gap-0">
        {/* Left: Product Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex w-full max-w-md items-center justify-center md:max-w-lg"
        >
          <Image
            src={instaLabel}
            alt="InstaLabel Printer"
            className="mx-auto h-[70vh] w-full max-w-[700px] object-contain transition duration-300 hover:-rotate-3 hover:scale-105"
          />
        </motion.div>

        {/* Right: Text + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="flex max-w-2xl flex-col items-start justify-center text-center md:text-left"
        >
          <h1 className="font-accent text-5xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl">
            InstaLabel:
            <br />
            Your Kitchen’s
            <br />
            Compliance Sidekick
          </h1>

          <p className="mt-6 text-lg text-primary-foreground sm:text-xl md:text-2xl">
            Print prep, cooked, and allergen labels in seconds — fully EHO and Natasha’s Law
            compliant.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Button
              size="lg"
              className="bg-white px-6 py-3 text-base text-primary hover:bg-white/90"
            >
              Book a Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" size="lg" className="border border-white text-white">
              <PlayCircle className="mr-2 h-5 w-5" />
              Explore Features
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

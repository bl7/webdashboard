"use client"

import { Button } from "@/components/ui"
import {
  ArrowRight,
  Combine,
  Download,
  Smartphone,
  BarChart3,
  Zap,
  Shield,
  Users,
} from "lucide-react"
import Image from "next/image"
import React from "react"
import instaLabel3 from "@/assets/images/instalabel3.png"
import { motion } from "framer-motion"
import Link from "next/link"
import { DemoRequestModal } from "./WaitlistModal"

export const Hero = () => {
  return (
    <section
      className="relative flex min-h-screen flex-col-reverse items-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 pb-16 pt-32 sm:px-6 md:flex-row md:px-12 lg:px-16"
      style={{ minHeight: "100vh" }}
    >
      {/* Enhanced Background blobs */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-20 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-20 blur-3xl" />
      <div className="absolute right-[20%] top-[60%] isolate -z-10 h-64 w-64 rounded-full bg-purple-400 opacity-15 blur-3xl" />

      <div className="container relative z-10 mx-auto flex h-full flex-col-reverse items-center justify-between gap-6 md:flex-row md:gap-10">
        {/* Left: Product Image (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2 flex w-full max-w-none flex-[1.2] items-center justify-center md:mb-0"
        >
          <div className="relative flex w-full max-w-[800px] justify-center">
            <Image
              src={instaLabel3}
              alt="InstaLabel Kitchen Labeling System - Professional Food Safety Labels and Thermal Printer"
              className="w-full max-w-[660px] object-contain transition duration-300 hover:scale-105"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
            />
            {/* Floating elements around the image */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 -top-4 rounded-full border border-purple-200 bg-white p-3 shadow-lg"
            >
              <Zap className="h-6 w-6 text-purple-600" />
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 rounded-full border border-purple-200 bg-white p-3 shadow-lg"
            >
              <Shield className="h-6 w-6 text-green-600" />
            </motion.div>
          </div>
        </motion.div>
        {/* Right: Content (headline, subheadline, CTAs, etc.) */}
        <div className="w-full max-w-xl flex-1 space-y-6 text-center md:text-left">
          {/* Headline block with tagline */}
          <div>
            <div className="mb-1 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200">
              Fast, Compliant, Hassle-Free
            </div>
            <h1 className="mt-0 font-accent text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Fast, Compliant Kitchen Labels — Without the Hassle
              </span>
            </h1>
          </div>
          {/* Power Statement */}
          <div className="mb-1 mt-2 text-sm font-semibold text-purple-700 sm:text-base">
            From PPDS to prep — get EHO and Food Safety compliant labels in seconds, not hours.
          </div>
          {/* Key Benefits (Visual with Icons) */}
          <div className="grid grid-cols-1 gap-3 py-1 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
            <div className="flex items-start gap-2">
              <span className="text-lg">🧾</span>
              <div>
                <div className="text-sm font-bold text-gray-900">Built-in Label Templates</div>
                <div className="text-xs text-gray-600">
                  Prep, Cook, Use-First, and PPDS — ready out of the box.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <div className="text-sm font-bold text-gray-900">Allergen Highlighting</div>
                <div className="text-xs text-gray-600">
                  Stay compliant with Natasha’s Law — no missed ingredients.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📆</span>
              <div>
                <div className="text-sm font-bold text-gray-900">Auto Expiry Tracking</div>
                <div className="text-xs text-gray-600">
                  Know exactly when food was prepped, cooked, or defrosted.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🔌</span>
              <div>
                <div className="text-sm font-bold text-gray-900">Works With Any USB Printer</div>
                <div className="text-xs text-gray-600">
                  No fancy hardware needed — plug in and go.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📱</span>
              <div>
                <div className="text-sm font-bold text-gray-900">Print from Android Devices</div>
                <div className="text-xs text-gray-600">
                  Mobile kitchen? Our Android app makes it portable.
                </div>
              </div>
            </div>
            {/* <div className="flex items-start gap-2">
              <span className="text-lg">🧑‍🍳</span>
              <div>
                <div className="text-sm font-bold text-gray-900">Designed for Real Kitchens</div>
                <div className="text-xs text-gray-600">
                  Print logs, override expiry dates, and queue up multiple labels — all in one
                  dashboard.
                </div>
              </div>
            </div> */}
            <div className="flex items-start gap-2">
              <span className="text-lg">🔄</span>
              <div>
                <div className="text-sm font-bold text-gray-900">Smart Square Integration</div>
                <div className="text-xs text-gray-600">
                  Bidirectional sync with smart allergen detection & safe create-only mode.
                </div>
              </div>
            </div>
          </div>
          {/* CTAs */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start">
            <Link href="/bookdemo">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
              >
                Book Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-purple-200 font-semibold text-purple-700 transition-all duration-300 hover:border-purple-600 hover:bg-purple-600 hover:text-white"
              >
                Start Trial
              </Button>
            </Link>
          </div>

          {/* Waitlist Link */}
          <div className="mt-3 text-center md:text-left">
            <Button
              variant="link"
              className="text-sm text-purple-600 hover:text-purple-800"
              onClick={() => {
                // Trigger the demo modal
                const event = new CustomEvent("openDemoModal")
                window.dispatchEvent(event)
              }}
            >
              Request a Demo →
            </Button>
          </div>
        </div>
      </div>
      {/* Bottom fade overlay */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-12 w-full sm:h-24"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)" }}
      />

      {/* Demo Request Modal */}
      <DemoRequestModal />
    </section>
  )
}

"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui"
import { ArrowRight, Package, Printer, CreditCard } from "lucide-react"
import { FaLinkedin, FaFacebook, FaXTwitter, FaInstagram } from "react-icons/fa6"

// CTA + Footer
export const Footer = () => {
  return (
    <>
      {/* Redesigned CTA Section with lighter purple and label ordering feature */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 px-6 py-24 text-gray-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, purple 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="container relative z-10 mx-auto max-w-6xl space-y-12 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                Ready to simplify
              </span>
              <br />
              <span className="text-gray-900">your kitchen labeling?</span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-700">
              EHO-compliant labels. Natasha's Law ready. No training required. Works with your
              existing Epson printer and Sunmi devices.
            </p>
          </div>

          {/* Label Ordering Feature Highlight */}
          <div className="rounded-3xl border border-purple-200/50 bg-white/60 p-8 shadow-xl backdrop-blur-sm">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Order Labels Directly</h3>
                <p className="text-gray-600">
                  Order professional labels right from your dashboard with just a few clicks
                </p>
              </div>

              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600">
                  <Printer className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Print Instantly</h3>
                <p className="text-gray-600">
                  Print labels immediately or save for later - your choice
                </p>
              </div>

              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Secure Payment</h3>
                <p className="text-gray-600">
                  Safe, encrypted payments with instant order confirmation
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced testimonial */}
          <blockquote className="mx-auto max-w-xl rounded-2xl border border-purple-200/50 bg-white/60 p-6 text-lg italic text-gray-700 backdrop-blur-sm">
            "InstaLabel changed the way our kitchen runs. We're more compliant, more efficient, and
            wasting less."
            <br />
            <span className="font-semibold not-italic text-gray-900">
              – Head Chef, Korean Fried Chicken, Prakash Chhetri
            </span>
          </blockquote>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Link href="/register">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/bookdemo">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-purple-300 px-8 py-4 text-lg font-semibold text-purple-700 transition-all duration-300 hover:scale-105 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-800"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer Section */}
      <footer className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 pt-10 text-sm text-white">
        <div className="container grid grid-cols-1 gap-8 px-4 pb-8 md:grid-cols-5">
          {/* Logo + Description */}
          <div className="space-y-3">
            <div className="relative">
              <Image
                src="/long_longwhite.png"
                width={140}
                height={30}
                alt="instalabel logo"
                className="drop-shadow-lg"
              />
            </div>
            <p className="max-w-xs text-xs leading-snug text-white/70">
              Smart, simple kitchen labeling for food safety, compliance, and efficiency — all in
              one app. Print from web dashboard or Sunmi devices with real-time analytics.
            </p>
          </div>

          {/* Learn Links */}
          <div className="space-y-3">
            <h3 className="border-b border-purple-400/30 pb-1 text-base font-semibold text-white">
              Learn
            </h3>
            <nav className="flex flex-col gap-2 text-xs text-white/80">
              <Link
                href="/uses"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                Kitchen Labeling Uses
              </Link>
              <Link
                href="/features"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                Features & Benefits
              </Link>
              <Link
                href="/printbridge"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                PrintBridge Technology
              </Link>
              <Link
                href="/square-integration"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                Square Integration
              </Link>
              <Link
                href="/allergen-compliance"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                Allergen Compliance Kit
              </Link>
              <Link
                href="/allergen-guide"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                UK 14 Allergens Guide
              </Link>
              <Link
                href="/faqs"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                Frequently Asked Questions
              </Link>
              <Link
                href="/blog"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                Kitchen Labeling Blog
              </Link>
            </nav>
          </div>

          {/* Business Links */}
          <div className="space-y-3">
            <h3 className="border-b border-purple-400/30 pb-1 text-base font-semibold text-white">
              Business
            </h3>
            <nav className="flex flex-col gap-2 text-xs text-white/80">
              <Link
                href="/plan"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                Pricing Plans
              </Link>
              <Link
                href="/bookdemo"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                Book Free Demo
              </Link>
              <Link
                href="/about"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                About InstaLabel
              </Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="border-b border-purple-400/30 pb-1 text-base font-semibold text-white">
              Legal
            </h3>
            <nav className="flex flex-col gap-2 text-xs text-white/80">
              <Link
                href="/privacy-policy"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookie-policy"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                Cookie Policy
              </Link>
              <Link
                href="/terms"
                className="transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
              >
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Contact + Socials */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="border-b border-purple-400/30 pb-1 text-base font-semibold text-white">
                Contact
              </h3>
              <div className="space-y-1 text-xs text-white/80">
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                  Bournemouth, England
                </p>
                <Link
                  href="mailto:contact@instalabel.co"
                  className="block transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
                >
                  contact@instalabel.co
                </Link>
                <Link
                  href="tel:+447405924790"
                  className="block transition-all duration-300 hover:translate-x-1 hover:text-purple-300"
                >
                  +44 7405 924790
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="border-b border-purple-400/30 pb-1 text-base font-semibold text-white">
                Follow Us
              </h3>
              <div className="flex gap-3">
                <Link
                  href="#"
                  className="group rounded-full bg-purple-800/50 p-2 transition-all duration-300 hover:scale-105 hover:bg-purple-700"
                  aria-label="Follow us on Twitter"
                >
                  <FaXTwitter className="h-4 w-4 text-white transition-colors duration-300 group-hover:text-sky-400" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="#"
                  className="group rounded-full bg-purple-800/50 p-2 transition-all duration-300 hover:scale-105 hover:bg-purple-700"
                  aria-label="Follow us on Instagram"
                >
                  <FaInstagram className="h-4 w-4 text-white transition-colors duration-300 group-hover:text-pink-400" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="#"
                  className="group rounded-full bg-purple-800/50 p-2 transition-all duration-300 hover:scale-105 hover:bg-purple-700"
                  aria-label="Follow us on Facebook"
                >
                  <FaFacebook className="h-4 w-4 text-white transition-colors duration-300 group-hover:text-blue-400" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="#"
                  className="group rounded-full bg-purple-800/50 p-2 transition-all duration-300 hover:scale-105 hover:bg-purple-700"
                  aria-label="Follow us on LinkedIn"
                >
                  <FaLinkedin className="h-4 w-4 text-white transition-colors duration-300 group-hover:text-blue-500" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-purple-700/50 py-3">
          <div className="container px-4 text-center text-xs text-white/50">
            <p>&copy; 2024 InstaLabel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

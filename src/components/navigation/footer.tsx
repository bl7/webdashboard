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
      <section className="bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 px-6 py-24 text-gray-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, purple 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="container mx-auto max-w-6xl space-y-12 text-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                Ready to simplify
              </span>
              <br />
              <span className="text-gray-900">your kitchen labeling?</span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-700 leading-relaxed">
              EHO-compliant labels. Natasha's Law ready. No training required. Works with your
              existing Epson printer and Sunmi devices.
            </p>
          </div>

          {/* Label Ordering Feature Highlight */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-purple-200/50 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Order Labels Directly</h3>
                <p className="text-gray-600">Order professional labels right from your dashboard with just a few clicks</p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Printer className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Print Instantly</h3>
                <p className="text-gray-600">Print labels immediately or save for later - your choice</p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Secure Payment</h3>
                <p className="text-gray-600">Safe, encrypted payments with instant order confirmation</p>
              </div>
            </div>
          </div>

          {/* Enhanced testimonial */}
          <blockquote className="mx-auto max-w-xl italic text-gray-700 text-lg bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50">
            "InstaLabel changed the way our kitchen runs. We're more compliant, more efficient, and
            wasting less."
            <br />
            <span className="font-semibold not-italic text-gray-900">– Head Chef, Local Deli Group</span>
          </blockquote>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Link href="/register">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/bookdemo">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-400 transition-all duration-300 hover:scale-105">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer Section */}
      <footer className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 pt-10 text-white text-sm">
        <div className="container grid grid-cols-1 gap-8 px-4 pb-8 md:grid-cols-4">
          {/* Logo + Description */}
          <div className="space-y-3">
            <div className="relative">
              <Image src="/long_longwhite.png" width={140} height={30} alt="instalabel logo" className="drop-shadow-lg" />
            </div>
            <p className="text-xs text-white/70 leading-snug max-w-xs">
              Smart, simple kitchen labeling for food safety, compliance, and efficiency — all in
              one app. Print from web dashboard or Sunmi devices with real-time analytics.
            </p>
          </div>

          {/* Learn Links */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white border-b border-purple-400/30 pb-1">Learn</h3>
            <nav className="flex flex-col gap-2 text-xs text-white/80">
              <Link href="/" className="hover:text-purple-300 transition-all duration-300 hover:translate-x-1">Home</Link>
              <Link href="/features" className="hover:text-purple-300 transition-all duration-300 hover:translate-x-1">Features</Link>
              <Link href="/plan" className="hover:text-purple-300 transition-all duration-300 hover:translate-x-1">Pricing</Link>
              <Link href="/faqs" className="hover:text-purple-300 transition-all duration-300 hover:translate-x-1">FAQs</Link>
              <Link href="/blog" className="hover:text-purple-300 transition-all duration-300 hover:translate-x-1">Blogs</Link>
              <Link href="/allergen-compliance" className="hover:text-purple-300 transition-all duration-300 hover:translate-x-1">Allergen Compliance</Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white border-b border-purple-400/30 pb-1">Legal</h3>
            <nav className="flex flex-col gap-2 text-xs text-white/80">
              <Link href="/privacy-policy" className="hover:text-purple-300 transition-all duration-300 hover:translate-x-1">Privacy Policy</Link>
              <Link href="/cookie-policy" className="hover:text-purple-300 transition-all duration-300 hover:translate-x-1">Cookie Policy</Link>
              <Link href="/terms" className="hover:text-purple-300 transition-all duration-300 hover:translate-x-1">Terms of Service</Link>
            </nav>
          </div>

          {/* Contact + Socials */}
            <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-white border-b border-purple-400/30 pb-1">Contact</h3>
              <div className="space-y-1 text-xs text-white/80">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  Bournemouth, England
                </p>
                <Link href="mailto:contact@instalabel.co" className="hover:text-purple-300 transition-all duration-300 hover:translate-x-1 block">
                  contact@instalabel.co
                </Link>
                <Link href="tel:+447405924790" className="hover:text-purple-300 transition-all duration-300 hover:translate-x-1 block">
                  +44 7405 924790
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-semibold text-white border-b border-purple-400/30 pb-1">Follow Us</h3>
              <div className="flex gap-3">
                <Link href="#" className="group p-2 rounded-full bg-purple-800/50 hover:bg-purple-700 transition-all duration-300 hover:scale-105">
                  <FaXTwitter className="h-4 w-4 text-white group-hover:text-sky-400 transition-colors duration-300" />
                </Link>
                <Link href="#" className="group p-2 rounded-full bg-purple-800/50 hover:bg-purple-700 transition-all duration-300 hover:scale-105">
                  <FaInstagram className="h-4 w-4 text-white group-hover:text-pink-400 transition-colors duration-300" />
                </Link>
                <Link href="#" className="group p-2 rounded-full bg-purple-800/50 hover:bg-purple-700 transition-all duration-300 hover:scale-105">
                  <FaFacebook className="h-4 w-4 text-white group-hover:text-blue-400 transition-colors duration-300" />
                </Link>
                <Link href="#" className="group p-2 rounded-full bg-purple-800/50 hover:bg-purple-700 transition-all duration-300 hover:scale-105">
                  <FaLinkedin className="h-4 w-4 text-white group-hover:text-blue-500 transition-colors duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-purple-700/50 mt-6 py-3">
          <div className="container px-4 text-center text-xs text-white/50">
            <p>&copy; 2024 InstaLabel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

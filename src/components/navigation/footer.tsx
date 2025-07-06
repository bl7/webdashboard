"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui"
import { ArrowRight } from "lucide-react"
import { FaLinkedin, FaFacebook, FaXTwitter, FaInstagram } from "react-icons/fa6"

// CTA + Footer
export const Footer = () => {
  return (
    <>
      {/* Enhanced CTA Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 px-6 py-24 text-white">
        <div className="container mx-auto max-w-5xl space-y-8 text-center">
          <h2 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Ready to simplify
            </span>
            <br />
            <span className="text-white">your kitchen labeling?</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-white/90 leading-relaxed">
            EHO-compliant labels. Natasha's Law ready. No training required. Works with your
            existing Epson printer and Sunmi devices.
          </p>

          {/* Enhanced testimonial */}
          <blockquote className="mx-auto max-w-xl italic text-white/80 text-lg">
            "InstaLabel changed the way our kitchen runs. We're more compliant, more efficient, and
            wasting less."
            <br />
            <span className="font-semibold not-italic text-white">– Head Chef, Local Deli Group</span>
          </blockquote>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Link href="/register">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/bookdemo">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 text-lg font-semibold transition-all duration-300">
                Book Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer Section */}
      <footer className="bg-black pt-20 text-white">
        <div className="container grid grid-cols-1 gap-12 px-6 pb-12 md:grid-cols-4">
          {/* Logo + Description */}
          <div className="space-y-4">
            <Image src="/long_longwhite.png" width={180} height={40} alt="instalabel logo" />
            <p className="text-sm text-white/80 leading-relaxed">
              Smart, simple kitchen labeling for food safety, compliance, and efficiency — all in
              one app. Print from web dashboard or Sunmi devices with real-time analytics.
            </p>
          </div>

          {/* Learn Links */}
          <div>
            <p className="mb-4 font-bold text-lg">Learn</p>
            <nav className="flex flex-col gap-3 text-sm text-white/80">
              <Link href="/" className="hover:text-purple-300 transition-colors duration-200">Home</Link>
              <Link href="/features" className="hover:text-purple-300 transition-colors duration-200">Features</Link>
              <Link href="/plan" className="hover:text-purple-300 transition-colors duration-200">Pricing</Link>
              <Link href="/faqs" className="hover:text-purple-300 transition-colors duration-200">FAQs</Link>
              <Link href="/blog" className="hover:text-purple-300 transition-colors duration-200">Blogs</Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <p className="mb-4 font-bold text-lg">Legal</p>
            <nav className="flex flex-col gap-3 text-sm text-white/80">
              <Link href="/privacy-policy" className="hover:text-purple-300 transition-colors duration-200">Privacy Policy</Link>
              <Link href="/cookie-policy" className="hover:text-purple-300 transition-colors duration-200">Cookie Policy</Link>
              <Link href="/terms" className="hover:text-purple-300 transition-colors duration-200">Terms of Service</Link>
            </nav>
          </div>

          {/* Contact + Socials */}
          <div className="space-y-6">
            <p className="font-bold text-lg">Contact</p>
            <div className="space-y-2 text-sm text-white/80">
              <p>Bournemouth, England</p>
              <Link href="mailto:contact@instalabel.co" className="hover:text-purple-300 transition-colors duration-200">contact@instalabel.co</Link>
              <Link href="tel:+447405924790" className="hover:text-purple-300 transition-colors duration-200">+44 7405 924790</Link>
            </div>

            <div>
              <p className="mb-3 font-bold text-lg">Follow Us</p>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-sky-400 transition-colors duration-200">
                  <FaXTwitter className="h-6 w-6" />
                </Link>
                <Link href="#" className="hover:text-pink-400 transition-colors duration-200">
                  <FaInstagram className="h-6 w-6" />
                </Link>
                <Link href="#" className="hover:text-purple-500 transition-colors duration-200">
                  <FaFacebook className="h-6 w-6" />
                </Link>
                <Link href="#" className="hover:text-sky-500 transition-colors duration-200">
                  <FaLinkedin className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 py-6">
          <div className="container px-6 text-center text-sm text-white/60">
            <p>&copy; 2024 InstaLabel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

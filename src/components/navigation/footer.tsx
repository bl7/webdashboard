"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Logo } from "@/assets/jsx/logo"
import { FaLinkedin, FaFacebook, FaXTwitter, FaInstagram } from "react-icons/fa6"

// CTA + Footer
export const Footer = () => {
  return (
    <>
      {/* CTA Section */}
      <section className="bg-[#2C1B4B] px-6 py-20 text-white">
        <div className="container mx-auto max-w-5xl space-y-6 text-center">
          <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
            Ready to simplify your kitchen labeling?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/90">
            EHO-compliant labels. Natasha's Law ready. No training required. Works with your
            existing Epson printer.
          </p>

          {/* Optional testimonial */}
          <blockquote className="mx-auto max-w-xl italic text-white/80">
            “InstaLabel changed the way our kitchen runs. We’re more compliant, more efficient, and
            wasting less.”
            <br />
            <span className="font-medium not-italic text-white">– Head Chef, Local Deli Group</span>
          </blockquote>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Link
              href="/book-demo"
              className="rounded-md bg-white px-6 py-3 font-semibold text-[#2C1B4B] transition hover:bg-white/90"
            >
              Book Your Free Demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-[#2C1B4B]"
            >
              Start Free Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black pt-20 text-white">
        <div className="container mx-auto grid grid-cols-1 gap-12 px-6 pb-12 md:grid-cols-4">
          {/* Logo + Description */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Logo className="h-10 w-10" />
              <h2 className="font-accent text-2xl font-bold">InstaLabel</h2>
            </div>
            <p className="text-sm text-white/80">
              Smart, simple kitchen labeling for food safety, compliance, and efficiency — all in
              one app.
            </p>
          </div>

          {/* Learn Links */}
          <div>
            <p className="mb-3 font-semibold">Learn</p>
            <nav className="flex flex-col gap-2 text-sm text-white/80">
              <Link href="/">Home</Link>
              <Link href="/features">Features</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/faqs">FAQs</Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <p className="mb-3 font-semibold">Legal</p>
            <nav className="flex flex-col gap-2 text-sm text-white/80">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/cookie-policy">Cookie Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </nav>
          </div>

          {/* Contact + Socials */}
          <div className="space-y-4">
            <p className="font-semibold">Contact</p>
            <div className="space-y-1 text-sm text-white/80">
              <p>Bournemouth, England</p>
              <Link href="mailto:contact@instalabel.co">contact@instalabel.co</Link>
              <Link href="tel:+447405924790">+44 7405 924790</Link>
            </div>

            <p className="mt-6 font-semibold">Follow Us</p>
            <div className="mt-2 flex gap-4">
              <Link href="#">
                <FaXTwitter className="h-6 w-6 hover:text-sky-400" />
              </Link>
              <Link href="#">
                <FaInstagram className="h-6 w-6 hover:text-pink-400" />
              </Link>
              <Link href="#">
                <FaFacebook className="h-6 w-6 hover:text-blue-500" />
              </Link>
              <Link href="#">
                <FaLinkedin className="h-6 w-6 hover:text-sky-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 text-center text-sm text-white/60">
          <p>
            &copy; {new Date().getFullYear()} InstaLabel. All Rights Reserved. Built by{" "}
            <Link
              href="https://www.nischaltimalsina.com.np"
              className="text-white hover:underline"
              target="_blank"
            >
              Nischal Timalsina
            </Link>
          </p>
        </div>
      </footer>
    </>
  )
}

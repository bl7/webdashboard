"use client"

import { Button } from "@/components/ui"
import { ArrowRight, Download, Shield, Award, Clock, CheckCircle2 } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export const AllergenComplianceHero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-32 pb-16">
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
          {/* Tagline pill */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
              <Shield className="mr-2 h-4 w-4" />
              HACCP-Compliant & EHO Approved
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="text-purple-600">Free UK Allergen</span>
              <br className="hidden md:block" />
              <span>Compliance Kit</span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
              Complete UK allergen compliance kit with 14 allergens guide, Natasha's Law checklist, and HACCP-compliant materials. Used by 500+ UK kitchens for EHO compliance.
            </p>
          </motion.div>

          {/* Key benefits grid */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>HACCP Compliant</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Award className="h-4 w-4 text-purple-600" />
                <span>EHO Approved</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Clock className="h-4 w-4 text-purple-600" />
                <span>Updated 2024</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Button size="lg" className="bg-purple-600 px-6 py-3 text-white hover:bg-purple-700">
                <Link href="/register">
                  Start Free Trial
                </Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('allergen-compliance-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Download className="mr-2 h-4 w-4" />
                Get Free Toolkit
              </Button>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-500 md:justify-start">
              <span>✓ Used by 500+ kitchens</span>
              <span>✓ Zero compliance issues</span>
              <span>✓ Normally £149 - yours free</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual Representation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="relative">
            {/* Toolkit Preview Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-xs text-gray-500">Allergen Compliance Toolkit</div>
              </div>
              
              {/* Toolkit Contents Preview */}
              <div className="space-y-3">
                {/* Visual Reference Card */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-semibold text-gray-800">14 Allergens Reference</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {['Milk', 'Eggs', 'Fish', 'Nuts'].map((allergen, i) => (
                      <div key={i} className="bg-white rounded px-2 py-1 text-[10px] text-center border">
                        {allergen}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checklist */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-semibold text-gray-800">HACCP Checklist</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-[10px] text-gray-700">Cross-contamination prevention</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-[10px] text-gray-700">Staff training template</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-[10px] text-gray-700">Emergency response protocol</span>
                    </div>
                  </div>
                </div>

                {/* Value Badge */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="text-center">
                    <div className="text-xs font-bold text-yellow-800 mb-1">FREE DOWNLOAD</div>
                    <div className="text-[10px] text-yellow-700">Normally £149 from consultants</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Bottom fade overlay */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 z-0" style={{background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)'}} />
    </section>
  )
} 
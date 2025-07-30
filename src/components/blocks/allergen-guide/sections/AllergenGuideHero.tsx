"use client"

import { Button } from "@/components/ui"
import { ArrowRight, Shield, AlertTriangle, CheckCircle2 } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export const AllergenGuideHero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-32 pb-16">
      {/* Background elements */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-10 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-10 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-10 blur-3xl" />

      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl space-y-6 text-center md:text-left"
        >
          {/* 1. Tagline pill at the top */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
              <Shield className="mr-2 h-4 w-4" />
              Complete UK Allergen Reference
            </div>
          </motion.div>

          {/* 2. Headline: two lines only, first line purple, second line black */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="text-purple-600">UK 14 Allergens</span>
              <br className="hidden md:block" />
              <span>Complete Reference Guide</span>
            </h1>
          </motion.div>

          {/* 3. Subheadline */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
              Essential reference guide for Natasha's Law compliance. Complete information on all 14 allergens, hidden sources, and cross-contamination prevention for UK food businesses.
            </p>
          </motion.div>

          {/* 4. Key benefits grid */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>EHO Compliant</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                <span>14 Allergens Covered</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <AlertTriangle className="h-4 w-4 text-purple-600" />
                <span>Hidden Sources Listed</span>
              </div>
            </div>
          </motion.div>

          {/* 5. CTAs */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Button size="lg" className="bg-purple-600 px-6 py-3 text-white hover:bg-purple-700">
                <Link href="/allergen-compliance">
                  Download Free Toolkit
                </Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Link href="#allergens-list">
                  View All Allergens
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-500 md:justify-start">
              <span>✓ Natasha's Law compliant</span>
              <span>✓ EHO approved information</span>
              <span>✓ Updated 2024</span>
            </div>
          </motion.div>
        </motion.div>

        {/* 6. Right visual: allergen reference card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="relative">
            {/* Allergen Reference Card */}
            <div className="space-y-4">
              {/* Main Reference Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">UK 14 Allergens</h3>
                  <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">
                    NATASHA'S LAW
                  </div>
                </div>
                
                {/* Allergen Grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {['1. Celery', '2. Gluten', '3. Crustaceans', '4. Eggs', '5. Fish', '6. Lupin', '7. Milk', '8. Molluscs', '9. Mustard', '10. Nuts', '11. Peanuts', '12. Sesame', '13. Soya', '14. Sulphites'].map((allergen, i) => (
                    <div key={i} className="bg-gray-50 rounded px-2 py-1 text-[10px] text-center border border-gray-200 font-medium">
                      {allergen}
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-gray-600">
                  Must be declared on all food labels
                </div>
              </div>

              {/* Checklist Card */}
              <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 ml-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-900">Compliance Checklist</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-700">All 14 allergens listed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-700">Hidden sources checked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-700">Cross-contamination prevention</span>
                  </div>
                </div>
              </div>

              {/* EHO Approval Badge */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200 ml-8">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm font-bold text-green-800">EHO Approved</div>
                    <div className="text-xs text-green-700">Compliant with UK food law</div>
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
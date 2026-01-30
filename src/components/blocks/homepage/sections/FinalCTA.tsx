"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui"
import { ArrowRight, Clock, Users, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

export const FinalCTA = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 px-4 py-24 sm:px-6 md:px-12 lg:px-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center space-y-12">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-bold text-white ring-1 ring-white/30">
              <Clock className="mr-2 h-4 w-4" />
              Limited Time: Free Setup + 14-Day Trial
            </div>
            
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
              Ready to Get Started?
            </h3>
            
            <p className="mx-auto max-w-3xl text-xl text-white/90 leading-relaxed">
              Join kitchens across the UK using InstaLabel for compliant labeling. Start your free trial today.
            </p>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Users className="h-8 w-8 text-yellow-300" />
              <div className="text-left">
                <div className="font-bold text-white">500+ Kitchens</div>
                <div className="text-sm text-white/80">Already using InstaLabel</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Star className="h-8 w-8 text-yellow-300" />
              <div className="text-left">
                <div className="font-bold text-white">Trusted by Kitchens</div>
                <div className="text-sm text-white/80">Across the UK</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <CheckCircle className="h-8 w-8 text-green-300" />
              <div className="text-left">
                <div className="font-bold text-white">High Availability</div>
                <div className="text-sm text-white/80">Reliable & secure</div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-10 py-5 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300" asChild>
              <Link href="/bookdemo">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-5 text-lg font-semibold backdrop-blur-sm transition-all duration-300" asChild>
              <Link href="/contact">
                Speak to Sales
              </Link>
            </Button>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-300" />
                No charges during trial
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-300" />
                Setup in 5 minutes
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-300" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-300" />
                UK-based support
              </span>
            </div>
            
            <div className="text-center">
              <p className="text-white/70 text-sm">
                "The setup was incredibly easy and our labeling is now consistent and compliant." 
                <br />
                <span className="font-semibold">— Head Chef, UK Restaurant</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 
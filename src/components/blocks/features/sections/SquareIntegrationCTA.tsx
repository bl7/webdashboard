"use client"

import { Button } from "@/components/ui"
import { ArrowRight, CheckCircle, Zap, Shield, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export const SquareIntegrationCTA = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 py-20">
      {/* Background Elements */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-white opacity-10 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-white opacity-10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="mb-4 inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30">
              <Zap className="mr-2 h-4 w-4" />
              Limited Time Offer
            </div>

            <h3 className="mb-6 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
              Ready to Transform Your Restaurant?
            </h3>

            <p className="mx-auto mb-8 max-w-3xl text-xl text-purple-100">
              Join the restaurants already using InstaLabel with Square integration. Get compliant
              labels in minutes, not hours.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Setup in 5 Minutes</h3>
              <p className="text-sm text-purple-100">
                Connect your Square account and start syncing immediately
              </p>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Built for Compliance</h3>
              <p className="text-sm text-purple-100">
                Automatic allergen detection and Natasha's Law labeling workflows
              </p>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Zero Manual Work</h3>
              <p className="text-sm text-purple-100">
                No data entry required - everything syncs automatically
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/bookdemo">
              <Button
                size="lg"
                className="bg-white font-bold text-purple-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100"
              >
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-purple-700"
              >
                Start Free Trial
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 border-t border-white/20 pt-8"
          >
            <p className="mb-4 text-sm text-purple-200">Trusted by restaurants across the UK</p>
            <div className="flex items-center justify-center space-x-8 text-xs text-purple-200">
              <span>✓ No credit card required</span>
              <span>✓ 14-day free trial</span>
              <span>✓ Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

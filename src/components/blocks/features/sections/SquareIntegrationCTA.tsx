"use client"

import { Button } from "@/components/ui"
import { ArrowRight, CheckCircle, Zap, Shield, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export const SquareIntegrationCTA = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-white opacity-10 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-white opacity-10 blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 mb-4">
              <Zap className="h-4 w-4 mr-2" />
              Limited Time Offer
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-6 text-white">
              Ready to Transform Your Restaurant?
            </h2>
            
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Join the restaurants already using InstaLabel with Square integration. 
              Get compliant labels in minutes, not hours.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 mx-auto">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Setup in 5 Minutes</h3>
              <p className="text-purple-100 text-sm">Connect your Square account and start syncing immediately</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 mx-auto">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Compliance Guaranteed</h3>
              <p className="text-purple-100 text-sm">Automatic allergen detection and Natasha's Law compliance</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 mx-auto">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zero Manual Work</h3>
              <p className="text-purple-100 text-sm">No data entry required - everything syncs automatically</p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/bookdemo">
              <Button size="lg" className="bg-white text-purple-700 font-bold shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/register">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-purple-700 font-bold transition-all duration-300 hover:scale-105">
                Start Free Trial
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-purple-200 text-sm mb-4">Trusted by restaurants across the UK</p>
            <div className="flex items-center justify-center space-x-8 text-purple-200 text-xs">
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
"use client"

import { Button } from "@/components/ui"
import { ArrowRight, Download, Upload, RefreshCw, CheckCircle, Zap, Database, Smartphone } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { SquareLogo } from "@/components/ui/SquareLogo"
import Image from "next/image"

export const SquareIntegrationHomepage = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-20 blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-800 ring-1 ring-purple-200 mb-4">
              <SquareLogo size="sm" className="mr-2" />
              Exclusive Square Integration
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                The Only Labeling Solution That Speaks
              </span>
              <br />
              <span className="text-black">Square</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              The only food labeling solution with <strong>native Square POS integration</strong>. 
              Smart bidirectional sync with allergen detection, safe create-only mode, and real-time menu updates — all automatically.
            </p>
          </motion.div>

          {/* Before/After Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-red-50 rounded-xl p-6 border border-red-200"
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">✕</span>
                </div>
                <h3 className="text-xl font-bold text-red-800">Without InstaLabel + Square</h3>
              </div>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Manual menu entry takes 2-3 hours
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Risk of typos and missing allergens
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  No real-time menu updates
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Inconsistent data across platforms
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-green-50 rounded-xl p-6 border border-green-200"
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <h3 className="text-xl font-bold text-green-800">With InstaLabel + Square</h3>
              </div>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <strong>Smart bidirectional sync</strong> in under 5 minutes
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <strong>AI-powered allergen detection</strong> from descriptions
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <strong>Safe create-only mode</strong> prevents data corruption
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <strong>Real-time menu updates</strong> with perfect structure
                </li>
              </ul>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/features">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                See How It Works
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/bookdemo">
              <Button variant="outline" size="lg" className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 font-semibold transition-all duration-300">
                Book Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 
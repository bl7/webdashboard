"use client"

import { Button } from "@/components/ui"
import {
  ArrowRight,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  Zap,
  Shield,
  Database,
  Smartphone,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { SquareLogo } from "@/components/ui/SquareLogo"
import Image from "next/image"

export const SquareIntegration = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 py-24">
      {/* Background Elements */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-20 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-800 ring-1 ring-purple-200">
            <SquareLogo size="sm" className="mr-2" />
            Exclusive Square Integration
          </div>
          <h2 className="mb-6 text-4xl font-black leading-tight tracking-tight text-black md:text-5xl">
            The Only Labeling Solution That Speaks Square
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            The only food labeling solution with <strong>native Square POS integration</strong>.
            Smart bidirectional sync with AI-powered allergen detection, safe create-only mode, and
            real-time menu updates — all automatically.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl">
          {/* Process Flow */}
          <div className="mb-16 grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <div className="mb-3 flex items-center justify-center">
                <SquareLogo size="sm" className="mr-2" />
                <h3 className="text-xl font-bold text-gray-900">Connect Square</h3>
              </div>
              <p className="text-gray-600">
                Link your Square account with one click. No technical setup required.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Smart Import</h3>
              <p className="text-gray-600">
                AI extracts ingredients from modifiers & allergens from descriptions automatically.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Safe Export</h3>
              <p className="text-gray-600">
                Create-only mode prevents data corruption while syncing compliant menus.
              </p>
            </motion.div>
          </div>

          {/* Technical Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Live Integration Demo</h3>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Square Side */}
              <div className="space-y-4">
                <div className="mb-3 flex items-center">
                  <SquareLogo size="sm" className="mr-2" />
                  <h4 className="font-semibold text-gray-900">Square Dashboard</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Caesar Salad</div>
                        <div className="text-sm text-gray-600">Romaine, Parmesan, Croutons</div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-green-600">✓ Synced</div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <div className="flex items-center space-x-3">
                      <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Chicken Burger</div>
                        <div className="text-sm text-gray-600">Chicken, Lettuce, Tomato</div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-blue-600">Syncing...</div>
                  </div>
                </div>
              </div>

              {/* InstaLabel Side */}
              <div className="space-y-4">
                <h4 className="mb-3 font-semibold text-gray-900">InstaLabel Dashboard</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 p-3">
                    <div className="flex items-center space-x-3">
                      <Upload className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Caesar Salad</div>
                        <div className="text-sm text-gray-600">Menu Item Ready for Square</div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-purple-600">Export Ready</div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-3">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Chicken Burger</div>
                        <div className="text-sm text-gray-600">Compliant Menu Item</div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-orange-600">Compliant</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Benefits */}
          <div className="mb-16 grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6"
            >
              <div className="mb-4 flex items-center">
                <SquareLogo size="sm" className="mr-2" />
                <h3 className="text-xl font-bold text-green-800">Time Savings</h3>
              </div>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <strong>2-3 hours saved</strong> per menu update
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <strong>AI-powered ingredient extraction</strong> from modifiers
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <strong>Smart allergen detection</strong> from descriptions
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <strong>Safe create-only mode</strong> prevents corruption
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6"
            >
              <h3 className="mb-4 text-xl font-bold text-purple-800">Menu Compliance</h3>
              <ul className="space-y-3 text-purple-700">
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <strong>Natasha's Law</strong> compliant menu items
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <strong>Bidirectional sync</strong> with Square POS
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <strong>Real-time menu updates</strong> with perfect structure
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <strong>Audit-ready menu system</strong> with full traceability
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Advanced Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-16 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-8"
          >
            <div className="mb-8 text-center">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Advanced Square Integration Features
              </h3>
              <p className="mx-auto max-w-2xl text-gray-600">
                Built for production kitchens with enterprise-grade reliability and smart automation
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-4 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">Safe Sync Mode</h4>
                <p className="text-sm text-gray-600">
                  Create-only mode prevents data corruption. Only adds new items, never updates
                  existing ones.
                </p>
              </div>

              <div className="p-4 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">Smart Ingredient Extraction</h4>
                <p className="text-sm text-gray-600">
                  AI extracts ingredients from Square modifiers and allergens from descriptions
                  automatically.
                </p>
              </div>

              <div className="p-4 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">Bidirectional Sync</h4>
                <p className="text-sm text-gray-600">
                  Import from Square, export back to Square. Real-time updates with perfect data
                  structure.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center"
          >
            <Link href="/bookdemo">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

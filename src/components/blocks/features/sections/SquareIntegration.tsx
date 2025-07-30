"use client"

import { Button } from "@/components/ui"
import { ArrowRight, Download, Upload, RefreshCw, CheckCircle, Zap, Shield, Database, Smartphone } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { SquareLogo } from "@/components/ui/SquareLogo"
import Image from "next/image"

export const SquareIntegration = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-20 blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-800 ring-1 ring-purple-200 mb-4">
            <SquareLogo size="sm" className="mr-2" />
            Exclusive Square Integration
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-6 text-black">
            The Only Labeling Solution That Speaks Square
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The only food labeling solution with <strong>native Square POS integration</strong>. 
            Smart bidirectional sync with AI-powered allergen detection, safe create-only mode, and real-time menu updates — all automatically.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Process Flow */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
                             <div className="flex items-center justify-center mb-3">
                 <SquareLogo size="sm" className="mr-2" />
                 <h3 className="text-xl font-bold text-gray-900">Connect Square</h3>
               </div>
               <p className="text-gray-600">Link your Square account with one click. No technical setup required.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Import</h3>
              <p className="text-gray-600">AI extracts ingredients from modifiers & allergens from descriptions automatically.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
                             <h3 className="text-xl font-bold text-gray-900 mb-3">Safe Export</h3>
               <p className="text-gray-600">Create-only mode prevents data corruption while syncing compliant menus.</p>
            </motion.div>
          </div>

          {/* Technical Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-16"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Live Integration Demo</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
                         <div className="grid md:grid-cols-2 gap-8">
               {/* Square Side */}
               <div className="space-y-4">
                 <div className="flex items-center mb-3">
                   <SquareLogo size="sm" className="mr-2" />
                   <h4 className="font-semibold text-gray-900">Square Dashboard</h4>
                 </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Caesar Salad</div>
                        <div className="text-sm text-gray-600">Romaine, Parmesan, Croutons</div>
                      </div>
                    </div>
                    <div className="text-xs text-green-600 font-medium">✓ Synced</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                      <div>
                        <div className="font-semibold text-gray-900">Chicken Burger</div>
                        <div className="text-sm text-gray-600">Chicken, Lettuce, Tomato</div>
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 font-medium">Syncing...</div>
                  </div>
                </div>
              </div>

                             {/* InstaLabel Side */}
               <div className="space-y-4">
                 <h4 className="font-semibold text-gray-900 mb-3">InstaLabel Dashboard</h4>
                <div className="space-y-3">
                                     <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                     <div className="flex items-center space-x-3">
                       <Upload className="h-5 w-5 text-purple-600" />
                       <div>
                         <div className="font-semibold text-gray-900">Caesar Salad</div>
                         <div className="text-sm text-gray-600">Menu Item Ready for Square</div>
                       </div>
                     </div>
                     <div className="text-xs text-purple-600 font-medium">Export Ready</div>
                   </div>
                  
                                     <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                     <div className="flex items-center space-x-3">
                       <Shield className="h-5 w-5 text-orange-600" />
                       <div>
                         <div className="font-semibold text-gray-900">Chicken Burger</div>
                         <div className="text-sm text-gray-600">Compliant Menu Item</div>
                       </div>
                     </div>
                     <div className="text-xs text-orange-600 font-medium">Compliant</div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
                         <motion.div
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.5 }}
               className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200"
             >
               <div className="flex items-center mb-4">
                 <SquareLogo size="sm" className="mr-2" />
                 <h3 className="text-xl font-bold text-green-800">Time Savings</h3>
               </div>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <strong>2-3 hours saved</strong> per menu update
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <strong>AI-powered ingredient extraction</strong> from modifiers
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <strong>Smart allergen detection</strong> from descriptions
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <strong>Safe create-only mode</strong> prevents corruption
                </li>
              </ul>
            </motion.div>

                         <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.6 }}
               className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200"
             >
                                <h3 className="text-xl font-bold text-purple-800 mb-4">Menu Compliance</h3>
                              <ul className="space-y-3 text-purple-700">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    <strong>Natasha's Law</strong> compliant menu items
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    <strong>Bidirectional sync</strong> with Square POS
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    <strong>Real-time menu updates</strong> with perfect structure
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
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
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 mb-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Square Integration Features</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Built for production kitchens with enterprise-grade reliability and smart automation
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Safe Sync Mode</h4>
                <p className="text-sm text-gray-600">
                  Create-only mode prevents data corruption. Only adds new items, never updates existing ones.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Smart Ingredient Extraction</h4>
                <p className="text-sm text-gray-600">
                  AI extracts ingredients from Square modifiers and allergens from descriptions automatically.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Bidirectional Sync</h4>
                <p className="text-sm text-gray-600">
                  Import from Square, export back to Square. Real-time updates with perfect data structure.
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
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
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
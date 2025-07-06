"use client"

import React from "react"
import { motion } from "framer-motion"
import { CheckCircle, Users, Heart, Target } from "lucide-react"

export const AboutTwoSection = () => {
  return (
    <section className="relative bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
              <Heart className="mr-2 h-4 w-4" />
              Our Story
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Built by Kitchen Staff, for Kitchen Staff
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              We started InstaLabel because we saw the chaos in kitchens firsthand. 
              Handwritten labels, missed expiry dates, and constant stress about compliance. 
              We built the solution we wished we had.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Kitchen-Tested</h3>
                  <p className="text-sm text-gray-600">Every feature designed and tested in real kitchen environments</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Chef-Approved</h3>
                  <p className="text-sm text-gray-600">Developed with input from head chefs and kitchen managers</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Compliance-First</h3>
                  <p className="text-sm text-gray-600">Built to meet all UK food safety regulations and standards</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Team/Company Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
              {/* Team Members */}
              <div className="space-y-4">
                {/* Chef */}
                <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Head Chef</h4>
                      <p className="text-sm text-gray-600">15+ years experience</p>
                    </div>
                  </div>
                </div>

                {/* Kitchen Manager */}
                <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-purple-500 ml-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Kitchen Manager</h4>
                      <p className="text-sm text-gray-600">Operations expert</p>
                    </div>
                  </div>
                </div>

                {/* Development Team */}
                <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500 ml-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Development Team</h4>
                      <p className="text-sm text-gray-600">Tech meets hospitality</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">500+</div>
                  <div className="text-xs text-gray-600">Kitchens</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">1M+</div>
                  <div className="text-xs text-gray-600">Labels Printed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">99.9%</div>
                  <div className="text-xs text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 
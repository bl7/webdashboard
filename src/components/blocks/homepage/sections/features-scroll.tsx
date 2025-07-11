"use client"

import Marquee from "@/lib/marqee"
import React from "react"
import { motion } from "framer-motion"
import { Star, Award, Users, TrendingUp, Quote } from "lucide-react"

const foodBusinesses = [
  { name: "Restaurant A", logo: "/noodle.png" },
  { name: "Cafe B", logo: "/noodle.png" },
  { name: "Catering C", logo: "/noodle.png" },
  { name: "Food Truck D", logo: "/noodle.png" },
  { name: "Bakery E", logo: "/noodle.png" },
]

const trustSignals = [
  { icon: Users, value: "500+", label: "locations managed" },
  { icon: TrendingUp, value: "£2.3M", label: "waste reduction tracked" },
  { icon: Star, value: "15,000+", label: "hours saved monthly" },
  { icon: Award, value: "99.9%", label: "uptime guarantee" },
]

export const TrustedBySection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/50 to-white px-4 py-24 sm:px-6 md:px-12 lg:px-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/3 top-1/3 h-32 w-32 rounded-full bg-purple-200/30 blur-2xl"></div>
        <div className="absolute right-1/3 bottom-1/3 h-24 w-24 rounded-full bg-pink-200/30 blur-2xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center space-y-12">      
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
            >
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Real Results
              </span>
              <br />
              <span className="text-gray-900">From Real Kitchens</span>
            </motion.h2>
          </motion.div>

          {/* Customer Success Story */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg ring-1 ring-purple-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Quote className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <blockquote className="text-xl text-gray-700 leading-relaxed mb-4">
                    "We switched from a basic label printer to InstaLabel and immediately saw the difference. Managing our 8 locations became effortless, and the inventory insights helped us reduce waste by 40% in the first quarter."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">MC</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Marcus Chen</div>
                      <div className="text-sm text-gray-600">Operations Director, Urban Feast Group</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Company Logos Marquee */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            <div className="relative rounded-2xl bg-white/60 p-8 shadow-lg ring-1 ring-purple-100 backdrop-blur-sm">
              <Marquee speed={25} pauseOnHover>
                <div className="flex items-center gap-20 overflow-hidden px-10">
                  {foodBusinesses.map(({ name, logo }) => (
                    <div key={name} className="group">
                      <img
                        src={logo}
                        alt={`${name} logo`}
                        className="h-24 max-h-24 w-auto cursor-pointer object-contain grayscale transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:grayscale-0 group-hover:drop-shadow-xl"
                      />
                    </div>
                  ))}
                </div>
              </Marquee>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
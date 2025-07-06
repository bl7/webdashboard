"use client"

import Marquee from "@/lib/marqee"
import React from "react"
import { motion } from "framer-motion"
import { Star, Award, Users, TrendingUp } from "lucide-react"

const foodBusinesses = [
  { name: "Restaurant A", logo: "/noodle.png" },
  { name: "Cafe B", logo: "/noodle.png" },
  { name: "Catering C", logo: "/noodle.png" },
  { name: "Food Truck D", logo: "/noodle.png" },
  { name: "Bakery E", logo: "/noodle.png" },
  // add your logos here
]

const stats = [
  { icon: Users, value: "500+", label: "Restaurants" },
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: Award, value: "99%", label: "Satisfaction" },
  { icon: TrendingUp, value: "60%", label: "Time Saved" },
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 text-sm font-bold text-purple-800 ring-1 ring-purple-200 shadow-sm"
            >
              <Star className="mr-2 h-4 w-4" />
              Trusted by Industry Leaders
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
            >
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                From Cloud Kitchens
              </span>
              <br />
              <span className="text-gray-900">to National Brands</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl text-xl text-gray-600 sm:text-2xl leading-relaxed font-medium"
            >
              InstaLabel makes food safety easy for kitchens of all sizes, from local cafes to enterprise chains.
            </motion.p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center space-y-2 rounded-2xl bg-white/60 p-6 shadow-sm ring-1 ring-purple-100 backdrop-blur-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-lg text-gray-600 font-medium">
              Join <span className="font-bold text-purple-600">500+ restaurants</span> across the UK who trust InstaLabel
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
"use client"

import Marquee from "@/lib/marqee"
import React from "react"
import { motion } from "framer-motion"

const foodBusinesses = [
  { name: "Restaurant A", logo: "/noodle.png" },
  { name: "Cafe B", logo: "/noodle.png" },
  { name: "Catering C", logo: "/noodle.png" },
  { name: "Food Truck D", logo: "/noodle.png" },
  { name: "Bakery E", logo: "/noodle.png" },
  // add your logos here
]

export const TrustedBySection = () => {
  return (
    <section className="bg-gradient-to-br from-white via-purple-50/30 to-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto text-center space-y-8">      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <p className="mx-auto max-w-2xl text-xl text-gray-600 sm:text-2xl leading-relaxed font-medium">
            From cloud kitchens to national brands, InstaLabel makes food safety easy.
          </p>
          <p className="text-sm text-gray-500 font-medium">
            Trusted by 500+ restaurants across the UK
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          
          <Marquee speed={30} pauseOnHover>
            <div className="flex items-center gap-16 overflow-hidden px-10">
              {foodBusinesses.map(({ name, logo }) => (
                <div key={name} className="group">
                  <img
                    src={logo}
                    alt={`${name} logo`}
                    className="h-20 max-h-20 w-auto cursor-pointer object-contain grayscale transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:grayscale-0 group-hover:drop-shadow-lg"
                  />
                </div>
              ))}
            </div>
          </Marquee>
        </motion.div>
      </div>
    </section>
  )
}
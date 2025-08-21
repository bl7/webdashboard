"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Award, Users, TrendingUp, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import Marquee from "@/lib/marqee"
import Image from "next/image"

const foodBusinesses = [
  { name: "Noodle Bar", logo: "/noodlebar.png" },
  { name: "Crispy as duck", logo: "/donald.jpg" },
  { name: "Katsu curry bar", logo: "/katsu.png" },
  { name: "Korean fried chicken", logo: "/korean.png" },
  { name: "bang fang rice bar", logo: "/dangfang.jpg" },
  { name: "Loco lime", logo: "/loco.png" },
  // { name: "momo's bento bar", logo: "/noodle.png" },
]

const trustSignals = [
  { icon: Users, value: "500+", label: "locations managed" },
  { icon: TrendingUp, value: "£2.3M", label: "waste reduction tracked" },
  { icon: Star, value: "15,000+", label: "hours saved monthly" },
  { icon: Award, value: "99.9%", label: "uptime guarantee" },
]

export const TrustedBySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Debug: Log when currentIndex changes
  useEffect(() => {
    console.log("Current index changed to:", currentIndex)
    console.log("Current image:", foodBusinesses[currentIndex].logo)
    console.log("Current company:", foodBusinesses[currentIndex].name)
  }, [currentIndex])

  const nextSlide = () => {
    console.log("Next clicked, current index:", currentIndex)
    setCurrentIndex((prev) => {
      const newIndex = (prev + 1) % foodBusinesses.length
      console.log("New index:", newIndex)
      console.log("New image source:", foodBusinesses[newIndex].logo)
      return newIndex
    })
  }

  const prevSlide = () => {
    console.log("Prev clicked, current index:", currentIndex)
    setCurrentIndex((prev) => {
      const newIndex = (prev - 1 + foodBusinesses.length) % foodBusinesses.length
      console.log("New index:", newIndex)
      console.log("New image source:", foodBusinesses[newIndex].logo)
      return newIndex
    })
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/50 to-white px-4 py-24 sm:px-6 md:px-12 lg:px-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/3 top-1/3 h-32 w-32 rounded-full bg-purple-200/30 blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/3 h-24 w-24 rounded-full bg-pink-200/30 blur-2xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="space-y-12 text-center">
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
            className="mx-auto max-w-4xl"
          >
            <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-purple-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                    <Quote className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <blockquote className="mb-4 text-xl leading-relaxed text-gray-700">
                    "We switched from a basic label printer to InstaLabel and immediately saw the
                    difference. Managing our 8 locations became effortless, and the inventory
                    insights helped us reduce waste by 40% in the first quarter."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100">
                      <Image
                        src="/noodlebar.png"
                        alt="Noodle Bar logo"
                        width={32}
                        height={32}
                        sizes="32px"
                        className="h-8 w-8 rounded-full object-cover"
                        priority
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Jonathan L.</div>
                      <div className="text-sm text-gray-600">Owner, Noodle Bar Franchise</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Company Logos - Desktop Marquee / Mobile Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Desktop Marquee */}
            <div className="hidden lg:block">
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16"></div>
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent"></div>

              <div className="relative p-10">
                <Marquee speed={25} pauseOnHover>
                  <div className="flex items-center gap-20 overflow-visible px-10 py-8">
                    {foodBusinesses.map(({ name, logo }) => (
                      <div key={name} className="group relative">
                        <Image
                          src={logo}
                          alt={`${name} logo`}
                          width={96}
                          height={96}
                          sizes="96px"
                          className="h-24 max-h-24 w-auto cursor-pointer object-contain grayscale transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:drop-shadow-xl group-hover:grayscale-0"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </Marquee>
              </div>
            </div>

            {/* Mobile Carousel */}
            <div className="lg:hidden">
              <div className="relative mx-auto max-w-sm">
                <div className="flex items-center justify-center">
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-50"
                    type="button"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>

                  <div className="flex h-32 items-center justify-center px-16">
                    <div className="group relative">
                      <Image
                        key={currentIndex} // Force re-render when index changes
                        src={foodBusinesses[currentIndex].logo}
                        alt={`${foodBusinesses[currentIndex].name} logo`}
                        width={96}
                        height={96}
                        sizes="96px"
                        className="h-24 max-h-24 w-auto object-contain grayscale transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:drop-shadow-xl group-hover:grayscale-0"
                        title={foodBusinesses[currentIndex].name}
                        priority={currentIndex === 0}
                        loading={currentIndex === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </div>

                  <button
                    onClick={nextSlide}
                    className="absolute right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-50"
                    type="button"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Company Name Display */}
                <div className="mt-3 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    {foodBusinesses[currentIndex].name}
                  </p>
                </div>

                {/* Carousel Indicators */}
                <div className="mt-4 flex justify-center space-x-2">
                  {foodBusinesses.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        index === currentIndex ? "bg-purple-600" : "bg-gray-300"
                      }`}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

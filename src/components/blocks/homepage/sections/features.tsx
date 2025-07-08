"use client"

import React, { useEffect, useRef, useState } from "react"
import { CheckCircle, ArrowRight, Zap, Shield, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui"
import { motion } from "framer-motion"
import Link from "next/link"

const features = [
  {
    icon: Shield,
    title: "Natasha's Law & EHO Compliant",
    description: "Always up-to-date with latest food safety regulations"
  },
  {
    icon: Zap,
    title: "Automated Expiry & Allergen Labeling",
    description: "Smart labeling that prevents food waste and protects customers"
  },
  {
    icon: Users,
    title: "Multi-Location Management",
    description: "Cloud-based system works across all your restaurant locations"
  },
  {
    icon: Clock,
    title: "Touchscreen Device Ready",
    description: "Rugged, hygienic, and incredibly easy to use in busy kitchens"
  }
]

const buttonVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.4 } },
}

export const Feature = () => {
  const textRef = useRef<HTMLDivElement>(null)
  const [videoHeight, setVideoHeight] = useState(0)

  useEffect(() => {
    function updateHeight() {
      if (textRef.current) {
        setVideoHeight(textRef.current.clientHeight)
      }
    }
    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  return (
    <section className="-mt-16 px-4 py-24 text-foreground sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-white via-purple-50/30 to-white">
      <div className="container mx-auto grid grid-cols-1 items-center gap-16 md:grid-cols-2">
        {/* Enhanced Left Content Block */}
        <div ref={textRef} className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-800 ring-1 ring-purple-200">
              <Zap className="mr-2 h-4 w-4" />
              All-In-One Solution
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-gray-900">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Transform
              </span>
              <br />
              <span className="text-gray-900">Your Kitchen</span>
            </h2>
            
            <p className="text-xl leading-relaxed text-gray-600">
              Trusted by 1,500+ UK businesses for effortless compliance, 
              expiry tracking, and kitchen efficiency.
            </p>
          </div>

          {/* Enhanced Features List */}
          <div className="space-y-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-purple-100 hover:bg-white/80 transition-all duration-300 hover:shadow-md"
              >
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-full flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={buttonVariant}
            className="pt-4"
          >
            <Link href="/bookdemo">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300">
                Book Your Free Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-center text-sm text-gray-500 mt-3">
              See InstaLabel in action • 30-minute demo • No pressure
            </p>
          </motion.div>
        </div>

        {/* Enhanced Video Block */}
        <div
          className="flex w-full justify-center lg:w-full"
          style={{ height: videoHeight, minHeight: 400 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative w-full overflow-hidden rounded-2xl border-2 border-purple-200 shadow-2xl"
            style={{ height: "100%" }}
          >
            {/* Video overlay with branding */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-sm font-semibold text-purple-600">Live Demo</p>
            </div>
            
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            >
              <source src="/printing.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

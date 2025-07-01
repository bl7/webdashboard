"use client"

import React, { useEffect, useRef, useState } from "react"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import { motion } from "framer-motion"
import Link from "next/link"
const features = [
  "Automated expiry and allergen labeling",
  "Natasha's Law & EHO compliant, always up-to-date",
  "Cloud-based management across all your locations",
  "Touchscreen device: rugged, hygienic, and easy to use",
]

const buttonVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.4 } },
}

export const Feature = () => {
  // Typed ref for the entire left content container
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
    <section className="-mt-16 px-4 py-20 text-foreground sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        {/* Entire Left Content Block with ref */}
        <div ref={textRef} className="">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">All-In-One Food Labeling Solution</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Transform your kitchen with InstaLabel—trusted by 1,500+ UK businesses for effortless
            compliance, expiry tracking, and efficiency.
          </p>
          <ul className="mb-6 space-y-4 leading-relaxed text-muted-foreground">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-base font-medium text-gray-800 md:text-lg">{feature}</span>
              </li>
            ))}
          </ul>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={buttonVariant}
          >
            <Link href="/bookdemo">
            <Button
              className="w-full bg-primary px-6 py-3 text-base text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                const el = document.getElementById("")
                if (el) el.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Book Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
          </motion.div>
        </div>

        {/* Video Block with dynamic height */}
        <div
          className="flex w-full justify-center lg:w-full"
          style={{ height: videoHeight, minHeight: 200 }} // minHeight prevents collapse
        >
          <div
            className="relative w-full overflow-hidden rounded-xl border border-border shadow-md"
            style={{ height: "100%" }} // fill parent's height
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full rounded-2xl object-cover"
            >
              <source src="/printing.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}

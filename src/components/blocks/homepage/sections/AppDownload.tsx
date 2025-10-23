"use client"

import React from "react"
import { Button } from "@/components/ui"
import { Smartphone, Download, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import instaLabel2 from "@/assets/images/instaLabel2.png"

export const AppDownload = () => {
  return (
    <section className="relative max-h-screen overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 px-6 py-16 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Background blobs */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-white opacity-10 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-pink-300 opacity-20 blur-3xl" />

      <div className="container relative z-10 mx-auto h-full max-w-6xl">
        <div className="grid min-h-[80vh] grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Download Our
                <br />
                <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Mobile App
                </span>
              </h2>
              <p className="text-xl leading-relaxed text-white/90">
                Print labels on the go with our mobile app. Connect to your printer via Bluetooth,
                manage your kitchen labels, and stay compliant wherever you are.
              </p>
            </div>

            {/* Download Button */}
            <div className="pt-4">
              <Link
                href="https://play.google.com/store/apps/details?id=com.instalabel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-all duration-300 hover:scale-105"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-12 w-auto"
                />
              </Link>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* App screenshot */}
              <div className="relative h-96 w-56 overflow-hidden">
                <Image
                  src={instaLabel2}
                  alt="InstaLabel Mobile App Screenshot"
                  className="h-full w-full object-contain"
                  priority
                />
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 top-8 h-8 w-8 rounded-full bg-pink-400 shadow-lg"
              />
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 bottom-16 h-6 w-6 rounded-full bg-purple-400 shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

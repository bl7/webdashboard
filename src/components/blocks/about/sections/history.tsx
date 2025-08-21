"use client"

import React from "react"
import care from "@/assets/images/kitchen.jpg"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export const History = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-12 sm:py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-purple-200/20 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full bg-pink-200/15 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative mb-12 sm:mb-16"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <div className="h-64 w-full sm:h-[32rem]">
              <Image
                src={care}
                alt="Chef in busy kitchen"
                className="h-full w-full object-cover"
                priority
              />
            </div>
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Floating badge */}
            <div className="absolute bottom-6 left-6 inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-800 shadow-lg backdrop-blur-sm">
              <span className="mr-2">🏆</span>
              Born in Real Kitchens
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          {/* Header */}
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              From Kitchen Chaos to Labeling Clarity
            </h2>
            <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          </div>

          {/* Story Content */}
          <div className="space-y-8">
            {/* Opening paragraph - highlighted */}
            <div className="relative rounded-2xl bg-white/80 p-8 shadow-lg ring-1 ring-gray-200/50 backdrop-blur-sm">
              <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-xl text-white shadow-lg">
                🚀
              </div>
              <div className="ml-20">
                <p className="text-lg leading-relaxed text-gray-700 sm:text-xl">
                  InstaLabel wasn't born out of a startup incubator or a pitch deck — it started
                  behind a prep counter, during a lunch rush. We were there when the labels smudged,
                  the expiry dates faded, and nobody could remember if the sauce tub was opened
                  today or yesterday. These weren't just annoyances — they were risks. For safety.
                  For compliance. For trust.
                </p>
              </div>
            </div>

            {/* Evolution story */}
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="group relative overflow-hidden rounded-xl bg-white/60 p-6 shadow-md ring-1 ring-gray-200/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 text-lg text-white">
                      🎯
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">
                      We knew kitchens needed a better way to track what's fresh, what's safe, and
                      what's compliant. So we built it — not with flashy tech jargon, but with real
                      kitchen problems in mind. InstaLabel began as a tool for auto-calculating
                      expiry dates and printing clear, wipe-safe labels.
                    </p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl bg-white/60 p-6 shadow-md ring-1 ring-gray-200/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-lg text-white">
                      ⚙️
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">
                      We added allergen tracking. Prep times. Use-by info. A manager dashboard. All
                      the things that turn chaos into calm — without adding extra steps. No steep
                      learning curves. No long onboarding. Just a tool that helps food teams get it
                      right the first time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group relative overflow-hidden rounded-xl bg-white/60 p-6 shadow-md ring-1 ring-gray-200/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-lg text-white">
                      🏪
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Today, InstaLabel is trusted in hundreds of commercial kitchens across the UK
                      — from independent cafés to growing chains — helping them reduce food waste,
                      pass EHO inspections, and protect customers with confidence. It's simple,
                      fast, and made to blend into the rhythm of your kitchen — not disrupt it.
                    </p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl bg-white/60 p-6 shadow-md ring-1 ring-gray-200/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-lg text-white">
                      🚀
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">
                      And this is just the beginning. We're building the future of kitchen labeling
                      — one clean, clear label at a time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Link href="/register">
              <button className="rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-primary/90 hover:shadow-xl">
                <span className="mr-2">✨</span>
                Ready to Transform Your Kitchen?
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

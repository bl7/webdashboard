"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import kitchen from "@/assets/images/kitchen.jpg"

export const AboutHero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-mkt-canvas px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-mkt-steel1 opacity-60 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-mkt-ink opacity-10 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-mkt-canvas opacity-80 blur-3xl" />

      <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl space-y-6 text-center md:text-left"
        >
          <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl lg:text-6xl">
            Making everyday kitchen labelling easier.
          </h1>

          <p className="mx-auto max-w-2xl text-base text-mkt-ink8 sm:text-lg">
            InstaLabel is kitchen labelling software from Bournemouth. It prints through a label
            printer the kitchen already has on Windows or macOS, or through a supported Android
            printer. The business still sets the recipes, allergens and dates.
          </p>

          <p className="text-sm text-mkt-steel">Based in Bournemouth, England.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-[500px]"
        >
          <div className="overflow-hidden rounded-lg border border-mkt-steel1 shadow-lg">
            <Image
              src={kitchen}
              alt="Kitchen work in a commercial kitchen"
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)" }}
      />
    </section>
  )
}

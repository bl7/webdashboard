"use client"

import { Button } from "@/components/ui"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import React from "react"
import instaLabel3 from "@/assets/images/instalabel3.png"
import { motion } from "framer-motion"
import Link from "next/link"
import { isChristmasOfferActive, trialCtaLabel } from "@/lib/marketing/trialOffer"
import { emitHomeEvent } from "../home-labels"

export const Hero = () => {
  const offerOn = isChristmasOfferActive()

  return (
    <section
      className="home-hero-keep relative flex min-h-screen flex-col-reverse items-center overflow-hidden bg-mkt-canvas px-4 pb-16 pt-32 sm:px-6 md:flex-row md:px-12 lg:px-16"
      style={{ minHeight: "100vh" }}
    >
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-mkt-steel1 opacity-60 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-mkt-ink opacity-20 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-mkt-canvas opacity-80 blur-3xl" />
      <div className="absolute right-[20%] top-[60%] isolate -z-10 h-64 w-64 rounded-full bg-mkt-steel1 opacity-60 blur-3xl" />

      <div className="container relative z-10 mx-auto flex h-full flex-col-reverse items-center justify-between gap-6 md:flex-row md:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2 flex w-full max-w-none flex-[1.2] items-center justify-center md:mb-0"
        >
          <div className="relative flex w-full max-w-[800px] justify-center">
            <Image
              src={instaLabel3}
              alt="InstaLabel item selection and label preview"
              className="w-full max-w-[660px] object-contain transition duration-300 hover:scale-105"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
            />
          </div>
        </motion.div>
        <div className="w-full max-w-xl flex-1 space-y-6 text-center md:text-left">
          <div>
            <div className="mb-1 inline-flex items-center rounded-full bg-mkt-canvas px-3 py-1 text-xs font-semibold text-mkt-ink ring-1 ring-mkt-steel1">
              Kitchen labelling software
            </div>
            <h1 className="mt-0 font-accent text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-mkt-ink">Inspection-ready labels in seconds.</span>
            </h1>
          </div>
          <p className="mb-1 mt-2 text-lg text-mkt-ink8 sm:text-xl">
            Allergens, use-by dates and temp checks — without paper, handwriting, or guesswork.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start">
            <Link href="/register">
              <Button
                size="lg"
                className="border-0 font-semibold text-white shadow-lg"
                style={{ backgroundColor: "#142124", backgroundImage: "none" }}
              >
                {trialCtaLabel()}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-mkt-steel1 font-semibold text-mkt-ink transition-all duration-300 hover:border-mkt-ink hover:bg-mkt-ink hover:text-white"
              asChild
            >
              <a
                href="/bookdemo"
                onClick={() => emitHomeEvent("demo_click", { location: "hero" })}
              >
                Book a demo
              </a>
            </Button>
          </div>
          <p className="text-xs text-mkt-steel sm:text-sm">
            {offerOn
              ? "£15.99 a month after your free period. No printer in the box — use the one you already have. Christmas offer ends 10 January 2027."
              : "£15.99 a month after your 14-day trial. No printer in the box — use the one you already have."}
          </p>
        </div>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-12 w-full sm:h-24"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)" }}
      />
    </section>
  )
}

"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import instaLabel2 from "@/assets/images/instaLabel2.png"
import { ANDROID_PRINTERS, PLAY_STORE_URL } from "@/lib/marketing/site"

export const PrintingOptions = () => (
  <section className="relative bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
    <div className="container mx-auto max-w-6xl">
      <h2 className="mb-10 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
        Choose the setup that fits your kitchen.
      </h2>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-mkt-steel1 bg-white p-6 sm:p-8">
          <h3 className="mb-3 text-xl font-bold text-mkt-ink">From a computer</h3>
          <p className="mb-4 text-sm leading-relaxed text-mkt-ink8">
            Use InstaLabel in your browser with PrintBridge and a label printer installed on Windows
            or macOS.
          </p>
          <Link
            href="/printbridge"
            className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
          >
            Explore desktop printing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-2xl border border-mkt-steel1 bg-white p-6 sm:p-8">
          <h3 className="mb-3 text-xl font-bold text-mkt-ink">From Android</h3>
          <p className="mb-4 text-sm leading-relaxed text-mkt-ink8">
            Use the InstaLabel app with a supported Bluetooth label printer. Confirmed models:{" "}
            {`${ANDROID_PRINTERS.join(" and ")}.`}
          </p>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <Image
              src={instaLabel2}
              alt="InstaLabel Android app"
              className="h-24 w-auto object-contain"
              sizes="160px"
            />
            <Link
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <Link
            href="/mobile-app"
            className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
          >
            Explore the Android app
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
      <p className="mt-6">
        <Link
          href="/kitchen-label-printer"
          className="text-sm font-semibold text-mkt-teal hover:underline"
        >
          Check printer compatibility
        </Link>
      </p>
    </div>
  </section>
)

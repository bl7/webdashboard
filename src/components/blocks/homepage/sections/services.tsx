"use client"

import React from "react"
import Image from "next/image"
import { ClipboardCheck, Smartphone, Monitor, Printer } from "lucide-react"

export const Services = () => {
  return (
    <section id="features" className="bg-primary py-24 text-white">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-col-reverse items-center gap-12 md:flex-row md:items-start">
          {/* Left Content */}
          <div className="space-y-8 md:w-1/2">
            <h2 className="text-4xl font-extrabold leading-tight">
              Powerful features built for kitchens, by kitchens.
            </h2>

            {/* Features List */}
            <ul className="space-y-6">
              {[
                {
                  icon: Printer,
                  title: "Print in Seconds",
                  desc: "No more handwriting or sticky notes. Select, tap, print.",
                },
                {
                  icon: ClipboardCheck,
                  title: "Track Prep & Expiry Dates Automatically",
                  desc: "We calculate everything — so your staff doesn’t have to.",
                },
                {
                  icon: Monitor,
                  title: "Comply with Natasha’s Law & EHO Standards",
                  desc: "Every label includes allergens, prep dates, and times — automatically.",
                },
                {
                  icon: Smartphone,
                  title: "Works on Web & Sunmi",
                  desc: "No special hardware required. We support what you already use.",
                },
              ].map(({ icon: Icon, title, desc }, idx) => (
                <li key={idx} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-3">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-white/90">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="rounded-md bg-white/90 px-6 py-3 font-semibold text-primary transition hover:bg-white">
                See Full List of Features
              </button>
              <button className="rounded-md border border-white/90 px-6 py-3 font-semibold transition hover:bg-white hover:text-primary">
                Find Your Plan
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:w-1/2">
            <div className="relative h-[400px] w-[300px] drop-shadow-2xl md:h-[450px] md:w-[350px]">
              <Image
                src="/icon.svg"
                alt="Sunmi device in kitchen"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

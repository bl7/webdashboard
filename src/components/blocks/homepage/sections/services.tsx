"use client"

import React from "react"
import Image from "next/image"
import { ClipboardCheck, Smartphone, Monitor, Printer } from "lucide-react"
import { Button } from "@/components/ui"
import { ArrowRight, StepForward } from "lucide-react"
export const Services = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-col-reverse items-center gap-12 md:flex-row md:items-start">
          {/* Left Content */}
          <div className="space-y-8 md:w-1/2">
            <h2 className="text-4xl font-extrabold leading-tight text-gray-900">
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
                  <div className="flex-shrink-0 rounded-full bg-gray-200 p-3">
                    <Icon className="h-7 w-7 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1 text-sm text-gray-700">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary px-6 py-3 text-white hover:bg-primary/90">
                See full list of features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" size="lg" className="border border-primary text-primary">
                <StepForward className="mr-2 h-5 w-5" />
                Choose your plan
              </Button>
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

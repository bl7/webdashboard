"use client"

import React from "react"
import Image from "next/image"
import { ClipboardCheck, Smartphone, Monitor, Printer } from "lucide-react"
import { Button } from "@/components/ui"
import { ArrowRight, StepForward } from "lucide-react"
import Link from "next/link"
export const Services = () => {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col-reverse items-center gap-16 md:flex-row md:items-start">
          {/* Left Content */}
          <div className="w-full max-w-2xl space-y-6">
            <h2 className="font-accent text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
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
                  desc: "We calculate everything — so your staff doesn't have to.",
                },
                {
                  icon: Monitor,
                  title: "Comply with Natasha's Law & EHO Standards",
                  desc: "Every label includes allergens, prep dates, and times — automatically.",
                },
                {
                  icon: Smartphone,
                  title: "Works on Web & Sunmi",
                  desc: "If you have a label printer, you can use InstaLabel.",
                },
              ].map(({ icon: Icon, title, desc }, idx) => (
                <li key={idx} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-gray-200 p-3">
                    <Icon className="h-7 w-7 text-gray-700" />
                  </div>
                  <div className="max-w-xl">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1 text-gray-600">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href='/features'>
              <Button size="lg" className="bg-primary px-6 py-3 text-white hover:bg-primary/90">
                See full list of features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              </Link>
              <Link href='/bookdemo'>
              <Button variant="ghost" size="lg" className="border border-primary text-primary">
                <StepForward className="mr-2 h-5 w-5" />
               Book Demo
              </Button>
              </Link>
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

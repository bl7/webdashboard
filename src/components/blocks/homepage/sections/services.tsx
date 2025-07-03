"use client"

import React from "react"
import Image from "next/image"
import { ClipboardCheck, Smartphone, Monitor, Printer } from "lucide-react"
import { Button } from "@/components/ui"
import { ArrowRight, StepForward } from "lucide-react"
import Link from "next/link"
import FeatureImage from "@/assets/images/feature.png"

export const Services = () => {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 md:px-12 lg:px-16 bg-gray-50/50">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/50"></div>

      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col-reverse items-center gap-16 md:flex-row md:items-start">
          {/* Left Content */}
          <div className="w-full max-w-2xl space-y-8">
            <div className="space-y-4">
              <h2 className="font-accent text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                Powerful features built for kitchens, by kitchens.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Transform your kitchen operations with intelligent automation that saves time, ensures compliance, and reduces errors.
              </p>
            </div>

            {/* Features List */}
            <ul className="space-y-4">
              {[
                {
                  icon: Printer,
                  title: "Print in Seconds",
                  desc: "No more handwriting or sticky notes. Select, tap, print.",
                  color: "text-green-600",
                  bgColor: "bg-green-50"
                },
                {
                  icon: ClipboardCheck,
                  title: "Track Prep & Expiry Dates Automatically",
                  desc: "We calculate everything — so your staff doesn't have to.",
                  color: "text-blue-600",
                  bgColor: "bg-blue-50"
                },
                {
                  icon: Monitor,
                  title: "Comply with Natasha's Law & EHO Standards",
                  desc: "Every label includes allergens, prep dates, and times — automatically.",
                  color: "text-purple-600",
                  bgColor: "bg-purple-50"
                },
                {
                  icon: Smartphone,
                  title: "Works on Web & Sunmi",
                  desc: "If you have a label printer, you can use InstaLabel.",
                  color: "text-orange-600",
                  bgColor: "bg-orange-50"
                },
              ].map(({ icon: Icon, title, desc, color, bgColor }, idx) => (
                <li key={idx} className="group">
                  <div className="flex items-start space-x-4 p-4 rounded-lg bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className={`flex-shrink-0 rounded-lg ${bgColor} p-3 transition-all duration-200`}>
                      <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">{title}</h3>
                      <p className="mt-1 text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-6">
              <Link href='/features'>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200">
                  See full list of features
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href='/bookdemo'>
                <Button variant="ghost" size="lg" className="border border-primary text-primary hover:bg-accent px-6 py-3 transition-all duration-200">
                  <StepForward className="mr-2 h-5 w-5" />
                  Book Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:w-1/2">
            <div className="relative h-[600px] w-[450px] drop-shadow-2xl md:h-[450px] md:w-[350px]">
              <Image
                src={FeatureImage}
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
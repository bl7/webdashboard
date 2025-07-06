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
    <section id="features" className="relative px-4 py-24 sm:px-6 md:px-12 lg:px-16 ">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
    

      <div className="relative container mx-auto max-w-6xl">
        <div className="flex flex-col-reverse items-center gap-16 md:flex-row md:items-center">
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

          {/* Right Image - Enhanced with better visual flow */}
          <div className="flex justify-center md:w-1/2 lg:w-2/5">
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Animated gradient background */}
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/15 via-blue-100/60 to-purple-100/60 rounded-3xl blur-2xl animate-pulse"></div>
              
              {/* Main image container with better depth */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                {/* Kitchen environment overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent z-10"></div>
                
                <div className="aspect-[3/4] relative">
                  <Image
                    src={FeatureImage}
                    alt="Professional kitchen staff using InstaLabel system - showing instant label printing and food safety compliance"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  />
                </div>
                
                {/* Subtle brand overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Live Kitchen Demo</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced floating elements with better positioning */}
              <div className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-xl border-2 border-white transform hover:scale-110 transition-transform duration-200">
                <Printer className="w-7 h-7 text-green-600" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-xl border-2 border-white transform hover:scale-110 transition-transform duration-200">
                <ClipboardCheck className="w-7 h-7 text-blue-600" />
              </div>
              
              {/* Additional floating badge */}
              <div className="absolute top-1/2 -left-6 w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-lg border-2 border-white transform -translate-y-1/2 hover:scale-110 transition-transform duration-200">
                <Monitor className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
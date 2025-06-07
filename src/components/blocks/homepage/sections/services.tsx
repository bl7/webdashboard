"use client"

import React from "react"
import Image from "next/image"
import { ClipboardCheck, Smartphone, CheckCircle2, Monitor, Printer } from "lucide-react"

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
                  icon: ClipboardCheck,
                  title: "EHO & Natasha’s Law Compliance",
                  desc: "Print fully compliant labels to meet regulatory standards easily — peace of mind for your kitchen and customers.",
                },
                {
                  icon: CheckCircle2,
                  title: "No Training Required",
                  desc: "Our intuitive system is simple to set up and use, letting your team get started right away without a steep learning curve.",
                },
                {
                  icon: Monitor,
                  title: "Web Interface & Mobile App",
                  desc: "Manage your labels anywhere, anytime from our cloud-based dashboard or on-the-go with the mobile app.",
                },
                {
                  icon: Printer,
                  title: "Use Your Existing Epson Printer",
                  desc: "No need to buy new hardware — our software works seamlessly with Epson TM-M30 printers you already own.",
                },
                {
                  icon: Smartphone,
                  title: "Sunmi Device Support",
                  desc: "Optionally upgrade with Sunmi devices for integrated kitchen printing and enhanced workflow management.",
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

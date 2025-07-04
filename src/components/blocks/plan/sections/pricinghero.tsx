import React from "react"
import Image from "next/image"
import plandevices from "@/assets/images/plandevices.png"

export const PricingHero = () => {
  return (
    <section className="relative overflow-visible px-2 sm:px-4 py-16 sm:px-6 lg:px-16">
      <div className="container relative z-10 mx-auto flex min-h-[200px] sm:min-h-[300px] flex-wrap-reverse items-center justify-center md:flex-nowrap lg:justify-between">
        {/* Text Content */}
        <div className="flex flex-col items-start justify-center text-center md:text-left w-full md:w-auto">
          <h1 className="max-w-2xl sm:max-w-4xl text-2xl sm:text-4xl font-bold md:text-5xl lg:text-6xl">
            Flexible plans for every kitchen
          </h1>
          <p className="mt-4 max-w-2xl sm:max-w-3xl text-base sm:text-lg font-light text-muted-foreground">
            Save hours, reduce waste, and stay compliant — all from a device of your choice.
          </p>

          <div className="mt-4 sm:mt-6 max-w-2xl sm:max-w-3xl text-xs sm:text-sm text-muted-foreground">
            Trusted by 500+ UK Kitchens · EHO Compliant · Works with Epson TM-M30 & Sunmi
          </div>
        </div>

        {/* Placeholder for image or animation */}
        <div className="relative mt-8 sm:mt-12 h-64 sm:h-[420px] w-full max-w-lg md:mt-0">
          <Image
            src={plandevices}
            alt="Plan devices preview"
            fill
            className="rounded-xl object-contain transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
            priority
            sizes="(max-width: 768px) 100vw, 560px"
          />
        </div>
      </div>

      {/* Background blobs */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-15 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-15 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-15 blur-3xl" />
      {/* Bottom fade overlay */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 z-0" style={{background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)'}} />
    </section>
  )
}
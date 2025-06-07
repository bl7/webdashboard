import { Button } from "@/components/ui"
import { ArrowRight } from "lucide-react"
import React from "react"

export const PricingHero = () => {
  return (
    <section>
      <div className="container relative">
        {/* Background blurs */}
        <div className="absolute left-0 top-0 isolate -z-0 h-80 w-80 scale-125 rounded-full bg-purple-400 p-6 opacity-15 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-0 h-96 w-96 rounded-full bg-purple-600 p-6 opacity-15 blur-3xl" />
        <div className="absolute left-[40%] top-[30%] isolate -z-0 h-96 w-96 scale-150 rounded-full bg-pink-300 p-6 opacity-15 blur-3xl" />

        {/* Main content */}
        <div className="relative flex min-h-[500px] w-full flex-wrap-reverse items-center justify-center py-24 md:flex-nowrap lg:justify-between">
          <div className="flex flex-col items-start justify-center">
            <h1 className="max-w-4xl text-center text-4xl font-bold md:text-start md:text-5xl lg:text-6xl">
              Flexible plans for every kitchen
            </h1>
            <p className="mt-4 max-w-3xl text-center text-base font-light text-muted-foreground sm:text-xl md:text-start">
              Save hours, reduce waste, and stay compliant — all from a device of your choice.
            </p>

            {/* Trust indicators */}
            <div className="mt-6 text-center text-sm text-muted-foreground md:text-left">
              Trusted by 500+ UK Kitchens · EHO Compliant · Works with Epson TM-M30 & Sunmi
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

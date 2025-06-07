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
              Compliant Kitchen Labeling Without the Fuss
            </h1>
            <p className="mt-4 max-w-3xl text-center text-base font-light text-muted-foreground sm:text-xl md:text-start">
              Instantly print food-safe labels with your existing printer. EHO-ready, Natasha’s Law
              compliant, no training needed.
            </p>

            {/* Trust indicators */}
            <div className="mt-6 text-center text-sm text-muted-foreground md:text-left">
              Trusted by 500+ UK Kitchens · EHO Compliant · Works with Epson TM-M30 & Sunmi
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-4 md:justify-start">
              <Button size="lg" className="rounded-full text-lg">
                Start Free Today
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group rounded-full bg-transparent text-lg"
              >
                <a href="/book-demo" className="flex items-center gap-2">
                  Book a Demo
                  <ArrowRight className="duration-200 group-hover:ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

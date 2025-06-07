import { Button } from "@/components/ui"
import { ArrowRight } from "lucide-react"
import React from "react"

export const FeaturesHero = () => {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Blurred Background Circles */}
      <div className="absolute left-0 top-0 -z-10 h-80 w-80 rounded-full bg-purple-400 opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-20 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] -z-10 h-96 w-96 rounded-full bg-pink-300 opacity-20 blur-3xl" />

      <div className="container relative z-10 flex flex-col-reverse items-center gap-12 text-center md:flex-row md:items-center md:justify-between md:text-left">
        {/* Text Content */}
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="font-accent font-semibold text-primary">Built for Speed, </span>
            Designed for Simplicity
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            From device setup to label printing — every feature is built to simplify your workflow,
            boost productivity, and scale with your business.
          </p>

          <div className="mt-8">
            <Button asChild size="lg" variant="outline" className="group rounded-full text-lg">
              <a href="#feature-1" className="flex items-center gap-2">
                Explore Features
                <ArrowRight className="transition-all duration-200 group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>

        {/* Optional Image Placeholder */}
        <div className="w-full max-w-md">
          {/* Insert image or Lottie animation here if needed */}
        </div>
      </div>
    </section>
  )
}

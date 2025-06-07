import { Button } from "@/components/ui"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import React from "react"

export const AboutHero = () => {
  return (
    <section>
      <div className="container relative">
        <div className="absolute left-0 top-0 isolate -z-0 h-80 w-80 scale-125 rounded-full bg-purple-400 p-6 opacity-15 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-0 h-96 w-96 rounded-full bg-purple-600 p-6 opacity-15 blur-3xl" />
        <div className="absolute left-[40%] top-[30%] isolate -z-0 h-96 w-96 scale-150 rounded-full bg-pink-300 p-6 opacity-15 blur-3xl" />
        <div className="relative flex min-h-[500px] w-full flex-wrap-reverse items-center justify-center text-pretty py-24 md:flex-nowrap lg:justify-between">
          <div className="flex flex-col items-start justify-center">
            <p className="mb-4 max-w-2xl text-center md:text-start"></p>
            <h1 className="max-w-4xl text-center text-4xl md:text-start md:text-5xl lg:text-6xl">
              <span className="hidden font-accent font-semibold text-primary lg:contents">
                InstaLabel:{" "}
              </span>
              Your Kitchen’s Smart Labeling Solution
            </h1>
            <p className="mt-4 max-w-4xl text-center text-base font-light text-muted-foreground sm:text-xl md:text-start">
              At InstaLabel, we are committed to transforming the way kitchens manage ingredient
              safety and labeling. We believe every kitchen—big or small—deserves an easy, reliable,
              and efficient solution to track expiry dates, allergens, and food safety details.
            </p>
            <div className="mt-8 flex w-full items-center justify-center gap-4 md:justify-start">
              <Button
                asChild
                size={"lg"}
                variant={"outline"}
                className="group rounded-full bg-transparent text-lg"
              >
                <a href="/#services" className="flex items-center justify-between gap-4">
                  Learn More
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

"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Marquee from "@/lib/marqee"

const foodBusinesses = [
  { name: "Noodle Bar", logo: "/noodlebar.png" },
  { name: "Crispy as duck", logo: "/donald.jpg" },
  { name: "Katsu curry bar", logo: "/katsu.png" },
  { name: "Korean fried chicken", logo: "/korean.png" },
  { name: "bang fang rice bar", logo: "/dangfang.jpg" },
  { name: "Loco lime", logo: "/loco.png" },
]

export const TrustedBySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 sm:px-6 md:px-12 lg:px-16">
      <div className="container relative mx-auto max-w-6xl">
        <h2 className="mb-3 text-center text-2xl font-black tracking-tight text-mkt-ink sm:text-3xl">
          Businesses labelling with InstaLabel.
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-mkt-ink8 sm:text-base">
          Used in real Bournemouth kitchens, including Noodle Bar and Loco Lime.
        </p>

        <div className="hidden lg:block">
          <Marquee speed={25} pauseOnHover>
            <div className="flex items-center gap-20 px-10 py-6">
              {foodBusinesses.map(({ name, logo }) => (
                <img
                  key={name}
                  src={logo}
                  alt={`${name} logo`}
                  width={96}
                  height={96}
                  className="h-20 w-auto object-contain"
                  loading="lazy"
                />
              ))}
            </div>
          </Marquee>
        </div>

        <div className="lg:hidden">
          <div className="relative mx-auto max-w-sm">
            <div className="flex items-center justify-center">
              <button
                onClick={() =>
                  setCurrentIndex((prev) => (prev - 1 + foodBusinesses.length) % foodBusinesses.length)
                }
                className="absolute left-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-mkt-steel1 bg-white"
                type="button"
                aria-label="Previous business"
              >
                <ChevronLeft className="h-5 w-5 text-mkt-ink" />
              </button>
              <div className="flex h-36 items-center justify-center px-16">
                <img
                  src={foodBusinesses[currentIndex].logo}
                  alt={`${foodBusinesses[currentIndex].name} logo`}
                  width={128}
                  height={128}
                  className="h-28 w-auto object-contain"
                />
              </div>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % foodBusinesses.length)}
                className="absolute right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-mkt-steel1 bg-white"
                type="button"
                aria-label="Next business"
              >
                <ChevronRight className="h-5 w-5 text-mkt-ink" />
              </button>
            </div>
            <p className="mt-3 text-center text-sm font-medium text-mkt-ink8">
              {foodBusinesses[currentIndex].name}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

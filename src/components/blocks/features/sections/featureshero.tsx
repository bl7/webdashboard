"use client"

import React from "react"
import Image from "next/image"
import FeatureImage from "@/assets/images/featurehero.png"
export const FeaturesHero = () => {
  return (
    <section className="relative overflow-visible px-4 py-16 sm:px-6 lg:px-16 bg-white">
      <div className="container relative z-10 mx-auto flex flex-wrap-reverse items-center justify-center md:flex-nowrap lg:justify-between">
        {/* Text Content */}
        <div className="flex flex-col items-start justify-center text-center md:text-left">
          <h1 className="max-w-4xl text-4xl font-bold md:text-5xl lg:text-6xl">
            Your Kitchen, Simplified.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            We built InstaLabel to remove chaos from food labeling — and help you stay
            inspection-ready.
          </p>
        </div>

        {/* Image */}
        <div className="relative mt-12 h-[450px] w-full max-w-md md:mt-0">
          <Image
            src={FeatureImage}
            alt="Dashboard screenshot"
            fill
            style={{ objectFit: "contain" }}
            priority
            className="rounded-xl"
          />
        </div>
      </div>

     </section>
  )
}

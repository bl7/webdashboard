import React from "react"
import Image from "next/image"


export const LabelsHero = () => {
  return (
    <section className="relative overflow-visible px-2 sm:px-4 py-12 sm:py-24 lg:px-16">
      <div className="container relative z-10 mx-auto flex flex-wrap-reverse items-center justify-center text-pretty md:flex-nowrap lg:justify-between">
        {/* Text Content */}
        <div className="flex flex-col items-start justify-center text-center md:text-left w-full md:w-auto">
          <h1 className="max-w-2xl sm:max-w-4xl text-2xl sm:text-4xl font-bold md:text-5xl lg:text-6xl">
            Natasha's Law & Food-Prep Labels – Fast, Clear, Compliant.
          </h1>
          <p className="mt-4 max-w-xl text-base sm:text-lg text-muted-foreground">
            Print allergy-friendly ingredient, prep, cooked, and pre-packed‑for‑direct‑sale (PPDS) labels in seconds. Highlight 14 UK allergens in bold, stay inspection-ready, meet Natasha's Law, and build trust with clear, legible labelling.
          </p>
        </div>

        {/* Images Grid - Tedha Medha Style */}
        <div className="relative mt-8 sm:mt-12 h-80 sm:h-[500px] w-full max-w-lg md:mt-0">
          {/* Image 1 - Top left, slightly rotated */}
          <div className="absolute left-0 top-0 h-24 w-32 sm:h-36 sm:w-48 -rotate-12 transform overflow-hidden rounded-lg shadow-lg">
            <Image 
              src="/labels/label1.png" 
              alt="Food prep label example"
              width={192}
              height={256}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          {/* Image 2 - Top right, rotated other way */}
          <div className="absolute right-0 top-6 sm:top-8 h-28 w-36 sm:h-40 sm:w-56 rotate-6 transform overflow-hidden rounded-lg shadow-lg">
            <Image 
              src="/labels/label2.png" 
              alt="Allergen label example"
              width={224}
              height={320}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          {/* Image 3 - Center left, tilted */}
          <div className="absolute left-2 sm:left-4 top-28 sm:top-40 h-28 w-36 sm:h-40 sm:w-56 -rotate-6 transform overflow-hidden rounded-lg shadow-lg">
            <Image 
              src="/labels/label3.png" 
              alt="PPDS compliant label"
              width={224}
              height={320}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Background blobs (overflow into next section) */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-15 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-15 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-15 blur-3xl" />
    </section>
  )
}
import React from "react"

export const LabelsHero = () => {
  return (
    <section className="relative overflow-visible px-4 py-24 sm:px-6 lg:px-16">
      <div className="container relative z-10 mx-auto flex flex-wrap-reverse items-center justify-center text-pretty md:flex-nowrap lg:justify-between">
        {/* Text Content */}
        <div className="flex flex-col items-start justify-center text-center md:text-left">
          <h1 className="max-w-4xl text-4xl font-bold md:text-5xl lg:text-6xl">
            Natasha’s Law & Prep Labels Made Simple
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Print compliant labels for allergens, ingredients, and expiry dates with ease — from
            your web dashboard or directly on your Sunmi device. Keep your kitchen safe, efficient,
            and inspection-ready without any hassle.
          </p>
        </div>

        {/* Placeholder for image or animation */}
        <div className="relative mt-12 h-[300px] w-full max-w-md md:mt-0">
          {/* You can replace this with actual image or animation */}
          <div className="h-full w-full rounded-xl bg-muted" />
        </div>
      </div>

      {/* Background blobs (overflow into next section) */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-15 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-15 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-15 blur-3xl" />
    </section>
  )
}

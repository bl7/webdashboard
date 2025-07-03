import React from "react"

export const AboutHero = () => {
  return (
    <section className="relative overflow-visible px-2 sm:px-4 py-12 sm:py-24 lg:px-16">
      <div className="container relative z-10 mx-auto flex flex-wrap-reverse items-center justify-center text-pretty md:flex-nowrap lg:justify-between">
        {/* Text Content */}
        <div className="flex flex-col items-start justify-center text-center md:text-left w-full md:w-auto">
          <h1 className="max-w-2xl sm:max-w-4xl text-2xl sm:text-4xl font-bold md:text-5xl lg:text-6xl">
            Built by kitchen staff. For kitchen staff.
          </h1>
          <p className="mt-4 max-w-xl text-base sm:text-lg text-muted-foreground">
            Smart labeling that keeps your kitchen compliant, waste-free, and running fast — no
            training needed.
          </p>
        </div>

        {/* Placeholder for image or animation */}
        <div className="relative mt-8 sm:mt-12 h-48 sm:h-[300px] w-full max-w-md md:mt-0">
          <div className="h-full w-full rounded-xl bg-muted" />
        </div>
      </div>

      {/* Background blobs */}
      <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-15 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-15 blur-3xl" />
      <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-15 blur-3xl" />
    </section>
  )
}

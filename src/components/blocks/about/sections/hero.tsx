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
            <h1 className="max-w-4xl text-center text-4xl font-bold md:text-start md:text-5xl lg:text-6xl">
              Built by kitchen staff. For kitchen staff.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Smart labeling that keeps your kitchen compliant, waste-free, and running fast — no
              training needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

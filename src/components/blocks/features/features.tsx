import React from "react"
import { FeaturesHero, FeaturesGrid, CoreFeaturesGrid, WhyChooseUs } from "."
import { HowToUploadSteps } from "./sections/HowToUploadSteps"

export const Features = () => {
  return (
    <>
      <FeaturesHero />
      <HowToUploadSteps />
      <div className="flex justify-center my-8">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="How to Use InstaLabel Bulk Upload"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl shadow-lg w-full max-w-2xl"
        ></iframe>
      </div>
      <CoreFeaturesGrid />
      <div className="flex justify-center my-6">
        <a href="/register">
          <button className="bg-primary px-8 py-4 text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 text-base font-semibold rounded-xl w-full sm:w-auto">
            Start Free Trial
          </button>
        </a>
      </div>
      <FeaturesGrid />
      <div className="flex justify-center my-6">
        <a href="/bookdemo" className="btn-primary px-8 py-4 rounded-xl text-lg font-bold shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition">
          Book a Free Demo
        </a>
      </div>
      <WhyChooseUs />

    </>
  )
}

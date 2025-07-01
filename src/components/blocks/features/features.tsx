import React from "react"
import { FeaturesHero, FeaturesGrid, CoreFeaturesGrid, WhyChooseUs } from "."
import { HowToUploadSteps } from "./sections/HowToUploadSteps"

export const Features = () => {
  return (
    <>
      <FeaturesHero />
      <HowToUploadSteps />
      <div className="flex justify-center my-10">
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
      <FeaturesGrid />
      <WhyChooseUs />

    </>
  )
}

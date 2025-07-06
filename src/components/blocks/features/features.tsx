import React from "react"
import { FeaturesHero, FeaturesGrid, CoreFeaturesGrid, WhyChooseUs } from "."
import { HowToUploadSteps } from "./sections/HowToUploadSteps"

export const Features = () => {
  return (
    <>
      <FeaturesHero />
      <HowToUploadSteps />
    
      <CoreFeaturesGrid />
      <FeaturesGrid />
      <WhyChooseUs />

    </>
  )
}

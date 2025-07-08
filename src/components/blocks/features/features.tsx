import React from "react"
import { FeaturesHero, WhyChooseUs } from "."
import { HowToUploadSteps } from "./sections/HowToUploadSteps"
import SystemFeaturesGrid from "./sections/SystemFeaturesGrid"
import ComplianceAndLabels from "./sections/ComplianceAndLabels"
import TechnicalSpecs from "./sections/TechnicalSpecs"

export const Features = () => {
  return (
    <>
      <FeaturesHero />
      <SystemFeaturesGrid />
      <HowToUploadSteps />
      <ComplianceAndLabels />
      <TechnicalSpecs />
      <WhyChooseUs />
    </>
  )
}

import React from "react"
import { FeaturesHero, WhyChooseUs } from "."
import { HowToUploadSteps } from "./sections/HowToUploadSteps"
import SystemFeaturesGrid from "./sections/SystemFeaturesGrid"
import ComplianceAndLabels from "./sections/ComplianceAndLabels"
import TechnicalSpecs from "./sections/TechnicalSpecs"
import { SquareIntegration } from "./sections/SquareIntegration"

export const Features = () => {
  return (
    <>
      <FeaturesHero />
      <SystemFeaturesGrid />
      <SquareIntegration />
      <HowToUploadSteps />
      <ComplianceAndLabels />
      <TechnicalSpecs />
      <WhyChooseUs />
    </>
  )
}

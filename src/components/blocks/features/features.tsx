import React from "react"
import { FeaturesHero, WhyChooseUs } from "."
import { HowToUploadSteps } from "./sections/HowToUploadSteps"
import SystemFeaturesGrid from "./sections/SystemFeaturesGrid"
import ComplianceAndLabels from "./sections/ComplianceAndLabels"
import { EnhancedSquareIntegration } from "./sections/EnhancedSquareIntegration"
import { SystemPerformance } from "./sections/SystemPerformance"

export const Features = () => {
  return (
    <>
      <FeaturesHero />
      <SystemFeaturesGrid />
      <SystemPerformance />
      <EnhancedSquareIntegration />
      <ComplianceAndLabels />
      <HowToUploadSteps />

      <WhyChooseUs />
    </>
  )
}

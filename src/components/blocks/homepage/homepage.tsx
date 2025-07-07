import React from "react"
import { Feature, Hero, TrustedBySection, Services, Pricing, BeforeAfterSection } from "."
import { BulkImportFeatureSection } from "./sections/BulkImportFeatureSection"
import { PPDSLabelHomepageSection } from "./sections/PPDSLabelHomepageSection"

export const Homepage = () => {
  return (
    <>
      <Hero />
      <TrustedBySection />
      <Feature />
      <PPDSLabelHomepageSection />
      <BeforeAfterSection />
      <Pricing />
      <BulkImportFeatureSection />
      <Services />
    </>
  )
}

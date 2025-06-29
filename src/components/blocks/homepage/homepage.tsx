import React from "react"
import { Feature, Hero, TrustedBySection, Services, Pricing, BeforeAfterSection } from "."
import { BulkImportFeatureSection } from "./sections/BulkImportFeatureSection"

export const Homepage = () => {
  return (
    <>
      <Hero />
      <Feature />
      <TrustedBySection />
      <BeforeAfterSection />
      <Services />
      <Pricing />
      <BulkImportFeatureSection />
    </>
  )
}

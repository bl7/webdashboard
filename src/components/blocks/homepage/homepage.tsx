import React from "react"
import { Feature, Hero, TrustedBySection, Services, Pricing, BeforeAfterSection } from "."
import { PPDSLabelHomepageSection } from "./sections/PPDSLabelHomepageSection"
import { HowItWorks } from "./sections/HowItWorks"

export const Homepage = () => {
  return (
    <>
      <Hero />
      <TrustedBySection />
      <HowItWorks />
      <Services />
      <Feature />
      <PPDSLabelHomepageSection />
      <BeforeAfterSection />
      <Pricing />
    </>
  )
}

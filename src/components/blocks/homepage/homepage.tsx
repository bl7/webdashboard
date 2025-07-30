import React from "react"
import { Feature, Hero, TrustedBySection, Services, Pricing, BeforeAfterSection } from "."
import { PPDSLabelHomepageSection } from "./sections/PPDSLabelHomepageSection"
import { HowItWorks } from "./sections/HowItWorks"
import WhatWeDoShowcase from "@/components/blocks/about/sections/WhatWeDoShowcase"
import WaitlistSection from "./sections/WaitlistSection"
import { SquareIntegrationHomepage } from "./sections/SquareIntegrationHomepage"

export const Homepage = () => {
  return (
    <>
      <Hero />
      <TrustedBySection />
      <WhatWeDoShowcase />
      <Services />
      <Feature />
      <SquareIntegrationHomepage />
      <HowItWorks />
      {/* <PPDSLabelHomepageSection /> */}
      <BeforeAfterSection />
      <Pricing />
      <WaitlistSection />
    </>
  )
}

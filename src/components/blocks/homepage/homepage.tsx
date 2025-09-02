import React from "react"
import { Hero, TrustedBySection, Services, Pricing, BeforeAfterSection } from "."
import { PPDSLabelHomepageSection } from "./sections/PPDSLabelHomepageSection"
import { HowItWorks } from "./sections/HowItWorks"
import WhatWeDoShowcase from "@/components/blocks/about/sections/WhatWeDoShowcase"
import { WaitlistModal } from "./sections/WaitlistModal"
import {
  SquareIntegrationHomepage,
  SimplePricing,
  AllergenQuizSection,
} from "./sections/SquareIntegrationHomepage"

export const Homepage = () => {
  return (
    <>
      <Hero />
      <WhatWeDoShowcase />
      <TrustedBySection />
      <Services />
      <BeforeAfterSection />
      <SquareIntegrationHomepage />
      <SimplePricing />
      <HowItWorks />
      {/* <PPDSLabelHomepageSection /> */}
      <AllergenQuizSection />
    </>
  )
}

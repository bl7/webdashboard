import React from "react"
import { Hero, TrustedBySection, Services, Pricing, BeforeAfterSection } from "."
import { PPDSLabelHomepageSection } from "./sections/PPDSLabelHomepageSection"
import { HowItWorks } from "./sections/HowItWorks"
import WhatWeDoShowcase from "@/components/blocks/about/sections/WhatWeDoShowcase"
import { FAQ } from "./sections/FAQ"
import { AppDownload } from "./sections/AppDownload"
import {
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
      <FAQ />
      <SimplePricing />
      <HowItWorks />
      {/* <PPDSLabelHomepageSection /> */}
      <AllergenQuizSection />
      <AppDownload />
    </>
  )
}

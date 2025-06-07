import React from "react"
import { Feature, Hero, TrustedBySection, Services, Pricing, BeforeAfterSection } from "."

export const Homepage = () => {
  return (
    <>
      <Hero />
      <TrustedBySection />
      <BeforeAfterSection />
      <Pricing />
      <Feature />
      <Services />
    </>
  )
}

import React from "react"
import { AboutHero, Contact, History,  WhyInstaLabel } from "."
import { AboutTwoSection } from "./sections/AboutTwoSection"

export const About = () => {
  return (
    <>
      <AboutHero />
      <AboutTwoSection />
      <History />
      <Contact />
      <WhyInstaLabel />
    </>
  )
}

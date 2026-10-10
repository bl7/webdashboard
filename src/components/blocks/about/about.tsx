import React from "react"
import { AboutHero, Contact, History, WhyInstaLabel } from "."
import { ShotStrip } from "@/components/marketing/MediaSlot"

export const About = () => {
  return (
    <>
      <AboutHero />
      <ShotStrip
        shots={[
          {
            file: "kitchen-portrait.jpg",
            alt: "A kitchen using InstaLabel",
            label: "A kitchen using InstaLabel.",
          },
        ]}
      />
      <History />
      <WhyInstaLabel />
      <Contact />
    </>
  )
}

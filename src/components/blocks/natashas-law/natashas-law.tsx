import React from "react"
import { NatashasLawHero } from "./sections/NatashasLawHero"
import { NatashasLawWhyMatters } from "./sections/NatashasLawWhyMatters"
import { NatashasLawHowItWorks } from "./sections/NatashasLawHowItWorks"
import { NatashasLawExampleLabel } from "./sections/NatashasLawExampleLabel"
import { NatashasLawBenefits } from "./sections/NatashasLawBenefits"

export const NatashasLawPage = () => {
  return (
    <>
      <NatashasLawHero />
      <NatashasLawWhyMatters />
      <NatashasLawHowItWorks />
      <NatashasLawExampleLabel />
      <NatashasLawBenefits />
    </>
  )
}

import React from "react"
import { AllergenComplianceHero } from "./sections/AllergenComplianceHero"
import { AllergenComplianceProblem } from "./sections/AllergenComplianceProblem"
import { AllergenComplianceSolution } from "./sections/AllergenComplianceSolution"
import { AllergenComplianceFeatures } from "./sections/AllergenComplianceFeatures"

import { AllergenComplianceSocialProof } from "./sections/AllergenComplianceSocialProof"
import { AllergenComplianceUrgency } from "./sections/AllergenComplianceUrgency"
import { AllergenComplianceBonus } from "./sections/AllergenComplianceBonus"

export const AllergenCompliancePage = () => {
  return (
    <>
      <AllergenComplianceHero />
      <AllergenComplianceProblem />
      <AllergenComplianceSolution />
      <AllergenComplianceFeatures />

      <AllergenComplianceSocialProof />
      <AllergenComplianceUrgency />
      <AllergenComplianceBonus />
    </>
  )
}

import React from "react"
import { AllergenComplianceHero } from "."
import { AllergenComplianceProblem } from "./sections/AllergenComplianceProblem"
import { AllergenComplianceSolution } from "./sections/AllergenComplianceSolution"
import { AllergenComplianceSocialProof } from "./sections/AllergenComplianceSocialProof"
import { AllergenComplianceUrgency } from "./sections/AllergenComplianceUrgency"
import { AllergenComplianceBonus } from "./sections/AllergenComplianceBonus"
import { AllergenComplianceCTA } from "./sections/AllergenComplianceCTA"

export const AllergenCompliancePage = () => {
  return (
    <>
      <AllergenComplianceHero />
      <AllergenComplianceProblem />
      <AllergenComplianceSolution />
      <AllergenComplianceSocialProof />
      <AllergenComplianceUrgency />
      <AllergenComplianceBonus />
      <AllergenComplianceCTA />
    </>
  )
} 
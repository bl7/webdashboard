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
      <div className="bg-gray-50 border-t border-gray-200 py-6 px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> InstaLabel helps standardize labeling workflows. Your team remains responsible for compliance and staff training.
          </p>
        </div>
      </div>
    </>
  )
}

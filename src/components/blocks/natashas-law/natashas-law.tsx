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

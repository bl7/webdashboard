import React from "react"
import { AllergenGuideHero } from "."
import { AllergenGuideList } from "./sections/AllergenGuideList"
import { AllergenGuideCompliance } from "./sections/AllergenGuideCompliance"
import { AllergenGuideCrossContamination } from "./sections/AllergenGuideCrossContamination"
import { AllergenGuideCTA } from "./sections/AllergenGuideCTA"

export const AllergenGuidePage = () => {
  return (
    <>
      <AllergenGuideHero />
      <AllergenGuideList />
      <AllergenGuideCompliance />
      <AllergenGuideCrossContamination />
      <AllergenGuideCTA />
    </>
  )
} 
import React from "react"
import { AllergenGuideHero } from "."
import { AllergenGuideList } from "./sections/AllergenGuideList"
import { AllergenGuideCompliance } from "./sections/AllergenGuideCompliance"
import { AllergenGuideCrossContamination } from "./sections/AllergenGuideCrossContamination"
import { AllergenGuideHACCP } from "./sections/AllergenGuideHACCP"
import { AllergenGuideQuiz } from "./sections/AllergenGuideQuiz"
import { AllergenGuideFAQ } from "./sections/AllergenGuideFAQ"
import { AllergenGuideCTA } from "./sections/AllergenGuideCTA"

export const AllergenGuidePage = () => {
  return (
    <>
      <AllergenGuideHero />
      <AllergenGuideList />
      <AllergenGuideCompliance />
      <AllergenGuideCrossContamination />
      <AllergenGuideHACCP />
      <AllergenGuideQuiz />
      <AllergenGuideFAQ />
      <AllergenGuideCTA />
    </>
  )
}

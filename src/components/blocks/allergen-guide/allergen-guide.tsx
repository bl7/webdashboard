import React from "react"
import { AllergenGuideHero } from "./sections/AllergenGuideHero"
import { AllergenGuideBody, AllergenGuideClosing } from "./sections/AllergenGuideBody"
import { AllergenGuideQuiz } from "./sections/AllergenGuideQuiz"

export const AllergenGuidePage = () => {
  return (
    <>
      <AllergenGuideHero />
      <AllergenGuideBody />
      <AllergenGuideQuiz />
      <AllergenGuideClosing />
    </>
  )
}

"use client"

import { CookedLabelsHero } from "./sections/CookedLabelsHero"
import { CookedLabelsWhyMatters } from "./sections/CookedLabelsWhyMatters"
import { CookedLabelsFeatures } from "./sections/CookedLabelsFeatures"
import { CookedLabelsExample } from "./sections/CookedLabelsExample"
import { CookedLabelsBenefits } from "./sections/CookedLabelsBenefits"

export const CookedLabelsPage = () => {
  return (
    <>
      <CookedLabelsHero />
      <CookedLabelsWhyMatters />
      <CookedLabelsFeatures />
      <CookedLabelsExample />
      <CookedLabelsBenefits />
    </>
  )
}

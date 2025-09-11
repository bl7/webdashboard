"use client"

import { DefrostLabelsHero } from "./sections/DefrostLabelsHero"
import { DefrostLabelsWhyMatters } from "./sections/DefrostLabelsWhyMatters"
import { DefrostLabelsFeatures } from "./sections/DefrostLabelsFeatures"
import { DefrostLabelsExample } from "./sections/DefrostLabelsExample"
import { DefrostLabelsBenefits } from "./sections/DefrostLabelsBenefits"

export const DefrostLabelsPage = () => {
  return (
    <>
      <DefrostLabelsHero />
      <DefrostLabelsWhyMatters />
      <DefrostLabelsFeatures />
      <DefrostLabelsExample />
      <DefrostLabelsBenefits />
    </>
  )
}

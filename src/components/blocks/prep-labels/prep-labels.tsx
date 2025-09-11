import React from "react"
import { PrepLabelsHero } from "./sections/PrepLabelsHero"
import { PrepLabelsWhyMatters } from "./sections/PrepLabelsWhyMatters"
import { PrepLabelsFeatures } from "./sections/PrepLabelsFeatures"
import { PrepLabelsExample } from "./sections/PrepLabelsExample"
import { PrepLabelsBenefits } from "./sections/PrepLabelsBenefits"

export const PrepLabelsPage = () => {
  return (
    <>
      <PrepLabelsHero />
      <PrepLabelsWhyMatters />
      <PrepLabelsFeatures />
      <PrepLabelsExample />
      <PrepLabelsBenefits />
    </>
  )
}

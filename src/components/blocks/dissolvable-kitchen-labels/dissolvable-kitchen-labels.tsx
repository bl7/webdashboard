"use client"
import React from "react"
import { DissolvableKitchenLabelsHero } from "./sections/DissolvableKitchenLabelsHero"
import { DissolvableKitchenLabelsProblem } from "./sections/DissolvableKitchenLabelsProblem"
import { DissolvableKitchenLabelsSolution } from "./sections/DissolvableKitchenLabelsSolution"
import { DissolvableKitchenLabelsFeatures } from "./sections/DissolvableKitchenLabelsFeatures"
import { DissolvableKitchenLabelsBenefits } from "./sections/DissolvableKitchenLabelsBenefits"
export const DissolvableKitchenLabelsPage = () => {
  return (
    <>
      <DissolvableKitchenLabelsHero />
      <DissolvableKitchenLabelsProblem />
      <DissolvableKitchenLabelsBenefits />
      <DissolvableKitchenLabelsSolution />
      <DissolvableKitchenLabelsFeatures />
    </>
  )
}

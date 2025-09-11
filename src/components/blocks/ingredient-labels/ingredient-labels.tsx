import React from "react"
import { IngredientLabelsHero } from "./sections/IngredientLabelsHero"
import { IngredientLabelsChallenge } from "./sections/IngredientLabelsChallenge"
import { IngredientLabelsFeatures } from "./sections/IngredientLabelsFeatures"
import { IngredientLabelsExample } from "./sections/IngredientLabelsExample"
import { IngredientLabelsBenefits } from "./sections/IngredientLabelsBenefits"

export const IngredientLabelsPage = () => {
  return (
    <>
      <IngredientLabelsHero />
      <IngredientLabelsChallenge />
      <IngredientLabelsFeatures />
      <IngredientLabelsExample />
      <IngredientLabelsBenefits />
    </>
  )
}

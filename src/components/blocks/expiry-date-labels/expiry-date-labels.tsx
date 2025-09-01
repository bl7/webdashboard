"use client"
import React from "react"
import { ExpiryDateLabelsHero } from "./sections/ExpiryDateLabelsHero"
import { ExpiryDateLabelsProblem } from "./sections/ExpiryDateLabelsProblem"
import { ExpiryDateLabelsSolution } from "./sections/ExpiryDateLabelsSolution"
import { ExpiryDateLabelsFeatures } from "./sections/ExpiryDateLabelsFeatures"
import { ExpiryDateLabelsCompliance } from "./sections/ExpiryDateLabelsCompliance"
export const ExpiryDateLabelsPage = () => {
  return (
    <>
      <ExpiryDateLabelsHero />
      <ExpiryDateLabelsProblem />
      <ExpiryDateLabelsSolution />
      <ExpiryDateLabelsFeatures />
      <ExpiryDateLabelsCompliance />
    </>
  )
}

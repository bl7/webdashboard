"use client"
import React from "react"
import { KitchenLabelPrinterHero } from "./sections/KitchenLabelPrinterHero"
import { KitchenLabelPrinterProblem } from "./sections/KitchenLabelPrinterProblem"
import { KitchenLabelPrinterSolution } from "./sections/KitchenLabelPrinterSolution"
import { KitchenLabelPrinterComparison } from "./sections/KitchenLabelPrinterComparison"
import { KitchenLabelPrinterFeatures } from "./sections/KitchenLabelPrinterFeatures"
import { KitchenLabelPrinterImageSection } from "./sections/KitchenLabelPrinterImageSection"

export const KitchenLabelPrinterPage = () => {
  return (
    <>
      <KitchenLabelPrinterHero />
      <KitchenLabelPrinterProblem />
      <KitchenLabelPrinterSolution />
      <KitchenLabelPrinterComparison />
      <KitchenLabelPrinterFeatures />
      <KitchenLabelPrinterImageSection />
    </>
  )
}

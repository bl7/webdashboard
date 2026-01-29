import React from "react"
import { PrintBridgeHero } from "."
import { PrintBridgeProblem } from "./sections/PrintBridgeProblem"
import { PrintBridgeAdvantages } from "./sections/PrintBridgeAdvantages"
import { PrintBridgeTechSpecs } from "./sections/PrintBridgeTechSpecs"
import { PrintBridgeUseCases } from "./sections/PrintBridgeUseCases"
import { PrintBridgeCTAs } from "./sections/PrintBridgeCTAs"
import { PrintBridgeHowItWorks } from "."

export const PrintBridgePage = () => {
  return (
    <>
      <PrintBridgeHero />
      <PrintBridgeProblem />
      <PrintBridgeHowItWorks />
      <PrintBridgeAdvantages />
      <PrintBridgeTechSpecs />
      <PrintBridgeUseCases />
      <PrintBridgeCTAs />
    </>
  )
} 
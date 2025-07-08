import React from "react"
import { PrintBridgeHero, PrintBridgeFeatures, PrintBridgeHowItWorks, PrintBridgeBenefits } from "."
import { ZentraTechnologySection } from "./ZentraTechnologySection"

export const PrintBridgePage = () => {
  return (
    <>
        <PrintBridgeHero />
        <ZentraTechnologySection />
    
      <PrintBridgeHowItWorks />
      <PrintBridgeFeatures />
      <PrintBridgeBenefits />
    </>
  )
} 
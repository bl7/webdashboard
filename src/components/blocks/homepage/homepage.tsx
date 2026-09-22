import React from "react"
import { Hero } from "./sections/hero"
import { TrustedBySection } from "./sections/features-scroll"
import { LabelTypeStrip } from "./sections/LabelTypeStrip"
import { ProductCapabilities } from "./sections/ProductCapabilities"
import { KitchenWorkflowExplorer } from "./sections/KitchenWorkflowExplorer"
import { EverydaySteps } from "./sections/EverydaySteps"
import { PrintingSetupSelector } from "./sections/PrintingSetupSelector"
import { HomepageFAQ } from "./sections/HomepageFAQ"
import { HomepageClosingCTA } from "./sections/HomepageClosingCTA"

export const Homepage = () => {
  return (
    <>
      <Hero />
      <TrustedBySection />
      <div className="home-life">
        <LabelTypeStrip />
        <ProductCapabilities />
        <KitchenWorkflowExplorer />
        <EverydaySteps />
        <PrintingSetupSelector />
        <HomepageFAQ />
        <HomepageClosingCTA />
      </div>
    </>
  )
}
